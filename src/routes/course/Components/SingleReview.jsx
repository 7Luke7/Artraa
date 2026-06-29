import { StarRow } from "~/components/StarRow"

export const SingleReview = ({review}) => {
    return <article
        class="bg-white border border-gray-200 rounded-2xl p-5 hover:border-[#E85A4F]/20 hover:shadow-sm transition-all duration-200 group"
        itemscope
        itemtype="https://schema.org/Review"
    >
        <div class="flex items-start gap-4">
            <img
                src={review.avatar}
                alt={review.name}
                onError={(e) => e.currentTarget.src = '/default_profile.png'}
                class="w-10 h-10 rounded-xl border border-gray-100 shrink-0 bg-gray-50"
                loading="lazy"
            />
            <div class="flex-1 min-w-0">
                <div class="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div class="flex items-center gap-2.5">
                        <h3 class="font-gsans font-semibold text-gray-900 text-sm" itemprop="name">
                            {review.name}
                        </h3>
                        <StarRow rating={review.rating} size={12} />
                    </div>
                    <time class="text-xs text-gray-400 font-gsans shrink-0" datetime={review.date}>
                        {new Date(review.created_at).toLocaleDateString('ka-GE', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </time>
                </div>
                <p class="text-gray-500 text-sm leading-relaxed font-gsans" itemprop="reviewBody">
                    {review.comment}
                </p>
            </div>
        </div>
    </article>
}