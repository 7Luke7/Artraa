import { A, createAsync } from "@solidjs/router"
import { createEffect, createSignal, Match, on, onCleanup, Show, Switch } from "solid-js"
import { AccountOptions } from "~/components/LazyAccountOptions"
import { Notifications } from "~/components/LazyNotifications"
import { HeaderNotification } from "~/components/Header_Notification"
import { get_header } from "~/routes/api/user/dashboard/landing"

export const Header = (props) => {
    const data = createAsync(get_header, { deferStream: true })
    const [displayModal, setDisplayModal] = createSignal({ notification: false, account: false })
    const [isScrolled, setIsScrolled] = createSignal(false)
    let ref;

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

    return (
        <header class={`sticky top-0 left-0 w-full z-50 transition-all duration-300
            ${isScrolled() ? 'shadow-md bg-white/95 backdrop-blur-sm' : 'bg-white'}
            border-b border-gray-200/50
            px-4 md:px-8 lg:px-12
            py-3 md:py-4`}>
            
            <div class="container mx-auto flex items-center justify-between">
                {/* Logo */}
                <A 
                    href="/" 
                    class="text-[#E85A4F] text-2xl md:text-3xl tracking-[0.15em] font-sans font-[800] hover:opacity-90 transition-opacity"
                >
                    ARTRA
                </A> 
                
                <Switch>
                    <Match when={data()}>
                        <div class="flex items-center gap-x-4 md:gap-x-6">
                            <HeaderNotification setDisplayModal={setDisplayModal} />
                            
                            <div class="relative">
                                <button 
                                    class="flex items-center gap-x-2 md:gap-x-3 hover:opacity-90 transition-opacity group"
                                    onClick={() => setDisplayModal(prev => ({ notification: false, account: !prev.account }))} 
                                    type="button"
                                    aria-label="ანგარიშის პარამეტრები"
                                >
                                    <div class="hidden md:flex flex-col items-end">
                                        <span class="text-sm font-gsans font-medium text-gray-600">
                                            გამარჯობა
                                        </span>
                                        <span class="text-base font-gsans font-bold text-gray-900 group-hover:text-[#E85A4F] transition-colors">
                                            {data().firstname}
                                        </span>
                                    </div>
                                    
                                    <div class="relative">
                                        <img 
                                            src={data().pfp ?? '/default_profile.png'} 
                                            alt="პროფილის სურათი" 
                                            class="rounded-full border-2 border-white shadow-sm w-10 h-10 md:w-12 md:h-12 object-cover"
                                            width={48}
                                            height={48}
                                        />
                                        <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
                                    </div>
                                </button>

                                <Show when={displayModal().account}>
                                    <div ref={el => (ref = el)} class="absolute right-0 mt-2">
                                        <AccountOptions />
                                    </div>
                                </Show>
                            </div>

                            <Show when={displayModal().notification}>
                                <div ref={el => (ref = el)} class="absolute z-50 right-4 top-full mt-2 z-50">
                                    <Notifications />
                                </div>
                            </Show>
                        </div>
                    </Match>

                    {/* Logged Out State */}
                    <Match when={!data()}>
                        <nav class="flex items-center gap-x-4 md:gap-x-8">
                            <A
                                href="/about"
                                class="relative text-gray-700 hover:text-[#E85A4F] py-2 font-gsans font-medium text-sm md:text-base transition-colors duration-200
                                after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#E85A4F] 
                                after:transition-all after:duration-300 hover:after:w-full"
                                activeClass="text-[#E85A4F] after:w-full"
                            >
                                ჩვენს შესახებ
                            </A>
                            
                            <A
                                href="/contact"
                                class="relative text-gray-700 hover:text-[#E85A4F] py-2 font-gsans font-medium text-sm md:text-base transition-colors duration-200
                                after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#E85A4F] 
                                after:transition-all after:duration-300 hover:after:w-full"
                                activeClass="text-[#E85A4F] after:w-full"
                            >
                                კონტაქტი
                            </A>
                            
                            <A
                                href="/courses"
                                class="relative text-gray-700 hover:text-[#E85A4F] py-2 font-gsans font-medium text-sm md:text-base transition-colors duration-200
                                after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#E85A4F] 
                                after:transition-all after:duration-300 hover:after:w-full"
                                activeClass="text-[#E85A4F] after:w-full"
                            >
                                კურსები
                            </A>

                            <div class="hidden md:block h-6 w-px bg-gray-300"></div>

                            <A
                                href="/login"
                                target="_self"
                                class="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#E85A4F] hover:bg-[#D84A3F] px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-gsans font-bold text-white transition-all duration-300 hover:shadow-lg"
                            >
                                <span>შესვლა</span>
                                <img src='svg/arrow-narrow-right.svg' class="transition-transform group-hover:translate-x-1" />
                            </A>

                            <A
                                target="_self"
                                href="/register"
                                class="hidden md:inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 hover:border-[#E85A4F] hover:text-[#E85A4F] px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base font-gsans font-bold text-gray-800 transition-all duration-300"
                            >
                                რეგისტრაცია
                            </A>
                        </nav>
                    </Match>
                </Switch>

                {/* Mobile Menu Button (Optional) */}
                <button 
                    class="md:hidden flex flex-col items-center justify-center w-10 h-10"
                    aria-label="მენიუს გახსნა"
                >
                    <span class="w-6 h-0.5 bg-gray-700 mb-1.5"></span>
                    <span class="w-6 h-0.5 bg-gray-700 mb-1.5"></span>
                    <span class="w-6 h-0.5 bg-gray-700"></span>
                </button>
            </div>

            {/* Mobile Navigation (Optional - if you want dropdown) */}
            <Show when={false /* Add mobile menu state here */}>
                <div class="md:hidden bg-white border-t border-gray-200 px-4 py-4">
                    <nav class="flex flex-col gap-y-4">
                        <A href="/about" class="text-gray-700 hover:text-[#E85A4F] font-gsans font-medium py-2">
                            ჩვენს შესახებ
                        </A>
                        <A href="/contact" class="text-gray-700 hover:text-[#E85A4F] font-gsans font-medium py-2">
                            კონტაქტი
                        </A>
                        <A href="/courses" class="text-gray-700 hover:text-[#E85A4F] font-gsans font-medium py-2">
                            კურსები
                        </A>
                        <div class="pt-2 border-t border-gray-200">
                            <A href="/login" target="_self" class="block text-center bg-[#E85A4F] text-white font-gsans font-bold py-3 rounded-lg mb-2">
                                შესვლა
                            </A>
                            <A href="/register" target="_self" class="block text-center border border-gray-300 text-gray-800 font-gsans font-bold py-3 rounded-lg">
                                რეგისტრაცია
                            </A>
                        </div>
                    </nav>
                </div>
            </Show>
        </header>
    )
}