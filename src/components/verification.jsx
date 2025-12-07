import { useSubmission } from '@solidjs/router';
import { createEffect, on, onCleanup, Show } from 'solid-js';
import { act_on_login_response } from '~/routes/api/auth/handle-forms/login_response';
import { resend_code } from '~/routes/api/auth/handle-forms/resend_code';
import { verify_email_action } from '~/routes/api/auth/handle-forms/verify-email';

export const EmailVerification = () => {
    const code_submission = useSubmission(verify_email_action)
    const resend_code_submission = useSubmission(resend_code)

    const device_id = () => code_submission.result?.device_id
    const waiting_for_approval = () => code_submission.result?.waiting_for_approval

    createEffect(
        on(
            device_id,
            () => {
                if (!device_id()) return;
                let timeout;
                const recursive_func = async () => {
                    try {
                        const res = await act_on_login_response(device_id())
                        if (!res.ok) return
                        window.location = res.redirectTo
                    } catch (err) {

                    } finally {
                        timeout = setTimeout(async () => await recursive_func(), 2000)
                    }
                }
                timeout = setTimeout(async () => await recursive_func(), 2000)

                onCleanup(() => {
                    clearTimeout(timeout)
                })
            },
            { defer: true }
        )
    );

    return (
        <main class="w-full max-w-md h-full mx-4">
            <div class="bg-white rounded-xl border border-gray-200 p-8 relative">
                <Show when={waiting_for_approval()}>
                    <div class="text-center py-10">
                        <h2 class="text-xl font-bold text-gray-900">⏳ ახალი მოწყობილობის ავტორიზაციისთვის გელოდებით</h2>
                        <p class="text-gray-600 mt-2">მომხმარებელი უნდა დაუშვას თქვენი შესვლა.</p>
                    </div>
                </Show>
                <Show when={!waiting_for_approval()}>
                    <header class="mb-8 text-center">
                        <div class="w-16 h-16 bg-[#E98074] rounded-full flex items-center justify-center mx-auto mb-4">
                            <img src='/svg/inbox-stroke-white.svg' />
                        </div>
                        <h1 class="text-2xl font-bold-tbc mb-2 text-gray-900">ელფოსტის ვერიფიკაცია</h1>
                        <p class="text-gray-600 leading-relaxed">
                            შეიყვანეთ 6-ნიშნა ვერიფიკაციის კოდი, რომელიც გამოგეგზავნათ ელფოსტაზე.
                        </p>
                    </header>

                    <form action={verify_email_action} method='POST'>
                        <div class="mb-3">
                            <input
                                name="კოდი"
                                type="text"
                                class="bg-slate-50 w-full tracking-widest font-medium-tbc text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-[#E98074] focus:bg-transparent"
                                placeholder="------"
                                maxlength="6"
                            />
                        </div>
                        <Show when={code_submission.result?.error_message}>
                            <p class="mb-2 text-red-500 font-medium-bold font-bold text-sm">
                                {code_submission.result.error_message}
                            </p>
                        </Show>
                        <div class="mb-6">
                            <button
                                type="submit"
                                disabled={code_submission.pending}
                                class="w-full bg-[#E98074] text-white py-3 px-4 rounded-lg font-medium-tbc hover:bg-[#E85A4F] disabled:opacity-50 disabled:cursor-not-allowed duration-200 transition"
                            >
                                {code_submission.pending ? 'მოწმდება...' : 'დადასტურება'}
                            </button>
                        </div>
                    </form>

                    <form action={resend_code} method='POST' class="text-center pt-4 border-t border-gray-100">
                        <p class="text-gray-600 mb-3">კოდი არ მოგივიდათ?</p>
                        <button
                            type="submit"
                            disabled={resend_code_submission.pending}
                            class="text-[#E98074] font-medium-tbc hover:text-[#E85A4F] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {resend_code_submission.pending ? 'იგზავნება...' : 'ხელახლა გაგზავნა'}
                        </button>
                    </form>
                </Show>
            </div>
        </main>
    );
}
