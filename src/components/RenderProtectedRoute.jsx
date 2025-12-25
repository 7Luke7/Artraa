import { createAsync } from "@solidjs/router"
import { Show } from "solid-js"
import { protected_route } from "~/routes/api/auth/ProtectRoutes"
import { WebSocketContextProvider } from "~/ws_context"

export const RenderProtectedRoute = (props) => {
    const auth = createAsync(protected_route, {deferStream: true})
    return <Show when={auth()}>
        <WebSocketContextProvider>
            {props.children}
        </WebSocketContextProvider>
    </Show>
}