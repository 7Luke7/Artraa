import { For } from "solid-js"
import { Lesson } from "./Lesson"

export const Lessons = (props) => {
    const {course, lessons} = props

    return <div class="bg-gray-50/50">
        <For each={lessons}>
            {(lesson, lessonIndex) => <Lesson lessonIndex={lessonIndex} course={course} lesson={lesson}></Lesson>}
        </For>
    </div>
}