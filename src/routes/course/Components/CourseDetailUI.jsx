import { createSignal, lazy, onMount, Show, Suspense } from "solid-js"
import { CourseBlocks } from "./CourseBlocks"
import { CourseMain } from "./CourseMain"
import { StarRow } from "~/components/StarRow"

const LazyReviews = lazy(() => import('./Reviews.jsx'))
const LazyRecommendedCourses = lazy(() => import('./RecommendedCourses.jsx'))

export const CourseDetailUI = (props) => {
    const [displayReviews, setDisplayReviews] = createSignal(false)
    const [displayRecommendedCourses, setDisplayRecommendedCourses] = createSignal(false)
    let recommendedIntersectionEl
    let reviewIntersectionEl

    onMount(() => {
        const options = { root: null, rootMargin: "200px", threshold: 0 }

        const recommendedObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setDisplayRecommendedCourses(true)
                    recommendedObserver.disconnect()
                }
            })
        }, options)

        if (recommendedIntersectionEl) {
            recommendedObserver.observe(recommendedIntersectionEl)
        }
    })

    const setupReviewObserver = () => {
        if (!reviewIntersectionEl) return
        const options = { root: null, rootMargin: "200px", threshold: 0 }
        const reviewsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setDisplayReviews(true)
                    reviewsObserver.disconnect()
                }
            })
        }, options)
        reviewsObserver.observe(reviewIntersectionEl)
    }

    return (
        <article class="py-4 md:py-8" itemscope itemtype="https://schema.org/Course">
            <div class="grid grid-cols-1 lg:grid-cols-12 lg:gap-12">
                <div class="lg:col-span-7 2xl:col-span-8 space-y-8 order-2 lg:order-1">
                    <header class="space-y-4">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="px-3 py-1 rounded-full bg-[#E85A4F]/10 text-[#E85A4F] text-xs font-gsans font-bold border border-[#E85A4F]/20">
                                {props.course.category_name}
                            </span>
                            <span class="px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 font-bold text-xs font-gsans">
                                {props.course.level}
                            </span>
                        </div>

                        <h1
                            class="text-2xl md:text-3xl lg:text-4xl font-gsans font-bold text-gray-900 leading-tight"
                            itemprop="name"
                        >
                            {props.course.title}
                        </h1>
                        <p
                            class="text-gray-500 text-base md:text-lg font-gsans font-medium leading-relaxed"
                            itemprop="description"
                        >
                            {props.course.description}
                        </p>

                        <div class="flex items-center gap-4 flex-wrap pt-1">
                            <Show when={props.course.average_rating > 0}>
                                <div class="flex items-center gap-1.5">
                                    <StarRow rating={props.course.average_rating}></StarRow>
                                    <span class="text-sm font-bold text-gray-800 font-gsans">{props.course.average_rating}</span>
                                    <span class="text-sm text-gray-400 font-gsans font-medium">({props.course.review_count} შეფასება)</span>
                                </div>
                                <span class="text-gray-200">·</span>
                            </Show>
                            <span class="text-sm text-gray-500 font-medium font-gsans">
                                {props.course.enrollment_count} მოსწავლე
                            </span>
                        </div>
                    </header>

                    <div class="block bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <CourseBlocks course={props.course} />
                    </div>

                    <section
                        aria-labelledby="instructor-heading"
                        itemprop="creator"
                        itemscope
                        itemtype="https://schema.org/Person"
                        class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm"
                    >
                        <div class="h-1 w-full bg-gradient-to-r from-[#E85A4F] to-[#f07068]" />
                        <div class="p-6">
                            <SectionHeader id="instructor-heading">
                                ინსტრუქტორის შესახებ
                            </SectionHeader>

                            <div class="flex items-start gap-5 mb-5">
                                <a href={`/instructor/${props.course.instructor_slug}`} class="shrink-0 group relative">
                                    <img
                                        src={props.course.avatar}
                                        onError={(e) => e.currentTarget.src = '/default_profile.png'}
                                        alt={props.course.instructor_name}
                                        class="w-20 h-20 rounded-2xl object-cover border border-gray-100 group-hover:opacity-90 transition-opacity"
                                        itemprop="image"
                                        loading="lazy"
                                    />
                                </a>

                                <div class="flex-1 min-w-0">
                                        <a
                                            href={`/instructor/${props.course.instructor_slug}`}
                                            class="text-lg mb-0.5 font-gsans font-bold text-gray-900 hover:text-[#E85A4F] transition-colors"
                                            itemprop="name"
                                        >
                                            {props.course.instructor_name}
                                        </a>

                                    <p class="text-[#E85A4F] font-gsans text-sm font-medium mb-3" itemprop="jobTitle">
                                        {props.course.instructor_headline}
                                    </p>
                                    <div class="flex items-center gap-3 flex-wrap text-xs text-gray-400 font-gsans mb-4">
                                        <span class="flex items-center gap-1">
                                            <img src='/svg/book-2.svg' width={13} height={13} />
                                            {props.course.total_courses} კურსი
                                        </span>
                                        <span class="text-gray-200">·</span>
                                        <span class="flex items-center gap-1">
                                            <img src='/svg/users-group.svg' width={13} height={13} />
                                            {props.course.total_students} მოსწავლე
                                        </span>
                                    </div>

                                    <a
                                        href={`/instructor/${props.course.instructor_slug}`}
                                        class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-xs font-gsans font-medium text-gray-600 hover:border-[#E85A4F]/40 hover:text-[#E85A4F] hover:bg-[#E85A4F]/4 transition-all"
                                    >
                                        პროფილის ნახვა
                                        <img src='/svg/arrow-narrow-right-black.svg' width={13} height={13} />
                                    </a>
                                </div>
                            </div>

                            <p class="text-gray-500 font-gsans leading-relaxed text-sm md:text-base border-t border-gray-100 pt-5" itemprop="description">
                                {props.course.instructor_bio}
                            </p>
                        </div>
                    </section>

                </div>
                <div class="lg:col-span-5 2xl:col-span-4 order-1 lg:order-2 mb-8 lg:mb-0">
                    <div class="lg:sticky lg:top-24">
                        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                            <CourseMain course={props.course} />
                        </div>
                    </div>
                </div>
            </div>
            <div ref={el => (recommendedIntersectionEl = el)} class="h-px mt-10" aria-hidden="true" />

            <Suspense>
                <Show when={displayRecommendedCourses()}>
                    <LazyRecommendedCourses data={{
                        category_id: props.course.category_id,
                        currentCourseSlug: props.course.slug
                    }} />
                    <div
                        ref={el => {
                            reviewIntersectionEl = el
                            setupReviewObserver()
                        }}
                        class="h-px mt-8"
                        aria-hidden="true"
                    />
                </Show>
            </Suspense>

            <Suspense>
                <Show when={displayReviews()}>
                    <LazyReviews stats={{
                        hasHalfStar: props.course.hasHalfStar,
                        averageRating: props.course.average_rating,
                        totalReviews: props.course.review_count,
                    }} course_id={props.course.id} />
                </Show>
            </Suspense>
        </article>
    )
}

const SectionHeader = (props) => (
    <div class="flex items-center gap-3 mb-5">
        <h2 id={props.id} class="text-xl md:text-2xl font-gsans font-bold text-gray-900">
            {props.children}
        </h2>
    </div>
)