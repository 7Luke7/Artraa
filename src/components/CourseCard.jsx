import { Show } from "solid-js"
import { StarRow } from "./StarRow"

export const CourseCard = (props) => {
    const { course } = props

    return (
        <article
            id={course.id}
            class="relative overflow-hidden rounded-xl border border-gray-200 bg-white flex flex-col"
            itemScope
            itemType="https://schema.org/Course"
            tabindex="0"
            role="article"
            aria-labelledby={`${course.id}-title`}
            aria-describedby={`${course.id}-rating`}
        >
            <Show when={course.discount}>
                <div
                    class="absolute top-3 left-3 z-10"
                    role="status"
                    aria-label={`${course.discount} პროცენტიანი ფასდაკლება`}
                >
                    <span
                        class="inline-block rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1 text-xs font-gsans font-medium text-white"
                        itemProp="offers"
                        itemScope
                        itemType="https://schema.org/Offer"
                    >
                        <span itemProp="price" class="font-bold font-gsans">₾{course.price}</span>
                        <span class="ml-1 sr-only">ფასდაკლება</span>
                        <span class="ml-1 font-gsans font-bold" aria-hidden="true">({course.discount}%)</span>
                        <meta itemProp="priceCurrency" content="GEL" />
                        <meta itemProp="availability" content="https://schema.org/InStock" />
                    </span>
                </div>
            </Show>

            <figure class="relative h-64 w-full overflow-hidden bg-gray-100 flex-shrink-0">
                <a
                    href={`/course/${course.slug}`}
                    target="_self"
                    class="block h-full w-full"
                    aria-label={`${course.title} - გადადით კურსის დეტალურ გვერდზე`}
                    tabindex="-1"
                >
                    <img
                        alt={course.title}
                        class="h-full w-full object-cover"
                        loading="lazy"
                        src={course.thumbnail_url}
                        srcSet={`
                            ${course.thumbnail_url}?w=200 200w,
                            ${course.thumbnail_url}?w=400 400w,
                            ${course.thumbnail_url}?w=600 600w,
                            ${course.thumbnail_url}?w=800 800w
                        `}
                        sizes="(max-width: 640px) 100vw,
                            (max-width: 768px) 50vw,
                            (max-width: 1024px) 33vw,
                            400px"
                        itemProp="image"
                    />
                </a>
            </figure>

            <div class="p-5 flex-grow flex flex-col">
                <div class="flex mb-2.5 items-center gap-2 flex-wrap">
                    <Show when={props.course.category_name}>
                        <span class="px-3 py-1 rounded-full bg-[#E85A4F]/10 text-[#E85A4F] text-xs font-gsans font-bold border border-[#E85A4F]/20">
                            {props.course.category_name}
                        </span>
                    </Show>
                    <span class="px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-200 font-bold text-xs font-gsans">
                        {props.course.level}
                    </span>
                </div>


                <div class="mb-3 flex items-start gap-2 min-h-[40px]">
                    <div class="flex-shrink-0">
                        <img
                            src={course.avatar}
                            onError={(e) => e.currentTarget.src = '/default_profile.png'}
                            alt={`${course.instructor_name} - ინსტრუქტორი`}
                            class="w-8 h-8 rounded-full object-cover"
                            loading="lazy"
                            width={32}
                            height={32}
                        />
                    </div>
                    <div class="flex flex-col min-w-0 flex-1">
                        <a
                            href={`/instructor/${course.instructor_slug}`}
                            class="text-sm font-gsans font-medium text-gray-700 hover:text-[#E85A4F] truncate"
                            aria-label={`ინსტრუქტორი: ${course.instructor_name}`}
                        >
                            {course.instructor_name}
                        </a>
                        <Show when={course.instructor_headline}>
                            <span
                                class="text-xs text-gray-500 truncate mt-0.5"
                                aria-hidden="true"
                            >
                                {course.instructor_headline}
                            </span>
                        </Show>
                    </div>
                </div>

                <h2 class="min-h-[50px]">
                    <a
                        href={`/course/${course.slug}`}
                        id={`${course.id}-title`}
                        class="text-lg font-gsans font-bold leading-tight text-gray-900 hover:text-[#E85A4F] line-clamp-2"
                        itemProp="name"
                        tabindex="-1"
                    >
                        {course.title}
                    </a>
                </h2>

                <p
                    class="min-h-[50px] text-gray-600 font-gsans font-normal text-sm mb-4 line-clamp-3 flex-grow-0"
                    itemProp="description"
                >
                    {course.description}
                </p>

                <div class="mb-4 flex flex-wrap items-center gap-3 text-sm text-gray-600 min-h-[24px]">
                    <div class="flex items-center gap-1">
                        <img loading="lazy" src='/svg/clock-black.svg' width={16} height={16} alt='' aria-hidden='true' />
                        <span>{course.total_duration}</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <img loading="lazy" src='/svg/book-2.svg' width={16} height={16} alt='' aria-hidden='true' />
                        <span>{course.total_lessons} გაკვეთილი</span>
                    </div>
                    <div class="flex items-center gap-1">
                        <img loading="lazy" src='/svg/users-group.svg' width={16} height={16} alt='' aria-hidden='true' />
                        <span>{course.enrollment_count} მოსწავლე</span>
                    </div>
                </div>

                <div
                    id={`${course.id}-rating`}
                    class="mb-4 flex items-center gap-2 min-h-[28px]"
                    itemProp="aggregateRating"
                    itemScope
                    itemType="https://schema.org/AggregateRating"
                >
                    <div
                        class="flex items-center"
                        aria-hidden="true"
                        role="img"
                        aria-label={`${course.average_rating} ვარსკვლავი 5-დან`}
                    >
                        <StarRow rating={course.average_rating}></StarRow>
                    </div>
                    <div class="flex items-center gap-1 text-sm">
                        <span
                            class="font-gsans font-medium text-gray-900"
                            itemProp="ratingValue"
                        >
                            {course.average_rating}
                        </span>
                        <span class="sr-only">
                            რეიტინგი: {course.average_rating} ვარსკვლავი {course.review_count} მიმოხილვიდან
                        </span>
                        <span
                            class="font-gsans font-normal text-gray-500"
                            aria-hidden="true"
                        >
                            ({course.review_count} მიმოხილვა)
                        </span>
                        <meta itemProp="reviewCount" content={course.review_count.toString()} />
                        <meta itemProp="bestRating" content="5" />
                        <meta itemProp="worstRating" content="1" />
                    </div>
                </div>

                <div class="flex lg:flex-row flex-col lg:items-center gap-y-2 lg:gap-y-0 lg:justify-between border-t border-gray-100 pt-4 mt-auto min-h-[60px]">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <span
                                class="text-xl font-gsans font-bold text-gray-900"
                                aria-label={`ახლანდელი ფასი: ${course.price} ლარი`}
                            >
                                ₾{course.price}
                            </span>
                            <Show when={course.discount}>
                                <span
                                    class="text-sm font-gsans font-normal text-gray-500 line-through"
                                    aria-label={`ორიგინალური ფასი: ${course.original_price} ლარი`}
                                >
                                    ₾{course.original_price}
                                </span>
                                <span
                                    class="rounded-full bg-red-50 px-2 py-1 text-xs font-gsans font-medium text-[#E85A4F]"
                                    aria-label={`${course.discount} პროცენტიანი ფასდაკლება`}
                                >
                                    -{course.discount}%
                                </span>
                            </Show>
                        </div>
                        <span
                            class="text-xs font-gsans font-normal text-gray-500 mt-1"
                            aria-hidden="true"
                        >
                            ერთჯერადი გადასახადი
                        </span>
                    </div>

                    <a
                        href={`/course/${course.slug}`}
                        class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E85A4F] px-4 py-2.5 text-sm font-gsans font-medium text-white hover:bg-[#D84A3F]"
                        aria-label={`იხილეთ დეტალები ${course.title} კურსის შესახებ`}
                        itemProp="url"
                        tabindex="-1"
                    >
                        კურსის ნახვა
                        <img
                            src='/svg/arrow-narrow-right.svg'
                            width={20}
                            height={20}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            decoding="async"
                        />
                    </a>
                </div>
            </div>

            <div class="sr-only">
                <p>ინსტრუქტორი: {course.instructor_name}</p>
                <p>ინსტრუქტორის სპეციალიზაცია: {course.instructor_headline}</p>
                <p>
                    ხანგრძლივობა: {course.durationHours} საათი, დონე: {course.level}
                </p>
                <p>
                    {course.total_lessons} გაკვეთილი, {course.enrollment_count} მოსწავლე
                </p>
                <Show when={course.discount > 0}>
                    <p>
                        ფასდაკლება: {course.discount} პროცენტი, ორიგინალური ფასი {course.original_price} ლარიდან
                    </p>
                </Show>
                <p>
                    რეიტინგი: {course.average_rating} 5 ვარსკვლავიდან, {course.review_count} მიმოხილვის საფუძველზე
                </p>
            </div>
        </article>
    )
}