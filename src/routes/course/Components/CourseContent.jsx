import { CourseDetailUI } from "./CourseDetailUI";
import { Meta, Title } from "@solidjs/meta";
import { Footer } from "~/components/Footer";
import { Header } from "~/components/Header";

export const CourseContent = (props) => {
    const data = props.data();

    const course = data.course;
    const structuredData = data.structuredData;

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
        <div class="pt-10 w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto">
            <Header></Header>
            <CourseDetailUI course={course}></CourseDetailUI>
        </div>
        <Footer></Footer>
    </>
}