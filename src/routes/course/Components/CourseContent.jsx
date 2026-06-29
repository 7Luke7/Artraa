import { lazy, Show, Suspense } from "solid-js";

const LazyNotEntrolledUI = lazy(() => import("./NotEnrolledUI"))
const LazyCoursePlayer = lazy(() => import("../Player/CoursePlayer"))

export const CourseContent = (props) => {
    return <Suspense>
        <Show fallback={<LazyNotEntrolledUI data={props.data()} />} when={
            props.data()?.course?.is_enrolled
            ||
            props.data()?.course?.preview_access
        }>
            <LazyCoursePlayer data={props.data()} />
        </Show>
    </Suspense>
}