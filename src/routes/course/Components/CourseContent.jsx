import { Show } from "solid-js";
import { EnrolledUI } from "./EnrolledUI";
import { NotEntrolledUI } from "./NotEnrolledUI";

export const CourseContent = (props) => {
    return <Show fallback={<NotEntrolledUI data={props.data()}></NotEntrolledUI>} when={props.data()?.course?.is_enrolled}>
        <EnrolledUI data={props.data()}></EnrolledUI>
    </Show>
}