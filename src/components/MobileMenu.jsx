import { Show } from "solid-js"
import { logout } from "~/routes/api/auth/logout"

export default (props) => {
    const isAuthed = () => props.status === 200
    const linkCls = "flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-gsans font-medium text-gray-700 hover:bg-gray-50 hover:text-[#E85A4F] transition-colors"

    return (
        <nav class="flex flex-col gap-1" aria-label="მობილური ნავიგაცია">
            <a href="/courses" class={linkCls} onClick={props.onClose}>
                კურსები
            </a>

            <Show when={!isAuthed()}>
                <a href="/about" class={linkCls} onClick={props.onClose}>
                    ჩვენს შესახებ
                </a>
            </Show>

            <Show when={!isAuthed()}>
                <div class="pt-3 mt-2 border-t border-gray-100 space-y-2">
                    <a
                        href="/login"
                        class="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[#E85A4F] text-white font-gsans font-bold text-sm hover:bg-[#D84A3F] transition-colors"
                        onClick={props.onClose}
                    >
                        შესვლა
                    </a>
                    <a
                        href="/register"
                        class="flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-gsans font-bold text-sm hover:border-[#E85A4F] hover:text-[#E85A4F] transition-colors"
                        onClick={props.onClose}
                    >
                        რეგისტრაცია
                    </a>
                </div>
            </Show>
            <Show when={isAuthed()}>
                <div class="pt-3 mt-2 border-t border-gray-100 space-y-1">
                    <a href="/notifications" class={linkCls} onClick={props.onClose}>
                        <img src='/svg/notification.svg' width={18} height={18} alt="" />
                        შეტყობინებები
                    </a>

                    <a href="/account" class={linkCls} onClick={props.onClose}>
                        <img src='/svg/gear.svg' width={18} height={18} alt="" />
                        აქაუნთი
                    </a>

                    <div class="pt-2 mt-1 border-t border-gray-100">
                        <form action={logout} method="POST">
                            <button
                                type="submit"
                                class="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl text-sm font-gsans font-medium text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <img src="/svg/logout.svg" width={18} height={18} alt="" />
                                გასვლა
                            </button>
                        </form>
                    </div>
                </div>
            </Show>
        </nav>
    )
}