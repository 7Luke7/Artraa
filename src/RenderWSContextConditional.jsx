import { createAsync } from "@solidjs/router";
import { WebSocketContextProvider } from "./ws_context";
import { auth } from "./routes/api/auth/ProtectRoutes";
import { Show, Suspense } from "solid-js";

export const RenderWSContextConditional = (props) => {
    const auth_state = createAsync(auth, { deferStream: true })
    return <Suspense>
        <Show fallback={props.children} when={auth_state()}>
            <WebSocketContextProvider>{props.children}</WebSocketContextProvider>
        </Show>
    </Suspense>
}