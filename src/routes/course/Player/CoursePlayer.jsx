import { createSignal, Show, createMemo } from "solid-js"
import { A } from "@solidjs/router"
import { LessonSidebar } from "./LessonSidebar"
import { VideoPane } from "./VideoPane"

/**
 * CoursePlayer
 * Two-column layout:
 *   - Left: collapsible lesson sidebar
 *   - Right: video player + lesson info + reviews (if purchased)
 */
export const CoursePlayer = (props) => {
    const course = () => props.data()?.course

    // Find first available lesson (preview or first if has_access)
    const firstLesson = createMemo(() => {
        const sections = course()?.course_content || []
        for (const section of sections) {
            for (const lesson of section.lessons || []) {
                if (lesson.is_preview || course()?.has_access) return lesson
            }
        }
        return null
    })

    const [activeLesson, setActiveLesson] = createSignal(null)
    const currentLesson = () => activeLesson() || firstLesson()

    const [sidebarOpen, setSidebarOpen] = createSignal(true)

    const canWatch = (lesson) => {
        if (!lesson) return false
        return lesson.is_preview || course()?.has_access
    }

    const handleSelect = (lesson) => {
        if (canWatch(lesson)) setActiveLesson(lesson)
    }

    return (
        <div class="min-h-screen bg-gray-950 flex flex-col">
            {/* Top bar */}
            <header class="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 gap-4 shrink-0 z-20">
                <A href={`/courses/${course()?.slug}`} class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                    <img src="/svg/chevron-left.svg" width={16} height={16} alt="" />
                    <span class="text-sm font-gsans hidden sm:inline">კურსის გვერდი</span>
                </A>
                <div class="w-px h-5 bg-gray-700" />
                <h1 class="text-white font-gsans font-semibold text-sm truncate flex-1">{course()?.title}</h1>
                <Show when={!course()?.has_access}>
                    <A
                        href={`/courses/${course()?.slug}`}
                        class="ml-auto shrink-0 px-4 py-1.5 rounded-lg bg-[#E85A4F] text-white text-xs font-gsans font-bold hover:bg-[#D84A3F] transition-colors"
                    >
                        კურსის შეძენა
                    </A>
                </Show>
            </header>

            {/* Body */}
            <div class="flex flex-1 overflow-hidden relative">
                {/* Sidebar toggle (mobile/desktop) */}
                <button
                    onClick={() => setSidebarOpen(v => !v)}
                    class={`absolute z-30 top-4 transition-all duration-300 ${sidebarOpen() ? 'left-[calc(320px-12px)]' : 'left-2'} w-7 h-7 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-full flex items-center justify-center text-gray-300 hover:text-white`}
                    aria-label="გაკვეთილების სია"
                >
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <Show when={sidebarOpen()} fallback={
                            <path d="M9 18l6-6-6-6"/>
                        }>
                            <path d="M15 18l-6-6 6-6"/>
                        </Show>
                    </svg>
                </button>

                {/* Sidebar */}
                <aside
                    class={`shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col overflow-hidden transition-all duration-300 ${sidebarOpen() ? 'w-80' : 'w-0'}`}
                    aria-hidden={!sidebarOpen()}
                >
                    <LessonSidebar
                        course={course()}
                        currentLesson={currentLesson()}
                        onSelect={handleSelect}
                    />
                </aside>

                {/* Main video area */}
                <main class="flex-1 overflow-y-auto">
                    <VideoPane
                        lesson={currentLesson()}
                        course={course()}
                        canWatch={canWatch(currentLesson())}
                    />
                </main>
            </div>
        </div>
    )
}