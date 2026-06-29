import { CourseCard } from "../CourseCard";
import { For } from "solid-js";

export const FeaturedCourses = (props) => {
    return (
        <section
            aria-labelledby="featured-courses-heading"
            class="container mb-20 md:mb-32"
        >
            <div class="mb-12 text-center md:mb-16">
                <h2
                    id="featured-courses-heading"
                    class="text-3xl md:text-4xl lg:text-5xl font-gsans font-bold text-gray-900 mb-4 md:mb-6"
                >
                    <span class="text-[#E85A4F]">რეკომენდებული</span> კურსები
                </h2>

                <p class="text-lg md:text-xl text-gray-600 font-gsans font-medium max-w-2xl mx-auto leading-relaxed">
                    შერჩეული კურსები პრაქტიკულ ცოდნაზე ორიენტირებული, რომლებიც ყველაზე ხშირად იწყება.
                </p>
            </div>
            <ul
                aria-label="რეკომენდებული კურსების ჩამონათვალი"
                class="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
            >
                <For each={props.courses}>
                    {(course, index) => (
                        <li
                            key={`course-${index()}`}
                            aria-label={`კურსი ${index() + 1}`}
                        >
                            <CourseCard course={course} />
                        </li>
                    )}
                </For>
            </ul>
            <div class="mt-16 md:mt-24">
                <div
                    role="region"
                    aria-labelledby="all-courses-cta-heading"
                    class="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200"
                >
                    <div
                        role="presentation"
                        class="absolute inset-0 opacity-5"
                        aria-hidden="true"
                    >
                        <div class="absolute inset-0" style={{
                            'background-image': 'radial-gradient(circle at 2px 2px, #E85A4F 1px, transparent 0)',
                            'background-size': '40px 40px'
                        }}></div>
                    </div>

                    <div class="relative z-10 py-12 px-6 xl:px-12">
                        <div class="max-w-7xl mx-auto">
                            <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
                                <div class="text-center lg:text-left">
                                    <h3
                                        id="all-courses-cta-heading"
                                        class="text-2xl md:text-3xl font-gsans font-bold text-gray-900 mb-3"
                                    >
                                        იპოვე შენთვის შესაფერისი კურსი
                                    </h3>
                                    <p class="text-gray-600 font-gsans font-normal text-lg">
                                        კურსები სხვადასხვა დონისა და მიმართულებისთვის
                                    </p>
                                </div>

                                <a
                                    href="/courses"
                                    class="inline-flex items-center justify-center gap-2 bg-[#E85A4F] hover:bg-[#D84A3F] text-white px-8 py-4 rounded-lg font-gsans font-bold text-lg transition-colors shadow-md hover:shadow-lg"
                                    aria-label="ყველა კურსის ნახვა - გადახვედი სრულ კატალოგზე"
                                >
                                    <span>ყველა კურსის ნახვა</span>
                                    <img
                                        src='/svg/arrow-narrow-right.svg'
                                        width={24}
                                        height={24}
                                        alt=""
                                        aria-hidden="true"
                                    />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="sr-only">
                <p>
                    აქ წარმოდგენილია რეკომენდებული კურსები, ყველა კურსი ორიენტირებულია პრაქტიკულ ცოდნაზე.
                </p>
            </div>
        </section>
    );
};