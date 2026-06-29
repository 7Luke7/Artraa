import { Title, Meta } from "@solidjs/meta"
import { Header } from "~/components/Header"
import { Footer } from "~/components/Footer"

// ─── EDIT THIS OBJECT TO UPDATE THE PAGE ──────────────────────────────────────
const ABOUT_CONTENT = {
    meta: {
        title: "ჩვენს შესახებ - Artra",
        description: "Artra არის ქართული ონლაინ სასწავლო პლატფორმა, სადაც ნებისმიერს შეუძლია ისწავლოს თავისი ტემპით.",
    },
    hero: {
        badge: "ჩვენს შესახებ",
        heading: "ცოდნა — ყველასთვის,\nყველგან",
        subheading: "Artra-ზე ვირწმუნებთ, რომ ხარისხიანი განათლება არ უნდა იყოს პრივილეგია. ჩვენ ვქმნით სივრცეს, სადაც სტუდენტი, პროფესიონალი თუ ახალდამწყები — ერთნაირად პოულობს შესაძლებლობას.",
    },
    stats: [
        { value: "5,000+", label: "მოსწავლე" },
        { value: "120+",   label: "კურსი" },
        { value: "40+",    label: "ინსტრუქტორი" },
        { value: "4.8★",   label: "საშუალო შეფასება" },
    ],
    mission: {
        heading: "ჩვენი მისია",
        body: "ჩვენი მიზანია ქართულ ენაზე შევქმნათ პრაქტიკული, განახლებადი და ხელმისაწვდომი კურსები — ისეთი, რომლებიც ნამდვილად ეხმარება ადამიანს კარიერაში, ბიზნესში ან პირადი განვითარებისთვის.",
    },
    values: [
        {
            icon: "🎯",
            title: "პრაქტიკული ცოდნა",
            body: "თეორიას ვავსებთ რეალური პროექტებით. ჩვენი კურსები შემუშავებულია ისე, რომ კურსდამთავრებულმა დაუყოვნებლივ გამოიყენოს მიღებული ცოდნა.",
        },
        {
            icon: "🌐",
            title: "ქართული ენა პირველ ადგილზე",
            body: "ყველა კურსი ქართულ ენაზეა. გვჯერა, რომ ყველაზე კარგი სწავლა ხდება მშობლიურ ენაზე — განსაკუთრებით ტექნიკურ სფეროებში.",
        },
        {
            icon: "🤝",
            title: "ინსტრუქტორები პრაქტიკოსები",
            body: "ჩვენი ყოველი ინსტრუქტორი აქტიურად მუშაობს იმ სფეროში, რასაც ასწავლის. ეს ნიშნავს, რომ ისწავლი სწორ, მიმდინარე ცოდნას.",
        },
        {
            icon: "🔓",
            title: "სამუდამო წვდომა",
            body: "კურსის შეძენის შემდეგ ყველა მასალა — ვიდეო, დავალება, რესურსი — სამუდამოდ შენია. განაახლე ცოდნა ნებისმიერ დროს.",
        },
    ],
    team: {
        heading: "ვინ ვართ ჩვენ",
        body: "Artra-ს გუნდი შედგება განათლების, ტექნოლოგიებისა და კრეატიული ინდუსტრიის პროფესიონალებისგან, რომლებსაც სჯერა, რომ ონლაინ სწავლა შეიძლება იყოს ისეთივე ეფექტური, როგორც საკლასო გარემო.",
    },
    cta: {
        heading: "დაიწყე სწავლა დღეს",
        body: "ათასობით სტუდენტი უკვე სწავლობს Artra-ზე. შემოგვიერთდი.",
        buttonText: "კურსების ნახვა",
        buttonHref: "/courses",
    },
}
// ──────────────────────────────────────────────────────────────────────────────

export default function AboutPage() {
    const c = ABOUT_CONTENT

    return (
        <>
            <Title>{c.meta.title}</Title>
            <Meta name="description" content={c.meta.description} />

            <div class="min-h-screen flex flex-col bg-gray-50">
                <div class="w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto flex-1">
                    <Header />

                    {/* Hero */}
                    <section class="py-16 md:py-24 text-center">
                        <span class="inline-block px-4 py-1.5 rounded-full bg-[#E85A4F]/10 text-[#E85A4F] text-xs font-gsans font-bold mb-6 border border-[#E85A4F]/20">
                            {c.hero.badge}
                        </span>
                        <h1 class="text-3xl md:text-5xl font-gsans font-bold text-gray-900 mb-6 leading-tight whitespace-pre-line">
                            {c.hero.heading}
                        </h1>
                        <p class="text-gray-500 font-gsans text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                            {c.hero.subheading}
                        </p>
                    </section>

                    {/* Stats */}
                    <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                        {c.stats.map(stat => (
                            <div class="bg-white border border-gray-200 rounded-2xl p-6 text-center shadow-sm">
                                <p class="text-3xl font-gsans font-bold text-[#E85A4F] mb-1">{stat.value}</p>
                                <p class="text-sm text-gray-500 font-gsans">{stat.label}</p>
                            </div>
                        ))}
                    </section>

                    {/* Mission */}
                    <section class="bg-white border border-gray-200 rounded-2xl p-8 md:p-12 mb-8 shadow-sm">
                        <h2 class="text-2xl md:text-3xl font-gsans font-bold text-gray-900 mb-4">{c.mission.heading}</h2>
                        <p class="text-gray-600 font-gsans text-base md:text-lg leading-relaxed max-w-3xl">{c.mission.body}</p>
                    </section>

                    {/* Values */}
                    <section class="mb-8">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {c.values.map(v => (
                                <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:border-[#E85A4F]/30 transition-colors">
                                    <div class="w-10 h-10 rounded-xl bg-[#E85A4F]/10 flex items-center justify-center text-xl mb-4">
                                        {v.icon}
                                    </div>
                                    <h3 class="font-gsans font-bold text-gray-900 mb-2">{v.title}</h3>
                                    <p class="text-gray-500 font-gsans text-sm leading-relaxed">{v.body}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Team blurb */}
                    <section class="bg-white border border-gray-200 rounded-2xl p-8 mb-16 shadow-sm">
                        <h2 class="text-xl md:text-2xl font-gsans font-bold text-gray-900 mb-3">{c.team.heading}</h2>
                        <p class="text-gray-600 font-gsans text-sm md:text-base leading-relaxed">{c.team.body}</p>
                    </section>

                    {/* CTA */}
                    <section class="bg-[#E85A4F] rounded-2xl p-10 md:p-16 text-center mb-16">
                        <h2 class="text-2xl md:text-3xl font-gsans font-bold text-white mb-3">{c.cta.heading}</h2>
                        <p class="text-white/80 font-gsans mb-8 text-sm md:text-base">{c.cta.body}</p>
                        <a
                            href={c.cta.buttonHref}
                            class="inline-block px-8 py-3 rounded-xl bg-white text-[#E85A4F] font-gsans font-bold text-sm hover:bg-gray-100 transition-colors"
                        >
                            {c.cta.buttonText}
                        </a>
                    </section>
                </div>
                <Footer />
            </div>
        </>
    )
}