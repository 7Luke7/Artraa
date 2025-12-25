import { createSignal, Show } from "solid-js"

export const CourseBlocks = (props) => {
    const [displayBlock, setDisplayBlock] = createSignal([0])

    return (
        <div
            itemscope
            itemtype="https://schema.org/ItemList"
        >
            {props.course.sections.map((section, sectionIndex) => (
                <div
                    key={section.id}
                    itemprop="itemListElement"
                    itemscope
                    itemtype="https://schema.org/ListItem"
                >
                    <button 
                    onClick={() => setDisplayBlock(prev => prev.includes(sectionIndex) ? prev.filter(prev => prev !== sectionIndex) : [...prev, sectionIndex])}
                    class="flex py-4 px-4 items-center justify-between mb-4 w-full">
                        <div
                            class="font-gsans font-medium text-lg text-gray-900 relative"
                            itemprop="name"
                        >
                            ნაწილი {sectionIndex + 1}: {section.title}
                            <span class="absolute left-0 -bottom-1 w-12 h-[2px] bg-[#E85A4F]" />
                        </div>
                        <meta itemprop="position" content={sectionIndex + 1} />
                        <img src='/svg/dropdown.svg' />
                    </button>

                    <Show when={displayBlock().includes(sectionIndex)}>
                        <div class="space-y-2 w-full">
                            {section.lessons.map((lesson, lessonIndex) => (
                                <div
                                    key={lesson.id}
                                    class="flex items-center justify-between py-3 px-2 rounded-md hover:bg-gray-50 transition w-full"
                                >
                                    <div class="flex items-center">
                                        <div
                                            class="w-7 h-7 rounded-full flex items-center justify-center mr-3 text-sm font-gsans font-medium text-white flex-shrink-0"
                                            style={{ "background-color": "#E85A4F" }}
                                        >
                                            {lessonIndex + 1}
                                        </div>

                                        <span class="text-gray-800">
                                            {lesson.title}
                                        </span>

                                        {lesson.is_preview && (
                                            <span
                                                class="ml-3 text-xs font-gsans font-medium px-2 py-1 rounded-full"
                                                style={{
                                                    color: "#E85A4F",
                                                    "background-color": "rgba(232, 90, 79, 0.12)"
                                                }}
                                            >
                                                უფასო
                                            </span>
                                        )}
                                    </div>

                                    <div class="text-gray-500 text-sm whitespace-nowrap">
                                        {Math.floor(lesson.video_duration / 60)} წთ
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Show>
                </div>
            ))}
        </div>
    )
}
