import { Title } from "@solidjs/meta"
import { useSubmission } from "@solidjs/router"
import { Show } from "solid-js"
import ProtectVerify from "~/components/protectVerifyRoute"
import { approve_with_device, approve_with_email } from "~/routes/api/auth/handle-forms/verification_options"

const verificationMethods = [
    {
        action: approve_with_email,
        id: "email",
        title: "ელფოსტის კოდი",
        description: "ერთჯერადი კოდი გამოგზავნილია თქვენს ელ-ფოსტაზე",
        icon: <img src='/svg/mail-forward.svg' width={22} height={22} />,
        ariaLabel: "ელფოსტაზე მიღებული კოდით დადასტურება",
    },
    {
        action: approve_with_device,
        id: "device",
        title: "სხვა მოწყობილობა",
        description: "დაადასტურეთ სხვა ავტორიზებული მოწყობილობიდან",
        icon: <img src='/svg/device-mobile-check.svg' width={22} height={22} />,
        ariaLabel: "სხვა მოწყობილობით დადასტურება",
    },
]

const PendingLogin = (props) => {
    const approve_with_email_sub  = useSubmission(approve_with_email)
    const approve_with_device_sub = useSubmission(approve_with_device)
    const is_pending = () => approve_with_email_sub.pending || approve_with_device_sub.pending

    return (
        <ProtectVerify>
            <Title>Artra - შესვლის დადასტურება</Title>

            <main class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
                <div
                    class="fixed inset-0 pointer-events-none opacity-[0.025]"
                    style={{
                        "background-image": "linear-gradient(#E85A4F 1px, transparent 1px), linear-gradient(90deg, #E85A4F 1px, transparent 1px)",
                        "background-size": "48px 48px",
                    }}
                />

                <div class="relative w-full max-w-md">
                    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="h-1 bg-gradient-to-r from-[#E85A4F] via-[#f07068] to-[#E85A4F]/40" />

                        <div class="p-8">
                            <div class="text-center mb-8">
                                <div class="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#E85A4F]/8 border border-[#E85A4F]/15 mb-5">
                                    <img src='/svg/shield-lock.svg' width={26} height={26} />
                                </div>
                                <h1 class="text-xl font-gsans font-bold text-gray-900 mb-2">
                                    დაადასტურეთ შესვლა
                                </h1>
                                <p class="text-sm font-gsans text-gray-400 leading-relaxed max-w-xs mx-auto">
                                    უსაფრთხოების მიზნით გთხოვთ აირჩიოთ ვერიფიკაციის მეთოდი
                                </p>
                            </div>

                            <div class="space-y-3">
                                {verificationMethods.map((method) => (
                                    <form
                                        action={method.action.with(props.location.search)}
                                        method="POST"
                                    >
                                        <button
                                            type="submit"
                                            disabled={is_pending()}
                                            aria-label={method.ariaLabel}
                                            class={`
                                                w-full group flex items-center gap-4 p-4 rounded-xl border-2 text-left
                                                transition-all duration-200 active:scale-[0.99]
                                                focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E85A4F]/40
                                                ${is_pending()
                                                    ? "border-gray-100 bg-gray-50 opacity-60 cursor-wait"
                                                    : "border-gray-100 bg-white hover:border-[#E85A4F]/40 hover:bg-[#E85A4F]/4 hover:shadow-sm"
                                                }
                                            `}
                                        >
                                            <div class={`shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors
                                                ${is_pending() ? "bg-gray-100 text-gray-400" : "bg-gray-50 text-gray-500 group-hover:bg-[#E85A4F]/10 group-hover:text-[#E85A4F]"}`}
                                            >
                                                {method.icon}
                                            </div>
                                            <div class="flex-1 min-w-0">
                                                <p class={`font-gsans font-semibold text-sm transition-colors
                                                    ${is_pending() ? "text-gray-400" : "text-gray-900 group-hover:text-[#E85A4F]"}`}
                                                >
                                                    {method.title}
                                                </p>
                                                <p class="text-xs font-gsans text-gray-400 mt-0.5 leading-snug">
                                                    {method.description}
                                                </p>
                                            </div>
                                            <Show when={!is_pending()}>
                                                <img src='/svg/chevron-right-black.svg' width={16} height={16} />
                                            </Show>

                                            <Show when={is_pending()}>
                                                <div class="relative w-4 h-4">
                                                    <div class="absolute inset-0 rounded-full border-2 border-gray-200" />
                                                    <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E85A4F] animate-spin" />
                                                </div>
                                            </Show>
                                        </button>
                                    </form>
                                ))}
                            </div>

                            {/* Footer */}
                            <div class="mt-8 pt-6 border-t border-gray-100 text-center">
                                <p class="text-xs text-gray-400 font-gsans leading-relaxed">
                                    პრობლემა გაქვთ?{" "}
                                    <a
                                        href={`mailto:${import.meta.env.VITE_EMAIL}`}
                                        class="text-[#E85A4F] hover:underline underline-offset-2 font-medium"
                                    >
                                        დაგვიკავშირდით
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Artra branding below card */}
                    <p class="text-center text-xs text-gray-300 font-gsans mt-5">
                        Artra · ავტორიზაცია
                    </p>
                </div>
            </main>
        </ProtectVerify>
    )
}

export default PendingLogin