import { createSignal, For, Show } from "solid-js"

const formatDuration = (seconds) => {
    if (!seconds) return ""
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const rem = minutes % 60
    return hours > 0 ? `${hours}სთ ${rem}წთ` : `${minutes}წთ`
}

export const LessonSidebar = (props) => {
    const [expandedSections, setExpandedSections] = createSignal(new Set([0]))

    const toggleSection = (idx) => {
        setExpandedSections(prev => {
            const next = new Set(prev)
            next.has(idx) ? next.delete(idx) : next.add(idx)
            return next
        })
    }

    const totalLessons = () =>
        props.course?.course_content?.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) || 0

    const completedCount = () =>
        props.course?.course_content?.reduce((acc, s) =>
            acc + (s.lessons?.filter(l => l.completed)?.length || 0), 0) || 0

    const progress = () => totalLessons() > 0
        ? Math.round((completedCount() / totalLessons()) * 100)
        : 0

    return (
        <div class="flex flex-col h-full w-80">
            {/* Sidebar header */}
            <div class="px-4 py-4 border-b border-gray-800 shrink-0">
                <p class="text-xs font-gsans text-gray-400 mb-2">
                    {completedCount()} / {totalLessons()} გაკვეთილი
                </p>
                <div class="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-[#E85A4F] rounded-full transition-all duration-500"
                        style={{ width: `${progress()}%` }}
                    />
                </div>
            </div>

            {/* Scrollable lesson list */}
            <div class="flex-1 overflow-y-auto">
                <For each={props.course?.course_content}>
                    {(section, sectionIndex) => {
                        const isOpen = () => expandedSections().has(sectionIndex())
                        const sectionDuration = section.lessons?.reduce((a, l) => a + (l.video_duration || 0), 0) || 0

                        return (
                            <div class="border-b border-gray-800/60 last:border-b-0">
                                {/* Section header */}
                                <button
                                    onClick={() => toggleSection(sectionIndex())}
                                    class="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-800/40 transition-colors group"
                                    aria-expanded={isOpen()}
                                >
                                    <div class={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${isOpen() ? 'bg-[#E85A4F]/20 text-[#E85A4F]' : 'bg-gray-800 text-gray-400 group-hover:text-gray-200'}`}>
                                        {sectionIndex() + 1}
                                    </div>
                                    <div class="flex-1 min-w-0">
                                        <p class="text-sm font-gsans font-semibold text-gray-200 leading-snug truncate">
                                            {section.section_title}
                                        </p>
                                        <p class="text-xs text-gray-500 font-gsans mt-0.5">
                                            {section.lessons?.length || 0} გაკვეთილი
                                            <Show when={sectionDuration > 0}>
                                                {" · "}{formatDuration(sectionDuration)}
                                            </Show>
                                        </p>
                                    </div>
                                    <svg
                                        class={`shrink-0 w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen() ? 'rotate-180' : ''}`}
                                        fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                                    >
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
                                    </svg>
                                </button>

                                {/* Lessons */}
                                <Show when={isOpen()}>
                                    <div class="bg-gray-950/30">
                                        <For each={section.lessons}>
                                            {(lesson, lessonIndex) => {
                                                const isActive = () => props.currentLesson?.id === lesson.id
                                                const isLocked = !lesson.is_preview && !props.course?.has_access

                                                return (
                                                    <button
                                                        onClick={() => !isLocked && props.onSelect(lesson)}
                                                        disabled={isLocked}
                                                        class={`w-full flex items-start gap-3 px-4 py-3 text-left border-t border-gray-800/40 transition-colors group/lesson
                                                            ${isActive() ? 'bg-[#E85A4F]/10 border-l-2 border-l-[#E85A4F]' : ''}
                                                            ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800/40 cursor-pointer'}
                                                        `}
                                                        aria-current={isActive() ? "true" : undefined}
                                                    >
                                                        {/* Status icon */}
                                                        <div class={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors
                                                            ${lesson.completed ? 'bg-green-500/20 text-green-400' : isActive() ? 'bg-[#E85A4F]/20 text-[#E85A4F]' : 'bg-gray-800 text-gray-500'}
                                                        `}>
                                                            <Show when={lesson.completed} fallback={
                                                                <Show when={isLocked} fallback={
                                                                    <svg width={10} height={10} viewBox="0 0 24 24" fill="currentColor">
                                                                        <path d="M8 5v14l11-7z"/>
                                                                    </svg>
                                                                }>
                                                                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                                                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                                                        <path d="M7 11V7a5 5 0 0110 0v4"/>
                                                                    </svg>
                                                                </Show>
                                                            }>
                                                                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                                                                    <polyline points="20 6 9 17 4 12"/>
                                                                </svg>
                                                            </Show>
                                                        </div>

                                                        <div class="flex-1 min-w-0">
                                                            <p class={`text-xs font-gsans leading-snug font-medium
                                                                ${isActive() ? 'text-[#E85A4F]' : 'text-gray-300 group-hover/lesson:text-white'}
                                                                ${isLocked ? 'text-gray-500' : ''}
                                                            `}>
                                                                {lessonIndex() + 1}. {lesson.lesson_title}
                                                            </p>
                                                            <Show when={lesson.description}>
                                                                <p class="text-[11px] text-gray-500 font-gsans mt-0.5 line-clamp-2">
                                                                    {lesson.description}
                                                                </p>
                                                            </Show>
                                                            <div class="flex items-center gap-2 mt-1">
                                                                <Show when={lesson.video_duration}>
                                                                    <span class="text-[11px] text-gray-500 tabular-nums">
                                                                        {formatDuration(lesson.video_duration)}
                                                                    </span>
                                                                </Show>
                                                                <Show when={lesson.is_preview && !props.course?.has_access}>
                                                                    <span class="text-[10px] font-bold text-[#E85A4F] bg-[#E85A4F]/10 px-1.5 py-0.5 rounded border border-[#E85A4F]/20">
                                                                        უფასო
                                                                    </span>
                                                                </Show>
                                                            </div>
                                                        </div>
                                                    </button>
                                                )
                                            }}
                                        </For>
                                    </div>
                                </Show>
                            </div>
                        )
                    }}
                </For>
            </div>
        </div>
    )
}