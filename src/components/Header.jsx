import { createAsync } from "@solidjs/router"
import { createEffect, createSignal, lazy, Match, on, onCleanup, Show, Suspense, Switch } from "solid-js"
import { get_header } from "~/routes/api/user/landing.js"

const LazyHeaderActionsAuthorized = lazy(() => import('./HeaderActionsAuthorized.jsx'))
const LazyHeaderLinks = lazy(() => import('./HeaderLinks.jsx'))
const LazyMobileMenu = lazy(() => import('./MobileMenu.jsx'))

export const Header = () => {
    const data = createAsync(get_header, { deferStream: true })
    const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false)
    let mobileMenuRef

    createEffect(on(isMobileMenuOpen, () => {
        const onClick = (e) => {
            if (isMobileMenuOpen() && mobileMenuRef && !mobileMenuRef.contains(e.target)) {
                setIsMobileMenuOpen(false)
            }
        }
        document.addEventListener("click", onClick)
        onCleanup(() => document.removeEventListener("click", onClick))
    }, { defer: true }))

    return (
        <header
            role="banner"
            class="sticky top-0 left-0 right-0 w-full z-50 bg-white border-b border-gray-200/50 rounded-b-3xl
                px-4 lg:px-12 py-3 lg:py-4 transition-all duration-300"
        >
            <div class="container mx-auto flex items-center justify-between">
                <a
                    href="/"
                    class="text-[#E85A4F] text-2xl lg:text-3xl tracking-[0.15em] font-gsans font-[800] hover:opacity-90 transition-opacity"
                    aria-label="Artra - მთავარი გვერდი"
                >
                    ARTRA
                </a>
                <div class="hidden lg:flex">
                    <Suspense>
                        <Switch>
                            <Match when={data()?.status === 200}>
                                <LazyHeaderActionsAuthorized avatar={data()?.avatar} />
                            </Match>
                            <Match when={data()?.status === 401}>
                                <LazyHeaderLinks />
                            </Match>
                        </Switch>
                    </Suspense>
                </div>
                <button
                    class="lg:hidden flex flex-col items-center justify-center w-10 h-10 rounded"
                    onClick={(e) => { e.stopPropagation(); setIsMobileMenuOpen(v => !v) }}
                    aria-label={isMobileMenuOpen() ? "მენიუს დახურვა" : "მენიუს გახსნა"}
                    aria-expanded={isMobileMenuOpen()}
                    aria-controls="mobile-menu"
                >
                    <span class={`w-6 h-0.5 bg-gray-700 mb-1.5 transition-transform ${isMobileMenuOpen() ? "rotate-45 translate-y-2" : ""}`} />
                    <span class={`w-6 h-0.5 bg-gray-700 mb-1.5 transition-opacity ${isMobileMenuOpen() ? "opacity-0" : ""}`} />
                    <span class={`w-6 h-0.5 bg-gray-700 transition-transform ${isMobileMenuOpen() ? "-rotate-45 -translate-y-2" : ""}`} />
                </button>
            </div>
            <Show when={isMobileMenuOpen()}>
                <div
                    ref={el => (mobileMenuRef = el)}
                    id="mobile-menu"
                    role="dialog"
                    aria-label="მობილური მენიუ"
                    class="lg:hidden border-t border-gray-100 pt-4 pb-2"
                >
                    <Suspense>
                        <LazyMobileMenu
                            status={data()?.status}
                            onClose={() => setIsMobileMenuOpen(false)}
                        />
                    </Suspense>
                </div>
            </Show>
        </header>
    )
}