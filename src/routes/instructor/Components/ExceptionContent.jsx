import { Header } from "~/components/Header"

export default () => {
    return <main class="min-h-screen bg-gray-50 font-gsans">
        <div class="w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto flex-1">
            <Header />
            <div class="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-4 text-center">
                <p class="text-gray-500 text-sm">შეცდომა მოხდა. სცადეთ თავიდან.</p>
                <button
                    onClick={() => window.location.reload()}
                    class="text-sm text-[#E85A4F] hover:underline"
                >
                    განახლება
                </button>
            </div>
        </div>
    </main>
}