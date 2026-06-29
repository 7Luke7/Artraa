import { Header } from "~/components/Header"
import { CourseDetailUI } from "./CourseDetailUI"
import { Footer } from "~/components/Footer"
import { Meta, Title } from "@solidjs/meta"

export default ({data}) => {
    const course = data.course
    const structuredData = data.structuredData
    
    const metaTitle = `${course.title} - Artra`;
    const metaDescription = course.description.slice(0, 160);
    const metaImage = course.thumbnail_url || `${import.meta.env.VITE_URL}/og-image.jpg`;
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
            <div class="min-h-screen flex flex-col bg-gray-50">
            <div class="w-full lg:w-12/12 xl:w-11/12 2xl:w-10/12 px-2 sm:px-4 md:px-6 mx-auto flex-1">
                <Header />
                <nav class="flex items-center gap-2 text-sm text-gray-500 font-gsans pt-4" aria-label="breadcrumb">
                    <a href="/courses" class="hover:text-[#E85A4F] transition-colors">კურსები</a>
                    <span class="text-gray-300">/</span>
                    <a href={`/courses?category=${course.category_slug}`} class="hover:text-[#E85A4F] transition-colors">
                        {course.category_name}
                    </a>
                    <span class="text-gray-300">/</span>
                    <span class="text-gray-800 font-medium truncate max-w-[200px]">{course.title}</span>
                </nav>
                <CourseDetailUI course={course} />
            </div>
            <Footer />
        </div>
    </>
}