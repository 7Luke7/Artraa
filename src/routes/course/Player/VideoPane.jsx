import { Show, createSignal, lazy, Suspense } from "solid-js"

const LazyPlayerReviewForm = lazy(() => import('./ReviewForm.jsx'))

export const VideoPane = (props) => {
    const [reviewOpen, setReviewOpen] = createSignal(false)

    return (
        <div class="max-w-4xl mx-auto px-4 py-6 space-y-6">
            {/* Video player */}
            <div class="relative w-full bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-200" style="aspect-ratio: 16/9">
                <Show
                    when={props.canWatch && props.lesson?.video_url}
                    fallback={<LockedOverlay course={props.course} lesson={props.lesson} />}
                >
                    {/* <iframe
                        src={props.lesson.video_url}
                        class="absolute inset-0 w-full h-full"
                        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                        allowfullscreen
                        title={props.lesson?.lesson_title}
                    /> */}
                </Show>
            </div>

            {/* Lesson info */}
            <Show when={props.lesson}>
                <div class="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-2">
                    <div class="flex items-start justify-between gap-4">
                        <h2 class="text-lg md:text-xl font-gsans font-bold text-gray-900 leading-tight">
                            {props.lesson.lesson_title}
                        </h2>
                        <Show when={props.lesson.is_preview && !props.course?.is_enrolled}>
                            <span class="shrink-0 text-xs font-bold text-[#E85A4F] bg-[#E85A4F]/10 px-3 py-1 rounded-full border border-[#E85A4F]/20">
                                უფასო გაკვეთილი
                            </span>
                        </Show>
                    </div>
                    <Show when={props.lesson.description}>
                        <p class="text-gray-500 font-gsans text-sm leading-relaxed">
                            {props.lesson.description}
                        </p>
                    </Show>
                </div>
            </Show>

            {/* Review / upsell section */}
            <Show
                when={props.course?.is_enrolled}
                fallback={
                    // Not enrolled — show buy CTA
                    <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm text-center">
                        <div class="w-10 h-10 rounded-xl bg-[#E85A4F]/10 flex items-center justify-center mx-auto mb-3">
                            <svg class="w-5 h-5 text-[#E85A4F]" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                            </svg>
                        </div>
                        <p class="text-gray-900 font-gsans font-bold mb-1">სრულ კურსზე წვდომა</p>
                        <p class="text-gray-500 font-gsans text-sm mb-5">
                            შეიძინეთ კურსი ყველა გაკვეთილზე, მასალებსა და სერტიფიკატზე წვდომისთვის
                        </p>
                        <a
                            href={`/course/${props.course?.slug}`}
                            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#E85A4F] text-white font-gsans font-bold text-sm hover:bg-[#D84A3F] transition-colors"
                        >
                            კურსის შეძენა — ₾{props.course?.price}
                        </a>
                    </div>
                }
            >
                {/* Enrolled — show review prompt */}
                <Suspense>
                    <Show when={reviewOpen()} fallback={
                        <div class="bg-white border border-gray-200 rounded-2xl px-5 py-4 shadow-sm flex items-center justify-between">
                            <div>
                                <p class="text-gray-900 font-gsans font-semibold text-sm">შეაფასეთ კურსი</p>
                                <p class="text-gray-400 font-gsans text-xs mt-0.5">გაუზიარეთ გამოცდილება სხვა მოსწავლეებს</p>
                            </div>
                            <button
                                onClick={() => setReviewOpen(true)}
                                class="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 text-sm font-gsans font-medium hover:border-[#E85A4F]/40 hover:text-[#E85A4F] transition-colors"
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
        <div class="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-1">
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0110 0v4" stroke-linecap="round"/>
            </svg>
        </div>
        <div>
            <p class="text-white font-gsans font-bold">გაკვეთილი დაბლოკილია</p>
            <p class="text-gray-400 font-gsans text-sm mt-1">შეიძინეთ კურსი ყველა გაკვეთილზე წვდომისათვის</p>
        </div>
        <a
            href={`/course/${props.course?.slug}`}
            class="px-5 py-2.5 rounded-xl bg-[#E85A4F] text-white font-gsans font-bold text-sm hover:bg-[#D84A3F] transition-colors"
        >
            კურსის შეძენა — ₾{props.course?.price}
        </a>
    </div>
)