import { Header } from "~/components/Header"

export default () => {
    return <main class="min-h-screen bg-gray-50 font-gsans">
        <div class="w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto flex-1">
            <Header />
            <div class="flex flex-col items-center justify-center min-h-[60vh] gap-6 px-4 text-center">
                <div class="relative w-20 h-20">
                    <div class="w-20 h-20 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M22 10.5h-6m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                    </div>
                    <div class="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-red-50 border-2 border-white flex items-center justify-center">
                        <img src='/svg/close.svg' width={9} height={9} alt="" />
                    </div>
                </div>

                <div class="flex flex-col gap-1.5 max-w-xs">
                    <p class="text-base font-medium text-gray-800">ინსტრუქტორი ვერ მოიძებნა</p>
                    <p class="text-sm text-gray-400 leading-relaxed">გვერდი, რომელსაც ეძებთ, არ არსებობს ან წაიშალა.</p>
                </div>

                <a href="/courses" class="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 border border-gray-200 hover:border-gray-300 rounded-lg px-4 py-2 bg-white transition-colors">
                    <img src='/svg/arrow-back.svg' width={16} height={16} alt="" />
                    კურსების ნახვა
                </a>
            </div>
        </div>
    </main>
}