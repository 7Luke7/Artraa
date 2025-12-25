import { CourseDetailUI } from "./CourseDetailUI";
import { Meta, Title } from "@solidjs/meta";
import { Header } from "~/components/Header";

export const CourseContent = (props) => {
    const data = props.data();

    const course = data.course;
    const structuredData = data.structuredData;

    console.log(data.structuredData)
    const metaTitle = `${course.title} - Artra`;
    const metaDescription = course.description.slice(0, 160);
    const metaImage =
        course.thumbnail_url || `${import.meta.env.VITE_URL}/og-image.jpg`;
    const courseUrl = `${import.meta.env.VITE_URL}/courses/${course.slug}`;

    return <>
        <Title>{metaTitle}</Title>
        <Meta name="description" content={metaDescription} />
        <Meta name="keywords" content={`${course.title}, ონლაინ კურსი, განათლება`} />
        <Meta property="og:title" content={metaTitle} />
        <Meta property="og:description" content={metaDescription} />
        <Meta property="og:image" content={metaImage} />
        <Meta property="og:url" content={courseUrl} />
        <script type="application/ld+json" innerHTML={structuredData} />
        <Header></Header>
        <CourseDetailUI course={course}></CourseDetailUI>
    </>
}