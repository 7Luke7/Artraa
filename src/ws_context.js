import { createContext, createSignal, For, onCleanup, onMount } from "solid-js"
import { createStore } from "solid-js/store"
import { LoginAttemptOverlay } from "./components/loginAttemptOverlay"

export const WSContext = createContext({})

export const WebSocketContextProvider = (props) => {
    const [ctx, setCtx] = createSignal()
    const [store, setStore] = createStore({
        login_requests: [],
        device_data: null
    })

    const approve_login_request = (id) => {
        const ws = ctx()
        ws.send(JSON.stringify({
            type: 'approve-login',
            temp_device_id: id
        }))
        setStore('login_requests', req => req.filter(device_id => device_id !== id))
    }
    const reject_login_request = (id) => {
        const ws = ctx()
        ws.send(JSON.stringify({
            type: 'reject-login',
            temp_device_id: id
        }))
        setStore('login_requests', req => req.filter(device_id => device_id !== id))
    }

    onMount(() => {
        const ws = new WebSocket(`${import.meta.env.VITE_WS_URL}`, [])
        setCtx(ws)

        let ping_timeout
        const ws_open_handler = () => {
            ws.send(JSON.stringify({
                type: 'ping'
            }))
        }

        const ws_message_handler = (msg) => {
            const data = JSON.parse(msg.data)
            switch (data.type) {
                case 'pong': {
                    ping_timeout = setTimeout(() => ws.send(JSON.stringify({
                        type: 'ping'
                    })), 30000)
                    break;
                }
                case 'new-device-login-request': {
                    setStore('login_requests', store.login_requests.length, data.temp_device_id)
                    break;
                }
            }
        }

        ws.addEventListener('open', ws_open_handler)
        ws.addEventListener('message', ws_message_handler)

        onCleanup(() => {
            clearTimeout(ping_timeout)
            ws.removeEventListener('open', ws_open_handler)
            ws.removeEventListener('message', ws_message_handler)
        })
    })

    return <WSContext.Provider value={{ ctx, store, setStore }}>
        <Show when={store.login_requests.length}>
            <For each={store.login_requests}>
                {(device_id) => <LoginAttemptOverlay
                    device_id={device_id}
                    approve_login_request={approve_login_request}
                    reject_login_request={reject_login_request}
                />}
            </For>
        </Show>
        {props.children}
    </WSContext.Provider>
}
