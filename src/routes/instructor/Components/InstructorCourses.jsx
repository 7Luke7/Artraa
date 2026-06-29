import { createMemo, createResource, createSignal } from "solid-js";
import { CourseCard } from "~/components/CourseCard";
import { get_instructor_courses } from "~/routes/api/instructor";

const COURSES_PER_PAGE = 6;

export default ({courses, course_count, instructor_id}) => {
    const [currentPage, setCurrentPage] = createSignal(1);
    const [data] = createResource(currentPage, async (p) => {
        if (course_count && currentPage() === 1) return courses;
        const data = await get_instructor_courses(p, instructor_id)
        return data
    })

    const totalPages = createMemo(() =>
        Math.ceil((course_count) / COURSES_PER_PAGE)
    );
    
    const visiblePages = () => {
        const current = currentPage()
        const total = totalPages()
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

    const goToPage = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };
    return <div class="mt-8 pb-20">
        <Show
            when={course_count > 0}
            fallback={
                <p class="text-sm text-gray-400 text-center py-16">კურსები არ მოიძებნა.</p>
            }
        >
            <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                <For each={data()}>
                    {(course) => <CourseCard course={course} />}
                </For>
            </div>

            <Show when={totalPages() > 1}>
                <nav aria-label="გვერდები" class="flex items-center justify-center gap-1.5 mt-10 mb-4">
                    <button
                        disabled={currentPage() === 1}
                        onClick={() => goToPage(currentPage() - 1)}
                        class={`flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-gsans transition-colors ${currentPage() === 1
                            ? "border-gray-100 text-gray-300 pointer-events-none bg-white"
                            : "border-gray-200 text-gray-600 bg-white hover:border-[#E85A4F]/40 hover:text-[#E85A4F] hover:bg-[#E85A4F]/5"
                            }`}
                    >
                        <img src="/svg/chevron-left-black.svg" width={14} height={14} alt="წინა" />
                    </button>
                    <For each={visiblePages()}>
                        {(_, i) => {
                            const the_page = i() + 1
                            return <button
                                onClick={() => goToPage(the_page)}
                                class={`flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-gsans font-medium transition-colors ${currentPage() === the_page
                                    ? "bg-[#E85A4F] border-[#E85A4F] text-white shadow-sm"
                                    : "border-gray-200 text-gray-600 bg-white hover:border-[#E85A4F]/40 hover:text-[#E85A4F] hover:bg-[#E85A4F]/5"
                                    }`}
                            >
                                {the_page}
                            </button>
                        }}
                    </For>
                    <button
                        onClick={() => goToPage(currentPage() + 1)}
                        disabled={currentPage() === totalPages()}
                        class={`flex items-center justify-center w-9 h-9 rounded-xl border text-sm font-gsans transition-colors ${currentPage() === totalPages()
                            ? "border-gray-100 text-gray-300 pointer-events-none bg-white"
                            : "border-gray-200 text-gray-600 bg-white hover:border-[#E85A4F]/40 hover:text-[#E85A4F] hover:bg-[#E85A4F]/5"
                            }`}
                    >
                        <img src="/svg/chevron-right-black.svg" width={14} height={14} alt="შემდეგი" />
                    </button>
                </nav>
            </Show>
        </Show>
    </div>
}