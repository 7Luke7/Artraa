import { Meta, Title } from "@solidjs/meta"
import { Footer } from "~/components/Footer"
import { Header } from "~/components/Header"
import { A, createAsync, useSubmission } from "@solidjs/router"
import { Match, Show, Switch } from "solid-js"
import { ProtectAnonymousRoute } from "~/components/protectAnonymousRoutes"
import { resetPasswordAction } from "~/routes/api/auth/handle-forms/ResetPassword"
import { HttpStatusCode } from "@solidjs/start"
import { ProtectResetPassword } from "~/routes/api/auth/ProtectRoutes"

const ResetPassword = () => {
    const authResult = createAsync(ProtectResetPassword, { deferStream: true })
    const submission = useSubmission(resetPasswordAction)

    return (
        <ProtectAnonymousRoute>
            <Show when={authResult()}>
                <HttpStatusCode code={authResult().status}></HttpStatusCode>
                <Title>Artra - პაროლის აღდგენა</Title>
                <Meta name="description" content="Artra - პაროლის აღდგენა" />
                <Meta name="keywords" content="Artra, პაროლის აღდგენა, Artra reset password" />

                <Header bg="#fff" />
                <Switch>
                    <Match when={!authResult().allowed}>
                        <div class="min-h-[70vh] flex items-center justify-center px-4">
                            <div class="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
                                <p class="text-gray-700 mb-6 font-regular-tbc leading-relaxed">
                                    {authResult().message}
                                </p>

                                <A
                                    href="/login"
                                    class="inline-block bg-[#E85A4F] px-5 py-2.5 rounded-xl text-white font-medium-tbc transition shadow-md hover:shadow-lg"
                                >
                                    შესვლის გვერდზე დაბრუნება
                                </A>
                            </div>
                        </div>
                    </Match>
                    <Match when={authResult().allowed}>
                        <div class="lg:min-h-[70vh] flex flex-col items-center justify-center p-6">
                            <main class="max-w-md w-full">
                                <form action={resetPasswordAction} method="POST">
                                    <div class="text-center mb-8">
                                        <h1 class="text-3xl font-bold-tbc font-semibold text-slate-900 mb-4">
                                            პაროლის აღდგენა
                                        </h1>
                                        <p class="text-[15px] font-medium-tbc text-slate-600 leading-relaxed">
                                            შეიყვანეთ ახალი პაროლი თქვენი ანგარიშის დასამატებად
                                        </p>
                                    </div>

                                    <Show when={submission.result?.message}>
                                        <div class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                            <p class="text-red-800 text-sm font-medium-tbc">
                                                {submission.result.message}
                                            </p>
                                        </div>
                                    </Show>

                                    <div class="space-y-6">
                                        <div>
                                            <label class="text-sm text-slate-900 font-medium-tbc mb-2 block">
                                                ახალი პაროლი
                                            </label>
                                            <input
                                                name="პაროლი"
                                                type="password"
                                                class="bg-slate-50 w-full text-sm font-medium-tbc text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-[#E98074] focus:bg-transparent"
                                                placeholder="შეიყვანეთ ახალი პაროლი"
                                            />
                                        </div>

                                        <div>
                                            <label class="text-sm text-slate-900 font-medium-tbc mb-2 block">
                                                დაადასტურეთ პაროლი
                                            </label>
                                            <input
                                                name="დაადასტურე პაროლი"
                                                type="password"
                                                class="bg-slate-50 w-full text-sm font-medium-tbc text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-[#E98074] focus:bg-transparent"
                                                placeholder="გაიმეორეთ ახალი პაროლი"
                                            />
                                        </div>
                                    </div>

                                    <div class="my-6">
                                        <button
                                            disabled={submission.pending}
                                            type="submit"
                                            class="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium-tbc font-bold rounded-md text-white bg-[#E98074] hover:bg-[#E85A4F] duration-200 ease-in focus:outline-none cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submission.pending ? "მუშავდება..." : "პაროლის შეცვლა"}
                                        </button>
                                    </div>

                                    <div class="text-center">
                                        <A href="/login" class="text-[#E85A4F] hover:text-[#E98074] font-medium text-sm">
                                            დაბრუნება შესვლის გვერდზე
                                        </A>
                                    </div>
                                </form>
                            </main>
                        </div>
                    </Match>
                </Switch>

                <Footer />
            </Show>
        </ProtectAnonymousRoute>
    )
}

export default ResetPassword
