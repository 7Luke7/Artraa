import { A } from "@solidjs/router"

export const CourseCard = () => {
    const courseData = {
        title: "AutoCAD - საფუძვლები სამშენებლო დიზაინისთვის",
        slug: "autocad-foundations-for-construction-design",
        price: 1699,
        originalPrice: 2599,
        discount: 35,
        rating: 5.0,
        reviews: 455,
        stars: 3,
        image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
        imageAlt: "AutoCAD სამშენებლო დიზაინის კურსი - 3D მოდელირება და პროექტირება"
    };

    const calculateDiscount = () => {
        return Math.round(((courseData.originalPrice - courseData.price) / courseData.originalPrice) * 100);
    };

    return (
        <article 
            class="group relative overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
            itemScope
            itemType="https://schema.org/Course"
        >
            {/* Discount Badge */}
            <div class="absolute top-3 left-3 z-10">
                <span 
                    class="inline-block rounded-full bg-gradient-to-r from-red-600 to-orange-500 px-3 py-1 text-xs font-gsans font-medium text-white shadow-sm"
                    itemProp="offers"
                    itemScope
                    itemType="https://schema.org/Offer"
                >
                    <span itemProp="price">₾{courseData.price}</span>
                    <span class="ml-1">({courseData.discount}% ფასდაკლება)</span>
                    <meta itemProp="priceCurrency" content="GEL" />
                </span>
            </div>

            {/* Course Image */}
            <figure class="relative h-64 w-full overflow-hidden bg-gray-100">
                <A 
                    href={`/course/${courseData.slug}`}
                    class="block h-full w-full"
                    aria-label={`გადადით ${courseData.title} კურსის გვერდზე`}
                >
                    <img
                        src={courseData.image}
                        alt={courseData.imageAlt}
                        class="h-full w-full object-cover"
                        loading="lazy"
                        width={400}
                        height={256}
                        itemProp="image"
                    />
                </A>
            </figure>

            {/* Course Content */}
            <div class="p-6">
                {/* Title */}
                <h2 class="mb-3">
                    <A 
                        href={`/course/${courseData.slug}`}
                        class="text-xl font-gsans font-bold leading-tight text-gray-900 hover:text-[#E85A4F] line-clamp-2"
                        itemProp="name"
                    >
                        {courseData.title}
                    </A>
                </h2>

                {/* Rating */}
                <div class="mb-4 flex items-center gap-2" itemProp="aggregateRating" itemScope itemType="https://schema.org/AggregateRating">
                    <div class="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            i < courseData.stars ? 
                                <img src='/svg/star-filled.svg' width={20} height={20} alt="filled star" /> : 
                                <img src='/svg/star-outline.svg' width={20} height={20} alt="outline star" />
                        ))}
                    </div>
                    <div class="flex items-center gap-1 text-sm">
                        <span class="font-gsans font-medium text-gray-900" itemProp="ratingValue">{courseData.rating.toFixed(1)}</span>
                        <span class="font-gsans font-normal text-gray-500">({courseData.reviews} მიმოხილვა)</span>
                        <meta itemProp="reviewCount" content={courseData.reviews.toString()} />
                        <meta itemProp="bestRating" content="5" />
                    </div>
                </div>

                {/* Price & CTA */}
                <div class="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div class="flex flex-col">
                        <div class="flex items-center gap-2">
                            <span class="text-2xl font-gsans font-bold text-gray-900">₾{courseData.price}</span>
                            <span class="text-sm font-gsans font-normal text-gray-500 line-through">₾{courseData.originalPrice}</span>
                            <span class="rounded-full bg-red-50 px-2 py-1 text-xs font-gsans font-medium text-[#E85A4F]">
                                -{calculateDiscount()}%
                            </span>
                        </div>
                        <span class="text-xs font-gsans font-normal text-gray-500 mt-1">ერთჯერადი გადასახადი</span>
                    </div>

                    <A
                        href={`/course/${courseData.slug}`}
                        class="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E85A4F] px-5 py-3 text-sm font-gsans font-medium text-white"
                        aria-label={`იხილეთ დეტალები ${courseData.title} კურსის შესახებ`}
                        itemProp="url"
                    >
                        კურსის ნახვა
                        <img src='/svg/arrow-narrow-right.svg' width={20} height={20} alt="arrow right" />
                    </A>
                </div>
            </div>

            {/* Schema.org Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "Course",
                    "name": courseData.title,
                    "description": "AutoCAD-ის პროფესიონალური კურსი სამშენებლო დიზაინისთვის",
                    "image": courseData.image,
                    "url": `https://yoursite.com/course/${courseData.slug}`,
                    "provider": {
                        "@type": "Organization",
                        "name": "Your Academy Name"
                    },
                    "offers": {
                        "@type": "Offer",
                        "price": courseData.price,
                        "priceCurrency": "GEL",
                        "availability": "https://schema.org/InStock"
                    },
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "ratingValue": courseData.rating,
                        "reviewCount": courseData.reviews
                    }
                })}
            </script>
        </article>
    );
}