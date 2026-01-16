import { createSignal, Show, For } from "solid-js";

export const CourseBlocks = (props) => {
    const [expandedSections, setExpandedSections] = createSignal(new Set([0]));

    const toggleSection = (sectionIndex) => {
        setExpandedSections(prev => {
            const newSet = new Set(prev);
            if (newSet.has(sectionIndex)) {
                newSet.delete(sectionIndex);
            } else {
                newSet.add(sectionIndex);
            }
            return newSet;
        });
    };

    const formatDuration = (seconds) => {
        if (!seconds) return "0 წთ";
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours > 0) {
            return `${hours}სთ ${remainingMinutes}წთ`;
        }
        return `${minutes} წთ`;
    };

    return (
        <div
            itemscope
            itemtype="https://schema.org/ItemList"
        >
            <meta itemprop="numberOfItems" content={props.course.course_content?.length || 0} />

            <For each={props.course.course_content}>
                {(section, sectionIndex) => (
                    <div
                        class="border border-gray-200 overflow-hidden"
                        itemprop="itemListElement"
                        itemscope
                        itemtype="https://schema.org/ListItem"
                        aria-expanded={expandedSections().has(sectionIndex())}
                    >
                        <button
                            onClick={() => toggleSection(sectionIndex())}
                            class="flex items-center justify-between w-full p-2 md:p-4 text-left"
                            aria-label={`ნაწილი ${sectionIndex() + 1}: ${section.section_title}`}
                        >
                            <div class="flex-1 mr-4">
                                <div class="flex items-start">
                                    <div
                                        class="flex-shrink-0 bg-[#E85A4F] w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center mr-3 md:mr-4 text-white font-medium text-sm md:text-base"
                                        aria-hidden="true"
                                    >
                                        {sectionIndex() + 1}
                                    </div>

                                    <div>
                                        <h3
                                            class="font-gsans font-semibold text-gray-900 text-lg md:text-xl mb-1 md:mb-2"
                                            itemprop="name"
                                        >
                                            <span class="text-gray-600 font-medium">ნაწილი {sectionIndex() + 1}:</span> {section.section_title}
                                        </h3>

                                        <Show when={section.section_description}>
                                            <p class="font-gsans text-gray-600 text-sm md:text-base line-clamp-2">
                                                {section.section_description}
                                            </p>
                                        </Show>

                                        <div class="flex flex-wrap items-center gap-3 md:gap-4 mt-2 md:mt-3 text-sm text-gray-500">
                                            <span class="flex items-center">
                                                <img
                                                    src='/svg/book-2.svg'
                                                    aria-hidden='true'
                                                    width={16}
                                                    height={16}
                                                    loading="lazy"
                                                    class="mr-1"
                                                />
                                                {section.lessons?.length || 0} გაკვეთილი
                                            </span>
                                            <Show when={section.lessons?.some(l => l.video_duration)}>
                                                <span class="flex items-center">
                                                    <img
                                                        src="/svg/clock-black.svg"
                                                        class="w-4 h-4 mr-1"
                                                        aria-hidden="true"
                                                        loading="lazy"
                                                    />
                                                    {formatDuration(
                                                        section.lessons?.reduce((acc, lesson) => acc + (lesson.video_duration || 0), 0) || 0
                                                    )}
                                                </span>
                                            </Show>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div
                                class={`flex-shrink-0 transition-transform duration-300 ${expandedSections().has(sectionIndex()) ? 'rotate-180' : ''
                                    }`}
                                aria-hidden="true"
                            >
                                <img 
                                    src='/svg/dropdown.svg' 
                                    alt="გახსნა/დახურვა"
                                    loading="lazy"
                                />
                            </div>

                            <meta itemprop="position" content={sectionIndex() + 1} />
                        </button>

                        <Show when={expandedSections().has(sectionIndex())}>
                            <div
                                class="bg-gray-50 border-t border-gray-200"
                                role="region"
                            >
                                <div class="p-4 md:p-6 space-y-3">
                                    <For each={section.lessons}>
                                        {(lesson, lessonIndex) => (
                                            <a
                                                href={lesson.video_url || "#"}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                class="flex items-center justify-between p-3 md:p-4 border border-gray-200"
                                                itemscope
                                                itemtype="https://schema.org/CreativeWork"
                                            >
                                                <div class="flex items-center flex-1 min-w-0">
                                                    <div
                                                        class="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center mr-3 md:mr-4 text-sm font-medium text-gray-700 bg-gray-100"
                                                        aria-hidden="true"
                                                    >
                                                        {lessonIndex() + 1}
                                                    </div>

                                                    <div class="min-w-0 flex-1">
                                                        <h4
                                                            class="font-gsans font-medium text-gray-900 truncate"
                                                            itemprop="name"
                                                        >
                                                            {lesson.lesson_title}
                                                        </h4>

                                                        <Show when={lesson.lesson_description}>
                                                            <p
                                                                class="font-gsans text-gray-600 text-sm mt-1 line-clamp-2"
                                                                itemprop="description"
                                                            >
                                                                {lesson.lesson_description}
                                                            </p>
                                                        </Show>
                                                    </div>
                                                </div>

                                                <div class="flex items-center gap-3 md:gap-4 ml-4 flex-shrink-0">
                                                    {lesson.is_preview && (
                                                        <span
                                                            class="px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap"
                                                            style={{
                                                                color: "#E85A4F",
                                                                backgroundColor: "rgba(232, 90, 79, 0.1)",
                                                                border: "1px solid rgba(232, 90, 79, 0.2)"
                                                            }}
                                                        >
                                                            უფასო წვდომა
                                                        </span>
                                                    )}

                                                    <Show when={lesson.video_duration}>
                                                        <div class="flex items-center text-gray-500 text-sm whitespace-nowrap">
                                                            <img
                                                                src="/svg/clock-black.svg"
                                                                alt="გაკვეთილის ხანგრძლივობა"
                                                                class="w-4 h-4 mr-1"
                                                                aria-hidden="true"
                                                                loading="lazy"
                                                            />
                                                            {formatDuration(lesson.video_duration)}
                                                        </div>
                                                    </Show>

                                                    <div class="text-gray-400 rounded-full bg-[#E85A4F]/90 p-1 flex items-center justify-center">
                                                        {lesson.is_preview ? <img
                                                            src="/svg/player-play.svg"
                                                            alt="ვიდეოს გაშვება"
                                                            width={20}
                                                            height={20}
                                                            class="w-5 h-5"
                                                            loading="lazy"
                                                        /> : <img
                                                            src="/svg/lock-white.svg"
                                                            alt="ვიდეოს გაშვება"
                                                            width={20}
                                                            height={20}
                                                            class="w-5 h-5"
                                                            loading="lazy"
                                                        />}
                                                    </div>
                                                </div>

                                                <meta itemprop="learningResourceType" content="Video" />
                                            </a>
                                        )}
                                    </For>
                                </div>
                            </div>
                        </Show>
                    </div>
                )}
            </For>
        </div>
    );
};