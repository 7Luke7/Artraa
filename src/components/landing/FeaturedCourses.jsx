import { A } from "@solidjs/router";
import { CourseCard } from "../CourseCard";

export const FeaturedCourses = () => {
    return (
        <section class="container mb-20 md:mb-32 px-4 md:px-6">
            {/* Header with improved spacing */}
            <div class="mb-12 md:mb-16">
                <div class="text-center mb-10">
                    <div class="inline-block mb-4">
                        <span class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E85A4F]/10 text-[#E85A4F] text-sm font-gsans font-medium">
                            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                            </svg>
                            ყველაზე პოპულარული
                        </span>
                    </div>
                    
                    <h2 class="text-3xl md:text-4xl lg:text-5xl font-gsans font-bold text-gray-900 mb-4 md:mb-6">
                        <span class="text-[#E85A4F]">რეკომენდებული</span> კურსები
                    </h2>
                    
                    <p class="text-lg md:text-xl text-gray-600 font-gsans font-medium max-w-2xl mx-auto leading-relaxed">
                        შერჩეული კურსები პრაქტიკულ ცოდნაზე ორიენტირებული, რომლებიც ყველაზე ხშირად იწყება.
                    </p>
                </div>

                {/* Stats/Info Row */}
                <div class="flex flex-wrap justify-center gap-6 mb-8">
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-[#E85A4F]"></div>
                        <span class="text-sm font-gsans font-medium text-gray-600">4000+ მოსმენელი</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-[#E85A4F]"></div>
                        <span class="text-sm font-gsans font-medium text-gray-600">95% დასრულების რეიტინგი</span>
                    </div>
                    <div class="flex items-center gap-2">
                        <div class="w-2 h-2 rounded-full bg-[#E85A4F]"></div>
                        <span class="text-sm font-gsans font-medium text-gray-600">პრაქტიკული პროექტები</span>
                    </div>
                </div>
            </div>

            {/* Courses Grid */}
            <div class="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {[...new Array(6)].map((_, index) => (
                    <div 
                        class={`${index >= 3 ? 'hidden lg:block' : ''}`}
                        key={index}
                    >
                        <CourseCard />
                    </div>
                ))}
            </div>

            {/* CTA Section */}
            <div class="mt-16 md:mt-24">
                <div class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200">
                    {/* Background Pattern */}
                    <div class="absolute inset-0 opacity-5">
                        <div class="absolute inset-0" style={{
                            'background-image': 'radial-gradient(circle at 2px 2px, #E85A4F 1px, transparent 0)',
                            'background-size': '40px 40px'
                        }}></div>
                    </div>
                    
                    <div class="relative z-10 py-12 px-6 md:px-12">
                        <div class="max-w-7xl mx-auto">
                            <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
                                <div class="text-center lg:text-left">
                                    <h3 class="text-2xl md:text-3xl font-gsans font-bold text-gray-900 mb-3">
                                        იპოვე შენთვის შესაფერისი კურსი
                                    </h3>
                                    <p class="text-gray-600 font-gsans font-normal text-lg">
                                        ჩვენს კატალოგში 100+ კურსი სხვადასხვა დონისა და მიმართულებისთვის
                                    </p>
                                </div>
                                
                                <div class="flex flex-col sm:flex-row gap-4">
                                    <A
                                        href="/courses"
                                        class="inline-flex items-center justify-center gap-2 bg-[#E85A4F] hover:bg-[#D84A3F] text-white px-8 py-4 rounded-lg font-gsans font-bold text-lg transition-colors shadow-md hover:shadow-lg"
                                    >
                                        <span>ყველა კურსის ნახვა</span>
                                        <img src='/svg/arrow-narrow-right.svg' width={20} height={20} alt="arrow right" />
                                    </A>
                                    
                                    <A
                                        href="/categories"
                                        class="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-8 py-4 rounded-lg font-gsans font-bold text-lg transition-colors"
                                    >
                                        <span>კატეგორიები</span>
                                        <img src='/svg/arrow-narrow-right-black.svg' width={20} height={20} alt="arrow right" />
                                    </A>
                                </div>
                            </div>
                            
                            {/* Quick Stats */}
                            <div class="mt-10 pt-8 border-t border-gray-200">
                                <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div class="text-center">
                                        <div class="text-3xl font-gsans font-bold text-gray-900 mb-1">150+</div>
                                        <div class="text-sm font-gsans font-medium text-gray-600">ინსტრუქტორი</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-3xl font-gsans font-bold text-gray-900 mb-1">15K+</div>
                                        <div class="text-sm font-gsans font-medium text-gray-600">დამთავრებული</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-3xl font-gsans font-bold text-gray-900 mb-1">4.8</div>
                                        <div class="text-sm font-gsans font-medium text-gray-600">საშუალო რეიტინგი</div>
                                    </div>
                                    <div class="text-center">
                                        <div class="text-3xl font-gsans font-bold text-gray-900 mb-1">24/7</div>
                                        <div class="text-sm font-gsans font-medium text-gray-600">მხარდაჭერა</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};