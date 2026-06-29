import { Title, Meta } from "@solidjs/meta"
import { Show } from "solid-js"
import { Header } from "~/components/Header"
import { Footer } from "~/components/Footer"
import { RenderWebsocketRoutes } from "~/components/RenderWebsocketRoutes"
import { useSubmission } from "@solidjs/router"
import { contactForm } from "../api/contact"

const CONTACT_INFO = {
    email: "hello@artra.ge",
    support_email: "support@artra.ge",
    teach_email: "teach@artra.ge",
}

const SUBJECT_OPTIONS = [
    "ტექნიკური პრობლემა",
    "გადახდასთან დაკავშირებული კითხვა",
    "კურსის შინაარსი",
    "ანგარიშის საკითხი",
    "ინსტრუქტორობა",
    "პარტნიორობა",
    "სხვა",
]

export default function ContactPage() {
    const submission = useSubmission(contactForm)
    const NameField = () => submission.result?.field === 'name'
    const EmailField = () => submission.result?.field === 'email'
    const GlobalField = () => submission.result?.field === 'global'
    const messageField = () => submission.result?.field === 'message'
    const message = () => submission.result?.message
    const isOk = () => submission.result?.ok

    const inputCls = "w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-gsans text-gray-900 placeholder-gray-400 bg-white focus:outline-none focus:border-[#E85A4F]/50 focus:ring-2 focus:ring-[#E85A4F]/10 transition-colors"

    return (
        <RenderWebsocketRoutes>
            <Title>კონტაქტი - Artra</Title>
            <Meta name="description" content="დაგვიკავშირდით ნებისმიერი კითხვით — ჩვენ ვართ აქ დასახმარებლად." />

            <div class="min-h-screen flex flex-col bg-gray-50">
                <div class="w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto flex-1">
                    <Header />

                    <div class="py-10 md:py-14">
                        <div class="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
                            <div class="lg:col-span-2 space-y-4">
                                <div class="mb-10 md:mb-12">
                                    <h1 class="text-3xl md:text-4xl font-gsans font-bold text-gray-900 mb-3 leading-tight">
                                        როგორ შეგვიძლია<br class="hidden sm:block" /> დაგეხმაროთ?
                                    </h1>
                                    <p class="text-gray-400 font-gsans text-sm md:text-base max-w-lg leading-relaxed">
                                        გაქვთ კითხვა, პრობლემა ან წინადადება? მოგვწერეთ ჩვეულებრივ ვპასუხობთ{" "}
                                        <span class="text-gray-600 font-medium">24 საათის</span> განმავლობაში.
                                    </p>
                                </div>
                                <ContactCard
                                    icon={
                                        <img src='/svg/inbox-stroke-normal.svg' width={20} height={20} />
                                    }
                                    label="ზოგადი კითხვები"
                                    value={CONTACT_INFO.email}
                                    href={`mailto:${CONTACT_INFO.email}`}
                                />
                                <ContactCard
                                    icon={
                                        <img src='/svg/help.svg' width={20} height={20} />
                                    }
                                    label="ტექნიკური მხარდაჭერა"
                                    value={CONTACT_INFO.support_email}
                                    href={`mailto:${CONTACT_INFO.support_email}`}
                                />
                                <ContactCard
                                    icon={
                                        <img src='/svg/book-light.svg' width={20} height={20} />
                                    }
                                    label="ინსტრუქტორობა"
                                    value={CONTACT_INFO.teach_email}
                                    href={`mailto:${CONTACT_INFO.teach_email}`}
                                />

                                <div class="bg-[#E85A4F]/5 border border-[#E85A4F]/15 rounded-2xl p-4 flex items-start gap-3">
                                    <div class="w-8 h-8 rounded-lg bg-[#E85A4F]/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <img src='/svg/clock.svg' width={16} height={16} />
                                    </div>
                                    <div>
                                        <p class="text-sm font-gsans font-semibold text-gray-800 mb-0.5">სწრაფი პასუხი</p>
                                        <p class="text-xs font-gsans text-gray-400 leading-relaxed">
                                            ვპასუხობთ 24 საათის განმავლობაში სამუშაო დღეებში.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div class="lg:col-span-3">
                                <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                                    <div class="px-6 pt-6 pb-5 border-b border-gray-100">
                                        <h2 id="registration-form-title" class="font-gsans font-bold text-gray-900">შეტყობინების გაგზავნა</h2>
                                        <p id="registration-form-description" class="text-xs text-gray-400 font-gsans mt-0.5">ყველა ველი სავალდებულოა</p>
                                    </div>
                                    <form
                                        action={contactForm}
                                        method="POST"
                                        aria-labelledby="registration-form-title"
                                        aria-describedby={GlobalField() ? 'global-error' : 'registration-form-description'}
                                        role="form"
                                        class="p-6 space-y-4">
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <section>
                                                <Field label="სახელი">
                                                    <input
                                                        name="name"
                                                        required
                                                        aria-required='true'
                                                        maxlength="254"
                                                        minLength="2"
                                                        id="name"
                                                        type="text"
                                                        title="მხოლოდ ასოები, მინიმუმ 2 სიმბოლო"
                                                        disabled={submission.pending}
                                                        aria-invalid={NameField() ? 'true' : 'false'}
                                                        aria-describedby={NameField() ? "email-error" : undefined}
                                                        autocomplete='name'
                                                        class={inputCls}
                                                        placeholder="სახელი"
                                                    />
                                                </Field>
                                                <Show when={NameField()}>
                                                    <div
                                                        id="name-error"
                                                        role="alert"
                                                        class="mt-2 text-sm text-red-600 font-gsans font-medium"
                                                    >
                                                        {message()}
                                                    </div>
                                                </Show>
                                            </section>
                                            <section>
                                                <Field label="ელ-ფოსტა">
                                                    <input
                                                        name="email"
                                                        required
                                                        aria-required='true'
                                                        maxlength="254"
                                                        id="email"
                                                        type="email"
                                                        title="გთხოვთ შეიყვანოთ სწორი ელ.ფოსტის მისამართი"
                                                        disabled={submission.pending}
                                                        aria-invalid={EmailField() ? 'true' : 'false'}
                                                        aria-describedby={EmailField() ? "email-error" : undefined}
                                                        autocomplete='username'
                                                        class={inputCls}
                                                        placeholder="მეილი"
                                                    />
                                                </Field>
                                                <Show when={EmailField()}>
                                                    <div
                                                        id="email-error"
                                                        role="alert"
                                                        class="mt-2 text-sm text-red-600 font-gsans font-medium"
                                                    >
                                                        {message()}
                                                    </div>
                                                </Show>
                                            </section>
                                        </div>

                                        <Field label="თემა">
                                            <div class="relative">
                                                <select
                                                    name="subject"
                                                    class={`${inputCls} appearance-none pr-9 cursor-pointer`}
                                                >
                                                    <option value="" disabled>აირჩიეთ თემა</option>
                                                    {SUBJECT_OPTIONS.map(opt => (
                                                        <option value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                                <img src='/svg/chevron-down.svg' width={16} height={16} class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                            </div>
                                        </Field>

                                        <section>
                                            <Field label="შეტყობინება" hint={`${message().length}/1000`}>
                                                <textarea
                                                    rows={5}
                                                    class={`${inputCls} resize-none`}
                                                    id='message'
                                                    name="message"
                                                    required
                                                    aria-required='true'
                                                    minlength="50"
                                                    maxlength="1000"
                                                    title="მინიმუმ 50 სიმბოლო, მაქსიმუმ 1000."
                                                    disabled={submission.pending}
                                                    aria-invalid={messageField() ? 'true' : 'false'}
                                                    aria-describedby={messageField() ? "given_name-error" : undefined}
                                                    placeholder="დაწერეთ თქვენი შეტყობინება..."
                                                />
                                            </Field>
                                            <Show when={EmailField()}>
                                                <div
                                                    id="email-error"
                                                    role="alert"
                                                    class="mt-2 text-sm text-red-600 font-gsans font-medium"
                                                >
                                                    {message()}
                                                </div>
                                            </Show>
                                        </section>

                                        <Show when={GlobalField()}>
                                            <div
                                                id="global-error"
                                                role="alert"
                                                aria-live="assertive"
                                                aria-atomic="true"
                                                class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
                                            >
                                                <p class="text-sm font-gsans font-medium text-red-800">
                                                    {message()}
                                                </p>
                                                <p class="text-xs text-red-700 mt-1">
                                                    გთხოვთ შეამოწმოთ ყველა ველი და სცადოთ თავიდან.
                                                </p>
                                            </div>
                                        </Show>
                                        <Show when={isOk()}>
                                            <div role="status" class="mb-5 flex items-center gap-3 p-3.5 bg-green-50 border border-green-100 rounded-xl">
                                                <img src='/svg/check.svg' width={16} height={16} />
                                                <p class="text-sm font-gsans text-green-700">{message()}</p>
                                            </div>
                                        </Show>

                                        <button
                                            type="submit"
                                            disabled={submission.pending}
                                            aria-label={submission.pending ? "რეგისტრაცია მუშავდება" : "რეგისტრაცია"}
                                            aria-busy={submission.pending}
                                            aria-describedby={GlobalField() ? 'global-error' : undefined}
                                            class="w-full py-3.5 rounded-xl bg-[#E85A4F] hover:bg-[#D84A3F] text-white font-gsans font-bold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
                                        >
                                            <Show when={submission.pending} fallback={
                                                <>
                                                    <img src='/svg/send.svg' width={16} height={16} />
                                                    გაგზავნა
                                                </>
                                            }>
                                                <div class="relative w-4 h-4">
                                                    <div class="absolute inset-0 rounded-full border-2 border-gray-200" />
                                                    <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E85A4F] animate-spin" />
                                                </div>
                                                იგზავნება...
                                            </Show>
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </RenderWebsocketRoutes>
    )
}

function Field(props) {
    return (
        <>
            <div class="flex items-center justify-between mb-1.5">
                <label class="text-sm font-gsans font-medium text-gray-700">
                    {props.label}
                    <span class="text-[#E85A4F] ml-0.5">*</span>
                </label>
            </div>
            {props.children}
        </>
    )
}

function ContactCard(props) {
    return (
        <a
            href={props.href}
            class="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-4 shadow-sm hover:border-[#E85A4F]/30 hover:shadow-md transition-all group"
        >
            <div class="w-10 h-10 rounded-xl bg-gray-50 group-hover:bg-[#E85A4F]/10 flex items-center justify-center text-gray-400 group-hover:text-[#E85A4F] transition-colors shrink-0">
                {props.icon}
            </div>
            <div class="min-w-0">
                <p class="text-xs text-gray-400 font-gsans mb-0.5">{props.label}</p>
                <p class="text-sm font-gsans font-semibold text-gray-800 group-hover:text-[#E85A4F] transition-colors truncate">
                    {props.value}
                </p>
            </div>
            <img src='/svg/chevron-right-black.svg' width={16} height={16} class="ml-auto shrink-0" />
        </a>
    )
}