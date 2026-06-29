export const OverviewSidebarComponent = (props) => {
    const {course} = props

    return <a
            href={`/course/${course.slug}`}
            class={`w-full flex items-start gap-3 px-4 py-3 text-left border-t border-gray-100 transition-colors group/lesson
                ${!course.search ? "bg-[#E85A4F]/5 border-l-2 border-l-[#E85A4F]" : ""}
            `}
                aria-current={!course.search ? "true" : undefined}
            >
            <div class="flex-1 min-w-0">
                <p class={`text-xs font-gsans leading-snug font-medium
                    ${!course.search ? 'text-[#E85A4F]' : 'text-gray-700 group-hover/lesson:text-gray-900'}
                `}>
                    {course.title}
                </p>
                <p class="text-[11px] text-gray-400 font-gsans mt-0.5 line-clamp-2">
                    {course.description.slice(0, 20)}
                </p>
            </div>
        </a>
}