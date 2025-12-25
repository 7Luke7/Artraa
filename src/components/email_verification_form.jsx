import { useSubmission } from '@solidjs/router';
import { Show } from 'solid-js';
import { resend_code } from '../routes/api/auth/handle-forms/resend_code';
import { verify_email_action } from '../routes/api/auth/handle-forms/verify-email';

export const EmailVerification = () => {
    const code_submission = useSubmission(verify_email_action)
    const resend_code_submission = useSubmission(resend_code)

    const code_submission_message = () => code_submission.result?.message
    const code_submission_field_global = () => code_submission.result?.field === 'global'
    const code_submission_field_code = () => code_submission.result?.field === 'one-time-code'
    const resend_code_submission_result = () => resend_code_submission.result

    return (
        <section
            class="w-full max-w-md h-full my-10 mx-4"
            aria-labelledby="verification-title"
            aria-describedby="verification-description"
        >
            <div class="bg-white rounded-xl border border-gray-200 p-8 relative">
                <header class="mb-8 text-center">
                    <div
                        class="w-16 h-16 bg-[#E98074] rounded-full flex items-center justify-center mx-auto mb-4"
                        role="img"
                        aria-label="ელფოსტის ყუთი"
                    >
                        <img
                            src='/svg/inbox-stroke-white.svg'
                            alt=""
                            aria-hidden="true"
                        />
                    </div>
                    <h1
                        id="verification-title"
                        class="text-2xl font-gsans font-bold mb-2 text-gray-900"
                    >
                        ელფოსტის ვერიფიკაცია
                    </h1>
                    <p
                        id="verification-description"
                        class="text-gray-600 leading-relaxed"
                    >
                        შეიყვანეთ 6-ნიშნა ვერიფიკაციის კოდი, რომელიც გამოგეგზავნათ ელფოსტაზე.
                    </p>
                </header>
                <div class="sr-only" aria-live="polite" aria-atomic="true">
                    {code_submission.pending && "ვერიფიკაციის კოდი მოწმდება..."}
                    {resend_code_submission.pending && "ახალი კოდი იგზავნება..."}
                </div>
                <Show when={code_submission_field_global() || resend_code_submission_result() && !resend_code_submission_result().ok}>
                    <div
                        id="global-error"
                        role="alert"
                        aria-live="assertive"
                        aria-atomic="true"
                        class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
                    >
                        <p class="text-sm font-gsans font-medium text-red-800">
                            {code_submission_message()}
                        </p>
                    </div>
                </Show>
                <Show when={resend_code_submission_result()?.ok}>
                    <div
                        role="status"
                        aria-live="polite"
                        aria-atomic="true"
                        class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md"
                    >

                        <p class="text-sm font-gsans font-medium text-green-800">
                            {resend_code_submission_result().message}
                        </p>
                    </div>
                </Show>
                <form
                    action={verify_email_action}
                    method='POST'
                    aria-label="ვერიფიკაციის კოდის შეყვანის ფორმა"
                >
                    <section class="mb-3">
                        <label
                            for="one-time-code"
                            class="sr-only"
                        >
                            ვერიფიკაციის კოდი
                        </label>
                        <input
                            id="one-time-code"
                            name="one-time-code"
                            type="text"
                            inputMode='numeric'
                            pattern="[0-9]{6}"
                            maxlength="6"
                            minlength="6"
                            required
                            aria-required='true'
                            autocomplete="one-time-code"
                            disabled={code_submission.pending}
                            aria-invalid={code_submission_field_code() ? 'true' : 'false'}
                            aria-describedby={code_submission_field_code() ? "verification-error" : "verification-description"}
                            class="bg-slate-50 w-full tracking-widest font-gsans font-medium text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-[#E98074] focus:ring-2 focus:ring-[#E98074] focus:ring-opacity-50 focus:bg-transparent text-center text-2xl disabled:opacity-70"
                            placeholder="000000"
                        />
                        <p
                            id="code-hint"
                            class="text-xs text-gray-500 mt-1 text-center"
                        >
                            6-ნიშნა რიცხვითი კოდი
                        </p>
                    </section>
                    <Show when={code_submission_field_code()}>
                        <div role="alert" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                            <p class="text-sm font-gsans font-medium text-red-800">
                                {code_submission_message()}
                            </p>
                        </div>
                    </Show>
                    <div class="mb-6">
                        <button
                            type="submit"
                            disabled={code_submission.pending}
                            aria-busy={code_submission.pending}
                            class="w-full bg-[#E98074] text-white py-3 px-4 rounded-lg font-gsans font-medium hover:bg-[#E85A4F] focus:outline-none focus:ring-4 focus:ring-[#E98074] focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed duration-200 transition relative"
                        >
                            {code_submission.pending ? (
                                <span class="flex items-center justify-center">
                                    <span class="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    მოწმდება...
                                </span>
                            ) : 'დადასტურება'}
                        </button>
                    </div>
                </form>

                <div class="text-center pt-4 border-t border-gray-100">
                    <p
                        id="resend-description"
                        class="text-gray-600 mb-3"
                    >
                        კოდი არ მოგივიდათ?
                    </p>
                    <form
                        action={resend_code}
                        method='POST'
                        aria-labelledby="resend-description"
                    >
                        <button
                            type="submit"
                            disabled={resend_code_submission.pending}
                            aria-busy={resend_code_submission.pending}
                            class="text-[#E98074] font-gsans font-medium hover:text-[#E85A4F] focus:outline-none focus:ring-2 focus:ring-[#E98074] focus:ring-opacity-50 focus:rounded focus:px-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {resend_code_submission.pending ? 'იგზავნება...' : 'ხელახლა გაგზავნა'}
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
