export const Lesson = (props) => {
    const {lessonIndex, lesson, course} = props

    const lessonIdx = lessonIndex()
    const isActive = () => course.current_lesson_id === lesson.lesson_id
    const isLocked = !lesson.is_preview && !props.course?.is_enrolled

    return (
        <a
            href={isLocked ? "#" : `?ln=${lesson.lesson_id}`}
            class={`w-full flex items-start gap-3 px-4 py-3 text-left border-t border-gray-100 transition-colors group/lesson
                ${isActive() ? "bg-[#E85A4F]/5 border-l-2 border-l-[#E85A4F]" : ""}
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white cursor-pointer'}
            `}
            aria-current={isActive() ? "true" : undefined}
        >
            {/* Status icon */}
            <div class={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center transition-colors
                ${lesson.completed ? 'bg-green-100 text-green-500' : isActive() ? 'bg-[#E85A4F]/10 text-[#E85A4F]' : 'bg-gray-100 text-gray-400'}
            `}>
                <Show when={lesson.completed} fallback={
                    <Show when={isLocked} fallback={
                        <svg width={10} height={10} viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                        </svg>
                    }>
                        <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0110 0v4" />
                        </svg>
                    </Show>
                }>
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </Show>
            </div>

            <div class="flex-1 min-w-0">
                <p class={`text-xs font-gsans leading-snug font-medium
                    ${isActive() ? 'text-[#E85A4F]' : 'text-gray-700 group-hover/lesson:text-gray-900'}
                    ${isLocked ? 'text-gray-400' : ''}
                `}>
                    {lessonIdx + 1}. {lesson.lesson_title}
                </p>
                <p class="text-[11px] text-gray-400 font-gsans mt-0.5 line-clamp-2">
                    {lesson.description}
                </p>
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-[11px] text-gray-400 tabular-nums">
                        {lesson.video_duration}
                    </span>
                    <Show when={lesson.is_preview && !props.course?.is_enrolled}>
                        <span class="text-[10px] font-bold text-[#E85A4F] bg-[#E85A4F]/10 px-1.5 py-0.5 rounded border border-[#E85A4F]/20">
                            უფასო
                        </span>
                    </Show>
                </div>
            </div>
        </a>
    )
}