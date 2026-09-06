import { useSubmission } from "@solidjs/router"
import { Match, Show, Switch, createSignal } from "solid-js"
import { set_password, update_password } from "~/routes/api/auth/handle-forms/update_password"

export const PasswordSection = ({security}) => {
    const submission = useSubmission(update_password)
    const set_password_submission = useSubmission(set_password)
    const [showCurrentPassword, setShowCurrentPassword] = createSignal(false)
    const [showNewPassword, setShowNewPassword] = createSignal(false)
    const [showConfirmPassword, setShowConfirmPassword] = createSignal(false)

    return (
        <div 
            class="w-full"
            role="region"
            aria-labelledby="password-section-heading"
        >
            <div
                aria-live="polite"
                aria-atomic="true"
                class="sr-only"
            >
                {submission.pending && "პაროლი იცვლება..."}
                {set_password_submission.pending && "პაროლი ინიშნება..."}
            </div>

            <Switch>
                <Match when={security()?.google && !security()?.password}>
                    <h3 
                        id="password-section-heading"
                        class="text-lg font-gsans font-medium text-gray-800 mb-4 md:mb-6"
                    >
                        პაროლის დაყენება
                    </h3>
                    
                    <form 
                        class="space-y-4 w-full lg:w-1/2" 
                        action={set_password} 
                        method="POST"
                        aria-label="პაროლის დაყენების ფორმა"
                    >
                        <div>
                            <label 
                                for="new-password-google"
                                class="block text-sm font-gsans font-medium text-gray-700 mb-2"
                            >
                                ახალი პაროლი
                            </label>
                            <section class="relative">
                                <input
                                    id="new-password-google"
                                    type={showNewPassword() ? "text" : "password"}
                                    inputmode="text"
                                    autocomplete="new-password"
                                    name="new_password"
                                    required
                                    minlength="8"
                                    maxlength="128"
                                    aria-required="true"
                                    aria-describedby='new-password-help-google'
                                    class='bg-slate-50 text-sm font-gsans font-medium text-slate-900 w-full px-4 py-3 pr-10 rounded-md outline-0 border focus:bg-transparent transition-colors duration-200 border-gray-200 focus:ring-2 focus:ring-[#E98074] focus:ring-opacity-30'
                                    placeholder="შეიყვანეთ ახალი პაროლი"
                                    disabled={set_password_submission.pending}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword())}
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E98074] focus:ring-offset-2 transition-colors duration-200"
                                    aria-label={showNewPassword() ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
                                    aria-controls="new-password-google"
                                    aria-expanded={showNewPassword()}
                                    disabled={set_password_submission.pending}
                                >
                                    <Show
                                        when={showNewPassword()}
                                        fallback={
                                            <img
                                                src="/svg/eye.svg"
                                                width={20}
                                                height={20}
                                                aria-hidden="true" alt="" />
                                        }
                                    >
                                        <img
                                            src="/svg/eye-closed.svg"
                                            width={20}
                                            height={20}
                                            aria-hidden="true" alt="" />
                                    </Show>
                                </button>
                            </section>
                            <div 
                                id="new-password-help-google"
                                class="mt-2 text-xs text-slate-600 font-gsans font-normal"
                            >
                                მინიმუმ 8 სიმბოლო, space-ის გარეშე
                            </div>
                        </div>
                        <div>
                            <label 
                                for="confirm-password-google"
                                class="block text-sm font-gsans font-medium text-gray-700 mb-2"
                            >
                                გაიმეორე ახალი პაროლი
                            </label>
                            <section class="relative">
                                <input
                                    id="confirm-password-google"
                                    type={showConfirmPassword() ? "text" : "password"}
                                    inputmode="text"
                                    autocomplete="new-password"
                                    name="confirm_password"
                                    required
                                    minlength="8"
                                    maxlength="128"
                                    aria-required="true"
                                    aria-describedby='confirm_password' 
                                    class='bg-slate-50 text-sm font-gsans font-medium text-slate-900 w-full px-4 py-3 pr-10 rounded-md outline-0 border focus:bg-transparent transition-colors duration-200 border-gray-200 focus:ring-2 focus:ring-[#E98074] focus:ring-opacity-30'
                                    placeholder="გაიმეორეთ ახალი პაროლი"
                                    disabled={set_password_submission.pending}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E98074] focus:ring-offset-2 transition-colors duration-200"
                                    aria-label={showConfirmPassword() ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
                                    aria-controls="confirm-password-google"
                                    aria-expanded={showConfirmPassword()}
                                    disabled={set_password_submission.pending}
                                >
                                    <Show
                                        when={showConfirmPassword()}
                                        fallback={
                                            <img
                                                src="/svg/eye.svg"
                                                width={20}
                                                height={20}
                                                aria-hidden="true" alt="" />
                                        }
                                    >
                                        <img
                                            src="/svg/eye-closed.svg"
                                            width={20}
                                            height={20}
                                            aria-hidden="true" alt="" />
                                    </Show>
                                </button>
                            </section>
                        </div>

                        <button
                            type="submit"
                            disabled={set_password_submission.pending}
                            aria-label={set_password_submission.pending ? "პაროლი ინიშნება..." : "პაროლის დაყენება"}
                            aria-busy={set_password_submission.pending}
                            class="py-3 w-full text-[15px] font-gsans font-bold rounded-md text-white bg-[#E98074] hover:bg-[#E85A4F] duration-200 ease-in focus:outline-none focus:ring-4 focus:ring-[#E98074] focus:ring-opacity-50 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {set_password_submission.pending ? (
                                <span class="flex items-center justify-center">
                                    <span class="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    მუშავდება...
                                </span>
                            ) : 'პაროლის დაყენება'}
                        </button>
                        
                        <Show when={set_password_submission.result}>
                            <div 
                                class={`mt-2 p-3 border rounded-lg ${
                                    !set_password_submission.result.ok 
                                        ? 'bg-red-50 border-red-200' 
                                        : 'bg-green-50 border-green-200'
                                }`}
                                role="alert"
                                aria-live="assertive"
                            >
                                <p class={`${
                                    !set_password_submission.result.ok 
                                        ? 'text-red-800' 
                                        : 'text-green-800'
                                } text-sm font-gsans font-medium`}>
                                    {set_password_submission.result.message}
                                </p>
                            </div>
                        </Show>
                    </form>
                </Match>
                
                <Match when={security()?.password}>
                    <h3 
                        id="password-section-heading"
                        class="text-lg font-gsans font-medium text-gray-800 mb-4 md:mb-6"
                    >
                        პაროლის შეცვლა
                    </h3>

                    <form 
                        class="space-y-4 w-full lg:w-1/2" 
                        action={update_password} 
                        method="POST"
                        aria-label="პაროლის შეცვლის ფორმა"
                    >
                        <div>
                            <label 
                                for="current-password"
                                class="block text-sm font-gsans font-medium text-gray-700 mb-2"
                            >
                                ამჟამინდელი პაროლი
                            </label>
                            <section class="relative">
                                <input
                                    id="current-password"
                                    type={showCurrentPassword() ? "text" : "password"}
                                    inputmode="text"
                                    name="current_password"
                                    autocomplete="current-password"
                                    required
                                    minlength="8"
                                    maxlength="128"
                                    aria-required="true"
                                    aria-describedby='current_password'
                                    class='bg-slate-50 text-sm font-gsans font-medium text-slate-900 w-full px-4 py-3 pr-10 rounded-md outline-0 border focus:bg-transparent transition-colors duration-200 border-gray-200 focus:ring-2 focus:ring-[#E98074] focus:ring-opacity-30'
                                    placeholder="შეიყვანეთ ამჟამინდელი პაროლი"
                                    disabled={submission.pending}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword())}
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E98074] focus:ring-offset-2 transition-colors duration-200"
                                    aria-label={showCurrentPassword() ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
                                    aria-controls="current-password"
                                    aria-expanded={showCurrentPassword()}
                                    disabled={submission.pending}
                                >
                                    <Show
                                        when={showCurrentPassword()}
                                        fallback={
                                            <img
                                                src="/svg/eye.svg"
                                                width={20}
                                                height={20}
                                                aria-hidden="true" alt="" />
                                        }
                                    >
                                        <img
                                            src="/svg/eye-closed.svg"
                                            width={20}
                                            height={20}
                                            aria-hidden="true" alt="" />
                                    </Show>
                                </button>
                            </section>
                        </div>
                        <div>
                            <label 
                                for="new-password"
                                class="block text-sm font-gsans font-medium text-gray-700 mb-2"
                            >
                                ახალი პაროლი
                            </label>
                            <section class="relative">
                                <input
                                    id="new-password"
                                    type={showNewPassword() ? "text" : "password"}
                                    inputmode="text"
                                    autocomplete="new-password"
                                    name="new_password"
                                    required
                                    minlength="8"
                                    maxlength="128"
                                    aria-required="true"
                                    aria-describedby='new-password-help'
                                    class='bg-slate-50 text-sm font-gsans font-medium text-slate-900 w-full px-4 py-3 pr-10 rounded-md outline-0 border focus:bg-transparent transition-colors duration-200 border-gray-200 focus:ring-2 focus:ring-[#E98074] focus:ring-opacity-30'
                                    placeholder="შეიყვანეთ ახალი პაროლი"
                                    disabled={submission.pending}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword())}
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E98074] focus:ring-offset-2 transition-colors duration-200"
                                    aria-label={showNewPassword() ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
                                    aria-controls="new-password"
                                    aria-expanded={showNewPassword()}
                                    disabled={submission.pending}
                                >
                                    <Show
                                        when={showNewPassword()}
                                        fallback={
                                            <img
                                                src="/svg/eye.svg"
                                                width={20}
                                                height={20}
                                                aria-hidden="true" alt="" />
                                        }
                                    >
                                        <img
                                            src="/svg/eye-closed.svg"
                                            width={20}
                                            height={20}
                                            aria-hidden="true" alt="" />
                                    </Show>
                                </button>
                            </section>
                            <div 
                                id="new-password-help"
                                class="mt-2 text-xs text-slate-600 font-gsans font-medium"
                            >
                                მინიმუმ 8 სიმბოლო, space-ის გარეშე
                            </div>
                        </div>
                        <div>
                            <label 
                                for="confirm-password"
                                class="block text-sm font-gsans font-medium text-gray-700 mb-2"
                            >
                                გაიმეორე ახალი პაროლი
                            </label>
                            <section class="relative">
                                <input
                                    id="confirm-password"
                                    type={showConfirmPassword() ? "text" : "password"}
                                    inputmode="text"
                                    name="confirm_password"
                                    autocomplete="new-password"
                                    required
                                    minlength="8"
                                    maxlength="128"
                                    aria-required="true"
                                    aria-describedby='confirm_password'
                                    class='bg-slate-50 text-sm font-gsans font-medium text-slate-900 w-full px-4 py-3 pr-10 rounded-md outline-0 border focus:bg-transparent transition-colors duration-200 border-gray-200 focus:ring-2 focus:ring-[#E98074] focus:ring-opacity-30'
                                    placeholder="გაიმეორეთ ახალი პაროლი"
                                    disabled={submission.pending}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword())}
                                    class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E98074] focus:ring-offset-2 transition-colors duration-200"
                                    aria-label={showConfirmPassword() ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
                                    aria-controls="confirm-password"
                                    aria-expanded={showConfirmPassword()}
                                    disabled={submission.pending}
                                >
                                    <Show
                                        when={showConfirmPassword()}
                                        fallback={
                                            <img
                                                src="/svg/eye.svg"
                                                width={20}
                                                height={20}
                                                aria-hidden="true" alt="" />
                                        }
                                    >
                                        <img
                                            src="/svg/eye-closed.svg"
                                            width={20}
                                            height={20}
                                            aria-hidden="true" alt="" />
                                    </Show>
                                </button>
                            </section>
                        </div>

                        <button
                            type="submit"
                            disabled={submission.pending}
                            aria-label={submission.pending ? "პაროლი იცვლება..." : "პაროლის შეცვლა"}
                            aria-busy={submission.pending}
                            class="py-3 w-full text-[15px] font-gsans font-bold rounded-md text-white bg-[#E98074] hover:bg-[#E85A4F] duration-200 ease-in focus:outline-none focus:ring-4 focus:ring-[#E98074] focus:ring-opacity-50 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submission.pending ? (
                                <span class="flex items-center justify-center">
                                    <span class="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    მუშავდება...
                                </span>
                            ) : 'პაროლის შეცვლა'}
                        </button>
                        
                        <Show when={submission.result}>
                            <div 
                                class={`mt-2 p-3 border rounded-lg ${
                                    !submission.result.ok 
                                        ? 'bg-red-50 border-red-200' 
                                        : 'bg-green-50 border-green-200'
                                }`}
                                role="alert"
                                aria-live="assertive"
                            >
                                <p class={`${
                                    !submission.result.ok 
                                        ? 'text-red-800' 
                                        : 'text-green-800'
                                } text-sm font-gsans font-medium`}>
                                    {submission.result.message}
                                </p>
                            </div>
                        </Show>
                    </form>
                </Match>
            </Switch>
        </div>
    )
}