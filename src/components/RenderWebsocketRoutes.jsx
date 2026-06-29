import { createAsync } from "@solidjs/router"
import { Show } from "solid-js"
import { websocket_route } from "~/routes/api/auth/ProtectRoutes"
import { WebSocketContextProvider } from "~/ws_context"

export const RenderWebsocketRoutes = (props) => {
    const auth = createAsync(websocket_route, {deferStream: true})
    return <Show when={auth()} fallback={props.children}>
        <WebSocketContextProvider>
            {props.children}
        </WebSocketContextProvider>
    </Show>
}