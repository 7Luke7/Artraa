import { Show, createSignal, lazy, Suspense } from "solid-js"
import { A } from "@solidjs/router"

const LazyPlayerReviewForm = lazy(() => import('./ReviewForm.jsx'))

/**
 * VideoPane
 * Handles:
 * - Cloudflare Stream embed (or any signed HLS url)
 * - Locked paywall overlay for non-purchased, non-preview lessons
 * - Lesson title, description
 * - Review form (only shown to purchased users)
 */
export const VideoPane = (props) => {
    const [reviewOpen, setReviewOpen] = createSignal(false)

    return (
        <div class="max-w-5xl mx-auto px-4 py-6 space-y-6">
            {/* Video player */}
            <div class="relative w-full bg-black rounded-2xl overflow-hidden shadow-2xl" style="aspect-ratio: 16/9">
                <Show
                    when={props.canWatch && props.lesson?.video_url}
                    fallback={<LockedOverlay course={props.course} lesson={props.lesson} />}
                >
                    {/*
                     * Cloudflare Stream embed.
                     * video_url should be the signed iframe src from Cloudflare.
                     *
                     * For signed URLs your server should do:
                     *   const token = await generateSignedToken(videoId, { exp: Date.now()/1000 + 3600 })
                     *   return `https://iframe.cloudflarestream.com/${token}`
                     *
                     * For unsigned (preview) lessons use the public iframe URL:
                     *   `https://iframe.cloudflarestream.com/${videoId}`
                     */}
                    <iframe
                        src={props.lesson.video_url}
                        class="absolute inset-0 w-full h-full"
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowfullscreen
                        title={props.lesson?.lesson_title}
                    />
                </Show>
            </div>

            {/* Lesson info */}
            <Show when={props.lesson}>
                <div class="space-y-3">
                    <div class="flex items-start justify-between gap-4">
                        <h2 class="text-xl md:text-2xl font-gsans font-bold text-white leading-tight">
                            {props.lesson.lesson_title}
                        </h2>
                        <Show when={props.lesson.is_preview && !props.course?.has_access}>
                            <span class="shrink-0 text-xs font-bold text-[#E85A4F] bg-[#E85A4F]/10 px-3 py-1 rounded-full border border-[#E85A4F]/30">
                                უფასო გაკვეთილი
                            </span>
                        </Show>
                    </div>

                    <Show when={props.lesson.description}>
                        <p class="text-gray-400 font-gsans text-sm md:text-base leading-relaxed">
                            {props.lesson.description}
                        </p>
                    </Show>
                </div>
            </Show>

            {/* Divider */}
            <div class="border-t border-gray-800" />

            {/* Review section — only for purchased users */}
            <Show
                when={props.course?.has_access}
                fallback={
                    <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 text-center">
                        <p class="text-gray-300 font-gsans font-semibold mb-1">სრული კურსი</p>
                        <p class="text-gray-500 font-gsans text-sm mb-4">
                            ყველა გაკვეთილზე წვდომა + შეფასების დამატება
                        </p>
                        <A
                            href={`/courses/${props.course?.slug}`}
                            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E85A4F] text-white font-gsans font-bold text-sm hover:bg-[#D84A3F] transition-colors"
                        >
                            კურსის შეძენა
                        </A>
                    </div>
                }
            >
                <Suspense>
                    <Show when={reviewOpen()} fallback={
                        <div class="flex items-center justify-between bg-gray-900 border border-gray-800 rounded-2xl px-6 py-4">
                            <div>
                                <p class="text-gray-200 font-gsans font-semibold text-sm">შეაფასეთ კურსი</p>
                                <p class="text-gray-500 font-gsans text-xs mt-0.5">გაუზიარეთ გამოცდილება სხვა მოსწავლეებს</p>
                            </div>
                            <button
                                onClick={() => setReviewOpen(true)}
                                class="px-4 py-2 rounded-xl border border-gray-700 text-gray-300 text-sm font-gsans font-medium hover:border-gray-500 hover:text-white transition-colors"
                            >
                                დაწერე შეფასება
                            </button>
                        </div>
                    }>
                        <LazyPlayerReviewForm
                            courseSlug={props.course?.slug}
                            onClose={() => setReviewOpen(false)}
                        />
                    </Show>
                </Suspense>
            </Show>
        </div>
    )
}

const LockedOverlay = (props) => (
    <div class="absolute inset-0 flex flex-col items-center justify-center bg-gray-900 gap-4 text-center px-6">
        <div class="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-2">
            <svg width={28} height={28} viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke-linecap="round"/>
            </svg>
        </div>
        <div>
            <p class="text-white font-gsans font-bold text-lg">გაკვეთილი დაბლოკილია</p>
            <p class="text-gray-400 font-gsans text-sm mt-1">შეიძინეთ კურსი ყველა გაკვეთილზე წვდომისათვის</p>
        </div>
        <A
            href={`/courses/${props.course?.slug}`}
            class="px-6 py-2.5 rounded-xl bg-[#E85A4F] text-white font-gsans font-bold text-sm hover:bg-[#D84A3F] transition-colors"
        >
            კურსის შეძენა ₾{props.course?.price}
        </A>
    </div>
)