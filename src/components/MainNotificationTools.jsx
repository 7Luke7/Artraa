import { batch, Show } from "solid-js"
import { mark_all_notification_as_seen } from "~/routes/api/user/notifications"

export const MainNotificationTools = (props) => {
    const {ctx, hasNotifications, store, setStore} = props
    const disabled = () => hasNotifications() ? store.notifications.some(n => !n.seen) : null
    const mark_all_as = async (e) => {
        e.preventDefault()
        e.stopImmediatePropagation()
        try {
            const res = await mark_all_notification_as_seen(true)
            if (!res.ok) return console.error('error')
            batch(() => {
                ctx?.setStore('notification_count', 0)
                setStore('notifications', (n) => !n.seen, 'seen', true)
            })
            return
        } catch (error) {
            console.log(error)
        }
    }

    return <div
        class="absolute top-0 -right-1.5 flex flex-col items-start w-64 p-2 bg-white rounded-lg shadow-xl border border-gray-100"
    >
        <div
            class="absolute -top-2 right-4
           w-0 h-0
           border-l-[8px] border-r-[8px] border-b-[8px]
           border-l-transparent border-r-transparent border-b-slate-200"
        ></div>
        <Show when={hasNotifications()}>
            <button
                onClick={mark_all_as}
                disabled={!disabled()}
                class="flex items-center gap-3 w-full relative
           px-4 py-3 rounded-md
           text-sm font-gsans font-medium
           text-gray-800
           hover:bg-gray-50
           transition-colors duration-150
           group"
            >
                <div class="w-5 h-5 flex items-center justify-center transition-colors group-hover:text-[#E85A4F]">
                    <img alt="" src='/svg/double-check.svg' class="opacity-70 group-hover:opacity-100"></img>
                </div>
                <span class="flex-1 text-left">
                    ყველას წაკითხულად მონიშვნა
                </span>
            </button>
        </Show>
    </div>
}