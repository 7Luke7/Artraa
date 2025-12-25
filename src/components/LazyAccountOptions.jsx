import { A, useLocation } from "@solidjs/router"
import { logout } from "~/routes/api/auth/logout"

export const AccountOptions = () => {
    const location = useLocation();

    return <div class="overflow-hidden w-50 border border-gray-200 bg-white shadow-lg border border-gray-200 transition-all duration-150">
        <A href='/dashboard'
            class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
            <img src="/svg/home.svg" class="rounded-lg mr-3" alt='' width={20} height={20}  />
            <span class="font-gsans font-normal">ჩემი სივრცე</span>
        </A>
        <A href='/account'
            state={location.pathname}
            class="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
            <img src='/svg/gear.svg' class="rounded-lg mr-3" alt='' width={20} height={20} />
            <span class="font-gsans font-normal">აქაუნთი</span>
        </A>
        <form action={logout} method="POST" class="border-t border-gray-200">
            <button type='submit' class="w-full flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50">
                <img src='/svg/logout.svg' class="rounded-lg mr-3" alt='' width={20} height={20} />
                <span class="font-gsans font-normal">გასვლა</span>
            </button>
        </form>
    </div>
}