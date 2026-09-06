import { Title } from "@solidjs/meta"
import { useLocation } from "@solidjs/router"
import { Footer } from "~/components/Footer"
import { onMount, createSignal } from "solid-js"

export default function NotFound() {
    const location = useLocation()
    const [mounted, setMounted] = createSignal(false)

    onMount(() => setMounted(true))

    return (
        <>
            <Title>404 - გვერდი ვერ მოიძებნა | Artra</Title>

            <div class="min-h-screen flex flex-col bg-gray-50">
                <div class="w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto flex-1 flex flex-col">
                    <main class="flex-1 flex items-center justify-center py-16">
                        <div class="w-full max-w-lg text-center">
                            <div
                                class="relative mb-8 select-none"
                                style={{
                                    opacity: mounted() ? 1 : 0,
                                    transform: mounted() ? "translateY(0)" : "translateY(16px)",
                                    transition: "opacity 0.5s ease, transform 0.5s ease",
                                }}
                            >
                                <p
                                    class="text-[10rem] md:text-[14rem] font-gsans font-bold leading-none"
                                    style={{
                                        color: "transparent",
                                        "-webkit-text-stroke": "2px #E5E7EB",
                                    }}
                                >
                                    404
                                </p>
                                <div
                                    class="absolute inset-0 flex items-center justify-center"
                                    style={{
                                        opacity: mounted() ? 1 : 0,
                                        transition: "opacity 0.6s ease 0.2s",
                                    }}
                                >
                                    <div class="bg-[#E85A4F] text-white font-gsans font-bold text-sm px-5 py-2 rounded-full shadow-lg shadow-[#E85A4F]/30">
                                        გვერდი ვერ მოიძებნა
                                    </div>
                                </div>
                            </div>
                            <div
                                style={{
                                    opacity: mounted() ? 1 : 0,
                                    transform: mounted() ? "translateY(0)" : "translateY(12px)",
                                    transition: "opacity 0.5s ease 0.15s, transform 0.5s ease 0.15s",
                                }}
                            >
                                <h1 class="text-2xl md:text-3xl font-gsans font-bold text-gray-900 mb-3">
                                    ასეთი გვერდი არ არსებობს
                                </h1>
                                <p class="text-gray-400 font-gsans text-sm md:text-base leading-relaxed mb-2">
                                    მისამართი{" "}
                                    <code class="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-lg text-xs font-mono">
                                        {location.pathname}
                                    </code>{" "}
                                    არ მოიძებნა.
                                </p>
                                <p class="text-gray-400 font-gsans text-sm mb-10">
                                    შეამოწმე მისამართი ან დაბრუნდი მთავარ გვერდზე.
                                </p>
                            </div>
                            <div
                                class="flex flex-col sm:flex-row items-center justify-center gap-3"
                                style={{
                                    opacity: mounted() ? 1 : 0,
                                    transform: mounted() ? "translateY(0)" : "translateY(12px)",
                                    transition: "opacity 0.5s ease 0.25s, transform 0.5s ease 0.25s",
                                }}
                            >
                                <a
                                    href="/"
                                    class="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#E85A4F] text-white font-gsans font-bold text-sm hover:bg-[#D84A3F] transition-colors shadow-sm"
                                >
                                    <img src='/svg/home-white.svg' width={16} height={16} alt="" ></img>
                                    მთავარი გვერდი
                                </a>
                                <a
                                    href="/courses"
                                    class="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 rounded-xl border border-gray-200 bg-white text-gray-700 font-gsans font-medium text-sm hover:border-gray-300 hover:bg-gray-50 transition-colors"
                                >
                                    <img src='/svg/book.svg' width={16} height={16} alt="" />
                                    კურსების დათვალიერება
                                </a>
                            </div>

                            <p
                                class="mt-10 text-xs text-gray-300 font-gsans"
                                style={{
                                    opacity: mounted() ? 1 : 0,
                                    transition: "opacity 0.5s ease 0.4s",
                                }}
                            >
                                პრობლემა გრძელდება?{" "}
                                <a href="/contact" class="text-gray-400 hover:text-[#E85A4F] transition-colors underline underline-offset-2">
                                    დაგვიკავშირდი
                                </a>
                            </p>
                        </div>
                    </main>
                </div>
                <Footer />
            </div>
        </>
    )
}