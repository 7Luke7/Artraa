import { createSignal, Show, For } from "solid-js";

export const CourseBlocks = (props) => {
    const [expandedSections, setExpandedSections] = createSignal([0])

    const toggleSection = (idx) => {
        setExpandedSections(prev =>
            prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
        )
    }
    const formatDuration = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const rem = minutes % 60;
        return hours > 0 ? `${hours}სთ ${rem}წთ` : `${minutes} წთ`;
    };
    return (
        <div itemscope itemtype="https://schema.org/ItemList">
            <meta itemprop="numberOfItems" content={props.course.course_content?.length || 0} />

            <For each={props.course.course_content}>
                {(section, sectionIndex) => {
                    const idx = sectionIndex()
                    const isOpen = () => expandedSections().includes(idx)
                    return (
                        <div
                            class={`border-b border-gray-100 last:border-b-0 transition-colors ${isOpen() ? 'bg-white' : 'bg-white hover:bg-gray-50/50'}`}
                            itemprop="itemListElement"
                            itemscope
                            itemtype="https://schema.org/ListItem"
                        >
                            <button
                                onClick={() => toggleSection(idx)}
                                class="flex items-center justify-between w-full px-4 py-4 text-left group"
                                aria-expanded={isOpen()}
                                aria-controls={`section-${idx}`}
                            >
                                <div class="flex items-center gap-4 flex-1 min-w-0">
                                    <div
                                        class={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold transition-colors ${isOpen() ? 'bg-[#E85A4F] text-white' : 'bg-gray-100 text-gray-600 group-hover:bg-[#E85A4F]/10 group-hover:text-[#E85A4F]'}`}
                                        aria-hidden="true"
                                    >
                                        {idx + 1}
                                    </div>
                                    <div class="min-w-0">
                                        <h3 class="font-gsans font-semibold text-gray-900 text-base truncate" itemprop="name">
                                            {section.section_title}
                                        </h3>
                                        <div class="flex items-center gap-3 mt-0.5 text-xs text-gray-400 font-gsans">
                                            <span>{section.lessons?.length || 0} გაკვეთილი</span>
                                            <span>•</span>
                                            <span>{section.section_duration}</span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    class={`flex-shrink-0 ml-3 transition-transform duration-200 ${isOpen() ? 'rotate-180' : ''}`}
                                    aria-hidden="true"
                                >
                                    <img src="/svg/dropdown.svg" width={16} height={16} alt="" />
                                </div>
                                <meta itemprop="position" content={idx + 1} />
                            </button>

                            <Show when={isOpen()}>
                                <div
                                    id={`section-${idx}`}
                                    class="border-t border-gray-100 bg-gray-50/50"
                                    role="region"
                                    aria-label={section.section_title}
                                >
                                    <For each={section.lessons}>
                                        {(lesson, lessonIndex) => (
                                            <a
                                                href={lesson.is_preview ? `${props.course.slug}/lessons/${section.lesson_id}` : "#"}
                                                class={`flex items-center gap-3 px-4 py-3 border-b border-gray-100/80 last:border-b-0 transition-colors group/lesson ${lesson.is_preview ? 'hover:bg-white cursor-pointer' : 'opacity-75 cursor-default'}`}
                                                itemscope
                                                itemtype="https://schema.org/CreativeWork"
                                            >
                                                <div class={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium transition-colors ${lesson.is_preview ? 'bg-[#E85A4F]/10 text-[#E85A4F] group-hover/lesson:bg-[#E85A4F]/30 group-hover/lesson:text-white' : 'bg-gray-100 text-gray-400'}`}>
                                                    {!lesson.is_preview ? (
                                                        <img src="/svg/lock-course.svg" width={16} height={16} alt="" />
                                                    ) : (
                                                        <img src="/svg/player-play-lesson.svg" width={16} height={16}/>
                                                    )}
                                                </div>

                                                <div class="flex-1 min-w-0">
                                                    <p class="font-gsans font-medium text-gray-800 text-sm truncate" itemprop="name">
                                                        {lesson.lesson_title}
                                                    </p>
                                                </div>

                                                <div class="flex items-center gap-2 flex-shrink-0">
                                                    <Show when={lesson.is_preview}>
                                                        <span class="text-xs font-medium text-[#E85A4F] bg-[#E85A4F]/8 px-2 py-0.5 rounded-full border border-[#E85A4F]/20">
                                                            უფასო
                                                        </span>
                                                    </Show>
                                                    <span class="text-xs font-bold text-gray-800">
                                                        {formatDuration(lesson.video_duration)}
                                                    </span>
                                                </div>
                                                <meta itemprop="learningResourceType" content="Video" />
                                            </a>
                                        )}
                                    </For>
                                </div>
                            </Show>
                        </div>
                    )
                }}
            </For>
        </div>
    );
};