import { batch, createContext, createSignal, For, onCleanup, onMount } from "solid-js"
import { createStore } from "solid-js/store"
import { LoginAttemptOverlay } from "./components/loginAttemptOverlay"
import { createAsync, query, revalidate} from "@solidjs/router"
import { getCookie } from "vinxi/http"
import { redisHGet } from "./routes/api/lib/redis/hash"
import { getRequestEvent } from "solid-js/web"

export const WSContext = createContext({})

// we could cache this way longer
const get_device_id = query(async () => {
    'use server'
    const event = getRequestEvent();
    const cookie = event.request.headers.get("cookie");
    if (!cookie) return null;

    const id = getCookie("auth.session-token", cookie);
    if (!id) return null

    try {
        const device_id = await redisHGet(`user:session:${id}`, 'device_id')
        if (!device_id) return null
        return device_id
    } catch (error) {
        return null
    }
}, 'device-id')

export const WebSocketContextProvider = (props) => {
    const device_id = createAsync(get_device_id, {deferStream: true})
    const [ctx, setCtx] = createSignal()
    const [store, setStore] = createStore({
        login_requests: [],
        notification_count: 0,
    })

    onMount(() => {
        const ws = new WebSocket(import.meta.env.VITE_WS_URL)
        setCtx(ws)
        const ws_message_handler = (msg) => {
            if (msg.data === 'ping') return ws.send('pong')

            const data = JSON.parse(msg.data)
            switch (data.type) {
                case 'new-device-login-request': {
                    batch(() => {
                        setStore('login_requests', store.login_requests.length, data.pending_verification_id)
                        setStore('notification_count', prev => prev + 1)
                    })
                    break;
                }
                case `logout-device-${device_id()}`: {
                    revalidate('protected')
                    break;
                }
            }
        }
        ws.addEventListener('message', ws_message_handler)

        // const bc = new BroadcastChannel("login_state");
        // const BroadcastChannelMessageHandler = (event) => {
        //     console.log(event)
        //     if (event.data?.type === 'logout') {
        //         revalidate(['auth', 'protected'])
        //         bc.removeEventListener('message', BroadcastChannelMessageHandler)
        //         bc.close()
        //     }
        // }

        // bc.addEventListener('message', BroadcastChannelMessageHandler)
        onCleanup(() => {
            ws.removeEventListener('message', ws_message_handler)
        })
    })

    return <WSContext.Provider value={{ ctx, store, setStore }}>
        <Show when={store.login_requests.length}>
            <For each={store.login_requests}>
                {(pending_verification_id) => <LoginAttemptOverlay
                    pending_verification_id={pending_verification_id}
                />}
            </For>
        </Show>
        {props.children}
    </WSContext.Provider>
}
