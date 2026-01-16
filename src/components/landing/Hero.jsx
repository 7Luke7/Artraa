import { A } from "@solidjs/router";

export const LandingHero = () => {
    return (
        <section 
            class="overflow-hidden"
            aria-labelledby="main-hero-heading"
        >
            <div class="container pt-8 md:pt-16 pb-16 md:pb-24">
                <div class="grid xl:grid-cols-2 gap-12 xl:gap-16 items-start">
                    <div class="text-center xl:text-left">
                        <h1 
                            id="main-hero-heading"
                            class="mb-6 md:mb-8 font-gsans font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-gray-900 leading-tight"
                        >
                            <span>ისწავლე <span class="text-[#E85A4F]">პროფესიული</span> უნარები ონლაინ</span>
                        </h1>
                        <p class="mb-8 md:mb-10 text-lg md:text-xl font-gsans font-medium text-gray-600 leading-relaxed max-w-xl mx-auto xl:mx-0">
                            თანამედროვე პროფესიებისთვის შექმნილი კურსები რეალური პროექტები,
                            გამოცდილი ინსტრუქტორები და ცოდნა, რომელიც რეალურად გამოგადგება.
                        </p>                        
                        <div class="flex flex-col sm:flex-row gap-4 mb-10 md:mb-12 justify-center xl:justify-start">
                            <A
                                href="/courses"
                                class="group inline-flex items-center justify-center gap-3 rounded-lg bg-[#E85A4F] hover:bg-[#D84A3F] px-8 py-4 text-lg font-gsans font-bold text-white shadow-lg shadow-[#E85A4F]/20"
                                aria-label="კურსების სრული კატალოგის ნახვა"
                            >
                                <span>კურსების ნახვა</span>
                                <img 
                                    src='svg/arrow-narrow-right.svg' 
                                    alt='' 
                                    aria-hidden='true' 
                                    width={24} 
                                    height={24} 
                                    loading="lazy"
                                />
                            </A>
                            <A
                                href="/register"
                                target="_self"
                                class="inline-flex items-center justify-center gap-3 rounded-lg border-2 border-gray-300 hover:border-[#E85A4F] px-8 py-4 text-lg font-gsans font-bold text-gray-800 hover:text-[#E85A4F] transition-all hover:shadow-lg"
                                aria-label="რეგისტრაცია უფასო ანგარიშზე"
                            >
                                <span>დაიწყე უფასოდ</span>
                                <img 
                                    src='svg/user-plus.svg' 
                                    alt='' 
                                    aria-hidden='true' 
                                    width={24} 
                                    height={24} 
                                    loading="lazy"
                                />
                            </A>
                        </div>
                    </div>
                    <div class="relative lg:pl-8">
                        <div class="relative">
                            <div class="relative rounded-3xl overflow-hidden shadow-2xl">
                                <img
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                                    alt="სტუდენტი იკვლევს ონლაინ სასწავლო პლატფორმას ლეპტოპზე, თანამედროვე სასწავლო გარემო"
                                    sizes="(max-width: 768px) 100vw, 100vw"
                                    loading="eager"
                                    fetchpriority="high"
                                    width={800}
                                    height={600}
                                    class="w-full aspect-[4/3] object-cover hover:scale-105 transition-transform duration-700"
                                />
                                <div 
                                    class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
                                    aria-hidden="true"
                                ></div>
                            </div>
                            <button 
                                aria-label="გაუშვი პლატფორმის საჩვენებელი ვიდეო"
                                class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#E85A4F]/90 hover:bg-[#E85A4F]/80 backdrop-blur-sm flex items-center justify-center group transition-colors shadow-xl"
                            >
                                <img 
                                    src='/svg/player-play.svg' 
                                    aria-hidden='true' 
                                    width={32} 
                                    height={32} 
                                    alt=""
                                    loading="lazy"
                                />
                                <span class="sr-only">ვიდეოს დაკვრა</span>
                            </button>
                        </div>
                        <div class="mt-10 flex flex-wrap items-center justify-center gap-6">
                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                <img 
                                    src='/svg/security-green.svg' 
                                    aria-hidden='true' 
                                    width={24} 
                                    height={24} 
                                    alt="" 
                                    loading="lazy"
                                />
                                <span class="font-gsans font-medium">უსაფრთხო გადახდა</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                <img 
                                    src='/svg/security-green.svg' 
                                    aria-hidden='true' 
                                    width={24} 
                                    height={24} 
                                    alt="" 
                                    loading="lazy"
                                />
                                <span class="font-gsans font-medium">30-დღიანი დაბრუნება</span>
                            </div>
                            <div class="flex items-center gap-2 text-sm text-gray-600">
                                <img 
                                    src='/svg/clock-green.svg' 
                                    aria-hidden='true' 
                                    width={24} 
                                    height={24} 
                                    alt="" 
                                    loading="lazy"
                                />
                                <span class="font-gsans font-medium">24/7 წვდომა</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="sr-only">
                <p>
                    Artra არის ონლაინ სასწავლო პლატფორმა საქართველოში, რომელიც გთავაზობთ პროფესიულ კურსებს 
                    თანამედროვე პროფესიებისთვის. ისწავლეთ პრაქტიკული უნარები, მიიღეთ რეალური გამოცდილება 
                    და განავითარეთ თქვენი კარიერა.
                </p>
            </div>
        </section>
    );
};