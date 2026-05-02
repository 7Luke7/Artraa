import { createSignal, For, Show } from "solid-js"

const StarIcon = (props) => {
    const s = props.size || 16
    if (props.half) return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
            <defs>
                <linearGradient id="half-grad">
                    <stop offset="50%" stop-color="#F59E0B"/>
                    <stop offset="50%" stop-color="#E5E7EB"/>
                </linearGradient>
            </defs>
            <path fill="url(#half-grad)" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
    )
    return (
        <svg width={s} height={s} viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill={props.filled ? "#F59E0B" : "none"}
                stroke={props.filled ? "#F59E0B" : "#D1D5DB"}
                stroke-width="1.5"
                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            />
        </svg>
    )
}

const StarRow = (props) => {
    return (
        <div class="flex items-center gap-0.5" aria-label={`${props.rating} ვარსკვლავი 5-დან`}>
            {[1, 2, 3, 4, 5].map(i => {
                const r = props.rating
                const isHalf = i === Math.ceil(r) && r % 1 !== 0
                return <StarIcon filled={i <= Math.floor(r)} half={isHalf} size={props.size} />
            })}
        </div>
    )
}

export default (props) => {
    const { stats } = props

    const [reviews] = createSignal([
        { id: 1, user: { name: "ანა ჯანაშია", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anna" }, rating: 5, date: "2024-01-15", comment: "ეს კურსი ნამდვილი სასწაული იყო! ინსტრუქტორმა ძალიან კარგად აუხსნა თემები, პრაქტიკული დავალებები დამეხმარა რეალურ პროექტებში მიღებული ცოდნის გამოყენებაში." },
        { id: 2, user: { name: "გიორგი კაკულია", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Giorgi" }, rating: 4, date: "2024-01-10", comment: "კარგი კურსია დამწყებთათვის. ზოგიერთ თემას უფრო დეტალურად მოვისურვებდი, მაგრამ საერთო ჯამში დამაკმაყოფილებელი იყო." },
        { id: 3, user: { name: "მარიამ ჭიჭინაძე", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mary" }, rating: 5, date: "2023-12-28", comment: "როგორც დიზაინერს, ყოველთვის მაინტერესებდა როგორ მუშაობს ვებ-ტექნოლოგიები. ეს კურსი სრულყოფილად გამომიხდა!" },
        { id: 4, user: { name: "თორნიკე აბრამიშვილი", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tornike" }, rating: 5, date: "2023-12-15", comment: "ინსტრუქტორი საოცარია! თითოეულ კონცეფციას ასახიერებს მაგალითებით. სამუშაოდ პორტფოლიოში 3 პროექტი დავამატე." },
        { id: 5, user: { name: "ნინო ბერიძე", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nino" }, rating: 4, date: "2023-12-05", comment: "ტექნიკური ცოდნის გარეშეც კარგად გასაგებია. დამეხმარა ტექნიკურ გუნდთან კომუნიკაციაში." },
        { id: 6, user: { name: "ლაშა გორგაძე", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lasha" }, rating: 3, date: "2023-11-20", comment: "კარგი კურსია, მაგრამ ზოგიერთი თავი ძალიან სწრაფად გადის. მეტი პრაქტიკული დავალება მოვისურვებდი." },
    ])

    return (
        <section class="py-8 md:py-12" aria-labelledby="reviews-heading">
            <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
                <h2 id="reviews-heading" class="text-xl md:text-2xl font-gsans font-bold text-gray-900 mb-6">
                    მოსწავლეების შეფასებები
                </h2>
            </div>

            <div class="space-y-4">
                <For each={reviews()}>
                    {(review) => (
                        <article
                            class="bg-white border border-gray-200 rounded-2xl p-5 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                            itemscope
                            itemtype="https://schema.org/Review"
                        >
                            <div class="flex items-start gap-4">
                                <img
                                    src={review.user.avatar}
                                    alt={review.user.name}
                                    class="w-11 h-11 rounded-xl border border-gray-100 flex-shrink-0"
                                    loading="lazy"
                                />
                                <div class="flex-1 min-w-0">
                                    <div class="flex flex-wrap items-center justify-between gap-2 mb-2">
                                        <h3 class="font-gsans font-semibold text-gray-900 text-sm" itemprop="name">
                                            {review.user.name}
                                        </h3>
                                        <div class="flex items-center gap-3">
                                            <StarRow rating={review.rating} size={14} />
                                            <time class="text-xs text-gray-400 font-gsans" datetime={review.date}>
                                                {new Date(review.date).toLocaleDateString('ka-GE', { year: 'numeric', month: 'long', day: 'numeric' })}
                                            </time>
                                        </div>
                                    </div>
                                    <p class="text-gray-600 text-sm leading-relaxed font-gsans" itemprop="reviewBody">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        </article>
                    )}
                </For>
            </div>
        </section>
    )
}