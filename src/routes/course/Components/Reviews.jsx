import { createSignal, For, Show } from "solid-js"

export default (props) => {
    const [reviews] = createSignal([
        {
            id: 1,
            user: {
                name: "ანა ჯანაშია",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna",
            },
            rating: 5,
            date: "2024-01-15",
            comment: "ეს კურსი ნამდვილი სასწაული იყო! ინსტრუქტორმა ძალიან კარგად აუხსნა თემები, პრაქტიკული დავალებები დამეხმარა რეალურ პროექტებში მიღებული ცოდნის გამოყენებაში. გირჩევთ ყველას ვისაც ვებ-დეველოპმენტის დაწყება სურს.",
        },
        {
            id: 2,
            user: {
                name: "გიორგი კაკულია",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Giorgi",
            },
            rating: 4,
            date: "2024-01-10",
            comment: "კარგი კურსია დამწყებთათვის. ზოგიერთ თემას უფრო დეტალურად მოვისურვებდი, მაგრამ საერთო ჯამში დამაკმაყოფილებელი იყო. სასარგებლო მასალები და დავალებები.",
        },
        {
            id: 3,
            user: {
                name: "მარიამ ჭიჭინაძე",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mary",
            },
            rating: 5,
            date: "2023-12-28",
            comment: "როგორც დიზაინერს, ყოველთვის მაინტერესებდა როგორ მუშაობს ვებ-ტექნოლოგიები. ეს კურსი სრულყოფილად გამომიხდა! ახლა უკეთესი თანამშრომლობა მაქვს დეველოპერებთან.",
        },
        {
            id: 4,
            user: {
                name: "თორნიკე აბრამიშვილი",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tornike",
            },
            rating: 5,
            date: "2023-12-15",
            comment: "ინსტრუქტორი საოცარია! თითოეულ კონცეფციას ასახიერებს მაგალითებით. სამუშაოდ პორტფოლიოში 3 პროექტი დავამატე ამ კურსის შედეგად.",
        },
        {
            id: 5,
            user: {
                name: "ნინო ბერიძე",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nino",
            },
            rating: 4,
            date: "2023-12-05",
            comment: "ტექნიკური ცოდნის გარეშეც კარგად გასაგებია. დამეხმარა ტექნიკურ გუნდთან კომუნიკაციაში. რეკომენდაციას ვაძლევ პროექტის მენეჯერებს.",
        },
        {
            id: 6,
            user: {
                name: "ლაშა გორგაძე",
                avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lasha",
            },
            rating: 3,
            date: "2023-11-20",
            comment: "კარგი კურსია, მაგრამ ზოგიერთი თავი ძალიან სწრაფად გადის. მეტი პრაქტიკული დავალება მოვისურვებდი. მიუხედავად ამისა, საბაზისო ცოდნა კარგად არის ახსნილი.",
        }
    ])

    const { stats } = props

    return (
        <section class="py-8 md:py-12" aria-labelledby="reviews-heading">
            <div class="mb-8">
                <h2
                    id="reviews-heading"
                    class="text-2xl md:text-3xl font-gsans font-bold text-gray-900 mb-2"
                >
                    მოსწავლეების შეფასებები
                </h2>

                <div class="flex flex-wrap items-center gap-4 md:gap-6">
                    <div class="flex items-center gap-2">
                        <div class="text-3xl md:text-4xl font-bold text-gray-900">
                            {stats.averageRating}
                        </div>
                        <div class="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <img
                                    key={i}
                                    src={
                                        i === 4 && Number(stats.averageRating) > 4 && Number(stats.averageRating) < 5 ?
                                        '/svg/star-half.svg'  
                                        : i < Number(stats.averageRating) 
                                        ? '/svg/star-filled.svg' :
                                        '/svg/star-outline.svg'
                                    }
                                    width={20}
                                    height={20}
                                    alt=""
                                    class="w-5 h-5"
                                    loading="lazy"
                                    decoding="async"
                                />
                            ))}
                        </div>
                    </div>
                    <div class="text-gray-600">
                        <span class="font-semibold">{stats.totalReviews}</span> შეფასება
                    </div>
                </div>
            </div>

            <div class="space-y-6">
                <For each={reviews()}>
                    {(review) => (
                        <article
                            class="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors duration-200"
                            itemscope
                            itemtype="https://schema.org/Review"
                        >
                            <div class="flex flex-col sm:flex-row sm:items-start gap-4">
                                <div class="flex-shrink-0">
                                    <img
                                        src={review.user.avatar}
                                        alt={review.user.name}
                                        class="w-12 h-12 rounded-full border-2 border-white shadow-sm"
                                        itemprop="author"
                                        itemscope
                                        itemtype="https://schema.org/Person"
                                    />
                                </div>
                                <div class="flex-1">
                                    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                        <div>
                                            <h3
                                                class="font-gsans font-semibold text-gray-900"
                                                itemprop="name"
                                            >
                                                {review.user.name}
                                            </h3>
                                        </div>

                                        <div class="flex items-center gap-4">
                                            <div class="flex items-center">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <img
                                                        key={i}
                                                        src={i < review.rating ? '/svg/star-filled.svg' : '/svg/star-outline.svg'}
                                                        width={20}
                                                        height={20}
                                                        alt=""
                                                        class="w-5 h-5"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                ))}
                                            </div>
                                            <time
                                                class="text-sm text-gray-500"
                                                datetime={review.date}
                                            >
                                                {new Date(review.date).toLocaleDateString('ka-GE', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </time>
                                        </div>
                                    </div>

                                    <div
                                        class="text-gray-700 leading-relaxed mb-4"
                                        itemprop="reviewBody"
                                    >
                                        {review.comment}
                                    </div>
                                </div>
                            </div>
                        </article>
                    )}
                </For>
            </div>
            {/** */}
        </section>
    )
}