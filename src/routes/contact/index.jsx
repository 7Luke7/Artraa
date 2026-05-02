import { Title, Meta } from "@solidjs/meta"
import { Header } from "~/components/Header"
import { Footer } from "~/components/Footer"
import { createSignal } from "solid-js"

// ─── EDIT THIS OBJECT TO UPDATE THE PAGE ──────────────────────────────────────
const CONTACT_CONTENT = {
    meta: {
        title: "კონტაქტი - Artra",
        description: "დაგვიკავშირდით ნებისმიერი კითხვით — ჩვენ ვართ აქ დასახმარებლად.",
    },
    hero: {
        heading: "კონტაქტი",
        subheading: "გაქვთ კითხვა? გვიკავშირდით — ჩვეულებრივ ვპასუხობთ 24 საათის განმავლობაში.",
    },
    channels: [
        {
            icon: "✉️",
            title: "ელ-ფოსტა",
            value: "hello@artra.ge",
            description: "ზოგადი კითხვებისთვის",
            href: "mailto:hello@artra.ge",
        },
        {
            icon: "🎓",
            title: "ინსტრუქტორებისთვის",
            value: "teach@artra.ge",
            description: "კურსის შექმნის მსურველებისთვის",
            href: "mailto:teach@artra.ge",
        },
        {
            icon: "🤝",
            title: "პარტნიორობა",
            value: "partners@artra.ge",
            description: "ბიზნეს შეთავაზებებისთვის",
            href: "mailto:partners@artra.ge",
        },
    ],
    form: {
        heading: "შეტყობინების გაგზავნა",
        subjectOptions: [
            "ტექნიკური პრობლემა",
            "გადახდასთან დაკავშირებული კითხვა",
            "კურსის შინაარსი",
            "ანგარიშის საკითხი",
            "ინსტრუქტორობა",
            "სხვა",
        ],
        successMessage: "მადლობა! თქვენი შეტყობინება მიღებულია. ვუპასუხებთ 24 საათში.",
    },
    social: [
        { name: "Facebook",  href: "https://facebook.com/artra.ge",  icon: "f" },
        { name: "LinkedIn",  href: "https://linkedin.com/company/artra", icon: "in" },
        { name: "Instagram", href: "https://instagram.com/artra.ge", icon: "ig" },
    ],
}
// ──────────────────────────────────────────────────────────────────────────────

export default function ContactPage() {
    const c = CONTACT_CONTENT

    const [name, setName] = createSignal("")
    const [email, setEmail] = createSignal("")
    const [subject, setSubject] = createSignal("")
    const [message, setMessage] = createSignal("")
    const [sending, setSending] = createSignal(false)
    const [sent, setSent] = createSignal(false)
    const [error, setError] = createSignal("")

    const handleSubmit = async () => {
        if (!name() || !email() || !subject() || !message()) {
            setError("გთხოვთ შეავსოთ ყველა ველი")
            return
        }
        setSending(true)
        setError("")
        try {
            // Replace with your actual API call
            await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name(), email: email(), subject: subject(), message: message() }),
            })
            setSent(true)
        } catch {
            setError("შეცდომა. სცადეთ ხელახლა.")
        } finally {
            setSending(false)
        }
    }

    return (
        <>
            <Title>{c.meta.title}</Title>
            <Meta name="description" content={c.meta.description} />

            <div class="min-h-screen flex flex-col bg-gray-50">
                <div class="w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto flex-1">
                    <Header />

                    {/* Hero */}
                    <section class="py-12 md:py-16">
                        <h1 class="text-3xl md:text-4xl font-gsans font-bold text-gray-900 mb-3">{c.hero.heading}</h1>
                        <p class="text-gray-500 font-gsans text-base md:text-lg max-w-xl">{c.hero.subheading}</p>
                    </section>

                    {/* Channel cards */}
                    <section class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        {c.channels.map(ch => (
                            <a
                                href={ch.href}
                                class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-[#E85A4F]/40 hover:shadow-md transition-all group"
                            >
                                <div class="w-10 h-10 rounded-xl bg-[#E85A4F]/10 flex items-center justify-center text-xl mb-4">
                                    {ch.icon}
                                </div>
                                <p class="text-xs text-gray-400 font-gsans mb-1">{ch.description}</p>
                                <p class="font-gsans font-bold text-gray-900 group-hover:text-[#E85A4F] transition-colors text-sm">{ch.value}</p>
                                <p class="text-gray-500 font-gsans text-xs mt-0.5">{ch.title}</p>
                            </a>
                        ))}
                    </section>

                    {/* Contact form */}
                    <section class="bg-white border border-gray-200 rounded-2xl p-6 md:p-10 shadow-sm mb-16">
                        <h2 class="text-xl md:text-2xl font-gsans font-bold text-gray-900 mb-6">{c.form.heading}</h2>

                        {sent() ? (
                            <div class="flex flex-col items-center justify-center py-12 text-center">
                                <div class="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                                    <svg class="w-7 h-7 text-green-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                                        <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                </div>
                                <p class="font-gsans font-bold text-gray-900 text-lg mb-2">გაგზავნილია!</p>
                                <p class="text-gray-500 font-gsans text-sm">{c.form.successMessage}</p>
                            </div>
                        ) : (
                            <div class="space-y-5">
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <label class="block text-sm font-gsans font-medium text-gray-700 mb-1.5">სახელი</label>
                                        <input
                                            type="text"
                                            value={name()}
                                            onInput={e => setName(e.target.value)}
                                            placeholder="თქვენი სახელი"
                                            class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-gsans text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E85A4F]/50 focus:ring-2 focus:ring-[#E85A4F]/10 transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label class="block text-sm font-gsans font-medium text-gray-700 mb-1.5">ელ-ფოსტა</label>
                                        <input
                                            type="email"
                                            value={email()}
                                            onInput={e => setEmail(e.target.value)}
                                            placeholder="you@example.com"
                                            class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-gsans text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E85A4F]/50 focus:ring-2 focus:ring-[#E85A4F]/10 transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label class="block text-sm font-gsans font-medium text-gray-700 mb-1.5">თემა</label>
                                    <select
                                        value={subject()}
                                        onChange={e => setSubject(e.target.value)}
                                        class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-gsans text-gray-900 focus:outline-none focus:border-[#E85A4F]/50 focus:ring-2 focus:ring-[#E85A4F]/10 transition-colors bg-white"
                                    >
                                        <option value="" disabled>აირჩიეთ თემა</option>
                                        {c.form.subjectOptions.map(opt => (
                                            <option value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label class="block text-sm font-gsans font-medium text-gray-700 mb-1.5">
                                        შეტყობინება
                                        <span class="text-gray-400 font-normal ml-1">({message().length}/1000)</span>
                                    </label>
                                    <textarea
                                        value={message()}
                                        onInput={e => setMessage(e.target.value.slice(0, 1000))}
                                        rows={5}
                                        placeholder="დაწერეთ თქვენი შეტყობინება..."
                                        class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-gsans text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E85A4F]/50 focus:ring-2 focus:ring-[#E85A4F]/10 transition-colors resize-none"
                                    />
                                </div>

                                {error() && (
                                    <p class="text-[#E85A4F] text-sm font-gsans">{error()}</p>
                                )}

                                <div class="flex justify-end">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={sending()}
                                        class="px-8 py-3 rounded-xl bg-[#E85A4F] text-white font-gsans font-bold text-sm hover:bg-[#D84A3F] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {sending() ? "იგზავნება..." : "გაგზავნა"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </section>
                </div>
                <Footer />
            </div>
        </>
    )
}