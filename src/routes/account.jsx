// ~/components/AccountLayout.jsx
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
        {
            icon: '/svg/billing.svg',
            label: 'გადახდები',
            href: '/account/billing',
            description: 'გადახდების ისტორია'
        }
    ]

    return <RenderProtectedRoute>
        <div class="min-h-screen relative flex flex-col lg:flex-row gap-8 px-4 pt-8">
            <div class="px-4 border-r w-1/6 border-gray-200 top-0 sticky">
                <A href='/dashboard'>
                    <img src='/svg/arrow-back.svg' width={36} height={36} class="mb-4" alt="go back" />
                </A>
                <nav class="space-y-1">
                    <For each={sidebarItems}>
                        {(item) => (
                            <A
                                href={item.href}
                                activeClass="bg-[#E85A4F]/10 border-l-3 border-[#E85A4F] text-[#E85A4F]"
                                inactiveClass="hover:bg-gray-50 text-gray-700"
                                end
                                class="flex items-center py-3 px-2 rounded-lg transition-colors group"
                            >
                                <div class="w-8 h-8 flex items-center justify-center mr-3">
                                    <img src={item.icon} class="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 class="font-medium-tbc text-sm">{item.label}</h2>
                                    <p class="text-xs font-regular-tbc text-gray-500">{item.description}</p>
                                </div>
                            </A>
                        )}
                    </For>
                </nav>
            </div>

            <main class="py-12 border-t border-gray-200 w-full">
                {props.children}
            </main>
        </div>
    </RenderProtectedRoute>
}

export default AccountLayout