import { A, createAsync, query } from "@solidjs/router"
import { For } from "solid-js/web"
import { logout } from "./api/auth/logout"

const get_user = query(async () => {
    'use server'
    try {
        return true
    } catch (error) {
        console.log(error)
    }
}, 'dashboard')

export const route = {
    preload: () => get_user()
}

const User = (props) => {
    createAsync(() => get_user(), { deferStream: true })

    const sidebar_content = [
        {
            content: 'მთავარი',
            icon: '/svg/dashboard-icon.svg',
            link: '/dashboard',
        },
        {
            content: 'კურსები',
            icon: '/svg/courses.svg',
            link: '/dashboard/courses',
        },
    ]

    const settings = [
        { icon: '/svg/dashboard-icon.svg', link: '/dashboard', content: 'მთავარი' },
        { icon: '/svg/security.svg', link: '/security', content: 'უსაფრთხოება' },
    ]

    return <div class="relative bg-[#f7f6f9] h-full min-h-screen">
        <div class="flex items-start">
            <nav class="bg-white h-screen overflow-auto bg-gray-500 lg:min-w-[266px]">
                <div class="flex items-center gap-2 justify-center pt-6 pb-2 px-4 sticky top-0 min-h-[64px]">
                    <A href="/" class="text-[#E85A4F] text-4xl tracking-[0.2em] font-sans font-bold">
                        ARTRA
                    </A>
                    {/* <button class="lg:hidden ml-auto">
                            <img src='/svg/close.svg' />
                        </button> */}
                </div>

                <div class="py-4 px-4">
                    <ul class="space-y-2">
                        <For each={sidebar_content}>
                            {(sc, i) => (
                                <li>
                                    <A href={sc.link}
                                    activeClass="bg-gray-100"
                                    inactiveClass="hover:bg-gray-100"
                                    end
                                        class="text-slate-800 text-[15px] font-medium flex items-center cursor-pointer rounded-md px-3 py-2.5">
                                        <img src={sc.icon} class="mr-3" />
                                        <span class="overflow-hidden text-ellipsis font-medium-tbc font-bold whitespace-nowrap">{sc.content}</span>
                                        <img src='/svg/arrow-right.svg' class="ml-auto" />
                                    </A>
                                </li>
                            )}
                        </For>
                    </ul>
                </div>
            </nav>

            {/* <button class="lg:hidden ml-4 mt-4 fixed top-0 left-0 bg-white z-[50]">
                <img src='/src/menu-burger.svg' />
            </button> */}
            <section class="w-full">
                <header class="z-50 sticky top-0">
                    <div
                        class="flex flex-wrap items-center px-6 py-2 bg-white min-h-[56px] w-full relative tracking-wide">
                        <div class="flex items-center flex-wrap gap-x-8 gap-y-4 z-50 w-full">
                            <div class="flex items-center gap-8 ml-auto">
                                <div class="flex items-center space-x-6">
                                    <A href='/dashboard'>
                                        <img src='/svg/dashboard-icon.svg' class="cursor-pointer" />
                                    </A>
                                    <button>
                                        <img src='/svg/notification.svg' class="cursor-pointer" />
                                    </button>
                                </div>

                                <div class="relative flex shrink-0 group">
                                    <img src="/default_profile.png" alt="profile-pic"
                                        class="w-9 h-9 rounded-full border-2 border-gray-300 cursor-pointer" />
                                    <div
                                        class="hidden group-hover:block shadow-md p-2 bg-white rounded-md absolute top-9 right-0 w-56">
                                        <div class="w-full">
                                            <A href='/account'
                                                class="text-[15px] text-slate-800 font-medium cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100">
                                                <img src='/svg/gear.svg' class="mr-3" />
                                                <span class="font-regular-tbc text-sm">ექაუნთი</span>
                                            </A>
                                            <hr class="my-2 -mx-2 border-gray-200" />
                                            <For each={settings}>
                                                {(s) => (
                                                    <A href={s.link}
                                                        class="text-[15px] text-slate-800 font-medium cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100">
                                                        <img src={s.icon} class="mr-3" />
                                                        <span class="font-regular-tbc text-sm">{s.content}</span>
                                                    </A>
                                                )}
                                            </For>
                                            <form action={logout} method="POST" class="text-[15px] text-slate-800 font-medium cursor-pointer rounded-md hover:bg-gray-100">
                                                <button type='submit' class="w-full cursor-pointer flex items-center p-2 font-regular-tbc text-sm">
                                                    <img src='/svg/logout.svg' class="mr-3" />
                                                    <span>გასვლა</span>
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {props.children}
            </section>
        </div>
    </div>
}

export default User