import { Faq } from "./Faq"
import { BreadCrumbs } from "./BreadCrumbs"
import { CourseMain } from "./CourseMain"
import { Footer } from "~/components/Footer"
import { CourseBlocks } from "./CourseBlocks"

export const CourseDetailUI = (props) => {
    console.log(props.course)
    return (
        <>
            <article class="bg-gray-50 md:px-[56px] py-10" itemscope itemtype="https://schema.org/Course">
                <BreadCrumbs category_name={props.course.category_name} category_slug={props.course.category_slug} title={props.course.title} />
                <main class="relative flex gap-x-10 mb-20">
                    <div class="w-5/8">
                        <div class="bg-white rounded-xl px-4 py-2">
                            <h1
                                class="text-3xl md:text-4xl font-gsans font-bold text-gray-900 mb-3 inline-block"
                                itemprop="name"
                            >
                                {props.course.title}
                            </h1>

                            <p class="text-gray-700 mb-6 max-w-3xl" itemprop="description">
                                {props.course.description}
                            </p>
                        </div>
                        {/* <CourseBlocks course={props.course}></CourseBlocks> */}
                        <Faq />
                    </div>
                    <div class="w-3/8">
                        <div class="bg-white sticky top-[75px] rounded-xl">
                            <CourseMain course={props.course} />
                        </div>
                    </div>
                </main>
                <Footer></Footer>
            </article>

        </>
    )
}