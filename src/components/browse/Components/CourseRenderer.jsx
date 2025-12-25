import { For } from "solid-js";
import { SingleCourseRenderer } from "./SingleCourseRenderer";

export const CoursesRenderer = (props) => {
  return (
    <div class="grid grid-cols-1 gap-2">
      <For each={props.courses}>
        {(c) => {
          return (
            <SingleCourseRenderer
              c={c}
            ></SingleCourseRenderer>
          );
        }}
      </For>
    </div>
  );
};
