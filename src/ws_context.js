import { batch, createContext, createSignal, For, lazy, onCleanup, onMount, Suspense } from "solid-js"
import { createStore } from "solid-js/store"
import { createAsync, useNavigate } from "@solidjs/router"
import { get_device_id } from "./routes/api/user/get_device_id.js"

const LazyLoginAttempOverlay = lazy(() => import('./components/loginAttemptOverlay.jsx'))

export const WSContext = createContext({})

export const WebSocketContextProvider = (props) => {
    const device_id = createAsync(get_device_id, { deferStream: false })
    const [ctx, setCtx] = createSignal()
    const [store, setStore] = createStore({
        login_requests: [],
        notification_count: 0,
    })
    const navigate = useNavigate()

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
                    navigate("/login", {replace: true})
                    break;
                }
            }
        }
        ws.addEventListener('message', ws_message_handler)
        onCleanup(() => {
            ws.removeEventListener('message', ws_message_handler)
        })
    })

    return <WSContext.Provider value={{ ctx, store, setStore }}>
        <Show when={store.login_requests.length}>
            <Suspense>
                <For each={store.login_requests}>
                    {(pending_verification_id) => <LazyLoginAttempOverlay
                        pending_verification_id={pending_verification_id}
                    />}
                </For>
            </Suspense>
        </Show>
        {props.children}
    </WSContext.Provider>
}
