import { A, createAsync } from "@solidjs/router"
import { createEffect, createSignal, lazy, Match, on, onCleanup, onMount, Show, Suspense, Switch } from "solid-js"
import { get_header } from "~/routes/api/user/dashboard/landing"

const LazyHeaderActionsAuthorized = lazy(() => import('./HeaderActionsAuthorized.jsx'))
const LazyHeaderLinks = lazy(() => import('./HeaderLinks.jsx'))

export const Header = () => {
    const data = createAsync(get_header, { deferStream: true })
    const [isScrolled, setIsScrolled] = createSignal(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false)
    let mobileMenuRef;

    createEffect(on(isMobileMenuOpen, () => {
        const handleClick = (event) => {
            if (
                isMobileMenuOpen() &&
                mobileMenuRef &&
                !mobileMenuRef.contains(event.target)
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener("click", handleClick);

        onCleanup(() => document.removeEventListener('click', handleClick))
    }, { defer: true }))

    onMount(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        
        window.addEventListener("scroll", handleScroll);
        onCleanup(() => window.removeEventListener("scroll", handleScroll));
    });
    return (
        <header
            role="banner"
            class={`sticky top-0 left-0 right-0 w-full z-50 transition-all duration-300
                ${isScrolled() && 'shadow-lg'}
                border-b bg-white border-gray-200/50
                px-4 lg:px-12
                rounded-b-3xl
                py-3 lg:py-4`}
        >
            <div class="container mx-auto flex items-center justify-between">
                <div class="flex items-center">
                    <A
                        href="/"
                        class="text-[#E85A4F] text-2xl lg:text-3xl tracking-[0.15em] font-sans font-[800] hover:opacity-90 transition-opacity rounded"
                        aria-label="Artra - მთავარი გვერდი"
                    >
                        <h1 class="m-0">ARTRA</h1>
                    </A>
                </div>

                <Suspense>
                    <Switch>
                        <Match when={data()?.status === 200}>
                            <LazyHeaderActionsAuthorized data={data} />
                        </Match>
                        <Match when={data()?.status === 401}>
                            <LazyHeaderLinks />
                        </Match>
                    </Switch>
                </Suspense>
                <button
                    class="xl:hidden flex flex-col items-center justify-center w-10 h-10 rounded"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen())}
                    aria-label={isMobileMenuOpen() ? "მენიუს დახურვა" : "მენიუს გახსნა"}
                    aria-expanded={isMobileMenuOpen()}
                    aria-controls="mobile-menu"
                >
                    <span class={`w-6 h-0.5 bg-gray-700 mb-1.5 transition-transform ${isMobileMenuOpen() ? 'rotate-45 translate-y-2' : ''}`}></span>
                    <span class={`w-6 h-0.5 bg-gray-700 mb-1.5 transition-opacity ${isMobileMenuOpen() ? 'opacity-0' : ''}`}></span>
                    <span class={`w-6 h-0.5 bg-gray-700 transition-transform ${isMobileMenuOpen() ? '-rotate-45 -translate-y-2' : ''}`}></span>
                </button>
            </div>
            <Show when={isMobileMenuOpen()}>
                <div
                    ref={el => (mobileMenuRef = el)}
                    class="xl:hidden bg-white border-t border-gray-200 px-4 py-4"
                    id="mobile-menu"
                    role="dialog"
                    aria-label="მობილური მენიუ"
                >
                    <nav
                        class="flex flex-col gap-y-4"
                        aria-label="მობილური ნავიგაცია"
                    >
                        <A
                            href="/about"
                            class="text-gray-700 hover:text-[#E85A4F] font-gsans font-medium py-2 px-3 rounded-lg hover:bg-gray-50"
                            aria-current="page"
                        >
                            ჩვენს შესახებ
                        </A>
                        <A
                            href="/contact"
                            class="text-gray-700 hover:text-[#E85A4F] font-gsans font-medium py-2 px-3 rounded-lg hover:bg-gray-50"
                            aria-current="page"
                        >
                            კონტაქტი
                        </A>
                        <A
                            href="/courses"
                            class="text-gray-700 hover:text-[#E85A4F] font-gsans font-medium py-2 px-3 rounded-lg hover:bg-gray-50"
                            aria-current="page"
                        >
                            კურსები
                        </A>

                        <Show when={data()?.status === 401}>
                            <div class="pt-4 border-t border-gray-200 space-y-3">
                                <A
                                    href="/login"
                                    target="_self"
                                    class="block text-center bg-[#E85A4F] text-white font-gsans font-bold py-3 px-4 rounded-lg hover:bg-[#D84A3F]"
                                    rel="noopener"
                                >
                                    შესვლა
                                </A>
                                <A
                                    href="/register"
                                    target="_self"
                                    class="block text-center border border-gray-300 text-gray-800 font-gsans font-bold py-3 px-4 rounded-lg hover:border-[#E85A4F] hover:text-[#E85A4F]"
                                    rel="noopener"
                                >
                                    რეგისტრაცია
                                </A>
                            </div>
                        </Show>

                        <Show when={data()?.status === 200}>
                            <div class="pt-4 border-t border-gray-200">
                                <div class="flex items-center p-3">
                                    <img
                                        src={data()?.data ?? '/default_profile.png'}
                                        alt='პროფილის სურათი'
                                        class="rounded-full w-10 h-10 object-cover"
                                        width={40}
                                        height={40}
                                        loading="lazy"
                                    />
                                </div>
                            </div>
                        </Show>
                    </nav>
                </div>
            </Show>
        </header>
    )
}