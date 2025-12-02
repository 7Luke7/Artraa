import { Meta, Title } from "@solidjs/meta"
import { Footer } from "~/components/Footer"
import { Header } from "~/components/Header"
import { A, useSubmission } from "@solidjs/router"
import { Show } from "solid-js"
import { ProtectAnonymousRoute } from "~/components/protectAnonymousRoutes"
import { findUserForReset } from "~/routes/api/auth/handle-forms/findUserForReset"

const FindUser = () => {
    const submission = useSubmission(findUserForReset)

    return (
        <ProtectAnonymousRoute>
            <Title>Artra - მომხმარებლის ძებნა</Title>
            <Meta name="description" content="Artra - მომხმარებლის ძებნა" />
            <Meta name="keywords" content="Artra, მომხმარებლის ძებნა, Artra ძებნა" />
            <Header bg={"#fff"}></Header>
            <div class="lg:min-h-[70vh] flex flex-col items-center justify-center p-6">
                <main class="max-w-md w-full">
                    <form action={findUserForReset} method="POST">
                        <div class="text-center mb-8">
                            <h1 class="text-3xl font-bold-tbc font-semibold text-slate-900 mb-4">
                                მომხმარებლის ძებნა
                            </h1>
                            <p class="text-[15px] font-medium-tbc text-slate-600 leading-relaxed">
                                შეიყვანეთ თქვენი ელ. ფოსტა, რათა მიიღოთ პაროლის აღდგენის ინსტრუქცია
                            </p>
                        </div>
                        <Show when={submission.result?.error_message}>
                            <div class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p class="text-red-800 text-sm font-medium-tbc">
                                    {submission.result.error_message}
                                </p>
                            </div>
                        </Show>
                        <Show when={submission.result?.message}>
                            <div class="mb-6 p-3 bg-[#FDECEA] border border-[#F5C4C0] rounded-lg">
                                <p class="text-[#B2382B] text-sm font-medium-tbc">
                                    {submission.result.message}
                                </p>
                            </div>
                        </Show>
                        <div class="space-y-6">
                            <div>
                                <label class='text-sm text-slate-900 font-medium-tbc mb-2 block'>ელ. ფოსტა</label>
                                <input
                                    name="მეილი"
                                    type="text"
                                    class="bg-slate-50 w-full text-sm font-medium-tbc text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-[#E98074] focus:bg-transparent"
                                    placeholder="შეიყვანეთ თქვენი ელ. ფოსტა"
                                />
                            </div>
                        </div>

                        <div class="my-6">
                            <button
                                disabled={submission.pending}
                                type="submit"
                                class="w-full shadow-xl py-2.5 px-4 text-[15px] font-medium-tbc font-bold rounded-md text-white bg-[#E98074] hover:bg-[#E85A4F] duration-200 ease-in focus:outline-none cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {submission.pending ? 'მუშავდება...' : 'გაგრძელება'}
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
            <Footer></Footer>
        </ProtectAnonymousRoute>
    )
}

export default FindUser