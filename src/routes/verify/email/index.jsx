import { Title } from "@solidjs/meta"
import ProtectVerify from "~/components/protectVerifyRoute"
import { useSubmission } from "@solidjs/router"
import { Show } from "solid-js"
import { verify_email_action } from "~/routes/api/auth/handle-forms/verify-email"
import { resend_code } from "~/routes/api/auth/handle-forms/resend_code"
import { Footer } from "~/components/Footer"

const Verify = (props) => {
  const code_sub = useSubmission(verify_email_action)
  const resend_sub = useSubmission(resend_code)

  const msg = () => code_sub.result?.message
  const isGlobalErr = () => code_sub.result?.field === "global"
  const isCodeErr = () => code_sub.result?.field === "one-time-code"
  const resendResult = () => resend_sub.result

  
  return <ProtectVerify>
    <Title>Artra - ელფოსტის ვერიფიკაცია</Title>
    <div class="min-h-screen flex flex-col bg-gray-50">
      <div
        class="fixed inset-0 pointer-events-none opacity-[0.03]"
        style={{
          "background-image": "radial-gradient(#E85A4F 1px, transparent 1px)",
          "background-size": "28px 28px",
        }}
      />
      <div class="flex-1 flex items-center justify-center px-4 py-12 relative">
        <div class="w-full max-w-md">
          <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div class="h-1 bg-gradient-to-r from-[#E85A4F] via-[#f07068] to-[#E85A4F]/40" />
            <div class="p-8">
              <div class="text-center mb-8">
                <div class="relative inline-flex items-center justify-center mb-5">
                  <span class="absolute w-16 h-16 rounded-full bg-[#E85A4F]/8 animate-ping opacity-30" style={{ "animation-duration": "2.5s" }} />
                  <div class="relative w-14 h-14 rounded-2xl bg-[#E85A4F]/8 border border-[#E85A4F]/15 flex items-center justify-center">
                    <img src='/svg/mail-check-branded.svg' width={26} height={26} />
                  </div>
                </div>

                <h1 class="text-xl font-gsans font-bold text-gray-900 mb-2">
                  ელფოსტის ვერიფიკაცია
                </h1>
                <p class="text-sm font-gsans text-gray-400 leading-relaxed max-w-xs mx-auto">
                  შეიყვანეთ 6-ნიშნა კოდი, რომელიც გამოგეგზავნათ ელფოსტაზე
                </p>
              </div>
              <div class="sr-only" aria-live="polite" aria-atomic="true">
                {code_sub.pending && "ვერიფიკაციის კოდი მოწმდება..."}
                {resend_sub.pending && "ახალი კოდი იგზავნება..."}
              </div>
              <Show when={isGlobalErr() || (resendResult() && !resendResult().ok)}>
                <div role="alert" class="mb-5 flex items-center gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                  <img src='/svg/exclamation.svg' width={16} height={16} />
                  <p class="text-sm font-gsans text-red-700">{msg()}</p>
                </div>
              </Show>
              <Show when={resendResult()?.ok}>
                <div role="status" class="mb-5 flex items-center gap-3 p-3.5 bg-green-50 border border-green-100 rounded-xl">
                  <img src='/svg/check.svg' width={16} height={16} />
                  <p class="text-sm font-gsans text-green-700">{resendResult().message}</p>
                </div>
              </Show>
              <form
                action={verify_email_action}
                method="POST"
                aria-label="ვერიფიკაციის კოდის შეყვანა"
                class="space-y-4"
              >
                <input type="hidden" name="next_page" value={props.search} />

                <div>
                  <label for="one-time-code" class="sr-only">
                    ვერიფიკაციის კოდი
                  </label>
                  <input
                    id="one-time-code"
                    name="one-time-code"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]{6}"
                    maxlength="6"
                    minlength="6"
                    required
                    aria-required="true"
                    autocomplete="one-time-code"
                    disabled={code_sub.pending}
                    aria-invalid={isCodeErr() ? "true" : "false"}
                    aria-describedby="verification-description"
                    placeholder="000000"
                    class={`w-full text-center text-3xl font-gsans font-bold tracking-[0.5em] py-4 px-4 rounded-xl border-2 bg-gray-50
                                    placeholder-gray-200 text-gray-900 outline-none transition-all duration-200
                                    disabled:opacity-50
                                    ${isCodeErr()
                        ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-gray-200 focus:border-[#E85A4F] focus:ring-2 focus:ring-[#E85A4F]/10 focus:bg-white"
                      }`}
                  />

                  <Show when={isCodeErr()}>
                    <div role="alert" class="mt-2 flex items-center gap-2 text-red-600">
                      <img src='/svg/exclamation.svg' width={16} height={16} />
                      <p class="text-xs font-gsans">{msg()}</p>
                    </div>
                  </Show>
                </div>

                <button
                  type="submit"
                  disabled={code_sub.pending}
                  aria-busy={code_sub.pending}
                  class="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#E85A4F] hover:bg-[#D84A3F] text-white font-gsans font-bold text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  <Show when={code_sub.pending} fallback="დადასტურება">
                    <div class="relative w-4 h-4">
                        <div class="absolute inset-0 rounded-full border-2 border-gray-200" />
                        <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E85A4F] animate-spin" />
                    </div>                   
                    მოწმდება...
                  </Show>
                </button>
              </form>

              <div class="mt-6 pt-5 border-t border-gray-100 flex items-center justify-center gap-2">
                <p class="text-xs text-gray-400 font-gsans">კოდი არ მოგივიდათ?</p>
                <form action={resend_code} method="POST">
                  <button
                    type="submit"
                    disabled={resend_sub.pending}
                    aria-busy={resend_sub.pending}
                    class="text-xs font-gsans font-semibold text-[#E85A4F] hover:text-[#D84A3F] hover:underline underline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {resend_sub.pending ? "იგზავნება..." : "ხელახლა გაგზავნა"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          <p class="text-center text-xs text-gray-300 font-gsans mt-5">
            Artra · ელფოსტის დადასტურება
          </p>
        </div>
      </div>
      <Footer />
    </div>
  </ProtectVerify>
}

export default Verify