import { createSignal } from "solid-js"
import { submit_review } from "~/routes/api/course"

const StarPicker = (props) => {
    const [hover, setHover] = createSignal(0)

    return (
        <div class="flex items-center gap-1" role="radiogroup" aria-label="შეფასება">
            {[1, 2, 3, 4, 5].map(i => (
                <button
                    type="button"
                    onClick={() => props.onChange(i)}
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(0)}
                    aria-label={`${i} ვარსკვლავი`}
                    class="transition-transform hover:scale-110 active:scale-95"
                >
                    <svg width={28} height={28} viewBox="0 0 24 24">
                        <path
                            fill={(hover() || props.value) >= i ? "#F59E0B" : "none"}
                            stroke={(hover() || props.value) >= i ? "#F59E0B" : "#D1D5DB"}
                            stroke-width="1.5"
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                        />
                    </svg>
                </button>
            ))}
        </div>
    )
}

export default (props) => {
    const [rating, setRating] = createSignal(0)
    const [comment, setComment] = createSignal("")
    const [submitting, setSubmitting] = createSignal(false)
    const [submitted, setSubmitted] = createSignal(false)
    const [error, setError] = createSignal("")

    const handleSubmit = async () => {
        if (rating() === 0) { setError("გთხოვთ აირჩიოთ შეფასება"); return }
        if (comment().trim().length < 10) { setError("კომენტარი მინიმუმ 10 სიმბოლო უნდა იყოს"); return }
        setSubmitting(true)
        setError("")
        try {
            await submit_review({ courseSlug: props.courseSlug, rating: rating(), comment: comment().trim() })
            setSubmitted(true)
        } catch {
            setError("შეცდომა. გთხოვთ სცადოთ თავიდან.")
        } finally {
            setSubmitting(false)
        }
    }

    if (submitted()) {
        return (
            <div class="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                    <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2.5">
                        <polyline points="20 6 9 17 4 12"/>
                    </svg>
                </div>
                <p class="text-gray-900 font-gsans font-bold mb-1">მადლობა შეფასებისთვის!</p>
                <p class="text-gray-500 font-gsans text-sm">თქვენი შეფასება წარმატებით დაემატა</p>
                <button onClick={props.onClose} class="mt-4 text-xs text-gray-400 hover:text-gray-600 font-gsans underline">
                    დახურვა
                </button>
            </div>
        )
    }

    return (
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
            <div class="flex items-center justify-between">
                <h3 class="text-gray-900 font-gsans font-bold">კურსის შეფასება</h3>
                <button
                    onClick={props.onClose}
                    class="text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="დახურვა"
                >
                    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                </button>
            </div>

            <div>
                <label class="block text-sm font-gsans font-medium text-gray-700 mb-2">რეიტინგი</label>
                <StarPicker value={rating()} onChange={setRating} />
            </div>

            <div>
                <label class="block text-sm font-gsans font-medium text-gray-700 mb-2">
                    კომენტარი
                    <span class="text-gray-400 font-normal ml-1">({comment().length}/500)</span>
                </label>
                <textarea
                    value={comment()}
                    onInput={e => setComment(e.target.value.slice(0, 500))}
                    rows={4}
                    placeholder="გაუზიარეთ გამოცდილება სხვა მოსწავლეებს..."
                    class="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-gsans text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E85A4F]/50 focus:ring-2 focus:ring-[#E85A4F]/10 resize-none transition-colors"
                />
            </div>

            {error() && <p class="text-[#E85A4F] text-sm font-gsans">{error()}</p>}

            <div class="flex items-center gap-3 justify-end">
                <button
                    onClick={props.onClose}
                    class="px-4 py-2 text-sm font-gsans text-gray-500 hover:text-gray-700 transition-colors"
                >
                    გაუქმება
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={submitting()}
                    class="px-5 py-2.5 rounded-xl bg-[#E85A4F] hover:bg-[#D84A3F] text-white text-sm font-gsans font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting() ? "იგზავნება..." : "გამოქვეყნება"}
                </button>
            </div>
        </div>
    )
}