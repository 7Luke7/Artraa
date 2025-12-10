import { useSubmission } from "@solidjs/router"

const Security = () => {
    const submission = useSubmission(() => {})
    return <>
        <div class="mb-8">
            <h2 class="text-xl font-bold text-gray-800">უსაფრთხოება</h2>
            <p class="text-gray-600 text-sm mt-1">მართე შენი ანგარიშის უსაფრთხოების პარამეტრები</p>
        </div>

        <div class="max-w-2xl space-y-8">
            <div class="rounded-xl border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">პაროლის შეცვლა</h3>

                <form class="space-y-4 w-64">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            ახალი პაროლი
                        </label>
                        <input
                            type="password"
                            class="bg-slate-50 text-sm font-medium-tbc text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-[#E98074] focus:bg-transparent"
                        />
                    </div>

                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">
                            გაიმეორე ახალი პაროლი
                        </label>
                        <input
                            type="password"
                            class="bg-slate-50 text-sm font-medium-tbc text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-[#E98074] focus:bg-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submission.pending}
                        class="py-2.5 px-4 text-[15px] font-medium-tbc font-bold rounded-md text-white bg-[#E98074] hover:bg-[#E85A4F] duration-200 ease-in focus:outline-none cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submission.pending ? 'მუშავდება...' : 'პაროლის შეცვლა'}
                    </button>
                </form>
            </div>

            <div class="rounded-xl border border-gray-200 p-6">
                <h3 class="text-lg font-semibold text-gray-800 mb-4">აქტიური სესიები</h3>
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="font-medium text-sm">Chrome on Windows</p>
                            <p class="text-xs text-gray-500 mt-1">თბილისი, საქართველო • ახლანდელი</p>
                        </div>
                        <span class="text-xs text-green-600 font-medium">აქტიური</span>
                    </div>
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                            <p class="font-medium text-sm">Safari on iPhone</p>
                            <p class="text-xs text-gray-500 mt-1">2 დღის წინ</p>
                        </div>
                        <button class="text-xs text-red-600 font-medium hover:text-red-700">
                            გამორთვა
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Security