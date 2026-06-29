import { batch, createSignal, For, Show } from "solid-js"
import { useNavigate } from "@solidjs/router"

const LEVELS = [
    { value: "beginner", label: "დამწყები" },
    { value: "intermediate", label: "საშუალო" },
    { value: "advanced", label: "მაღალი" },
]

const CATEGORIES = [
    { value: "construction", label: "მშენებლობა" },
    { value: "technology", label: "ტექნოლოგიები" },
]

const OFFERS = [
    {value: "sale", label: "ფასდაკლება"}
]

export const CourseFilters = (props) => {
    const navigate = useNavigate()
    const params = () => new URLSearchParams(props.location.search)

    const [category, setCategory] = createSignal(params().get("category") || "")
    const [offer, setOffer] = createSignal(params().get("offer") || "")
    const [level, setLevel] = createSignal(params().get("level") || "")
    const [priceFrom, setPriceFrom] = createSignal(params().get("priceFrom") || "")
    const [priceTo, setPriceTo] = createSignal(params().get("priceTo") || "")

    const hasAny = () => category() || level() || priceFrom() || priceTo() || offer()

    const apply = () => {
        const p = new URLSearchParams()
        if (category()) p.set("category", category())
        if (level()) p.set("level", level())
        if (priceFrom()) p.set("priceFrom", priceFrom())
        if (priceTo()) p.set("priceTo", priceTo())
        if (offer()) p.set("offer", offer())
        const sort = params().get("sort")
        if (sort) p.set("sort", sort)

        navigate(`/courses?${p.toString()}`)
        props.onApply?.()
    }

    const reset = () => {
        batch(() => {
            setCategory(""); setLevel(""); setPriceFrom(""); setPriceTo(""); setOffer(""); setOffer("")
        })
        navigate("/courses")
        props.onApply?.()
    }

    return (
        <div class="p-5 space-y-6">
            <div>
                <label class="block text-xs font-gsans font-bold text-gray-500 uppercase tracking-wide mb-2.5">
                    შეთავაზებები
                </label>
                <div class="space-y-1">
                    <button
                        onClick={() => setOffer("")}
                        class={`w-full text-left px-3 py-2 rounded-lg text-sm font-gsans transition-colors ${!offer() ? "bg-[#E85A4F]/10 text-[#E85A4F] font-medium" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        ყველა
                    </button>
                    <For each={OFFERS}>
                        {cat => (
                            <button
                                onClick={() => setOffer(cat.value)}
                                class={`w-full text-left px-3 py-2 rounded-lg text-sm font-gsans transition-colors ${offer() === cat.value
                                        ? "bg-[#E85A4F]/10 text-[#E85A4F] font-medium"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        )}
                    </For>
                </div>

            </div>
            <div>
                <label class="block text-xs font-gsans font-bold text-gray-500 uppercase tracking-wide mb-2.5">
                    კატეგორია
                </label>
                <div class="space-y-1">
                    <button
                        onClick={() => setCategory("")}
                        class={`w-full text-left px-3 py-2 rounded-lg text-sm font-gsans transition-colors ${!category() ? "bg-[#E85A4F]/10 text-[#E85A4F] font-medium" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        ყველა
                    </button>
                    <For each={CATEGORIES}>
                        {cat => (
                            <button
                                onClick={() => setCategory(cat.value)}
                                class={`w-full text-left px-3 py-2 rounded-lg text-sm font-gsans transition-colors ${category() === cat.value
                                        ? "bg-[#E85A4F]/10 text-[#E85A4F] font-medium"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                {cat.label}
                            </button>
                        )}
                    </For>
                </div>
            </div>

            <div>
                <label class="block text-xs font-gsans font-bold text-gray-500 uppercase tracking-wide mb-2.5">
                    დონე
                </label>
                <div class="space-y-1">
                    <button
                        onClick={() => setLevel("")}
                        class={`w-full text-left px-3 py-2 rounded-lg text-sm font-gsans transition-colors ${!level() ? "bg-[#E85A4F]/10 text-[#E85A4F] font-medium" : "text-gray-600 hover:bg-gray-50"
                            }`}
                    >
                        ყველა
                    </button>
                    <For each={LEVELS}>
                        {lv => (
                            <button
                                onClick={() => setLevel(lv.value)}
                                class={`w-full text-left px-3 py-2 rounded-lg text-sm font-gsans transition-colors ${level() === lv.value
                                        ? "bg-[#E85A4F]/10 text-[#E85A4F] font-medium"
                                        : "text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                {lv.label}
                            </button>
                        )}
                    </For>
                </div>
            </div>

            <div>
                <label class="block text-xs font-gsans font-bold text-gray-500 uppercase tracking-wide mb-2.5">
                    ფასი (₾)
                </label>
                <div class="flex items-center gap-2">
                    <input
                        type="number"
                        value={priceFrom()}
                        onInput={e => setPriceFrom(e.target.value)}
                        placeholder={props.minPrice ?? "0"}
                        min="0"
                        class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-gsans text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E85A4F]/50 focus:ring-2 focus:ring-[#E85A4F]/10 transition-colors"
                    />
                    <span class="text-gray-300 shrink-0">—</span>
                    <input
                        type="number"
                        value={priceTo()}
                        onInput={e => setPriceTo(e.target.value)}
                        placeholder={props.maxPrice ?? "∞"}
                        min="0"
                        class="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm font-gsans text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E85A4F]/50 focus:ring-2 focus:ring-[#E85A4F]/10 transition-colors"
                    />
                </div>
            </div>

            <div class="space-y-2 pt-1">
                <button
                    onClick={apply}
                    class="w-full py-2.5 rounded-xl bg-[#E85A4F] text-white font-gsans font-bold text-sm hover:bg-[#D84A3F] transition-colors"
                >
                    გაფილტვრა
                </button>
                <Show when={hasAny()}>
                    <button
                        onClick={reset}
                        class="w-full py-2.5 rounded-xl border border-gray-200 text-gray-600 font-gsans font-medium text-sm hover:bg-gray-50 transition-colors"
                    >
                        გასუფთავება
                    </button>
                </Show>
            </div>
        </div>
    )
}