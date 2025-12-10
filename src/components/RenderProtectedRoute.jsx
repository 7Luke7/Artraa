import { createAsync } from "@solidjs/router"
import { Show } from "solid-js"
import { protected_route } from "~/routes/api/auth/ProtectRoutes"

export const RenderProtectedRoute = (props) => {
    const auth = createAsync(protected_route, {deferStream: true})
    return <Show when={auth()}>
        {props.children}
    </Show>
}