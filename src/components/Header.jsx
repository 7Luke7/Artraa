import { A, createAsync } from "@solidjs/router"
import { createEffect, createSignal, Match, on, onCleanup, Show, Switch } from "solid-js"
import { AccountOptions } from "~/components/LazyAccountOptions"
import { Notifications } from "~/components/LazyNotifications"
import { HeaderNotification } from "~/components/Header_Notification"
import { get_header } from "~/routes/api/user/dashboard/landing"

export const Header = () => {
    const data = createAsync(get_header, { deferStream: true })
    const [displayModal, setDisplayModal] = createSignal({ notification: false, account: false })
    const [isScrolled, setIsScrolled] = createSignal(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = createSignal(false)
    let ref;
    let mobileMenuRef;

    // Handle scroll effect
    createEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        onCleanup(() => window.removeEventListener('scroll', handleScroll))
    })

    createEffect(on(displayModal,() => {
        if (!displayModal().account && !displayModal().notification) return;

        const handleClickOutside = (event) => {
            if (ref && !ref.contains(event.target)) {
                setDisplayModal({notification: false, account: false});
            }
        };

        document.addEventListener('click', handleClickOutside);
        onCleanup(() => {
            document.removeEventListener('click', handleClickOutside);
        });
    }, {defer: true}));

    createEffect(on(isMobileMenuOpen, () => {
        if (!isMobileMenuOpen()) return;

        const handleClickOutside = (event) => {
            if (mobileMenuRef && !mobileMenuRef.contains(event.target)) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        onCleanup(() => {
            document.removeEventListener('click', handleClickOutside);
        });
    }, { defer: true }));

    createEffect(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                if (displayModal().account || displayModal().notification) {
                    setDisplayModal({ notification: false, account: false });
                }
                if (isMobileMenuOpen()) {
                    setIsMobileMenuOpen(false);
                }
            }
        };

        document.addEventListener('keydown', handleEscape);
        onCleanup(() => document.removeEventListener('keydown', handleEscape));
    });

    return (
        <header 
            role="banner"
            class={`sticky top-0 left-0 w-full z-50 transition-all duration-300
                ${isScrolled() ? 'shadow-md bg-white/95 backdrop-blur-sm' : 'bg-white'}
                border-b border-gray-200/50
                px-4 md:px-8 lg:px-12
                rounded-b-3xl
                py-3 md:py-4`}
        >
            <div class="container mx-auto flex items-center justify-between">
                <div class="flex items-center">
                    <A 
                        href="/" 
                        class="text-[#E85A4F] text-2xl md:text-3xl tracking-[0.15em] font-sans font-[800] hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 rounded"
                        aria-label="Artra - მთავარი გვერდი"
                    >
                        <h1 class="m-0">ARTRA</h1>
                    </A> 
                </div>
                
                <Switch>
                    <Match when={data()}>
                        <div class="flex items-center gap-x-4 md:gap-x-6">
                            <HeaderNotification setDisplayModal={setDisplayModal} />
                            <div class="relative">
                                <button 
                                    class="hover:opacity-90 transition-opacity group focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 rounded-full"
                                    onClick={() => setDisplayModal(prev => ({ 
                                        notification: false, 
                                        account: !prev.account 
                                    }))} 
                                    type="button"
                                    aria-label="ანგარიშის პარამეტრები"
                                    aria-expanded={displayModal().account}
                                    aria-controls="account-options"
                                    aria-haspopup="true"
                                >                                    
                                    <div class="relative">
                                        <img 
                                            src={data().pfp ?? '/default_profile.png'} 
                                            alt={`${data().name || 'მომხმარებლის'} პროფილის სურათი`} 
                                            class="rounded-full border-2 border-white shadow-sm w-10 h-10 md:w-12 md:h-12 object-cover"
                                            width={48}
                                            height={48}
                                            loading="lazy"
                                        />
                                        <span class="sr-only">ონლაინ მომხმარებელი</span>
                                        <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" aria-hidden="true"></div>
                                    </div>
                                </button>

                                <Show when={displayModal().account}>
                                    <div 
                                        ref={el => (ref = el)} 
                                        class="absolute right-0 mt-2 z-50"
                                        id="account-options"
                                        role="menu"
                                        aria-orientation="vertical"
                                    >
                                        <AccountOptions onClose={() => setDisplayModal({ ...displayModal(), account: false })} />
                                    </div>
                                </Show>
                            </div>

                            <Show when={displayModal().notification}>
                                <div 
                                    ref={el => (ref = el)} 
                                    class="absolute z-50 right-4 top-full mt-2"
                                    role="dialog"
                                    aria-label="შეტყობინებები"
                                >
                                    <Notifications onClose={() => setDisplayModal({ ...displayModal(), notification: false })} />
                                </div>
                            </Show>
                        </div>
                    </Match>

                    <Match when={!data()}>
                        <nav 
                            class="hidden md:flex items-center gap-x-4 md:gap-x-8"
                            aria-label="მთავარი ნავიგაცია"
                        >
                            <A
                                href="/about"
                                class="relative text-gray-700 hover:text-[#E85A4F] py-2 font-gsans font-medium text-sm md:text-base transition-colors duration-200 focus:outline-none focus:text-[#E85A4F]
                                after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#E85A4F] 
                                after:transition-all after:duration-300 hover:after:w-full focus:after:w-full"
                                activeClass="text-[#E85A4F] after:w-full"
                                aria-current="page"
                            >
                                ჩვენს შესახებ
                            </A>
                            
                            <A
                                href="/contact"
                                class="relative text-gray-700 hover:text-[#E85A4F] py-2 font-gsans font-medium text-sm md:text-base transition-colors duration-200 focus:outline-none focus:text-[#E85A4F]
                                after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#E85A4F] 
                                after:transition-all after:duration-300 hover:after:w-full focus:after:w-full"
                                activeClass="text-[#E85A4F] after:w-full"
                                aria-current="page"
                            >
                                კონტაქტი
                            </A>
                            
                            <A
                                href="/courses"
                                class="relative text-gray-700 hover:text-[#E85A4F] py-2 font-gsans font-medium text-sm md:text-base transition-colors duration-200 focus:outline-none focus:text-[#E85A4F]
                                after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#E85A4F] 
                                after:transition-all after:duration-300 hover:after:w-full focus:after:w-full"
                                activeClass="text-[#E85A4F] after:w-full"
                                aria-current="page"
                            >
                                კურსები
                            </A>

                            <span class="h-6 w-px bg-gray-300" aria-hidden="true"></span>

                            <A
                                href="/login"
                                target="_self"
                                class="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#E85A4F] hover:bg-[#D84A3F] px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-gsans font-bold text-white transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2"
                                rel="noopener"
                            >
                                <span>შესვლა</span>
                                <img 
                                    src='svg/arrow-narrow-right.svg' 
                                    alt="" 
                                    class="transition-transform group-hover:translate-x-1" 
                                    aria-hidden="true"
                                />
                            </A>

                            <A
                                href="/register"
                                target="_self"
                                class="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 hover:border-[#E85A4F] hover:text-[#E85A4F] px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-gsans font-bold text-gray-800 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2"
                                rel="noopener"
                            >
                                რეგისტრაცია
                            </A>
                        </nav>
                    </Match>
                </Switch>
                <button 
                    class="md:hidden flex flex-col items-center justify-center w-10 h-10 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 rounded"
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
                    class="md:hidden bg-white border-t border-gray-200 px-4 py-4 animate-slideDown"
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
                            class="text-gray-700 hover:text-[#E85A4F] font-gsans font-medium py-2 px-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:bg-gray-50 focus:text-[#E85A4F]"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-current="page"
                        >
                            ჩვენს შესახებ
                        </A>
                        <A 
                            href="/contact" 
                            class="text-gray-700 hover:text-[#E85A4F] font-gsans font-medium py-2 px-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:bg-gray-50 focus:text-[#E85A4F]"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-current="page"
                        >
                            კონტაქტი
                        </A>
                        <A 
                            href="/courses" 
                            class="text-gray-700 hover:text-[#E85A4F] font-gsans font-medium py-2 px-3 rounded-lg hover:bg-gray-50 focus:outline-none focus:bg-gray-50 focus:text-[#E85A4F]"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-current="page"
                        >
                            კურსები
                        </A>
                        
                        <Show when={!data()}>
                            <div class="pt-4 border-t border-gray-200 space-y-3">
                                <A 
                                    href="/login" 
                                    target="_self"
                                    class="block text-center bg-[#E85A4F] text-white font-gsans font-bold py-3 px-4 rounded-lg hover:bg-[#D84A3F] focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    rel="noopener"
                                >
                                    შესვლა
                                </A>
                                <A 
                                    href="/register" 
                                    target="_self"
                                    class="block text-center border border-gray-300 text-gray-800 font-gsans font-bold py-3 px-4 rounded-lg hover:border-[#E85A4F] hover:text-[#E85A4F] focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    rel="noopener"
                                >
                                    რეგისტრაცია
                                </A>
                            </div>
                        </Show>
                        
                        <Show when={data()}>
                            <div class="pt-4 border-t border-gray-200">
                                <div class="flex items-center gap-x-3 px-3 py-3">
                                    <img 
                                        src={data().pfp ?? '/default_profile.png'} 
                                        alt={`${data().name || 'მომხმარებლის'} პროფილის სურათი`} 
                                        class="rounded-full w-10 h-10 object-cover"
                                        width={40}
                                        height={40}
                                        loading="lazy"
                                    />
                                    <div>
                                        <p class="font-gsans font-semibold text-gray-900">{data().name || 'მომხმარებელი'}</p>
                                        <p class="text-sm text-gray-600">{data().email || ''}</p>
                                    </div>
                                </div>
                            </div>
                        </Show>
                    </nav>
                </div>
            </Show>
        </header>
    )
}