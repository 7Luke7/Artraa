import { createAsync } from "@solidjs/router"
import { get_user } from "../api/user/account"
import { Title } from "@solidjs/meta"
import { ProfilePicture } from "./components/ProfilePicture"

const Account = () => {
    const user = createAsync(get_user, { deferStream: false })

    return (
        <>
            <Title>Artra - აქაუნთი</Title>
            
            <div class="min-h-screen bg-gray-50 py-8 md:py-12">
                <div class="container mx-auto px-4 md:px-[56px]">
                    <div class="mb-8 md:mb-12">
                        <h1 class="text-3xl md:text-4xl font-bold font-gsans text-gray-900">
                            ჩემი პროფილი
                        </h1>
                        <p class="text-gray-500 font-normal font-gsans mt-2">
                            პერსონალური ინფორმაცია და სტატისტიკა
                        </p>
                    </div>
                    <div class="max-w-4xl mx-auto">
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                            <ProfilePicture user={user}></ProfilePicture>
                            <div class="pt-16 pb-6 px-6 md:px-8">
                                <h2 class="text-2xl md:text-3xl font-bold font-gsans text-gray-900">
                                    {user()?.name}
                                </h2>
                                <div class="flex items-center gap-2 mt-2">
                                    <span class="text-sm font-normal text-gray-500">{user()?.email}</span>
                                </div>
                            </div>
                        </div>
                        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div class="border-b border-gray-100 px-6 md:px-8 py-4">
                                <h3 class="text-lg font-bold font-gsans text-gray-900">
                                    პირადი ინფორმაცია
                                </h3>
                            </div>
                            
                            <div class="p-6 md:p-8 space-y-6">
                                <div class="group">
                                    <label class="block font-gsans text-sm font-medium text-gray-500 mb-2">
                                        სრული სახელი
                                    </label>
                                    <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 group-hover:border-gray-200 transition">
                                        <div class="flex items-center gap-3">
                                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span class="text-gray-900 font-gsans font-medium">
                                                {user()?.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="group">
                                    <label class="block text-sm font-gsans font-medium text-gray-500 mb-2">
                                        ელექტრონული ფოსტა
                                    </label>
                                    <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 group-hover:border-gray-200 transition">
                                        <div class="flex items-center gap-3">
                                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                            <span class="text-gray-900">
                                                {user()?.email}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="group">
                                    <label class="block text-sm font-gsans font-medium text-gray-500 mb-2">
                                        შემოუერთდა
                                    </label>
                                    <div class="bg-gray-50 rounded-xl p-4 border border-gray-100 group-hover:border-gray-200 transition">
                                        <div class="flex items-center gap-3">
                                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span class="text-gray-900">
                                                <time datetime={user()?.created_at}>
                                                    {user()?.parsed_created_at}
                                                </time>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Account