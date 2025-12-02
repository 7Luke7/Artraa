import { createAsync } from "@solidjs/router";
import { CourseDisplay } from "~/components/HeroSection";
import { Meta, Title } from "@solidjs/meta";
import { Show } from "solid-js";
import { get_landing_courses } from "./api/courses";

export const route = {
  preload: () => get_landing_courses()
};

export default function Landing() {
  const courses = createAsync(get_landing_courses, {deferStream: true})

  return (
    <>
      <Meta name="description" content="არტრა განათლება" />
      <Meta name="keywords" content="Artra, განათლება, არტრა" />
      <Title>Artra - განათლება</Title>
      <Show when={courses()?.mock_data.length}>
        <CourseDisplay courses={courses} />
      </Show>
    </>
  );
}
