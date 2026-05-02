import { createSignal, lazy, onMount, Show, Suspense } from "solid-js"
import { CourseBlocks } from "./CourseBlocks"
import { CourseMain } from "./CourseMain"

const LazyReviews = lazy(() => import('./Reviews.jsx'))

export const CourseDetailUI = (props) => {
    const [displayReviews, setDisplayReviews] = createSignal(false)
    let reviewIntersectionEl

    onMount(() => {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setDisplayReviews(true)
                    obs.unobserve(entry.target)
                }
            })
        }, { root: null, rootMargin: "200px", threshold: 0 })

        observer.observe(reviewIntersectionEl)
    })

    return (
        <article class="py-4 md:py-8" itemscope itemtype="https://schema.org/Course">
            <div class="lg:hidden mb-8 rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                <CourseMain course={props.course} />
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                <div class="lg:col-span-2 space-y-10">
                    <header>
                        <h1
                            class="text-2xl md:text-3xl lg:text-4xl font-gsans font-bold text-gray-900 mb-4 leading-tight"
                            itemprop="name"
                        >
                            {props.course.title}
                        </h1>
                        <p
                            class="text-gray-600 text-base md:text-lg leading-relaxed"
                            itemprop="description"
                        >
                            {props.course.description}
                        </p>
                    </header>

                    <section aria-labelledby="course-content-heading">
                        <div class="flex items-center justify-between mb-5">
                            <h2
                                id="course-content-heading"
                                class="text-xl md:text-2xl font-gsans font-bold text-gray-900"
                            >
                                კურსის შინაარსი
                            </h2>
                            <div class="flex items-center gap-3 text-sm text-gray-500 font-gsans font-medium">
                                <span class="flex items-center gap-1.5">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332-.477-4.5-1.253"/>
                                    </svg>
                                    {props.course.total_lessons} გაკვეთილი
                                </span>
                                <span class="text-gray-300">•</span>
                                <span class="flex items-center gap-1.5">
                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                    </svg>
                                    {props.course.durationHours} საათი
                                </span>
                            </div>
                        </div>
                        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            <CourseBlocks course={props.course} />
                        </div>
                    </section>

                    <section
                        aria-labelledby="instructor-heading"
                        itemprop="creator"
                        itemscope
                        itemtype="https://schema.org/Person"
                        class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm"
                    >
                        <h2
                            id="instructor-heading"
                            class="text-xl md:text-2xl font-gsans font-bold text-gray-900 mb-6"
                        >
                            ინსტრუქტორის შესახებ
                        </h2>

                        <div class="flex items-start gap-5 mb-5">
                            <div class="relative flex-shrink-0">
                                <img
                                    src={props.course.instructor_avatar_url}
                                    alt={props.course.instructor_name}
                                    class="w-20 h-20 rounded-2xl object-cover border border-gray-100"
                                    itemprop="image"
                                    loading="lazy"
                                />
                                <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white" title="Verified instructor" />
                            </div>

                            <div>
                                <h3 class="text-lg font-gsans font-bold text-gray-900 mb-1" itemprop="name">
                                    {props.course.instructor_name}
                                </h3>
                                <p class="text-[#E85A4F] font-gsans text-sm font-medium mb-3" itemprop="jobTitle">
                                    {props.course.instructor_headline}
                                </p>
                                <div class="flex items-center gap-4 text-sm text-gray-500 font-gsans">
                                    <span class="flex items-center gap-1">
                                        <svg class="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                                        </svg>
                                        {props.course.average_rating || "4.8"} რეიტინგი
                                    </span>
                                    <span>•</span>
                                    <span>{props.course.review_count || 0} შეფასება</span>
                                    <span>•</span>
                                    <span>{props.course.enrollment_count || 0} მსმენელი</span>
                                </div>
                            </div>
                        </div>

                        <p class="text-gray-600 font-gsans leading-relaxed text-sm md:text-base border-t border-gray-100 pt-5" itemprop="description">
                            {props.course.instructor_bio}
                        </p>
                    </section>
                </div>

                <div class="hidden lg:block lg:col-span-1">
                    <div class="sticky top-24">
                        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            <CourseMain course={props.course} />
                        </div>
                    </div>
                </div>
            </div>

            <div ref={el => (reviewIntersectionEl = el)} class="h-px mt-8" aria-hidden="true" />

            <Suspense>
                <Show when={displayReviews()}>
                    <LazyReviews stats={{
                        hasHalfStar: props.course.hasHalfStar,
                        averageRating: props.course.average_rating,
                        totalReviews: props.course.review_count
                    }} />
                </Show>
            </Suspense>
        </article>
    )
}