import { createAsync } from "@solidjs/router"
import { Show } from "solid-js"
import { Title } from "@solidjs/meta"
import { A } from "@solidjs/router"
import { get_course_player } from "../api/course"
import { CoursePlayer } from "./Components/CoursePlayer"

/**
 * /course/[slug] — The in-app course player
 *
 * get_course_player should return:
 * {
 *   ok: boolean,
 *   error?: string,
 *   course: {
 *     title, slug, thumbnail_url,
 *     has_access: boolean,       // true if purchased OR lesson is free preview
 *     course_content: [{
 *       section_title,
 *       lessons: [{
 *         id, lesson_title, description,
 *         is_preview: boolean,
 *         video_url: string | null,   // signed Cloudflare Stream URL (null if no access)
 *         video_duration,
 *       }]
 *     }]
 *   }
 * }
 */
const CoursePlayerPage = (props) => {
    const data = createAsync(
        () => get_course_player(props.params.slug),
        { deferStream: true }
    )

    return (
        <Show
            when={data()?.ok}
            fallback={
                <>
                    <Title>Artra - კურსი ვერ მოიძებნა</Title>
                    <div class="min-h-screen flex items-center justify-center px-4 bg-gray-950">
                        <div class="text-center max-w-md">
                            <div class="w-16 h-16 rounded-2xl bg-[#E85A4F]/10 flex items-center justify-center mx-auto mb-6">
                                <img src="/svg/exclamation.svg" alt="" width={32} height={32} />
                            </div>
                            <h1 class="text-2xl font-gsans font-bold text-white mb-2">
                                კურსი ვერ მოიძებნა
                            </h1>
                            <p class="text-gray-400 font-gsans mb-8">
                                {data()?.error || "დაფიქსირდა შეცდომა"}
                            </p>
                            <A
                                href="/courses"
                                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E85A4F] text-white font-gsans font-medium text-sm hover:bg-[#D84A3F] transition-colors"
                            >
                                <img src="/svg/chevron-left.svg" width={16} height={16} alt="" />
                                კურსების სია
                            </A>
                        </div>
                    </div>
                </>
            }
        >
            <Title>{data()?.course?.title} - Artra Player</Title>
            <CoursePlayer data={data} />
        </Show>
    )
}

export default CoursePlayerPage