import { Show } from "solid-js"
import { useSubmission } from "@solidjs/router"
import { initiate_purchase } from "~/routes/api/payment/course-payment"

export const CourseMain = (props) => {
    const { course } = props
    const submission = useSubmission(initiate_purchase)

    return (
        <div class="flex flex-col">
            <div class="relative overflow-hidden">
                <img
                    src={course.thumbnail_url || "https://placehold.co/800x450"}
                    srcSet={`
                        ${course.thumbnail_url}?w=300 300w,
                        ${course.thumbnail_url}?w=600 600w,
                        ${course.thumbnail_url}?w=800 800w
                    `}
                    sizes="(max-width: 1024px) 50vw, 400px"
                    alt={`${course.title} - სასწავლო კურსი`}
                    class="w-full aspect-video object-cover"
                    itemprop="image"
                    loading="lazy"
                />
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {course.discount && (
                    <div class="absolute top-3 left-3 bg-[#E85A4F] text-white text-[11px] font-bold px-2.5 py-1 rounded-lg tracking-wide">
                        -{course.discount}% ფასდაკლება
                    </div>
                )}

                <div class="absolute bottom-0 left-0 right-0 px-5 pb-4 pt-8">
                    <div
                        itemprop="offers"
                        itemscope
                        itemtype="https://schema.org/Offer"
                        class="flex items-end gap-2.5"
                    >
                        <span
                            class="text-4xl font-bold text-white leading-none tracking-tight"
                            itemprop="price"
                            content={course.price}
                        >
                            ₾{course.price}
                        </span>
                        {course.discount > 0 && (
                            <span class="text-sm text-white/50 line-through mb-1">
                                ₾{course.original_price}
                            </span>
                        )}
                        <meta itemprop="priceCurrency" content="GEL" />
                        <meta itemprop="availability" content="https://schema.org/InStock" />
                    </div>
                    <p class="text-white/60 text-xs font-gsans mt-0.5">სამუდამო წვდომა · ყველა მასალა</p>
                </div>
            </div>

            <div class="p-5 space-y-4">

                <div class="space-y-2.5">
                    <form method="POST" action={initiate_purchase.with(course.slug)}>
                        <button
                            type="submit"
                            disabled={submission.pending}
                            class="w-full py-3.5 px-4 rounded-xl text-white font-gsans font-bold text-sm bg-[#E85A4F] hover:bg-[#D84A3F] shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            aria-label={`შეიძინეთ კურსი: ${course.title} ფასად ₾${course.price}`}
                        >
                            <Show
                                when={submission.pending}
                                fallback={
                                    <>
                                        <img src='/svg/cart.svg' width={15} height={15} alt="" />                         
                                        კურსის შეძენა
                                    </>
                                }
                            >
                                <div class="relative w-10 h-10">
                                    <div class="absolute inset-0 rounded-full border-2 border-gray-200" />
                                    <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E85A4F] animate-spin" />
                                </div>
                                გადამისამართება...
                            </Show>
                        </button>
                    </form>

                    <Show when={course.preview_lesson_id}>
                        <a
                            href={`/course/${course.slug}?ln=${course.preview_lesson_id}`}
                            class="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl text-gray-600 font-gsans font-medium text-sm border border-gray-200 hover:border-[#E85A4F]/40 hover:text-[#E85A4F] hover:bg-[#E85A4F]/5 transition-all duration-200"
                        >
                            <img src='/svg/player-play-outline.svg' width={15} height={15} alt="" />
                            უფასო გაკვეთილი
                        </a>
                    </Show>
                </div>

                <div class="border-t border-gray-100" />

                <div class="grid grid-cols-2 gap-2">
                    <StatItem
                        icon={
                            <img src='/svg/clock.svg' width={16} height={16} alt="" />
                        }
                        label="ხანგრძლივობა"
                        value={course.total_duration}
                        bg="bg-[#E85A4F]/8"
                        iconBg="bg-[#E85A4F]/10"
                    />
                    <StatItem
                        icon={
                            <img src='/svg/book-2-branded.svg' width={16} height={16} alt="" />
                        }
                        label="გაკვეთილები"
                        value={course.total_lessons}
                        bg="bg-[#E85A4F]/8"
                        iconBg="bg-[#E85A4F]/10"
                    />
                    <StatItem
                        icon={
                            <img src='/svg/users-group-branded.svg' width={16} height={16} alt="" />
                        }
                        label="მსმენელები"
                        value={course.enrollment_count}
                        bg="bg-[#E85A4F]/8"
                        iconBg="bg-[#E85A4F]/10"
                    />
                    <StatItem
                        icon={
                            <img src='/svg/star-outline-orange.svg' width={16} height={16} alt="" />
                        }
                        label="რეიტინგი"
                        value={`${course.average_rating || 0} (${course.review_count || 0})`}
                        bg="bg-[#E85A4F]/8"
                        iconBg="bg-[#E85A4F]/10"
                    />
                </div>

                <div class="flex items-center justify-center gap-2 py-3 px-4 bg-gray-50 rounded-xl border border-gray-100">
                    <img src="/svg/lock-course.svg" width={14} height={14} alt="" />
                    <span class="text-[11px] text-gray-400 font-gsans">
                        უსაფრთხო გადახდა · საქართველოს ბანკი
                    </span>
                </div>
            </div>
        </div>
    )
}

const StatItem = (props) => (
    <div class={`flex items-center gap-2.5 p-2.5 rounded-xl ${props.bg}`}>
        <div class={`shrink-0 w-8 h-8 rounded-lg ${props.iconBg} flex items-center justify-center`}>
            {props.icon}
        </div>
        <div class="min-w-0">
            <p class="text-[10px] text-gray-400 font-gsans leading-none mb-0.5">{props.label}</p>
            <p class="text-sm font-bold text-gray-800 font-gsans truncate">{props.value}</p>
        </div>
    </div>
)