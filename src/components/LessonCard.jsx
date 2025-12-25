import { A } from "@solidjs/router"

export const LessonCard = ({lesson}) => {
    return <div class="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow overflow-hidden w-full flex flex-col">
        <div class="h-2 bg-gradient-to-r from-[#E85A4F] to-orange-400 flex-shrink-0"></div>

        <div class="p-6 flex-1 flex flex-col">
            <div class="flex items-start mb-4 flex-shrink-0">
                <div class="flex items-start space-x-4 w-full">
                    <img src={lesson.icon} width={56} height={56} alt={lesson.title} />
                    <div class="flex-1 min-w-0">
                        <span class="text-xs font-gsans font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded inline-block">
                            {lesson.category}
                        </span>
                        <h3 class="text-lg font-gsans font-bold text-gray-800 mt-1 truncate">{lesson.title}</h3>
                    </div>
                </div>
            </div>

            <p class="text-gray-600 text-sm mb-6 line-clamp-3 flex-1">{lesson.description}</p>

            <div class="mb-4 flex-shrink-0">
                <div class="flex justify-between text-sm mb-2">
                    <span class="text-gray-600">პროგრესი</span>
                    <span class="font-gsans font-medium text-gray-800">{lesson.progress}%</span>
                </div>
                <div class="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-gradient-to-r bg-orange-300 to-orange-600 rounded-full"
                        style={{ width: `${lesson.progress}%` }}
                    ></div>
                </div>
            </div>

            <div class="flex flex-col text-sm text-gray-500 pt-4 border-t border-gray-100 space-y-4 flex-shrink-0">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-x-2">
                        <img src="/svg/book.svg" width={20} height={20} />
                        <span class="font-gsans font-medium whitespace-nowrap">{lesson.lessons} გაკვეთილი</span>
                    </div>
                    <div class="flex items-center gap-x-2">
                        <img src="/svg/clock.svg" width={20} height={20} />
                        <span class="font-gsans font-medium whitespace-nowrap">{lesson.duration}</span>
                    </div>
                </div>

                <A
                    href={`/dashboard/course/${lesson.id}`}
                    class="w-full py-3 px-4 text-[15px] font-gsans font-medium rounded-md text-white bg-[#E98074] hover:bg-[#E85A4F] duration-200 ease-in focus:outline-none cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed text-center"
                >
                    {lesson.progress === 100 ? 'გადახედვა' : 'გაგრძელება'}
                </A>
            </div>
        </div>
    </div>
}