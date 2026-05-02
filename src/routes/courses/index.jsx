import { Title, Meta } from "@solidjs/meta"
import { createAsync, useSearchParams } from "@solidjs/router"
import { For, Show } from "solid-js"
import { Header } from "~/components/Header"
import { Footer } from "~/components/Footer"
import { CourseCard } from "~/components/CourseCard"
import { get_courses } from "../api/courses"

const SORT_OPTIONS = [
    { value: "latest", label: "უახლესი" },
    { value: "popular", label: "პოპულარული" },
    { value: "rating", label: "მაღალი რეიტინგი" },
    { value: "price_asc", label: "ფასი ↑" },
    { value: "price_desc", label: "ფასი ↓" },
]

export default function CoursesPage() {
    const [params, setParams] = useSearchParams()

    const sort = () => props.search.sort || "latest"
    const after = () => props.search.after || null
    const stack = () => props.search.stack ? props.search.stack.split(",").filter(Boolean) : []
    const dir = () => (sort() === "price_asc") ? "asc" : "desc"

    const data = createAsync(() => get_courses({ after: after(), sort: sort(), dir: dir() }))

    const goNext = () => {
        const lastId = data()?.lastId
        if (!lastId) return
        const newStack = [...stack(), after() || "start"].join(",")
        setParams({ sort: sort(), after: lastId, stack: newStack })
    }

    const goPrev = () => {
        const s = stack()
        if (!s.length) return
        const prev = s[s.length - 1]
        const newStack = s.slice(0, -1).join(",")
        setParams({
            sort: sort(),
            after: prev === "start" ? null : prev,
            stack: newStack || null
        })
    }

    return (
        <>
            <Title>კურსები - Artra</Title>
            <Meta name="description" content="აღმოაჩინეთ ქართული ონლაინ კურსები Artra-ზე — ისწავლეთ საკუთარი ტემპით." />

            <div class="min-h-screen flex flex-col bg-gray-50">
                <div class="w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto flex-1">
                    <Header />
                    <div class="py-8 md:py-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <h1 class="text-2xl md:text-3xl font-gsans font-bold text-gray-900">კურსები</h1>
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-xs text-gray-400 font-gsans mr-1">დალაგება:</span>
                            <For each={SORT_OPTIONS}>
                                {opt => (
                                    <button
                                        onClick={() => setSort(opt.value)}
                                        class={`px-3 py-1.5 rounded-lg text-xs font-gsans font-medium transition-colors ${sort() === opt.value
                                                ? "bg-[#E85A4F] text-white"
                                                : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                )}
                            </For>
                        </div>
                    </div>

                    <Show
                        when={data()?.courses?.length > 0}
                        fallback={
                            <div class="text-center py-24">
                                <p class="text-gray-400 font-gsans text-lg">კურსები ვერ მოიძებნა</p>
                            </div>
                        }
                    >
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-10">
                            <For each={data()?.courses}>
                                {course => <CourseCard course={course} />}
                            </For>
                        </div>

                        <div class="flex items-center justify-center gap-4 pb-16">
                            <button
                                onClick={goPrev}
                                disabled={stack().length === 0}
                                class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-gsans text-gray-700 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                <img src="/svg/chevron-left.svg" width={14} height={14} alt="" />
                                წინა
                            </button>
                            <button
                                onClick={goNext}
                                disabled={!data()?.hasNext}
                                class="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-gsans text-gray-700 hover:border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                                შემდეგი
                                <img src="/svg/chevron-right.svg" width={14} height={14} alt="" />
                            </button>
                        </div>
                    </Show>
                </div>
                <Footer />
            </div>
        </>
    )
}