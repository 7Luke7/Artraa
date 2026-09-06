import { Title, Meta } from "@solidjs/meta"
import { createAsync } from "@solidjs/router"
import { For, Show, Suspense, createSignal, lazy } from "solid-js"
import { Header } from "~/components/Header"
import { Footer } from "~/components/Footer"
import { CourseCard } from "~/components/CourseCard"
import { CourseFilters } from "./components/CourseFilters"
import { CoursePagination } from "./components/CoursePagination"
import { CourseSort } from "./components/CourseSort"
import { RenderWebsocketRoutes } from "~/components/RenderWebsocketRoutes"

const EmptyState = lazy(() => import("./components/EmptyState.jsx"))

const BrowseCourses = (props) => {
    const [filtersOpen, setFiltersOpen] = createSignal(false)

    const courses = createAsync(
        async () => {
            try {
                return (await fetch(`${import.meta.env.VITE_URL}/api/browse/courses${props.location.search}`)).json()
            } catch (error) {
                console.log(error)
            }
        },
        { deferStream: false }
    )

    const hasActiveFilters = () => {
        const search = props.location.search
        return search.includes("category=") || search.includes("priceFrom=") || search.includes("priceTo=")
    }

    return <RenderWebsocketRoutes>
        <Title>კურსები - Artra</Title>
        <Meta name="description" content="აღმოაჩინეთ ქართული ონლაინ კურსები Artra-ზე — ისწავლეთ საკუთარი ტემპით." />

        <div class="min-h-screen flex flex-col bg-gray-50">
            <div class="w-full lg:w-10/12 px-2 mb-16 sm:px-4 md:px-6 mx-auto flex-1">
                <Header />

                <div class="py-6 md:py-8">
                    <h1 class="text-2xl md:text-3xl font-gsans font-bold text-gray-900 mb-1">კურსები</h1>
                    <Show when={courses()?.total_count}>
                        <p class="text-sm text-gray-400 font-gsans">
                            {courses()?.total_count} კურსი
                            <Show when={courses()?.category}>
                                {" · "}
                                <span class="text-[#E85A4F] font-medium">{courses()?.category}</span>
                            </Show>
                        </p>
                    </Show>
                </div>

                <div class="flex items-center gap-3 mb-4 xl:hidden">
                    <button
                        onClick={() => setFiltersOpen(v => !v)}
                        class={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-gsans font-medium transition-colors ${filtersOpen() || hasActiveFilters()
                                ? "border-[#E85A4F] text-[#E85A4F] bg-[#E85A4F]/5"
                                : "border-gray-200 text-gray-700 bg-white hover:border-gray-300"
                            }`}
                    >
                        <img src='/svg/filter.svg' width={16} height={16} alt="" />
                        ფილტრი
                        <Show when={hasActiveFilters()}>
                            <span class="w-1.5 h-1.5 rounded-full bg-[#E85A4F]" />
                        </Show>
                    </button>
                </div>

                <div class="flex gap-6 xl:gap-8 items-start">
                    <aside class={`
                            xl:block xl:w-56 xl:w-64 shrink-0
                            ${filtersOpen()
                            ? "fixed inset-0 z-50 xl:relative xl:inset-auto"
                            : "hidden xl:block"
                        }
                        `}>
                        <Show when={filtersOpen()}>
                            <div
                                class="absolute inset-0 bg-black/40 xl:hidden"
                                onClick={() => setFiltersOpen(false)}
                            />
                        </Show>

                        <div class={`
                                relative bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden
                                xl:sticky xl:top-6
                                ${filtersOpen() ? "absolute left-0 top-0 h-screen bottom-0 w-72 z-10 rounded-none border-0 shadow-xl overflow-y-auto" : ""}
                            `}>
                            <Show when={filtersOpen()}>
                                <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 xl:hidden">
                                    <p class="font-gsans font-bold text-gray-900">ფილტრი</p>
                                    <button
                                        onClick={() => setFiltersOpen(false)}
                                        class="text-gray-400 hover:text-gray-600"
                                    >
                                        <img src='/svg/close.svg' width={20} height={20} alt="" />
                                    </button>
                                </div>
                            </Show>

                            <CourseFilters
                                location={props.location}
                                minPrice={courses()?.priceFrom}
                                maxPrice={courses()?.priceTo}
                                onApply={() => setFiltersOpen(false)}
                            />
                        </div>
                    </aside>

                    <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between mb-5">
                            <Show when={courses()?.total_count}>
                                <p class="text-sm text-gray-400 font-gsans">
                                    ნაჩვენებია <span class="text-gray-700 font-medium">{courses()?.courses?.length}</span> / {courses()?.total_count}
                                </p>
                            </Show>
                            <Show when={courses()?.total_count}>
                                <CourseSort currentSort={new URLSearchParams(props.location.search).get("sort")} location={props.location} />
                            </Show>
                        </div>

                        <Show
                            when={courses()?.courses?.length > 0}
                            fallback={<Suspense>
                                <EmptyState hasFilters={hasActiveFilters()} location={props.location} />
                            </Suspense>}
                        >
                            <ul
                                aria-label="კურსები"
                                class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 2xl:grid-cols-3 gap-4"
                            >
                                <For each={courses()?.courses}>
                                    {(course, index) => (
                                        <li aria-label={`კურსი ${index() + 1}`}>
                                            <CourseCard course={course} />
                                        </li>
                                    )}
                                </For>
                            </ul>

                            <Show when={courses()}>
                                <CoursePagination
                                    links={courses().links}
                                    right_btn_link={courses().right_btn_link}
                                    left_btn_link={courses().left_btn_link}
                                />
                            </Show>
                        </Show>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    </RenderWebsocketRoutes>
}

export default BrowseCourses