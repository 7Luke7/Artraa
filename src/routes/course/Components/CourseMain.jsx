export const CourseMain = (props) => {
    const { course } = props;
    return (
        <div class="flex flex-col overflow-hidden">
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
                <div class="absolute top-3 right-3 bg-[#E85A4F] text-white text-xs font-bold px-2 py-1 rounded-full">
                    ხელმისაწვდომი
                </div>
            </div>

            <div class="p-5">
                <div class="mb-4 pb-4 border-b border-gray-100" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <div class="flex items-baseline gap-2 mb-1">
                        <div
                            class="text-3xl font-bold"
                            style={{ color: "#E85A4F" }}
                            itemprop="price"
                            content={course.price}
                        >
                            ₾{course.price}
                        </div>
                        {course.discount && (
                            <div class="text-base text-gray-400 line-through">
                                ₾{course.original_price}
                            </div>
                        )}
                    </div>
                    <div class="flex items-center justify-between">
                        <span class="text-sm text-gray-600">
                            სამუდამო წვდომა
                        </span>
                        {course.discount > 0 && (
                            <span class="text-xs font-bold bg-gradient-to-r from-[#E85A4F] to-[#E98074] text-white px-2 py-1 rounded-full">
                                -{course.discount}%
                            </span>
                        )}
                    </div>
                    <meta itemprop="priceCurrency" content="GEL" />
                    <meta itemprop="availability" content="https://schema.org/InStock" />
                </div>
                <div class="grid grid-cols-2 gap-3 mb-5">
                    <div class="flex items-center gap-2 text-sm">
                        <div class="w-8 h-8 rounded-md bg-blue-50 flex items-center justify-center">
                            <img
                                src="/svg/clock-black.svg"
                                alt=""
                                class="w-4 h-4"
                                aria-hidden="true"
                                loading="lazy"
                            />
                        </div>
                        <div>
                            <div class="text-gray-600">ხანგრძლივობა</div>
                            <div class="font-bold">{course.durationHours} საათი</div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <div class="w-8 h-8 rounded-md bg-green-50 flex items-center justify-center">
                            <img
                                src="/svg/book-2.svg"
                                alt=""
                                class="w-4 h-4"
                                aria-hidden="true"
                                loading="lazy"
                            />
                        </div>
                        <div>
                            <div class="text-gray-600">გაკვეთილები</div>
                            <div class="font-bold">{course.total_lessons}</div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <div class="w-8 h-8 rounded-md bg-purple-50 flex items-center justify-center">
                            <img
                                src="/svg/users-group.svg"
                                alt=""
                                class="w-4 h-4"
                                aria-hidden="true"
                                loading="lazy"
                            />
                        </div>
                        <div>
                            <div class="text-gray-600">მსმენელები</div>
                            <div class="font-bold">{course.enrollment_count}</div>
                        </div>
                    </div>

                    <div class="flex items-center gap-2 text-sm">
                        <div class="w-8 h-8 rounded-md bg-yellow-50 flex items-center justify-center">
                            <img
                                src="/svg/star-filled.svg"
                                alt=""
                                class="w-4 h-4"
                                aria-hidden="true"
                                loading="lazy"
                            />
                        </div>
                        <div>
                            <div class="text-gray-600">რეიტინგი</div>
                            <div class="font-bold">{course.average_rating || 0}<span class="text-xs font-normal text-gray-500 ml-1">({course.review_count || 0})</span></div>
                        </div>
                    </div>
                </div>
                <div class="pt-4 border-t border-gray-100">
                    <div class="flex items-center justify-around">
                        <button aria-label="გააზიარე" class="flex flex-col items-center gap-1 text-gray-600 hover:text-[#E85A4F] transition-colors group">
                            <div class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#E85A4F]/10 transition-colors">
                                <img
                                    src="/svg/share-2.svg"
                                    class="w-4 h-4"
                                    loading="lazy"
                                />
                            </div>
                            <span class="text-xs">გააზიარე</span>
                        </button>
                        <button aria-label="აჩუქე" class="flex flex-col items-center gap-1 text-gray-600 hover:text-[#E85A4F] transition-colors group">
                            <div class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#E85A4F]/10 transition-colors">
                                <img
                                    src="/svg/gift.svg"
                                    class="w-4 h-4"
                                    loading="lazy"
                                />
                            </div>
                            <span class="text-xs">აჩუქე</span>
                        </button>
                    </div>
                </div>
            </div>
            <button
                onClick={}
                class="w-full py-3 px-4 text-base font-bold rounded-lg text-white bg-gradient-to-r from-[#E85A4F] to-[#E98074] hover:from-[#D84A3F] hover:to-[#D87064] shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] mb-5"
                aria-label={`შეიძინეთ კურსი: ${course.title} ფასად ₾${course.price}`}
            >
                კურსის შეძენა
            </button>
        </div>
    )
}