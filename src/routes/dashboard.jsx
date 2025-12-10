import { A } from "@solidjs/router"
import { logout } from "./api/auth/logout"
import { RenderProtectedRoute } from "~/components/RenderProtectedRoute"

const User = (props) => {
    return <RenderProtectedRoute>
        <div class="relative flex items-start h-full min-h-screen bg-gray-50">
            <aside class="h-screen overflow-auto sticky top-0 lg:min-w-[280px] bg-white border-r border-gray-200">
                <header class="text-center py-4 bg-white border-b border-gray-100">
                    <A href="/" class="text-[#E85A4F] text-3xl tracking-[0.15em] font-medium-tbc font-bold">
                        ARTRA
                    </A>
                </header>

                <nav class="py-6 px-4">
                    <ul class="space-y-2">
                        <li>
                            <A href='/dashboard'
                                activeClass="bg-gray-100 text-[#E85A4F] border-l-3 border-[#E85A4F]"
                                inactiveClass="hover:bg-gray-50"
                                end
                                class="text-slate-800 text-[15px] font-medium-tbc flex items-center cursor-pointer rounded-lg px-4 py-3 transition-colors">
                                <div class="w-8 h-8 flex items-center justify-center mr-3 bg-gray-100 rounded-lg">
                                    <img src='/svg/dashboard-icon.svg' width={24} height={24} />
                                </div>
                                <span class="overflow-hidden text-ellipsis font-medium-tbc font-medium whitespace-nowrap flex-1">
                                    მთავარი
                                </span>
                                <img src='/svg/arrow-right.svg' width={24} height={24} />
                            </A>
                        </li>
                        <li>
                            <A href='courses'
                                activeClass="bg-gray-100 text-[#E85A4F] border-l-3 border-[#E85A4F]"
                                inactiveClass="hover:bg-gray-50"
                                end
                                class="text-slate-800 text-[15px] font-medium-tbc flex items-center cursor-pointer rounded-lg px-4 py-3 transition-colors">
                                <div class="w-8 h-8 flex items-center justify-center mr-3 bg-gray-100 rounded-lg">
                                    <img src='/svg/courses.svg' width={24} height={24} />
                                </div>
                                <span class="overflow-hidden text-ellipsis font-medium-tbc font-medium whitespace-nowrap flex-1">
                                    კურსები
                                </span>
                                <img src='/svg/arrow-right.svg' width={24} height={24} />
                            </A>
                        </li>
                    </ul>
                </nav>
            </aside>

            <section class="w-full">
                <header class="flex items-center justify-between px-8 py-4 sticky top-0 z-10 bg-white border-b border-gray-200">
                    <h1 class="text-md font-semibold text-gray-800">კეთილი იყოს თქვენი მობრძანება ლუკა!</h1>
                    <div class="flex items-center gap-6">
                        <div class="flex items-center space-x-5">
                            <A href='/dashboard' class="p-2 rounded-lg hover:bg-gray-100">
                                <img src='/svg/dashboard-icon.svg' width={20} height={20} />
                            </A>
                            <button class="relative p-2 rounded-lg hover:bg-gray-100">
                                <img src='/svg/notification.svg' width={20} height={20} />
                                <div class="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></div>
                            </button>
                        </div>

                        <div class="relative group">
                            <button class="flex items-center focus:outline-none">
                                <img src="/default_profile.png" alt="profile-pic" width={32} height={32} class="rounded-full border-2 border-gray-200" />
                            </button>

                            <div class="absolute hidden right-0 overflow-hidden top-full w-56 bg-white rounded-lg shadow-lg border border-gray-200 group-hover:block transition-all duration-150">
                                <A href='/account'
                                    class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                                    <img src='/svg/gear.svg' class="bg-gray-100 rounded-lg mr-3" width={20} height={20} />
                                    <span class="font-regular-tbc">ექაუნთი</span>
                                </A>
                                <form action={logout} method="POST" class="border-t border-gray-200">
                                    <button type='submit' class="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                                        <img src='/svg/logout.svg' class="bg-gray-100 rounded-lg mr-3" width={20} height={20} />
                                        <span class="font-regular-tbc">გასვლა</span>
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </header>
                {props.children}
            </section>
        </div>
    </RenderProtectedRoute>
}

export default User