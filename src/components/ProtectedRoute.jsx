import { Show } from "solid-js/web";

export const ProtectedRoute = (props) => {
    const result = true
    return <Show when={result()}>
        {props.children}
    </Show>
}