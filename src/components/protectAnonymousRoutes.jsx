import { createAsync } from "@solidjs/router";
import { Show } from "solid-js/web";
import { protect_anonymous_routes } from "~/routes/api/auth/ProtectRoutes";

export const route = {
    preload: () => protect_anonymous_routes()
}

export const ProtectAnonymousRoute = (props) => {
    const result = createAsync(protect_anonymous_routes, {deferStream: true})
    return <Show when={result()}>
        {props.children}
    </Show>
}