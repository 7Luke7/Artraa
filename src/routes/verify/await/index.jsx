import { Title } from "@solidjs/meta"
import { useNavigate } from "@solidjs/router"
import { createSignal, onCleanup, onMount } from "solid-js"
import ProtectVerify from "~/components/protectVerifyRoute"
import { act_on_login_response } from "~/routes/api/auth/handle-forms/login_response"

const WaitingForApproval = (props) => {
    const navigate = useNavigate()
    const next_page = new URLSearchParams(props.location.search).get("next")
    const [dots, setDots] = createSignal(1)

    onMount(() => {
        const dotsInterval = setInterval(() => {
            setDots(d => d >= 3 ? 1 : d + 1)
        }, 600)
        const pollInterval = setInterval(async () => {
            try {
                const res = await act_on_login_response()
                if (res.pending) return
                navigate(next_page || "/", { replace: true })
            } catch {}
        }, 2000)

        onCleanup(() => {
            clearInterval(dotsInterval)
            clearInterval(pollInterval)
        })
    })

    return (
        <ProtectVerify>
            <Title>Artra - მოწყობილობის დადასტურება</Title>
            <main class="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
                <div
                    class="fixed inset-0 pointer-events-none opacity-[0.025]"
                    style={{
                        "background-image": "linear-gradient(#E85A4F 1px, transparent 1px), linear-gradient(90deg, #E85A4F 1px, transparent 1px)",
                        "background-size": "48px 48px",
                    }}
                />

                <div class="relative w-full max-w-sm">
                    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                        <div class="h-1 bg-gradient-to-r from-[#E85A4F] via-[#f07068] to-[#E85A4F]/40" />

                        <div class="p-8 text-center">
                            <div class="relative inline-flex items-center justify-center mb-7">
                                <span class="absolute w-20 h-20 rounded-full bg-[#E85A4F]/10 animate-ping opacity-40" />
                                <span class="absolute w-16 h-16 rounded-full bg-[#E85A4F]/8" />
                                <div class="relative w-14 h-14 rounded-2xl bg-[#E85A4F]/8 border border-[#E85A4F]/15 flex items-center justify-center">
                                    <img src='/svg/device-mobile-check-branded.svg' width={26} height={26} alt="" />
                                </div>
                            </div>

                            <h1 class="text-xl font-gsans font-bold text-gray-900 mb-2">
                                დადასტურებას ველოდებით
                                <span class="inline-block w-6 text-left text-[#E85A4F]">
                                    {"·".repeat(dots())}
                                </span>
                            </h1>

                            <p class="text-sm font-gsans text-gray-400 leading-relaxed mb-8 max-w-xs mx-auto">
                                გახსენით Artra ავტორიზებულ მოწყობილობაზე და დაადასტურეთ შესვლის მოთხოვნა
                            </p>
                            <div class="space-y-3 text-left bg-gray-50 rounded-xl p-4 mb-8">
                                {[
                                    { step: "1", text: "გახსენით Artra სხვა მოწყობილობაზე" },
                                    { step: "2", text: "გადადით შეტყობინებებში ან აქაუნთი -> უსაფრთხოება" },
                                    { step: "3", text: "დაადასტურეთ შესვლის მოთხოვნა" },
                                ].map(item => (
                                    <div class="flex items-start gap-3">
                                        <span class="shrink-0 w-5 h-5 rounded-full bg-[#E85A4F]/10 text-[#E85A4F] text-[11px] font-gsans font-bold flex items-center justify-center mt-0.5">
                                            {item.step}
                                        </span>
                                        <p class="text-xs font-gsans text-gray-500 leading-snug pt-0.5">
                                            {item.text}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div class="flex items-center justify-center gap-2 text-xs text-gray-300 font-gsans">
                                <span class="w-1.5 h-1.5 rounded-full bg-[#E85A4F] animate-pulse" />
                                ავტომატურ განახლებას ველოდებით
                            </div>
                        </div>
                    </div>

                    <p class="text-center text-xs text-gray-300 font-gsans mt-5">
                        Artra · ავტორიზაცია
                    </p>
                </div>
            </main>
        </ProtectVerify>
    )
}

export default WaitingForApproval