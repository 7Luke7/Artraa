import { A, useLocation } from "@solidjs/router"
import { logout } from "~/routes/api/auth/logout"

const AccountOptions = () => {
    const location = useLocation();

    return (
        <div class="
            w-[calc(100vw-2rem)] max-w-[13rem]
            overflow-hidden
            border border-gray-200 bg-white shadow-lg
            rounded-xl
            transition-all duration-150
        ">
            <A
                href='/dashboard'
                class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
                <img src="/svg/home.svg" class="rounded-lg mr-3 shrink-0" alt='' width={20} height={20} />
                <span class="font-gsans font-normal truncate">ჩემი სივრცე</span>
            </A>
            <A
                href='/account'
                state={location.pathname}
                class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
            >
                <img src='/svg/gear.svg' class="rounded-lg mr-3 shrink-0" alt='' width={20} height={20} />
                <span class="font-gsans font-normal truncate">აქაუნთი</span>
            </A>
            <form action={logout} method="POST" class="border-t border-gray-200">
                <button type='submit' class="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                    <img src='/svg/logout.svg' class="rounded-lg mr-3 shrink-0" alt='' width={20} height={20} />
                    <span class="font-gsans font-normal truncate">გასვლა</span>
                </button>
            </form>
        </div>
    )
}

export default AccountOptions