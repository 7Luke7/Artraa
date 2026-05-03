import { Show } from "solid-js"
import { A, useSubmission } from "@solidjs/router"
import { initiate_purchase } from "~/routes/api/payment/course-payment"

export const CourseMain = (props) => {
    const { course } = props
    const submission = useSubmission(initiate_purchase)
    
    return (
        <div class="flex flex-col">
            <div class="relative">
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
                <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                {course.discount > 0 && (
                    <div class="absolute top-3 left-3 bg-[#E85A4F] text-white text-xs font-bold px-2.5 py-1 rounded-full">
                        -{course.discount}% ფასდაკლება
                    </div>
                )}
            </div>

            <div class="p-5">
                <div
                    class="mb-5"
                    itemprop="offers"
                    itemscope
                    itemtype="https://schema.org/Offer"
                >
                    <div class="flex items-baseline gap-3 mb-1">
                        <span class="text-3xl font-bold text-gray-900" itemprop="price" content={course.price}>
                            ₾{course.price}
                        </span>
                        {course.discount > 0 && (
                            <span class="text-base text-gray-400 line-through">₾{course.original_price}</span>
                        )}
                    </div>
                    <p class="text-xs text-gray-500 font-gsans">სამუდამო წვდომა • ყველა მასალა</p>
                    <meta itemprop="priceCurrency" content="GEL" />
                    <meta itemprop="availability" content="https://schema.org/InStock" />
                </div>
                <Show
                    when={!course.is_enrolled}
                    fallback={
                        <A
                            href={`/course/${course.slug}`}
                            class="block w-full py-3.5 px-4 text-base font-bold rounded-xl text-white bg-green-500 hover:bg-green-600 shadow-sm transition-all duration-200 text-center font-gsans mb-3"
                        >
                            ✓ კურსზე გადასვლა
                        </A>
                    }
                >
                    <form method="POST" action={initiate_purchase}>
                        <button
                            type="submit"
                            disabled={submission.pending}
                            class="w-full py-3.5 px-4 text-base font-bold rounded-xl text-white bg-[#E85A4F] hover:bg-[#D84A3F] shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98] mb-3 font-gsans disabled:opacity-70 disabled:cursor-not-allowed"
                            aria-label={`შეიძინეთ კურსი: ${course.title} ფასად ₾${course.price}`}
                        >
                            <Show when={submission.pending} fallback="კურსის შეძენა">
                                <span class="flex items-center justify-center gap-2">
                                    <svg class="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    გადამისამართება...
                                </span>
                            </Show>
                        </button>
                    </form>
                </Show>

                <Show when={course.preview_lesson_slug || course.has_preview}>
                    <A
                        href={`/course/${course.slug}`}
                        class="block w-full py-3 px-4 text-sm font-medium rounded-xl text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 font-gsans mb-5 text-center"
                    >
                        სცადე უფასოდ
                    </A>
                </Show>

                <div class="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100">
                    {[
                        { icon: "/svg/clock-black.svg", label: "ხანგრძლივობა", value: course.durationHours, color: "bg-blue-50" },
                        { icon: "/svg/book.svg", label: "გაკვეთილები", value: course.total_lessons, color: "bg-green-50" },
                        { icon: "/svg/users-group.svg", label: "მსმენელები", value: course.enrollment_count, color: "bg-purple-50" },
                        { icon: "/svg/star-outline.svg", label: "რეიტინგი", value: `${course.average_rating || 0} (${course.review_count || 0})`, color: "bg-yellow-50" },
                    ].map(stat => (
                        <div class="flex items-center gap-2.5 text-sm">
                            <div class={`w-8 h-8 rounded-lg ${stat.color} flex items-center justify-center flex-shrink-0`}>
                                <img src={stat.icon} alt="" />
                            </div>
                            <div>
                                <div class="text-gray-400 text-xs">{stat.label}</div>
                                <div class="font-bold text-gray-800 font-gsans">{stat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-center gap-1.5">
                    <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span class="text-[11px] text-gray-400 font-gsans">უსაფრთხო გადახდა · საქართველოს ბანკი</span>
                </div>
            </div>
        </div>
    )
}