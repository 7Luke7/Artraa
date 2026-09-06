// ─── RecommendedCourses.jsx ───────────────────────────────────────────────────
import { createResource, For, Show } from "solid-js"
import { CourseCard } from "~/components/CourseCard"
import { recommended_courses } from "~/routes/api/course"

export default (props) => {
    const [recommendedCourses] = createResource(
        () => props.data,
        recommended_courses
    )

    return (
        <section class="py-8 md:py-10" aria-labelledby="recommended-heading">
            <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                    <div class="w-9 h-9 rounded-xl bg-[#E85A4F]/10 flex items-center justify-center shrink-0">
                        <img src='/svg/sparkles.svg' width={18} height={18} alt="" />
                    </div>
                    <div>
                        <h2 id="recommended-heading" class="text-xl md:text-2xl font-gsans font-bold text-gray-900 leading-tight">
                            მსგავსი კურსები
                        </h2>
                        <p class="text-xs text-gray-400 font-gsans mt-0.5">იმავე კატეგორიის კურსები</p>
                    </div>
                </div>
            </div>

            <Show when={recommendedCourses.loading}>
                <div class="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
                    {Array.from({ length: 3 }).map(() => (
                        <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden animate-pulse">
                            <div class="w-full aspect-video bg-gray-100" />
                            <div class="p-4 space-y-2">
                                <div class="h-3 bg-gray-100 rounded w-1/3" />
                                <div class="h-4 bg-gray-100 rounded w-3/4" />
                                <div class="h-3 bg-gray-100 rounded w-1/2" />
                                <div class="h-5 bg-gray-100 rounded w-1/4 mt-3" />
                            </div>
                        </div>
                    ))}
                </div>
            </Show>

            <Show when={!recommendedCourses.loading && recommendedCourses()?.length > 0}>
                <ul class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 2xl:grid-cols-3 gap-6" aria-label="რეკომენდირებული კურსები">
                    <For each={recommendedCourses()}>
                        {(course, index) => (
                            <li aria-label={`რეკომენდირებული კურსი ${index() + 1}`}>
                                <CourseCard course={course} />
                            </li>
                        )}
                    </For>
                </ul>
            </Show>

            <Show when={!recommendedCourses.loading && (!recommendedCourses() || recommendedCourses()?.length === 0)}>
                <div class="text-center py-10 text-gray-400 font-gsans text-sm">
                    სხვა კურსები ამ კატეგორიაში ჯერ არ არის
                </div>
            </Show>
        </section>
    )
}