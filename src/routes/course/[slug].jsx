import { createAsync } from "@solidjs/router"
import { CourseContent } from "./Components/CourseContent"
import { lazy, Show } from "solid-js"
import { get_course_detail } from "../api/course"
import { RenderWebsocketRoutes } from "~/components/RenderWebsocketRoutes"

const NotFound = lazy(() => import("./Components/NotFound.jsx"))

const Course = (props) => {
    const data = createAsync(() => get_course_detail(props.params.slug, props.location.search), { deferStream: true })

    return <RenderWebsocketRoutes>
        <Show
            when={data()?.ok}
            fallback={
                <NotFound />
            }
        >
            <CourseContent data={data} />
        </Show>     
    </RenderWebsocketRoutes>
}

export default Course