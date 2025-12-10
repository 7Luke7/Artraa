import { A } from "@solidjs/router"
import { For } from "solid-js/web"
import { logout } from "./api/auth/logout"
import { RenderProtectedRoute } from "~/components/RenderProtectedRoute"

const User = (props) => {
    const sidebar_content = [
        {
            content: 'უსაფრთხოება',
            icon: '/svg/security.svg',
            link: '/security',
        },
    ]

    return <RenderProtectedRoute>
        <div class="relative bg-[#f7f6f9] flex items-start h-full min-h-screen">
            <aside class="bg-white h-screen overflow-auto bg-gray-500 lg:min-w-[266px]">
                <header class="flex items-center gap-2 justify-center pt-6 pb-2 px-4 sticky top-0 min-h-[64px]">
                    <A href="/" class="text-[#E85A4F] text-4xl tracking-[0.2em] font-medium-tbc font-bold">
                        ARTRA
                    </A>
                    {/* <button class="lg:hidden ml-auto">
                            <img src='/svg/close.svg' />
                        </button> */}
                </header>

                <nav class="py-4 px-4">
                    <ul class="space-y-2">
                        <For each={sidebar_content}>
                            {(sc, i) => (
                                <li>
                                    <A href={sc.link}
                                        activeClass="bg-gray-100"
                                        inactiveClass="hover:bg-gray-100"
                                        end
                                        class="text-slate-800 text-[15px] font-medium-tbc flex items-center cursor-pointer rounded-md px-3 py-2.5">
                                        <img src={sc.icon} class="mr-3" />
                                        <span class="overflow-hidden text-ellipsis font-medium-tbc font-bold whitespace-nowrap">{sc.content}</span>
                                        <img src='/svg/arrow-right.svg' class="ml-auto" />
                                    </A>
                                </li>
                            )}
                        </For>
                    </ul>
                </nav>
            </aside>

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