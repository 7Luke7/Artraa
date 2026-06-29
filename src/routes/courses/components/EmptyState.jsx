export default ({ hasFilters }) => {
    return (
        <div class="flex flex-col items-center justify-center py-20 text-center">
            <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
                <img src='/svg/search.svg' width={28} height={28} />
            </div>
            <p class="font-gsans font-bold text-gray-900 mb-2">კურსები ვერ მოიძებნა</p>
            <p class="text-sm text-gray-400 font-gsans mb-6">სხვა ფილტრები სცადეთ</p>
            <Show when={hasFilters}>
                <a
                    href="/courses"
                    class="px-5 py-2.5 rounded-xl bg-[#E85A4F] text-white font-gsans font-bold text-sm hover:bg-[#D84A3F] transition-colors"
                >
                    ფილტრების გასუფთავება
                </a>
            </Show>
        </div>
    )
}
