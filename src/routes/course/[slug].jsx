import { createAsync } from "@solidjs/router"
import { get_course_detail } from "../api/course"
import { CourseContent } from "./Components/CourseContent"

export const route = {
    preload: ({ params }) => get_course_detail(params.slug)
};

const Course = (props) => {
    const data = createAsync(() => get_course_detail(props.params.slug), { deferStream: true })
    return <Show when={data()?.ok} fallback={
            <div class="min-h-screen flex items-center justify-center">
                <div class="text-center">
                    <h1 class="text-2xl font-gsans font-bold mb-4">კურსი ვერ მოიძებნა</h1>
                    <p class="text-gray-600 mb-6">{data()?.error || "დაფიქსირდა შეცდომა"}</p>
                    <a href="/courses" class="font-gsans font-medium text-[#E85A4f]">
                        ← დაბრუნება კურსების სიაში
                    </a>
                </div>
            </div>
        }
        >
            <CourseContent data={data} />
    </Show>
}

export default Course