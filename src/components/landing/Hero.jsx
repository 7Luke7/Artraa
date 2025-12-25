import { A } from "@solidjs/router";

const Stats = [
    {
        value: "პირველი",
        label: "მოსმენელი შეგიძლია იყო",
        icon: "👤"
    },
    {
        value: "10+",
        label: "კურსი ხელმისაწვდომია",
        icon: "📚"
    },
    {
        value: "100%",
        label: "პრაქტიკული კონტენტი",
        icon: "🎯"
    },
    {
        value: "∞",
        label: "სამუდამო წვდომა",
        icon: "⏰"
    },
];

export const LandingHero = () => {
    return (
        <section class="relative overflow-hidden">
            {/* Background Elements */}
            <div class="absolute inset-0 -z-10">
                <div class="absolute top-0 left-1/4 w-96 h-96 bg-[#E85A4F]/5 rounded-full blur-3xl"></div>
                <div class="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
            </div>

            <div class="container px-4 md:px-6 pt-8 md:pt-16 pb-16 md:pb-24">
                <div class="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
                    {/* Left Content */}
                    <div class="text-center lg:text-left">
                        {/* Main Heading */}
                        <h1 class="mb-6 md:mb-8 font-gsans font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 leading-tight">
                            <span>ისწავლე <b class="text-[#E85A4F]">პროფესიული</b> უნარები ონლაინ</span>
                        </h1>

                        {/* Description */}
                        <p class="mb-8 md:mb-10 text-lg md:text-xl font-gsans font-medium text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            თანამედროვე პროფესიებისთვის შექმნილი კურსები — რეალური პროექტები,
                            გამოცდილი ინსტრუქტორები და ცოდნა, რომელიც რეალურად გამოგადგება.
                        </p>

                        {/* CTA Buttons */}
                        <div class="flex flex-col sm:flex-row gap-4 mb-10 md:mb-12 justify-center lg:justify-start">
                            <A
                                href="/courses"
                                class="group inline-flex items-center justify-center gap-3 rounded-lg bg-[#E85A4F] hover:bg-[#D84A3F] px-8 py-4 text-lg font-gsans font-bold text-white shadow-lg shadow-[#E85A4F]/20 transition-all hover:shadow-xl hover:-translate-y-0.5"
                            >
                                <span>კურსების ნახვა</span>
                                <svg class="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </A>

                            <A
                                target="_self"
                                href="/register"
                                class="group inline-flex items-center justify-center gap-3 rounded-lg border-2 border-gray-300 hover:border-[#E85A4F] px-8 py-4 text-lg font-gsans font-bold text-gray-800 hover:text-[#E85A4F] transition-all hover:shadow-lg"
                            >
                                <span>დაიწყე უფასოდ</span>
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                                </svg>
                            </A>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div class="relative lg:pl-8">
                        <div class="relative">
                            {/* Main Image */}
                            <div class="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                    alt="ონლაინ კურსები საქართველოში - Artra პლატფორმა"
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    loading="eager"
                                    fetchpriority="high"
                                    class="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                                />

                                {/* Gradient Overlay */}
                                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            </div>

                            {/* Play Button */}
                            <button class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center group hover:bg-white transition-colors shadow-xl">
                                <svg class="w-6 h-6 md:w-8 md:h-8 text-[#E85A4F] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
                                </svg>
                            </button>
                        </div>

                        <div class="mt-10 flex flex-wrap items-center justify-center gap-6">
                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span class="font-gsans font-medium">უსაფრთხო გადახდა</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span class="font-gsans font-medium">30-დღიანი დაბრუნება</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                <svg class="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <span class="font-gsans font-medium">24/7 წვდომა მასალებზე</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mb-10">
                    <div class="text-center lg:text-left mb-6">
                        <div class="text-lg font-gsans font-bold text-gray-900 mb-2">
                            იყავი პირველი, ვინც შეუერთდება!
                        </div>
                        <div class="text-gray-600">
                            შემოგვიერთდი და გახდი ჩვენი პლატფორმის ადრეული მომხმარებელი
                        </div>
                    </div>

                    {/* Keep only real stats */}
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-6">
                        {Stats.map((stat, index) => (
                            <div
                                key={index}
                                class="bg-white rounded-xl border border-gray-200 p-4 hover:border-[#E85A4F]/50 transition-colors"
                            >
                                <div class="flex items-center gap-3">
                                    <div class="text-2xl">{stat.icon}</div>
                                    <div>
                                        <div class="text-xl font-gsans font-bold text-gray-900">{stat.value}</div>
                                        <div class="text-sm text-gray-600 font-gsans font-medium">{stat.label}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};