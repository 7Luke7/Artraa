import { createAsync } from "@solidjs/router"
import { onMount, Show, useContext } from "solid-js"
import { get_new_notification_count } from "~/routes/api/user/notifications"
import { WSContext } from "~/ws_context"

export const HeaderNotification = ({ setDisplayModal }) => {
    const new_notifications = createAsync(get_new_notification_count, { deferStream: false })
    const ctx = useContext(WSContext)

    const notification_count = () => ctx?.store?.notification_count || Number(new_notifications())
    onMount(() => {
            console.log(!ctx?.store?.notification_count)
        if (!ctx?.store?.notification_count && Number(new_notifications())) {
            ctx?.setStore(
                'notification_count', Number(new_notifications())
            )
        }
    })

    return <button
        type="button"
        onClick={() => setDisplayModal(prev => ({ notification: !prev.notification, account: false }))}
        class="
        relative inline-flex items-center justify-center
        md:h-9 md:w-9 h-[40px] w-[40px] rounded-xl
        transition
        hover:bg-gray-100 active:bg-gray-200"
        >
        <img
            src="/svg/notification.svg"
            width={24}
            class="md:w-8 md:h-8"
            height={24}
        />

        <Show when={notification_count()}>
            <span
                class="
                    absolute top-0 right-0
                    min-w-[18px] h-[18px]
                    flex items-center justify-center
                    text-[10px] leading-none
                    font-gsans font-bold text-white
                    bg-red-500
                    rounded-full
                    border-2 border-white
                "
            >
                {notification_count()}
            </span>
        </Show>
    </button>

}