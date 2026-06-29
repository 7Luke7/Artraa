import { createSignal, Show } from "solid-js"
import { LessonSidebar } from "./LessonSidebar"
import { VideoPane } from "./VideoPane"

export default ({data}) => {
    const course = () => data.course
    const [sidebarOpen, setSidebarOpen] = createSignal(true)

    return (
        <div class="min-h-screen flex flex-col bg-gray-50">
            <div class="w-full bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
                <div class="px-2 sm:px-4 md:px-6">
                    <div class="h-14 flex items-center gap-3">
                        <a
                            href={`/course/${course()?.slug}`}
                            class="flex items-center gap-1.5 text-gray-500 hover:text-[#E85A4F] transition-colors text-sm font-gsans"
                        >
                            <img src="/svg/chevron-left-black.svg" width={14} height={14} alt="" />
                            <span class="hidden sm:inline">კურსის გვერდი</span>
                        </a>

                        <div class="w-px h-4 bg-gray-200" />

                        <h1 class="text-gray-900 font-gsans font-semibold text-sm truncate flex-1">
                            {course()?.title}
                        </h1>

                        <Show when={!course()?.is_enrolled}>
                            <a
                                href={`/course/${course()?.slug}`}
                                class="shrink-0 px-4 py-1.5 rounded-lg bg-[#E85A4F] text-white text-xs font-gsans font-bold hover:bg-[#D84A3F] transition-colors"
                            >
                                კურსის შეძენა
                            </a>
                        </Show>
                    </div>
                </div>
            </div>

            <div class="flex flex-1 overflow-hidden relative">
                <button
                    onClick={() => setSidebarOpen(v => !v)}
                    class={`absolute z-30 top-4 transition-all duration-300 ${sidebarOpen() ? 'left-[calc(304px-10px)]' : 'left-2'} w-6 h-6 bg-white hover:bg-gray-50 border border-gray-200 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 shadow-sm`}
                    aria-label="გაკვეთილების სია"
                >
                    <Show when={sidebarOpen()} fallback={<img src="/svg/chevron-left-black.svg" width={14} height={14} alt="" />}>
                        <img src="/svg/chevron-right-black.svg" width={14} height={14} alt="" />
                    </Show>
                </button>

                <aside
                    class={`shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen() ? 'w-[304px]' : 'w-0'}`}
                    aria-hidden={!sidebarOpen()}
                >
                    <LessonSidebar
                        course={course()}
                    />
                </aside>
                <main class="flex-1 overflow-y-auto bg-gray-50">
                    <VideoPane
                        course={course()}
                    />
                </main>
            </div>
        </div>
    )
}