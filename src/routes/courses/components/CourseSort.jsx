import { useNavigate } from "@solidjs/router"
import { For } from "solid-js"

const SORT_OPTIONS = [
    { value: "created_at-DESC", label: "უახლესი" },
    { value: "enrollment_count-DESC", label: "პოპულარული" },
    { value: "average_rating-DESC", label: "მაღალი რეიტინგი" },
    { value: "price-ASC", label: "ფასი ↑" },
    { value: "price-DESC", label: "ფასი ↓" },
]

export const CourseSort = (props) => {
    const search = new URLSearchParams(props.location.search)
    const sort = () => search.get("sort")?.split("-")[0] || SORT_OPTIONS[0].value
    const navigate = useNavigate()

    const handleSort = (next_sort_value) => {
        const reactiveSearch = new URLSearchParams(props.location.search)
        reactiveSearch.set("sort", next_sort_value)
        const keys_to_clear = ['course-created_at', 'course-price', 'course-average_rating', 'course-enrollment_count']
        
        for (const key of reactiveSearch.keys()) {
            if (keys_to_clear.some(k => k === key)) reactiveSearch.delete(key)
        }
        reactiveSearch.delete("course-slug")
        reactiveSearch.delete("page")
        navigate(`/courses?${reactiveSearch.toString()}`)
    }
    return (
        <div class="relative">
            <select
                value={sort()}
                onChange={e => handleSort(e.target.value)}
                class="appearance-none pl-3 pr-8 py-2 border border-gray-200 rounded-xl text-sm font-gsans text-gray-700 bg-white focus:outline-none focus:border-[#E85A4F]/50 focus:ring-2 focus:ring-[#E85A4F]/10 cursor-pointer transition-colors hover:border-gray-300"
            >
                <For each={SORT_OPTIONS}>
                    {opt => <option name={opt.label} value={opt.value}>{opt.label}</option>}
                </For>
            </select>
            <img src="svg/chevron-down.svg" class="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" width={14} height={14} alt="" />
        </div>
    )
}