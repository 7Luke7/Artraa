import { Title } from "@solidjs/meta"

export default () => {
    return <>
        <Title>Artra - კურსი ვერ მოიძებნა</Title>
        <div class="min-h-screen flex items-center justify-center px-4">
            <div class="text-center max-w-md">
                <div class="w-16 h-16 rounded-2xl bg-[#E85A4F]/10 flex items-center justify-center mx-auto mb-6">
                    <img src="/svg/exclamation.svg" alt="" width={32} height={32} />
                </div>
                <h1 class="text-2xl font-gsans font-bold text-gray-900 mb-2">კურსი ვერ მოიძებნა</h1>
                <p class="text-gray-500 font-gsans mb-8">დაფიქსირდა შეცდომა</p>
                <a
                    href="/courses"
                    class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#E85A4F] text-white font-gsans font-medium text-sm hover:bg-[#D84A3F] transition-colors"
                >
                    <img src="/svg/chevron-left.svg" width={16} height={16} alt="" />
                    კურსების სია
                </a>
            </div>
        </div>
    </>
}