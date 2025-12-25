import { For } from "solid-js"

const Billing = () => {
    const paymentMethods = [
        {
            id: 1,
            type: "card",
            last4: "4242",
            brand: "visa",
            expiry: "12/25",
            isDefault: true
        },
        {
            id: 2,
            type: "card",
            last4: "8888",
            brand: "mastercard",
            expiry: "08/24",
            isDefault: false
        }
    ]

    const billingHistory = [
        {
            id: "INV-2023-001",
            date: "2023-12-15",
            description: "Pro Plan - Monthly",
            amount: "29 ₾",
            status: "paid",
            receiptUrl: "#"
        },
        {
            id: "INV-2023-002",
            date: "2023-11-15",
            description: "Pro Plan - Monthly",
            amount: "29 ₾",
            status: "paid",
            receiptUrl: "#"
        },
        {
            id: "INV-2023-003",
            date: "2023-10-15",
            description: "Pro Plan - Monthly",
            amount: "29 ₾",
            status: "refunded",
            receiptUrl: "#"
        }
    ]

    return <>
        {/* Header */}
        <div class="mb-8">
            <h2 class="text-xl font-gsans font-bold text-gray-800">გადახდები</h2>
            <p class="text-gray-600 text-sm mt-1">ინვოისები და გადახდის მეთოდები</p>
        </div>

        {/* Payment Methods */}
        <div class="mb-12">
            <div class="flex items-center justify-between mb-6">
                <h3 class="text-lg font-gsans font-medium text-gray-800">გადახდის მეთოდები</h3>
                <button class="text-[#E85A4F] hover:text-[#d74a3f] font-gsans font-medium flex items-center">
                    <img src="/svg/plus.svg" class="w-4 h-4 mr-2" />
                    ახალი მეთოდი
                </button>
            </div>

            <div class="space-y-4">
                <For each={paymentMethods}>
                    {(method) => (
                        <div class="bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md transition-shadow">
                            <div class="flex items-center justify-between">
                                <div class="flex items-center">
                                    <div class="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mr-4">
                                        <img src={`/svg/${method.brand}.svg`} class="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div class="font-gsans font-medium text-gray-800">
                                            •••• {method.last4}
                                            {method.isDefault && (
                                                <span class="ml-3 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                                    ძირითადი
                                                </span>
                                            )}
                                        </div>
                                        <div class="text-sm text-gray-500 mt-1">
                                            ვადა: {method.expiry}
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center space-x-3">
                                    {!method.isDefault && (
                                        <button class="text-sm text-gray-600 hover:text-gray-800">
                                            გახადე ძირითადი
                                        </button>
                                    )}
                                    <button class="text-sm text-red-600 hover:text-red-700">
                                        წაშალე
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </For>
            </div>
        </div>

        {/* Billing History */}
        <div>
            <h3 class="text-lg font-gsans font-medium text-gray-800 mb-6">ბილინგის ისტორია</h3>

            <div class="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th class="text-left py-3 px-6 text-sm font-gsans font-medium text-gray-700">ინვოისი</th>
                                <th class="text-left py-3 px-6 text-sm font-gsans font-medium text-gray-700">თარიღი</th>
                                <th class="text-left py-3 px-6 text-sm font-gsans font-medium text-gray-700">აღწერა</th>
                                <th class="text-left py-3 px-6 text-sm font-gsans font-medium text-gray-700">თანხა</th>
                                <th class="text-left py-3 px-6 text-sm font-gsans font-medium text-gray-700">სტატუსი</th>
                                <th class="text-left py-3 px-6 text-sm font-gsans font-medium text-gray-700">მოქმედება</th>
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            <For each={billingHistory}>
                                {(invoice) => (
                                    <tr class="hover:bg-gray-50">
                                        <td class="py-4 px-6 text-sm text-gray-800 font-gsans font-medium">
                                            {invoice.id}
                                        </td>
                                        <td class="py-4 px-6 text-sm text-gray-600">
                                            {invoice.date}
                                        </td>
                                        <td class="py-4 px-6 text-sm text-gray-600">
                                            {invoice.description}
                                        </td>
                                        <td class="py-4 px-6 text-sm text-gray-800 font-gsans font-medium">
                                            {invoice.amount}
                                        </td>
                                        <td class="py-4 px-6">
                                            <span class={`inline-flex items-center px-3 py-1 rounded-full text-xs font-gsans font-medium ${invoice.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                                {invoice.status === "paid" ? "გადახდილი" : "დაბრუნებული"}
                                            </span>
                                        </td>
                                        <td class="py-4 px-6">
                                            <a
                                                href={invoice.receiptUrl}
                                                class="text-sm text-[#E85A4F] hover:text-[#d74a3f] hover:underline"
                                            >
                                                ჩამოტვირთვა
                                            </a>
                                        </td>
                                    </tr>
                                )}
                            </For>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* FAQ Section */}
        <div class="mt-12 pt-8 border-t border-gray-200">
            <h3 class="text-lg font-gsans font-medium text-gray-800 mb-6">ხშირად დასმული კითხვები</h3>
            <div class="space-y-4">
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="font-gsans font-medium text-gray-800 mb-2">როგორ შემიძლია გამოწერის გაუქმება?</div>
                    <div class="text-sm text-gray-600">
                        გამოწერა შეგიძლიათ გააუქმოთ ნებისმიერ დროს. გაუქმების შემდეგ პრემიუმ ფუნქციები თქვენს ანგარიშზე დარჩება გამოწერის პერიოდის დასრულებამდე.
                    </div>
                </div>
                <div class="bg-gray-50 rounded-lg p-4">
                    <div class="font-gsans font-medium text-gray-800 mb-2">როგორ მუშაობს ყოველწლიური გადახდა?</div>
                    <div class="text-sm text-gray-600">
                        ყოველწლიური გამოწერით იხდით წინასწარ მთელი წლისთვის და იზოგებთ 15%-ს. გადახდა ავტომატურად განახლდება წლის დასრულებისას.
                    </div>
                </div>
            </div>
        </div>
    </>
}

export default Billing