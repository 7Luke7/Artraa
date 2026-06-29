import { A } from "@solidjs/router"

export default () => {
    return <nav
        class="hidden lg:flex items-center gap-x-4 lg:gap-x-8"
        aria-label="მთავარი ნავიგაცია"
    >
        <A
            href="/courses"
            class="relative text-gray-700 hover:text-[#E85A4F] py-2 font-gsans font-medium text-sm lg:text-base transition-colors duration-200
                                        after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#E85A4F] 
                                        after:transition-all after:duration-300 hover:after:w-full"
            activeClass="text-[#E85A4F] after:w-full"
            aria-current="page"
        >
            კურსები
        </A>
        <A
            href="/about"
            class="relative text-gray-700 hover:text-[#E85A4F] py-2 font-gsans font-medium text-sm lg:text-base transition-colors duration-200
                                    after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-0.5 after:w-0 after:bg-[#E85A4F] 
                                    after:transition-all after:duration-300 hover:after:w-full"
            activeClass="text-[#E85A4F] after:w-full"
            aria-current="page"
        >
            ჩვენს შესახებ
        </A>

        <span class="h-6 w-px bg-gray-300" aria-hidden="true"></span>

        <A
            href="/login"
            target="_self"
            class="group inline-flex items-center justify-center gap-2 rounded-lg bg-[#E85A4F] hover:bg-[#D84A3F] px-5 py-2.5 lg:px-6 lg:py-3 text-sm lg:text-base font-gsans font-bold text-white transition-all duration-300 hover:shadow-lg"
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
            class="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-gray-300 hover:border-[#E85A4F] hover:text-[#E85A4F] px-5 py-2.5 lg:px-6 lg:py-3 text-sm lg:text-base font-gsans font-bold text-gray-800 transition-all duration-300"
            rel="noopener"
        >
            რეგისტრაცია
        </A>
    </nav>
}