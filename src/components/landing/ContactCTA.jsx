import { A } from "@solidjs/router"
import { createSignal } from "solid-js"

export const ContactCTA = () => {
    const [formType, setFormType] = createSignal('instructor')

    return (
        <div class="mt-12 mb-16">
            <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div class="px-8 py-12">
                    <div class="text-center mb-8">
                        <h2 class="text-3xl font-gsans font-bold text-gray-900 mb-4">
                            დაგვიკავშირდით
                        </h2>
                        <p class="text-lg font-gsans font-medium text-gray-600 max-w-xl mx-auto">
                            გაქვთ კითხვები ან გსურთ თანამშრომლობა? ჩვენ მზად ვართ დაგეხმაროთ.
                        </p>
                    </div>

                    <div class="flex flex-col lg:flex-row gap-8">
                        <div class="lg:w-1/2">
                            <div class="mb-6">
                                <div class="inline-flex rounded-lg bg-gray-100 p-1">
                                    <button
                                        onClick={() => setFormType('instructor')}
                                        class={`px-4 py-2 rounded-md text-sm font-gsans font-medium transition-colors ${formType() === 'instructor' ? 'bg-[#E85A4F] text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        ინსტრუქტორისთვის
                                    </button>
                                    <button
                                        onClick={() => setFormType('general')}
                                        class={`px-4 py-2 rounded-md text-sm font-gsans font-medium transition-colors ${formType() === 'general' ? 'bg-[#E85A4F] text-white' : 'text-gray-600 hover:text-gray-900'}`}
                                    >
                                        საერთო შეტყობინება
                                    </button>
                                </div>
                            </div>

                            <form method="POST" class="space-y-5">
                                <div class="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label for="name" class="block text-sm font-gsans font-medium text-gray-700 mb-2">
                                            სახელი
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            class="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:border-transparent"
                                            placeholder="თქვენი სახელი"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label for="email" class="block text-sm font-gsans font-medium text-gray-700 mb-2">
                                            ელ. ფოსტა
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            class="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:border-transparent"
                                            placeholder="თქვენი ელ. ფოსტა"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label for="phone" class="block text-sm font-gsans font-medium text-gray-700 mb-2">
                                        ტელეფონი
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:border-transparent"
                                        placeholder="+995 5__ __ __ __"
                                        required
                                    />
                                </div>

                                <div>
                                    <label for="subject" class="block text-sm font-gsans font-medium text-gray-700 mb-2">
                                        თემა
                                    </label>
                                    <input
                                        type="text"
                                        id="subject"
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:border-transparent"
                                        placeholder={formType() === 'instructor' ? 'თქვენი ექსპერტიზის სფერო' : 'შეტყობინების თემა'}
                                        required
                                    />
                                </div>

                                <div>
                                    <label for="message" class="block text-sm font-gsans font-medium text-gray-700 mb-2">
                                        შეტყობინება
                                    </label>
                                    <textarea
                                        id="message"
                                        rows={4}
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:border-transparent resize-none"
                                        placeholder={formType() === 'instructor' ? 'დაწერეთ რატომ გსურთ გახდეთ ინსტრუქტორი და თქვენი გამოცდილების შესახებ...' : 'დაწერეთ თქვენი შეტყობინება...'}
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    class="w-full bg-[#E85A4F] hover:bg-[#D84A3F] text-white py-3 rounded-lg font-gsans font-bold transition-colors"
                                >
                                    {formType() === 'instructor' ? 'გახდი ინსტრუქტორი' : 'გაგზავნა'}
                                </button>
                            </form>
                        </div>

                        <div class="lg:w-1/2 lg:pl-8 lg:border-l lg:border-gray-200">
                            <div class="space-y-6">
                                <div>
                                    <h3 class="text-xl font-gsans font-bold text-gray-900 mb-4">
                                        {formType() === 'instructor' ? 'რატომ გახდეთ ჩვენი ინსტრუქტორი?' : 'როგორ შეგვიძლია დაგეხმაროთ?'}
                                    </h3>
                                    <p class="text-gray-600 font-gsans font-normal mb-6">
                                        {formType() === 'instructor' 
                                            ? 'გაზიარეთ თქვენი ცოდნა ათასობით მსმენელთან და შექმენით შემოსავლის ახალი წყარო. ჩვენ დაგეხმარებით კურსის შექმნასა და პრომოუშენში.'
                                            : 'გვაქვს მზადყოფნა ვუპასუხოთ თქვენს ნებისმიერ კითხვას ან მოსაზრებას 24 საათის განმავლობაში.'}
                                    </p>
                                </div>

                                <div class="space-y-4">
                                    <div class="flex items-start gap-3">
                                        <div class="w-8 h-8 rounded-full bg-[#E85A4F] bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg class="w-4 h-4 text-[#E85A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 class="font-gsans font-medium text-gray-900">პირადი მენტორი</h4>
                                            <p class="text-sm text-gray-600 mt-1">ჩვენი გუნდი დაგეხმარებათ კურსის შექმნის ყველა ეტაპზე</p>
                                        </div>
                                    </div>

                                    <div class="flex items-start gap-3">
                                        <div class="w-8 h-8 rounded-full bg-[#E85A4F] bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg class="w-4 h-4 text-[#E85A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 class="font-gsans font-medium text-gray-900">შემოსავლის ზრდა</h4>
                                            <p class="text-sm text-gray-600 mt-1">მიიღეთ კურსის გაყიდვების 70%-მდე მოგება</p>
                                        </div>
                                    </div>

                                    <div class="flex items-start gap-3">
                                        <div class="w-8 h-8 rounded-full bg-[#E85A4F] bg-opacity-10 flex items-center justify-center flex-shrink-0 mt-1">
                                            <svg class="w-4 h-4 text-[#E85A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h6l2 4m-8-4v8m0-8V6a1 1 0 00-1-1H4a1 1 0 00-1 1v9h2m8 0H9m4 0h2m4 0h2v-4m0 0h-5m3.5 5.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0Zm-10 0a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0Z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 class="font-gsans font-medium text-gray-900">პლატფორმის აუდიტორია</h4>
                                            <p class="text-sm text-gray-600 mt-1">ჩვენი პლატფორმა აერთიანებს ათასობით მსმენელს</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="pt-6 border-t border-gray-200">
                                    <p class="text-gray-600 text-sm font-gsans font-normal mb-4">
                                        ალტერნატიულად, დაგვიკავშირდით პირდაპირ:
                                    </p>
                                    <div class="flex flex-col gap-3">
                                        <A
                                            href={`mailto:${import.meta.env.VITE_EMAIL}`}
                                            class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-[#E85A4F] rounded-lg transition-colors"
                                        >
                                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span class="font-gsans font-medium text-gray-700">{import.meta.env.VITE_EMAIL}</span>
                                        </A>
                                        <A
                                            href="tel:+995322603060"
                                            class="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 hover:border-[#E85A4F] rounded-lg transition-colors"
                                        >
                                            <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            <span class="font-gsans font-medium text-gray-700">+995 (32) 2 60 30 60</span>
                                        </A>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}