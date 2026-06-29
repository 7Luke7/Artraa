import { Lessons } from "./Lessons"

export const Section = (props) => {
    const {expandedSections, sectionIndex, section, course, toggleSection} = props
    const idx = sectionIndex()
    const isOpen = () => expandedSections().includes(idx)
    
    return (
        <div class="border-b border-gray-100 last:border-b-0">
            <button
                onClick={() => toggleSection(idx)}
                class="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors group"
                aria-expanded={isOpen()}
            >
                <div class={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold transition-colors ${isOpen() ? 'bg-[#E85A4F]/10 text-[#E85A4F]' : 'bg-gray-100 text-gray-500 group-hover:bg-[#E85A4F]/10 group-hover:text-[#E85A4F]'}`}>
                    {idx + 1}
                </div>
                <div class="flex-1 min-w-0">
                    <p class="text-sm font-gsans font-semibold text-gray-900 leading-snug truncate">
                        {section.section_title}
                    </p>
                    <p class="text-xs text-gray-400 font-gsans mt-0.5">
                        {section.lessons?.length || 0} გაკვეთილი • {section.section_duration}
                    </p>
                </div>
                <svg
                    class={`shrink-0 w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen() ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            <Show when={isOpen()}>
                <Lessons course={course} lessons={section.lessons}></Lessons>
            </Show>
        </div>
    )
}