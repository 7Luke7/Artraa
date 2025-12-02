import { A } from "@solidjs/router"
import { Match, Switch } from "solid-js"

export const Header = ({ is_auth, bg}) => {
    return <header class={`flex ${bg ?? "bg-[#EAE7DC]"} px-14 z-[50] top-0 py-6 right-0 justify-between items-center sticky`}>
        <A href="/" class="text-[#E85A4F] text-4xl tracking-[0.2em] font-sans font-bold">
            ARTRA
        </A>
        <nav class="flex items-center gap-x-[40px]">
            <A
                class="relative text-gray-800 py-1 font-regular-tbc
                hover:text-[#E98074] transition duration-200 ease-in
                before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2
                before:bottom-0 before:h-[2px] before:w-0 before:bg-[#E98074]
                before:transition-all before:duration-300
                hover:before:w-full"
                href="/about"
            >
                ჩვენს შესახებ
            </A>
            <A
                class="relative text-gray-800 py-1 font-regular-tbc
                hover:text-[#E98074] transition duration-200 ease-in
                before:content-[''] before:absolute before:left-1/2 before:-translate-x-1/2
                before:bottom-0 before:h-[2px] before:w-0 before:bg-[#E98074]
                before:transition-all before:duration-300
                hover:before:w-full"
                href="/contact"
            >
                კონტაქტი
            </A>
            <Switch>
                <Match when={is_auth}>
                    <A
                        class="relative text-gray-800 py-1 font-regular-tbc"
                        href="/dashboard"
                    >
                        პროფილი
                    </A>
                </Match>
                <Match when={!is_auth}>
                    <A
                        class="relative text-gray-800 py-1 font-regular-tbc"
                        href="/login"
                    >
                        შესვლა
                    </A>
                </Match>
            </Switch>
        </nav>
    </header>
}