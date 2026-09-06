import { createSignal, Show, splitProps } from "solid-js"

/**
 * A password input with its reveal toggle and constraint hint.
 *
 * The hint element doubles as the error region - it shows the rule while the
 * field is clean and the failure once it is not - which is why it is a single
 * `aria-describedby` target rather than the hint/error pair the text fields use.
 *
 * `hintId` is a prop and not a constant because it has to be unique per field.
 * The reset screen renders two of these and hard-coded `password-constraints`
 * on both, so the document had two elements with the same id and the confirm
 * field's `aria-describedby` resolved to the *other* field's message.
 *
 * The reveal state lives here. It is per-field by nature, and hoisting it into
 * every screen is how one `showPassword` signal ended up driving several inputs.
 */
export const PasswordField = (props) => {
    const [own, rest] = splitProps(props, [
        "id", "name", "label", "invalid", "message", "hint", "hintId", "disabled"
    ])

    const [shown, setShown] = createSignal(false)
    const hintId = () => own.hintId ?? "password-constraints"

    return (
        <>
            <label
                for={own.id}
                class="text-sm text-slate-900 font-gsans font-medium mb-2 block"
            >
                {own.label}
            </label>
            <div class="relative">
                <input
                    {...rest}
                    id={own.id}
                    name={own.name}
                    disabled={own.disabled}
                    type={shown() ? 'text' : 'password'}
                    aria-invalid={own.invalid ? 'true' : 'false'}
                    aria-describedby={hintId()}
                    class={`bg-slate-50 outline-0 w-full text-slate-900 pl-4 pr-10 py-3 rounded-md border focus:bg-transparent text-sm font-gsans font-medium transition-colors duration-200
                            ${own.invalid
                            ? 'border-red-500'
                            : 'border-gray-200 focus:ring-2 focus:ring-[#E98074] focus:ring-opacity-30'
                        }`}
                />
                <button
                    type="button"
                    onClick={() => setShown(!shown())}
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E98074] focus:ring-offset-2 transition-colors duration-200"
                    aria-label={shown() ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
                    aria-controls={own.id}
                    aria-expanded={shown()}
                    disabled={own.disabled}
                >
                    <Show
                        when={shown()}
                        fallback={<img src="/svg/eye.svg" width={20} height={20} aria-hidden="true" alt="" />}
                    >
                        <img src="/svg/eye-closed.svg" width={20} height={20} aria-hidden="true" alt="" />
                    </Show>
                </button>
            </div>
            <div
                id={hintId()}
                aria-live={own.invalid ? 'assertive' : 'off'}
                role={own.invalid ? 'alert' : ''}
                class={`mt-2 font-gsans font-normal text-xs ${own.invalid ? 'text-red-600' : 'text-slate-600'}`}
            >
                {own.invalid ? own.message : own.hint}
            </div>
        </>
    )
}
