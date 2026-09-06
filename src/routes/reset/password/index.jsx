import { Footer } from "~/components/Footer"
import { createAsync, useSubmission } from "@solidjs/router"
import { Match, Show, Switch } from "solid-js"
import { resetPasswordAction } from "~/routes/api/auth/handle-forms/ResetPassword"
import { HttpStatusCode } from "@solidjs/start"
import { ProtectResetPassword } from "~/routes/api/auth/ProtectRoutes"
import { Title } from "@solidjs/meta"
import { PasswordField } from "~/components/forms/PasswordField"

const ResetPassword = () => {
    const authResult = createAsync(ProtectResetPassword, { deferStream: false })
    const submission = useSubmission(resetPasswordAction)

    const globalFailed = () => submission.result?.field === 'global'
    const passwordFailed = () => submission.result?.field === 'password'
    const confirmPasswordFailed = () => submission.result?.field === 'confirm_password'
    const message = () => submission.result?.message

    return <>
        <HttpStatusCode code={authResult()?.status} />
        <Switch>
            <Match when={authResult()?.status === 401}>
                <Title>401 - პაროლის აღდგენა</Title>
                <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
                    <div
                        class="fixed inset-0 pointer-events-none opacity-[0.03]"
                        style={{
                            "background-image": "radial-gradient(#E85A4F 1px, transparent 1px)",
                            "background-size": "28px 28px",
                        }}
                    />

                    <div class="relative w-full max-w-sm">
                        <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                            <div class="h-1 bg-gradient-to-r from-[#E85A4F] via-[#f07068] to-[#E85A4F]/40" />

                            <div class="p-8 text-center">
                                <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E85A4F]/8 border border-[#E85A4F]/15 mb-5">
                                    <img src='/svg/link-off.svg' width={26} height={26} alt="" />
                                </div>

                                <h1 class="text-xl font-gsans font-bold text-gray-900 mb-2">
                                    ბმული არ არის მოქმედი
                                </h1>
                                <p class="text-sm font-gsans text-gray-400 leading-relaxed mb-8 max-w-xs mx-auto">
                                    პაროლის აღდგენის ბმულის ვადა ამოიწურა ან ბმული არასწორია
                                </p>

                                <div class="space-y-3">
                                    <a
                                        href="/reset/find"
                                        class="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-[#E85A4F] hover:bg-[#D84A3F] text-white font-gsans font-bold text-sm transition-colors active:scale-[0.99] shadow-sm"
                                    >
                                        <img src='/svg/refresh.svg' width={15} height={15} alt="" />
                                        ახალი ბმულის მოთხოვნა
                                    </a>

                                    <a
                                        href="/login"
                                        class="flex items-center justify-center w-full py-3.5 rounded-xl border border-gray-200 text-gray-600 font-gsans font-medium text-sm hover:bg-gray-50 hover:border-gray-300 transition-colors"
                                    >
                                        შესვლის გვერდზე დაბრუნება
                                    </a>
                                </div>
                            </div>
                        </div>

                        <p class="text-center text-xs text-gray-300 font-gsans mt-5">
                            Artra · პაროლის აღდგენა
                        </p>
                    </div>
                </div>
            </Match >

            <Match when={authResult()?.status === 200}>
                <div class="flex flex-col items-center my-20 justify-center p-4">
                    <main class="w-full max-w-lg">
                        <form
                            action={resetPasswordAction}
                            method="POST"
                            aria-label="ახალი პაროლის დაყენების ფორმა"
                            role="form"
                            class="p-4 md:p-6"
                        >
                            <div
                                aria-live="polite"
                                aria-atomic="true"
                                class="sr-only"
                            >
                                {submission.pending && "პაროლი იცვლება..."}
                            </div>

                            <div class="text-center mb-8">
                                <h1 class="text-2xl md:text-3xl font-gsans font-bold text-slate-900 mb-4">
                                    ახალი პაროლის დაყენება
                                </h1>
                                <p class="text-sm md:text-[15px] font-gsans font-medium text-slate-600 leading-relaxed">
                                    შეიყვანეთ ახალი პაროლი თქვენი ანგარიშისთვის
                                </p>
                            </div>

                            <Show when={globalFailed()}>
                                <div
                                    class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg"
                                    role="alert"
                                    aria-live="assertive"
                                >
                                    <p class="text-red-800 text-sm font-gsans font-medium">
                                        {message()}
                                    </p>
                                </div>
                            </Show>

                            <div class="space-y-6">
                                <section>
                                    <PasswordField
                                        id="new-password"
                                        name="password"
                                        label="ახალი პაროლი"
                                        autocomplete="new-password"
                                        required
                                        aria-required="true"
                                        minlength="8"
                                        maxlength="128"
                                        disabled={submission.pending}
                                        placeholder="შეიყვანეთ ახალი პაროლი"
                                        invalid={passwordFailed()}
                                        message={message()}
                                        hint="მინიმუმ 8 სიმბოლო, space-ის გარეშე"
                                    />
                                </section>

                                <section>
                                    <PasswordField
                                        id="confirm-password"
                                        name="confirm_password"
                                        label="დაადასტურეთ პაროლი"
                                        autocomplete="new-password"
                                        required
                                        aria-required="true"
                                        minlength="8"
                                        maxlength="128"
                                        disabled={submission.pending}
                                        placeholder="გაიმეორეთ ახალი პაროლი"
                                        invalid={confirmPasswordFailed()}
                                        message={message()}
                                        hint="გაიმეორეთ ზუსტად იგივე პაროლი"
                                        hintId="confirm-password-constraints"
                                    />
                                </section>
                            </div>

                            <div class="my-6">
                                <button
                                    type="submit"
                                    disabled={submission.pending}
                                    aria-label={submission.pending ? "პაროლი იცვლება..." : "პაროლის შეცვლა"}
                                    aria-busy={submission.pending}
                                    class={`w-full py-3 px-4 text-[15px] font-gsans font-bold rounded-md text-white bg-[#E98074] hover:bg-[#E85A4F] duration-200 ease-in focus:outline-none focus:ring-4 focus:ring-[#E98074] focus:ring-opacity-50 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {submission.pending ? (
                                        <span class="flex items-center justify-center">
                                            <span class="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            მუშავდება...
                                        </span>
                                    ) : 'პაროლის შეცვლა'}
                                </button>
                            </div>

                            <div class="text-center">
                                <a
                                    href="/login"
                                    class="text-[#E85A4F] hover:text-[#E98074] font-gsans font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 rounded"
                                    aria-label="დაბრუნება შესვლის გვერდზე"
                                >
                                    დაბრუნება შესვლის გვერდზე
                                </a>
                            </div>
                        </form>
                    </main>
                </div>
            </Match>
        </Switch >
        <Footer />
    </>
}

export default ResetPassword