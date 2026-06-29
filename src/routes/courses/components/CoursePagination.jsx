import { For } from "solid-js"

export const CoursePagination = (props) => {
    return (
        <nav aria-label="გვერდები" class="flex items-center justify-center gap-1.5 mt-10 mb-4">
            <a
                href={props.left_btn_link || "#"}
                aria-disabled={!props.left_btn_link}
                class={`flex items-center justify-center w-9 h-9 rounded-xl border ${
                    !props.left_btn_link
                        ? "border-gray-100 pointer-events-none bg-white"
                        : "border-gray-200 bg-white hover:border-[#E85A4F]/40 hover:bg-[#E85A4F]/5"
                }`}
            >
                <img src="/svg/chevron-left-black.svg" width={14} height={14} alt="წინა" />
            </a>
            <For each={props.links}>
                {(l) => (
                    <a
                        href={l.link || "#"}
                        aria-current={l.active ? "page" : undefined}
                        class={`flex items-center justify-center w-9 h-9 rounded-xl border text-sm transition-colors ${
                            l.active
                                ? "bg-[#E85A4F] border-[#E85A4F] text-white shadow-sm"
                                : "border-gray-200 text-gray-600 bg-white hover:border-[#E85A4F]/40 hover:text-[#E85A4F] hover:bg-[#E85A4F]/5"
                        }`}
                    >
                        {l.page}
                    </a>
                )}
            </For>
            <a
                href={props.right_btn_link || "#"}
                aria-disabled={!props.right_btn_link}
                class={`flex items-center justify-center w-9 h-9 rounded-xl border ${
                    !props.right_btn_link
                        ? "border-gray-100 pointer-events-none bg-white"
                        : "border-gray-200 bg-white hover:border-[#E85A4F]/40 hover:bg-[#E85A4F]/5"
                }`}
            >
                <img src="/svg/chevron-right-black.svg" width={14} height={14} alt="შემდეგი" />
            </a>
        </nav>
    )
}