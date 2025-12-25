export const CourseMain = (props) => {
    return (
        <div class="flex flex-col gap-6 rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300">
            <div class="relative">
                <img
                    src={props.course.thumbnail_url || "https://placehold.co/960x540"}
                    srcSet={`
                        ${props.course.thumbnail_url}?w=360 360w,
                        ${props.course.thumbnail_url}?w=640 640w,
                        ${props.course.thumbnail_url}?w=960 960w,
                        ${props.course.thumbnail_url}?w=1280 1280w,
                        ${props.course.thumbnail_url}?w=1920 1920w
                    `}
                    sizes="(max-width: 640px) 360px,
                    (max-width: 1024px) 50vw, 
                    540px"
                    alt={`${props.course.title} - სასწავლო კურსი`}
                    class="w-full aspect-video object-cover"
                    itemprop="image"
                />
                <div class="absolute top-3 right-3 bg-[#E85A4F] text-white text-xs font-gsans font-bold px-2 py-1 rounded-md shadow-sm">
                    ხელმისაწვდომი
                </div>
            </div>

            {/* Content Section */}
            <div class="px-5 pb-5">
                {/* Price Section */}
                <div class="mb-6 pb-4 border-b border-gray-100" itemprop="offers" itemscope itemtype="https://schema.org/Offer">
                    <div class="flex items-end gap-2 mb-1">
                        <div 
                            class="text-3xl font-gsans font-bold"
                            style={{ color: "#E85A4F" }}
                            itemprop="price"
                            content={props.course.price}
                        >
                            ₾{props.course.price}
                        </div>
                        <div class="text-sm text-gray-500 line-through mb-1">
                            ₾{props.course.original_price || Math.round(props.course.price * 1.3)}
                        </div>
                    </div>
                    <div class="flex items-center justify-between">
                        <div class="text-gray-600 text-sm">
                            სამუდამო წვდომა
                        </div>
                        <div class="text-xs font-medium bg-green-50 text-green-700 px-2 py-1 rounded">
                            -{props.course.discount || 20}%
                        </div>
                    </div>
                    <meta itemprop="priceCurrency" content="GEL" />
                    <meta itemprop="availability" content="https://schema.org/InStock" />
                </div>

                {/* Course Stats */}
                <div class="space-y-5 mb-6">
                    {/* Duration */}
                    <div 
                        class="flex items-center gap-3"
                        itemprop="timeRequired" 
                        content={`PT${props.course.total_duration}M`}
                    >
                        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-50">
                            <img src="/svg/clock.svg" width={20} height={20} class="text-blue-600" />
                        </div>
                        <div>
                            <div class="text-sm text-gray-500">მთლიანი ხანგრძლივობა</div>
                            <div class="font-gsans font-bold text-gray-800">{Math.floor(props.course.total_duration / 60)} საათი {props.course.total_duration % 60} წუთი</div>
                        </div>
                    </div>

                    {/* Lessons */}
                    <div class="flex items-center gap-3" itemprop="numberOfCredits">
                        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-purple-50">
                            <img src="/svg/book.svg" width={20} height={20} class="text-purple-600" />
                        </div>
                        <div>
                            <div class="text-sm text-gray-500">ლექციების რაოდენობა</div>
                            <div class="font-gsans font-bold text-gray-800">{props.course.total_lessons} ლექცია</div>
                        </div>
                    </div>

                    {/* Optional: Add difficulty level */}
                    <div class="flex items-center gap-3">
                        <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-50">
                            <img src="/svg/levels.svg" width={20} height={20} class="text-amber-600" />
                        </div>
                        <div>
                            <div class="text-sm text-gray-500">სირთულე</div>
                            <div class="font-gsans font-bold text-gray-800">
                                {props.course.difficulty === 'beginner' && 'დამწყები'}
                                {props.course.difficulty === 'intermediate' && 'საშუალო'}
                                {props.course.difficulty === 'advanced' && 'მაღალი'}
                                {!props.course.difficulty && 'ყველა დონის'}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA Button */}
                <button
                    class="w-full py-3.5 px-4 text-base font-gsans font-bold rounded-lg text-white bg-gradient-to-r from-[#E85A4F] to-[#E98074] hover:from-[#D84A3F] hover:to-[#D87064] duration-200 ease-in focus:outline-none cursor-pointer transition-all active:scale-[0.98]"
                    aria-label={`შეიძინეთ კურსი: ${props.course.title} ფასად ₾${props.course.price}`}
                >
                    კურსის შეძენა
                </button>
            </div>
        </div>
    )
}