import { Show, splitProps } from "solid-js"

/**
 * A labelled text input with its error message.
 *
 * The login and register screens each spelled this out per field - label,
 * input, the conditional red border, the conditional aria-describedby, the
 * error div - about 40 lines apiece, four times over, with the two screens
 * drifting apart every time one of them was touched.
 *
 * The contract the rest of the app relies on is kept exactly: the input keeps
 * its own `id`, and the error region is `<name>-error`, which is what
 * aria-describedby points at and what the end-to-end suite looks for. Note the
 * two differ on purpose - the input id is hyphenated (`given-name`, matching
 * the autocomplete token) while the field name is not (`given_name`, matching
 * the server's validation rules).
 *
 * Anything not named here is forwarded to the input, so per-field constraints
 * (minlength, pattern, title, inputmode) stay where they belong: with the field.
 */
export const TextField = (props) => {
    const [own, rest] = splitProps(props, ["id", "name", "label", "invalid", "message", "class"])

    const errorId = () => `${own.name}-error`

    return (
        <>
            <label
                for={own.id}
                class="text-sm text-slate-900 font-gsans font-medium mb-2 block"
            >
                {own.label}
            </label>
            <input
                {...rest}
                id={own.id}
                name={own.name}
                aria-invalid={own.invalid ? 'true' : 'false'}
                aria-describedby={own.invalid ? errorId() : undefined}
                class={`bg-slate-50 w-full text-sm font-gsans font-medium text-slate-900 px-4 py-3 rounded-md outline-0 border focus:bg-transparent transition-colors duration-200
                        ${own.invalid
                        ? 'border-red-500'
                        : 'border-gray-200 focus:ring-2 focus:ring-[#E98074] focus:ring-opacity-30'
                    }`}
            />
            <Show when={own.invalid}>
                <div
                    id={errorId()}
                    role="alert"
                    aria-live='assertive'
                    class="mt-2 text-sm text-red-600 font-gsans font-medium"
                >
                    {own.message}
                </div>
            </Show>
        </>
    )
}
