import { A, useLocation } from "@solidjs/router"
import { logout } from "~/routes/api/auth/logout"

export default () => {
    const location = useLocation()

    return (
        <div class="w-48 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
            <A
                href="/account"
                state={location.pathname}
                class="flex items-center gap-3 px-4 py-2.5 text-sm font-gsans text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
                <img src='/svg/gear.svg' width={16} height={16} alt="" />
                აქაუნთი
            </A>

            <div class="border-t border-gray-100">
                <form action={logout} method="POST">
                    <button
                        type="submit"
                        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-700 font-gsans hover:bg-red-50 transition-colors"
                    >
                        <img src='/svg/logout.svg' width={16} height={16} alt="" />
                        გასვლა
                    </button>
                </form>
            </div>
        </div>
    )
}