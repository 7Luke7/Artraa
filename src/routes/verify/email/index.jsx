import { Title } from "@solidjs/meta"
import ProtectVerify from "~/components/protectVerifyRoute"
import { createAsync, useSubmission } from "@solidjs/router"
import { Index, Show, createEffect, createSignal, onCleanup, onMount } from "solid-js"
import { verify_email_action } from "~/routes/api/auth/handle-forms/verify-email"
import { resend_code } from "~/routes/api/auth/handle-forms/resend_code"
import { pending_verification } from "~/routes/api/auth/pending_verification"
import { Footer } from "~/components/Footer"

/** The code is six digits (validation-rules.js). */
const LENGTH = 6

/** How long the resend control stays disabled after a code has been sent. */
const RESEND_COOLDOWN = 30

const two = (n) => String(n).padStart(2, '0')
const clock = (seconds) => `${two(Math.floor(seconds / 60))}:${two(seconds % 60)}`

const Verify = (props) => {
  const code_sub = useSubmission(verify_email_action)
  const resend_sub = useSubmission(resend_code)
  const pending = createAsync(pending_verification)

  const msg = () => code_sub.result?.message
  const isGlobalErr = () => code_sub.result?.field === "global"
  const isCodeErr = () => code_sub.result?.field === "one-time-code"
  const resendResult = () => resend_sub.result

  // The six boxes are painted from this; the input under them holds the real
  // value. Keeping one input rather than six is what makes backspace, text
  // selection, autofill and autocomplete="one-time-code" behave natively
  // instead of each having to be reimplemented per keystroke.
  const [code, setCode] = createSignal("")
  const [focused, setFocused] = createSignal(false)

  // Until Solid has hydrated there are no boxes to paint, so the input stays an
  // ordinary visible field. Without this the pre-hydration page would look like
  // it was swallowing keystrokes: text typed into an input that is transparent
  // because the thing meant to render it does not exist yet.
  const [enhanced, setEnhanced] = createSignal(false)

  const [remaining, setRemaining] = createSignal(null)
  const [cooldown, setCooldown] = createSignal(0)

  let form
  let field

  // An error belongs to the code that produced it. Leaving it on screen while
  // the next one is typed makes a correct code look rejected before it has been
  // sent anywhere.
  const [dismissed, setDismissed] = createSignal(false)
  const showCodeErr = () => isCodeErr() && !dismissed()
  const showGlobalErr = () => isGlobalErr() && !dismissed()

  // ...and an answer un-dismisses. Without this the flag set while typing is
  // never cleared, so the rejection that comes back for the code just sent is
  // suppressed too and a wrong code is refused in silence.
  createEffect(() => {
    code_sub.result
    if (!code_sub.pending) setDismissed(false)
  })

  const accept = (raw) => {
    const digits = String(raw ?? "").replace(/\D/g, "").slice(0, LENGTH)
    setCode(digits)
    setDismissed(true)
    return digits
  }

  const onInput = (event) => {
    const digits = accept(event.currentTarget.value)
    // Non-digits are dropped, so the field has to be written back or the
    // rejected character stays in the (invisible) input and the boxes disagree
    // with the value that would be posted.
    if (event.currentTarget.value !== digits) event.currentTarget.value = digits
  }

  // Codes are copied out of an email, and they arrive with whatever the mail
  // client wrapped around them: "481 093", a trailing newline, sometimes the
  // whole sentence. Taking just the digits is the difference between paste
  // working and the field rejecting a code the user can see is correct.
  const onPaste = (event) => {
    const text = event.clipboardData?.getData("text")
    if (!text) return
    event.preventDefault()
    const digits = accept(text)
    if (field) field.value = digits
  }

  onMount(() => {
    setEnhanced(true)
    field?.focus()

    const tick = setInterval(() => {
      setRemaining((left) => (typeof left === 'number' && left > 0 ? left - 1 : left))
      setCooldown((left) => (left > 0 ? left - 1 : 0))
    }, 1000)
    onCleanup(() => clearInterval(tick))
  })

  // Seeded from the key's own TTL rather than from a constant, so a code issued
  // four minutes ago does not claim a fresh fifteen.
  createEffect(() => {
    const seconds = pending()?.expires_in
    if (typeof seconds === 'number') setRemaining(seconds)
  })

  createEffect(() => {
    if (resendResult()?.ok) {
      setRemaining(pending()?.expires_in ?? null)
      setCooldown(RESEND_COOLDOWN)
    }
  })

  // Submitting the moment the last digit lands removes the one step in this
  // screen that has no decision in it. Guarded on the value rather than a
  // boolean, so a code corrected after a rejection still submits and the same
  // rejected code does not resubmit itself in a loop.
  let submitted = null
  createEffect(() => {
    const value = code()
    if (value.length !== LENGTH) return
    if (code_sub.pending || value === submitted) return
    submitted = value
    form?.requestSubmit()
  })

  const expired = () => remaining() === 0
  const busy = () => code_sub.pending

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
                    <img src='/svg/mail-check-branded.svg' width={26} height={26} alt="" />
                  </div>
                </div>

                <h1 class="text-xl font-gsans font-bold text-gray-900 mb-2">
                  ელფოსტის ვერიფიკაცია
                </h1>
                <p class="text-sm font-gsans text-gray-400 leading-relaxed max-w-xs mx-auto">
                  შეიყვანეთ 6-ნიშნა კოდი, რომელიც გამოგეგზავნათ
                </p>
                <Show when={pending()?.email_hint}>
                  <p class="mt-1.5 text-sm font-gsans font-semibold text-gray-700 break-all">
                    {pending().email_hint}
                  </p>
                </Show>
              </div>

              <div class="sr-only" aria-live="polite" aria-atomic="true">
                {code_sub.pending && "ვერიფიკაციის კოდი მოწმდება..."}
                {resend_sub.pending && "ახალი კოდი იგზავნება..."}
              </div>

              <Show when={showGlobalErr() || (resendResult() && !resendResult().ok)}>
                <div role="alert" class="mb-5 flex items-center gap-3 p-3.5 bg-red-50 border border-red-100 rounded-xl">
                  <img src='/svg/exclamation.svg' width={16} height={16} alt="" />
                  <p class="text-sm font-gsans text-red-700">{msg() || resendResult()?.message}</p>
                </div>
              </Show>
              <Show when={resendResult()?.ok}>
                <div role="status" class="mb-5 flex items-center gap-3 p-3.5 bg-green-50 border border-green-100 rounded-xl">
                  <img src='/svg/check.svg' width={16} height={16} alt="" />
                  <p class="text-sm font-gsans text-green-700">{resendResult().message}</p>
                </div>
              </Show>

              <form
                ref={form}
                action={verify_email_action}
                method="POST"
                aria-label="ვერიფიკაციის კოდის შეყვანა"
                class="space-y-4"
              >
                <input type="hidden" name="next_page" value={props.location?.search ?? ""} />

                <div>
                  <label for="one-time-code" class="sr-only">
                    ვერიფიკაციის კოდი
                  </label>

                  <div class="relative">
                    <Show when={enhanced()}>
                      {/* Painted from the value, never focusable, and hidden
                          from assistive technology: the input below is the
                          control, and announcing six boxes alongside it would
                          read the same field twice. */}
                      <div class="flex justify-between gap-2" aria-hidden="true">
                        <Index each={Array.from({ length: LENGTH })}>
                          {(_, index) => {
                            const filled = () => code().length > index
                            const active = () => focused() &&
                              (code().length === index || (index === LENGTH - 1 && code().length === LENGTH))
                            return (
                              <div
                                class={`flex-1 aspect-[3/4] max-h-16 flex items-center justify-center rounded-xl border-2 bg-gray-50
                                        text-2xl font-gsans font-bold text-gray-900 transition-all duration-150
                                        ${showCodeErr()
                                    ? "border-red-300 bg-red-50"
                                    : active()
                                      ? "border-[#E85A4F] bg-white ring-2 ring-[#E85A4F]/10"
                                      : filled()
                                        ? "border-gray-300 bg-white"
                                        : "border-gray-200"}`}
                              >
                                <Show when={filled()} fallback={<span class="text-gray-200">·</span>}>
                                  {code()[index]}
                                </Show>
                              </div>
                            )
                          }}
                        </Index>
                      </div>
                    </Show>

                    <input
                      ref={field}
                      id="one-time-code"
                      name="one-time-code"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]{6}"
                      maxlength={LENGTH}
                      minlength={LENGTH}
                      required
                      aria-required="true"
                      autocomplete="one-time-code"
                      readonly={busy()}
                      aria-invalid={showCodeErr() ? "true" : "false"}
                      aria-describedby="verification-description"
                      placeholder={enhanced() ? "" : "000000"}
                      onInput={onInput}
                      onPaste={onPaste}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      class={enhanced()
                        ? `absolute inset-0 w-full h-full text-center bg-transparent border-0 outline-none
                           text-transparent caret-transparent selection:bg-transparent
                           [-webkit-text-fill-color:transparent] cursor-pointer`
                        : `w-full text-center text-3xl font-gsans font-bold tracking-[0.5em] py-4 px-4 rounded-xl border-2 bg-gray-50
                           placeholder-gray-200 text-gray-900 outline-none transition-all duration-200
                           ${showCodeErr()
                          ? "border-red-300 bg-red-50 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                          : "border-gray-200 focus:border-[#E85A4F] focus:ring-2 focus:ring-[#E85A4F]/10 focus:bg-white"}`}
                    />
                  </div>

                  <p id="verification-description" class="sr-only">
                    შეიყვანეთ ელფოსტაზე გამოგზავნილი 6-ნიშნა კოდი. კოდის სრულად შეყვანის შემდეგ ფორმა ავტომატურად გაიგზავნება.
                  </p>

                  <Show when={showCodeErr()}>
                    <div role="alert" class="mt-2 flex items-center gap-2 text-red-600">
                      <img src='/svg/exclamation.svg' width={16} height={16} alt="" />
                      <p class="text-xs font-gsans">{msg()}</p>
                    </div>
                  </Show>

                  <Show when={typeof remaining() === 'number'}>
                    <p class={`mt-3 text-center text-xs font-gsans ${expired() ? "text-red-500" : "text-gray-400"}`}>
                      <Show when={!expired()} fallback="კოდს ვადა გაუვიდა — გამოითხოვეთ ახალი">
                        კოდი იწურება <span class="font-semibold tabular-nums">{clock(remaining())}</span>-ში
                      </Show>
                    </p>
                  </Show>
                </div>

                <button
                  type="submit"
                  disabled={busy()}
                  aria-busy={busy()}
                  class="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#E85A4F] hover:bg-[#D84A3F] text-white font-gsans font-bold text-sm transition-all duration-200 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                >
                  <Show when={busy()} fallback="დადასტურება">
                    <div class="relative w-4 h-4">
                      <div class="absolute inset-0 rounded-full border-2 border-white/30" />
                      <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-white animate-spin" />
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
                    disabled={resend_sub.pending || cooldown() > 0}
                    aria-busy={resend_sub.pending}
                    class="text-xs font-gsans font-semibold text-[#E85A4F] hover:text-[#D84A3F] hover:underline underline-offset-2 disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed transition-colors"
                  >
                    {resend_sub.pending
                      ? "იგზავნება..."
                      : cooldown() > 0
                        ? `ხელახლა გაგზავნა (${cooldown()}წმ)`
                        : "ხელახლა გაგზავნა"}
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
