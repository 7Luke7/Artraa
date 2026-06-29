import { createResource, createSignal, For } from "solid-js"
import { StarRow } from "~/components/StarRow"
import { get_course_reviews } from "~/routes/api/course"
import { SingleReview } from "./SingleReview"

export default (props) => {
    const { stats, course_id } = props
    const [page, setPage] = createSignal(1)
    const [reviews] = createResource(page, (p) => get_course_reviews(p, course_id))

    const totalPages = Math.ceil(Number(stats?.totalReviews) / 8)

    const goToNextPage = (page) => setPage(page)

    const visiblePages = () => {
        const current = page()
        const total = totalPages
        const delta = 2

        let start = Math.max(1, current - delta)
        let end = Math.min(total, current + delta)

        if (current - delta < 1) {
            end = Math.min(total, end + (delta - (current - 1)))
        }
        if (current + delta > total) {
            start = Math.max(1, start - (delta - (total - current)))
        }

        return Array.from({ length: end - start + 1 }, (_, i) => start + i)
    }

    return (
        <section class="py-8 md:py-10" aria-labelledby="reviews-heading">
            <div class="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-6">
                <div class="h-1 bg-gradient-to-r from-[#E85A4F] to-[#f07068]" />

                <div class="p-6">
                    <h2 id="reviews-heading" class="text-xl md:text-2xl font-gsans font-bold text-gray-900 mb-6">
                        მოსწავლეების შეფასებები
                    </h2>
                    <p class="text-6xl font-gsans font-bold text-gray-900 leading-none mb-2">
                        {stats?.averageRating || "4.8"}
                    </p>
                    <StarRow rating={stats?.averageRating || 4.8} size={18} />
                    <p class="text-xs text-gray-400 font-gsans mt-2">
                        {stats?.totalReviews || 0} შეფასება
                    </p>
                </div>
            </div>

            <div class={`space-y-3 transition-opacity duration-150 ${reviews.loading ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                <For each={reviews.latest ?? []}>
                    {(review) => <SingleReview review={review} />}
                </For>
            </div>
            <nav aria-label="გვერდები" class="flex items-center justify-center gap-1.5 mt-10 mb-4">
                <button
                    disabled={page() === 1}
                    onClick={() => goToNextPage(page() - 1)}
                    class={`flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-gsans transition-colors ${page() === 1
                        ? "border-gray-100 text-gray-300 pointer-events-none bg-white"
                        : "border-gray-200 text-gray-600 bg-white hover:border-[#E85A4F]/40 hover:text-[#E85A4F] hover:bg-[#E85A4F]/5"
                        }`}
                >
                    <img src="/svg/chevron-left-black.svg" width={14} height={14} alt="წინა" />
                </button>

                <For each={visiblePages()}>
                    {(the_page) => (
                        <button
                            onClick={() => goToNextPage(the_page)}
                            class={`flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-gsans font-medium transition-colors ${page() === the_page
                                ? "bg-[#E85A4F] border-[#E85A4F] text-white shadow-sm"
                                : "border-gray-200 text-gray-600 bg-white hover:border-[#E85A4F]/40 hover:text-[#E85A4F] hover:bg-[#E85A4F]/5"
                                }`}
                        >
                            {the_page}
                        </button>
                    )}
                </For>

                <button
                    onClick={() => goToNextPage(page() + 1)}
                    disabled={page() === totalPages}
                    class={`flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-gsans transition-colors ${page() === totalPages
                        ? "border-gray-100 text-gray-300 pointer-events-none bg-white"
                        : "border-gray-200 text-gray-600 bg-white hover:border-[#E85A4F]/40 hover:text-[#E85A4F] hover:bg-[#E85A4F]/5"
                        }`}
                >
                    <img src="/svg/chevron-right-black.svg" width={14} height={14} alt="შემდეგი" />
                </button>
            </nav>
        </section>
    )
}
