import { A } from "@solidjs/router"
import { For } from "solid-js"
import { RenderProtectedRoute } from "~/components/RenderProtectedRoute"

const AccountLayout = (props) => {
    const sidebarItems = [
        {
            icon: '/svg/gear.svg',
            label: 'აქაუნთი',
            href: '/account',
            description: 'პირადი ინფორმაცია'
        },
        {
            icon: '/svg/security.svg',
            label: 'უსაფრთხოება',
            href: '/account/security',
            description: 'პაროლი და უსაფრთხოება'
        },
    ]

    return (
        <RenderProtectedRoute>
            <div class="min-h-screen flex flex-col lg:flex-row">
                <div class="lg:hidden border-b border-gray-200 px-4 py-3">
                    <A
                        href={typeof props.location.state === 'string' ? props.location.state : '/'}
                        class="inline-flex items-center text-sm font-medium-gsans text-gray-700 hover:text-[#E85A4F]"
                        aria-label="დაბრუნება წინა გვერდზე"
                    >
                        <img
                            src='/svg/arrow-back.svg'
                            width={20}
                            height={20}
                            alt=""
                            aria-hidden="true"
                            class="mr-2"
                        />
                        დაბრუნება
                    </A>
                </div>

                <aside
                    class="hidden lg:block w-full lg:w-1/4 xl:w-1/5 border-r border-gray-200 sticky top-0 h-screen"
                    aria-label="ანგარიშის ნავიგაცია"
                >
                    <div class="p-4 lg:p-6">
                        <A
                            href={typeof props.location.state === 'string' ? props.location.state : '/'}
                            class="inline-flex items-center mb-6 lg:mb-8 text-sm font-medium-gsans text-gray-700 hover:text-[#E85A4F]"
                            aria-label="დაბრუნება წინა გვერდზე"
                        >
                            <img
                                src='/svg/arrow-back.svg'
                                width={24}
                                height={24}
                                alt=""
                                aria-hidden="true"
                                class="mr-2"
                            />
                            დაბრუნება
                        </A>

                        <nav
                            class="space-y-1"
                            aria-label="ანგარიშის სექციები"
                        >
                            <For each={sidebarItems}>
                                {(item) => (
                                    <A
                                        href={item.href}
                                        activeClass="bg-[#E85A4F]/10 border-l-4 border-[#E85A4F] text-[#E85A4F]"
                                        inactiveClass="hover:bg-gray-50 text-gray-700 border-l-4 border-transparent"
                                        end
                                        class="flex items-center py-3 px-3 lg:px-4 rounded-r-lg transition-colors duration-200 group"
                                        aria-current={props.location.pathname === item.href ? "page" : undefined}
                                    >
                                        <div
                                            class="w-8 h-8 flex items-center justify-center mr-3"
                                            aria-hidden="true"
                                        >
                                            <img
                                                src={item.icon}
                                                class="w-5 h-5"
                                                alt=""
                                                aria-hidden="true"
                                            />
                                        </div>
                                        <div>
                                            <span class="font-gsans font-medium text-sm block">
                                                {item.label}
                                            </span>
                                            <span class="text-xs font-gsans font-normal text-gray-500 block">
                                                {item.description}
                                            </span>
                                        </div>
                                    </A>
                                )}
                            </For>
                        </nav>
                    </div>
                </aside>

                <nav
                    class="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 shadow-sm"
                    aria-label="მობილური ნავიგაცია"
                >
                    <div class="flex justify-around">
                        <For each={sidebarItems}>
                            {(item) => (
                                <A
                                    href={item.href}
                                    activeClass="text-[#E85A4F]"
                                    inactiveClass="text-gray-500"
                                    end
                                    class="flex flex-col items-center p-2 relative"
                                    aria-label={item.label}
                                    aria-current={props.location.pathname === item.href ? "page" : undefined}
                                >
                                    <div class="relative">
                                        <img
                                            src={item.icon}
                                            class="w-6 h-6 mb-1"
                                            alt=""
                                            aria-hidden="true"
                                        />
                                        <Show when={props.location.pathname === item.href}>
                                            <span
                                                class="absolute -top-2 left-1/2 transform -translate-x-1/2 w-full h-0.5 bg-[#E85A4F] rounded-full"
                                                aria-hidden="true"
                                            ></span>
                                        </Show>
                                    </div>
                                    <span class="text-xs font-gsans font-medium">
                                        {item.label}
                                    </span>
                                </A>
                            )}
                        </For>
                    </div>
                </nav>

                <main
                    class="flex-1 p-4 md:p-6 lg:p-8 pb-24 lg:pb-8"
                    id="main-content"
                    aria-labelledby="page-title"
                >
                    <div class="max-w-4xl mx-auto">
                        <h1
                            id="page-title"
                            class="lg:sr-only text-xl font-bold-gsans text-gray-900 mb-6"
                        >
                            ანგარიშის მართვა
                        </h1>

                        {props.children}
                    </div>
                </main>
            </div>
        </RenderProtectedRoute>
    )
}

export default AccountLayout