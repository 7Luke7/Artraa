import { batch } from "solid-js"
import { produce } from "solid-js/store"
import { mark_notification_as, remove_notification } from "~/routes/api/user/notifications"

export const NotificationTools = (props) => {
    const { notification, store, setStore, ctx } = props
    const mark_as = async (id, seen) => {
        try {
            const res = await mark_notification_as(id, !seen)
            if (!res.ok) return console.error('error')
            const index = store.notifications.findIndex(n => n.id === id)
            batch(() => {
                ctx?.setStore('notification_count', prev => seen ? prev + 1 : prev - 1)
                setStore('notifications', index, prev => ({ ...prev, seen: !seen }))
            })
            return
        } catch (error) {
            console.log(error)
        }
    }

    const removeNotification = async (id, seen) => {
        try {
            const res = await remove_notification(id, seen)
            if (!res.ok) return console.error('error')

            batch(() => {
                if (!seen) ctx?.setStore('notification_count', c => c - 1)
                setStore(produce(state => {
                    const index = state.notifications.findIndex(n => n.id === id)
                    if (index !== -1) {
                        state.notifications.splice(index, 1)
                    }
                    state.total_notifications = Math.max(0, state.total_notifications - 1)
                }))
            })
            return
        } catch (error) {
            console.log(error)
        }
    }

    return <div
        class="absolute top-0 -right-3 flex flex-col items-start w-56 p-2 bg-white rounded-lg shadow-xl border border-gray-100"
    >
        <div
            class="absolute -top-2 right-3
           w-0 h-0
           border-l-[8px] border-r-[8px] border-b-[8px]
           border-l-transparent border-r-transparent border-b-slate-200"
        ></div>
        <button
            onClick={() => mark_as(notification.id, notification.seen)}
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
                {notification.seen ? "წაუკითხავად მონიშვნა" : "წაკითხულად მონიშვნა"}
            </span>
        </button>

        <button
            onClick={() => removeNotification(notification.id, notification.seen)}
            class="flex items-center gap-3 w-full relative
           px-4 py-3 rounded-md
           text-sm font-gsans font-medium
           text-gray-800
           hover:bg-gray-50
           transition-colors duration-150
           group"
        >
            <div class="w-5 h-5 flex items-center justify-center transition-colors group-hover:text-[#E85A4F]">
                <img id="notification-menu" alt="" src='/svg/trash.svg' class="opacity-70 group-hover:opacity-100"></img>
            </div>
            <span class="flex-1 text-left">
                შეტყობინების წაშლა
            </span>
        </button>
    </div>

}