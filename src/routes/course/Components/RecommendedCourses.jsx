import { createResource, For } from "solid-js"
import { CourseCard } from "~/components/CourseCard"
import { recommended_courses } from "~/routes/api/course"

export default (props) => {    
    const [recommendedCourses, {mutate, refetch}] = createResource(props.data, recommended_courses)
    return <>
        <ul class="grid gap-8 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
            <For each={recommendedCourses()}>
                {(course, index) => (
                    <li
                        key={`course-${index()}`}
                        aria-label={`რეკომენდირებული კურსი ${index() + 1}`}
                    >
                        <CourseCard course={course} />
                    </li>
                )}
            </For>
        </ul>
    </>
}