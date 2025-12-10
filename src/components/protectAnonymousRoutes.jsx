import { createAsync } from "@solidjs/router";
import { Show } from "solid-js/web";
import { protect_anonymous } from "~/routes/api/auth/ProtectRoutes";

export const ProtectAnonymousRoute = (props) => {
    const result = createAsync(protect_anonymous, {deferStream: true})
    return <Show when={result()}>
        {props.children}
    </Show>
}