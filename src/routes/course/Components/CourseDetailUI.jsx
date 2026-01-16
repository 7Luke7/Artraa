import { createSignal, lazy, onMount, Show, Suspense } from "solid-js"
import { BreadCrumbs } from "./BreadCrumbs"
import { CourseBlocks } from "./CourseBlocks"
import { CourseMain } from "./CourseMain"

const LazyRecommendedCourses = lazy(() => import('./RecommendedCourses.jsx'))
const LazyReviews = lazy(() => import('./Reviews.jsx'))

export const CourseDetailUI = (props) => {
    const [displayRecommendedCourses, setDisplayRecommendedCourses] = createSignal(false)
    const [displayReviews, setDisplayReviews] = createSignal(false)
    let recommendedIntersectionEl
    let reviewIntersectionEl

    onMount(() => {
        const options = {
            root: null,
            rootMargin: "0px",
            scrollMargin: "0px",
            threshold: 0.1,
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                const isRecommended = entry.target.id === 'recommended'
                if (entry.isIntersecting && isRecommended) {
                    setDisplayRecommendedCourses(true)
                    observer.unobserve(entry.target)
                    observer.observe(reviewIntersectionEl)
                } else if (entry.isIntersecting) {
                    setDisplayReviews(true)
                    observer.unobserve(entry.target)
                }
            })
        }, options);
        observer.observe(recommendedIntersectionEl)
    })
    return (
        <article
            class="py-6 md:py-8"
            itemscope
            itemtype="https://schema.org/Course"
        >
            <div class="mb-6">
                <BreadCrumbs
                    category_name={props.course.category_name}
                    category_slug={props.course.category_slug}
                    title={props.course.title}
                    cp={props.course.cp}
                />
            </div>

            <div class="lg:hidden mb-8">
                <div class="overflow-hidden">
                    <CourseMain course={props.course} />
                </div>
            </div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10">
                <div class="lg:col-span-2">
                    <header class="mb-8">
                        <h1
                            class="text-2xl md:text-3xl lg:text-4xl font-gsans font-bold text-gray-900 mb-4 leading-tight"
                            itemprop="name"
                        >
                            {props.course.title}
                        </h1>

                        <p
                            class="text-gray-700 mb-6 text-base md:text-lg leading-relaxed"
                            itemprop="description"
                        >
                            {props.course.description}
                        </p>
                    </header>
                    <section
                        class="mb-10"
                        aria-labelledby="course-content-heading"
                    >
                        <div class="flex items-center justify-between mb-6">
                            <h2
                                id="course-content-heading"
                                class="text-xl md:text-2xl font-gsans font-bold text-gray-900"
                            >
                                კურსის შინაარსი
                            </h2>
                            <div class="flex items-center gap-2">
                                <span class="text-sm text-gray-500 font-gsans font-medium">
                                    {props.course.total_lessons} გაკვეთილი
                                </span>
                                <span class="text-sm text-gray-400">•</span>
                                <span class="text-sm text-gray-500 font-gsans font-medium">
                                    {props.course.durationHours} საათი
                                </span>
                            </div>
                        </div>
                        <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <CourseBlocks course={props.course} />
                        </div>
                    </section>

                    <section
                        class="mb-10"
                        aria-labelledby="instructor-heading"
                        itemprop="creator"
                        itemscope
                        itemtype="https://schema.org/Person"
                    >
                        <h2
                            id="instructor-heading"
                            class="text-xl md:text-2xl font-gsans font-bold text-gray-900 mb-6"
                        >
                            ინსტრუქტორის შესახებ
                        </h2>

                        <div class="flex flex-row gap-6">
                            <div class="flex-shrink-0">
                                <img
                                    src={props.course.instructor_avatar_url}
                                    alt={`${props.course.instructor_name}`}
                                    class="w-24 h-24 rounded-full border-2 border-white shadow-md"
                                    itemprop="image"
                                    loading="lazy"
                                />
                            </div>

                            <div class="flex-1">
                                <h3
                                    class="text-lg font-gsans font-bold text-gray-900 mb-2"
                                    itemprop="name"
                                >
                                    {props.course.instructor_name}
                                </h3>

                                <p
                                    class="text-gray-600 mb-4"
                                    itemprop="jobTitle"
                                >
                                    {props.course.instructor_headline}
                                </p>
                            </div>
                        </div>
                        <div
                            class="text-gray-700 p-2 leading-relaxed mb-4"
                            itemprop="description"
                        >
                            {props.course.instructor_bio}
                        </div>
                    </section>
                </div>

                <div class="hidden lg:block lg:col-span-1">
                    <div class="sticky top-24 overflow-hidden">
                        <CourseMain course={props.course} />
                    </div>
                </div>
                <div id='recommended' ref={el => (recommendedIntersectionEl = el)}></div>
            </div>
            <div>
                <Suspense>
                    <Show when={displayRecommendedCourses()}>
                        <LazyRecommendedCourses data={[props.course.category_slug, props.course.cp.parent_category_slug, props.course.slug]}></LazyRecommendedCourses>
                        <div id='reviews' ref={el => (reviewIntersectionEl = el)}></div>
                    </Show>
                </Suspense>
                <Suspense>
                    <Show when={displayReviews()}>
                        <LazyReviews stats={{hasHalfStar: props.course.hasHalfStar, averageRating: props.course.average_rating, totalReviews: props.course.review_count}}></LazyReviews>
                    </Show>
                </Suspense>
            </div>
        </article>
    )
}