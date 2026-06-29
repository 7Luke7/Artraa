import { Show } from "solid-js"
import { OverviewSidebarComponent } from "./Components/CourseOverview/OverviewSidebarComponent"
import { Sections } from "./Components/Sidebar/Sections"

export const LessonSidebar = (props) => {
    const completedCount = () =>
        props.course?.course_content?.reduce((acc, s) =>
            acc + (s.lessons?.filter(l => l.completed)?.length || 0), 0) || 0

    const progress = () => Math.round((completedCount() / props.course.total_lessons) * 100)

    return (
        <div class="flex flex-col h-full" style="width: 304px">
            <div class="px-4 py-4 border-b border-gray-100 shrink-0 bg-white">
                <div class="flex items-center justify-between mb-2">
                    <p class="text-xs font-gsans font-medium text-gray-500">
                        პროგრესი
                    </p>
                    <p class="text-xs font-gsans text-gray-400">
                        {completedCount()} / {props.course.total_lessons}
                    </p>
                </div>
                <div class="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                        class="h-full bg-[#E85A4F] rounded-full transition-all duration-500"
                        style={{ width: `${progress() || 0}%` }}
                    />
                </div>
            </div>
            <div class="flex-1 overflow-y-auto">
                <Show when={!props.course?.isEnrolled}>
                    <OverviewSidebarComponent course={props.course}></OverviewSidebarComponent>                
                </Show>
                <Sections course={props.course}></Sections>
            </div>
        </div>
    )
}