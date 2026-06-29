import { A } from "@solidjs/router"

const SOCIAL = [
    {
        name: "Facebook",
        href: "https://facebook.com/artra",
        icon: <img src='/svg/facebook.svg' width={18} height={18} />
    },
    {
        name: "Instagram",
        href: "https://instagram.com/artra",
        icon: <img src='/svg/instagram.svg' width={18} height={18} />
    },
    {
        name: "TikTok",
        href: "https://tiktok.com/@artra",
        icon: <img src='/svg/tiktok.svg' width={18} height={18} />
    },
    {
        name: "YouTube",
        href: "https://youtube.com/@artra",
        icon: <img src='/svg/youtube.svg' width={18} height={18} />
    },
]

const NAV_LINKS = [
    { href: "/courses", label: "კურსები" },
    { href: "/about", label: "ჩვენს შესახებ" },
    { href: "/contact", label: "კონტაქტი" },
]

const LEGAL_LINKS = [
    { href: "/terms", label: "წესები" },
    { href: "/privacy", label: "კონფიდენციალურობა" },
    { href: "/cookies", label: "ქუქი-ფაილები" },
]

export const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer
            role="contentinfo"
            aria-label="საიტის ქვედა ნაწილი"
            class="w-full bg-white border-t border-gray-100"
        >
            <div class="w-full md:w-10/12 px-4 sm:px-6 mx-auto">
                <div class="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
                    <div class="lg:col-span-1 space-y-5">
                        <A
                            href="/"
                            class="inline-block text-[#E85A4F] text-2xl tracking-[0.15em] font-sans font-[800] hover:opacity-80 transition-opacity"
                            aria-label="Artra - მთავარი გვერდი"
                        >
                            ARTRA
                        </A>
                        <p class="text-sm font-gsans text-gray-400 leading-relaxed max-w-[220px]">
                            ქართულ ენაზე შექმნილი პრაქტიკული ონლაინ კურსები პროფესიონალი ინსტრუქტორებისგან.
                        </p>
                        <div class="flex items-center gap-2">
                            {SOCIAL.map(s => (
                                <a
                                    href={s.href}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    aria-label={`Artra ${s.name}-ზე`}
                                    class="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#E85A4F]/10 hover:text-[#E85A4F] transition-colors"
                                >
                                    {s.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-sm font-gsans font-bold text-gray-900 uppercase tracking-wide">
                            ნავიგაცია
                        </h2>
                        <div class="w-8 h-0.5 bg-[#E85A4F] rounded-full" aria-hidden="true" />
                        <nav aria-label="ნავიგაციის ბმულები">
                            <ul class="space-y-2.5">
                                {NAV_LINKS.slice(0, 4).map(link => (
                                    <li>
                                        <A
                                            href={link.href}
                                            class="text-sm font-gsans text-gray-500 hover:text-[#E85A4F] transition-colors"
                                        >
                                            {link.label}
                                        </A>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-sm font-gsans font-bold text-gray-900 uppercase tracking-wide">
                            სამართლებრივი
                        </h2>
                        <div class="w-8 h-0.5 bg-[#E85A4F] rounded-full" aria-hidden="true" />
                        <nav aria-label="იურიდიული ბმულები">
                            <ul class="space-y-2.5">
                                {LEGAL_LINKS.map(link => (
                                    <li>
                                        <A
                                            href={link.href}
                                            class="text-sm font-gsans text-gray-500 hover:text-[#E85A4F] transition-colors"
                                        >
                                            {link.label}
                                        </A>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Contact column */}
                    <div class="space-y-4">
                        <h2 class="text-sm font-gsans font-bold text-gray-900 uppercase tracking-wide">
                            კონტაქტი
                        </h2>
                        <div class="w-8 h-0.5 bg-[#E85A4F] rounded-full" aria-hidden="true" />
                        <address class="not-italic space-y-4">
                            {/* Email */}
                            <div class="flex items-start gap-3">
                                <div class="w-8 h-8 rounded-lg bg-[#E85A4F]/8 flex items-center justify-center shrink-0 mt-0.5">
                                    <img src='/svg/inbox-stroke.svg' width={15} height={15} />
                                </div>
                                <div>
                                    <p class="text-xs font-gsans font-medium text-gray-400 mb-0.5">ელ. ფოსტა</p>
                                    <a
                                        href={`mailto:${import.meta.env.VITE_EMAIL}`}
                                        class="text-sm font-gsans text-gray-600 hover:text-[#E85A4F] transition-colors"
                                        aria-label={`გაგზავნეთ ელ. ფოსტა`}
                                    >
                                        {import.meta.env.VITE_EMAIL}
                                    </a>
                                </div>
                            </div>

                            <div class="flex items-start gap-3">
                                <div class="w-8 h-8 rounded-lg bg-[#E85A4F]/8 flex items-center justify-center shrink-0 mt-0.5">
                                    <img src='/svg/telephone.svg' width={15} height={15} />
                                </div>
                                <div>
                                    <p class="text-xs font-gsans font-medium text-gray-400 mb-0.5">ტელეფონი</p>
                                    <a
                                        href="tel:+995322603060"
                                        class="text-sm font-gsans text-gray-600 hover:text-[#E85A4F] transition-colors"
                                        aria-label="დაგვირეკეთ"
                                    >
                                        +995 (32) 2 60 30 60
                                    </a>
                                </div>
                            </div>
                        </address>
                    </div>
                </div>

                <p class="text-xs border-t border-gray-100 py-6 font-gsans text-gray-400 text-center sm:text-left">
                    © {year} Artra. ყველა უფლება დაცულია.
                </p>
            </div>
        </footer>
    )
}