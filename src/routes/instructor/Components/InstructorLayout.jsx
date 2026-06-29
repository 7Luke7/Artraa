import { Show } from "solid-js"

export const InstructorLayout = ({ instructor, setActiveTab, activeTab }) => {
    return <>
        <div class="flex flex-col sm:flex-row gap-5 sm:mt-14 items-start sm:items-end">
            <img
                src={instructor.avatar}
                onError={(e) => e.currentTarget.src = '/default_profile.png'}
                alt={instructor.name}
                class="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-xl"
                width={144}
                height={144}
                loading="lazy"
            />

            <div class="flex-1 pb-2">
                <div class="flex flex-wrap items-start">
                    <div>
                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                            {instructor.name}
                        </h1>
                        <p class="text-sm text-gray-500 mt-1">{instructor.headline}</p>
                        <span class="inline-block mt-2 text-xs font-medium text-[#E85A4F] bg-[#E85A4F]/10 rounded-full px-3 py-0.5">
                            {instructor.specialization}
                        </span>
                    </div>

                    <div class="flex items-center gap-2 flex-wrap">
                        <Show when={instructor.social_links['linkedin']}>
                            <a
                                href={instructor.social_links['linkedin']}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="linkedin"
                                class="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#E85A4F] hover:text-white text-gray-600 flex items-center justify-center transition-colors duration-150"
                            >
                                <img src="/svg/linkedin.svg" width={16} height={16} alt="" />
                            </a>
                        </Show>
                        <Show when={instructor.social_links['github']}>
                            <a
                                href={instructor.social_links['github']}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="github"
                                class="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#E85A4F] hover:text-white text-gray-600 flex items-center justify-center transition-colors duration-150"
                            >
                                <img src="/svg/github.svg" width={16} height={16} alt="" />
                            </a>
                        </Show>
                        <Show when={instructor.social_links['facebook']}>
                            <a
                                href={instructor.social_links['facebook']}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="facebook"
                                class="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#E85A4F] hover:text-white text-gray-600 flex items-center justify-center transition-colors duration-150"
                            >
                                <img src="/svg/facebook.svg" width={16} height={16} alt="" />
                            </a>
                        </Show>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex gap-4 mt-6">
            {[
                {
                    icon: (
                        <img src='/svg/users-group.svg' width={16} height={16} />
                    ),
                    label: "მოსწავლე",
                    value: instructor.total_students,
                    color: "text-[#E85A4F]",
                },
                {
                    icon: (
                        <img src='/svg/courses.svg' width={16} height={16} />
                    ),
                    label: "კურსი",
                    value: instructor.courses?.course_count || 0,
                    color: "text-blue-500",
                }
            ].map((stat) => (
                <div class="flex items-center gap-1.5">
                    <span class={stat.color}>{stat.icon}</span>
                    <span class="text-sm font-semibold text-gray-800">{stat.value}</span>
                    <span class="text-sm text-gray-400">{stat.label}</span>
                </div>
            ))}
        </div>
        <div class="mt-8 flex gap-1 border-b border-gray-200">
            {[
                { id: "about", label: "ჩემს შესახებ" },
                {
                    id: "courses",
                    label: `კურსები (${instructor.courses?.course_count || 0})`,
                },
            ].map((tab) => (
                <button
                    onClick={() => setActiveTab(tab.id)}
                    class={`px-5 py-2.5 text-sm font-semibold transition-all duration-150 border-b-2 -mb-px ${activeTab() === tab.id
                        ? "border-[#E85A4F] text-[#E85A4F]"
                        : "border-transparent text-gray-500 hover:text-gray-800"
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    </>
}