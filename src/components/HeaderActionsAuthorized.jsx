import { createEffect, createSignal, lazy, on, onCleanup, Show, Suspense } from "solid-js";
import { HeaderNotification } from "./Header_Notification";

const LazyNotifications = lazy(() => import("./LazyNotifications.jsx"))
const LazyAccountOptions = lazy(() => import("./LazyAccountOptions.jsx"))

const HeaderActionsAuthorized = (props) => {
    const {data} = props
    const [displayModal, setDisplayModal] = createSignal({ notification: false, account: false })

    let accountOptionsRef;
    let NotificationsRef;

    createEffect(on(displayModal, () => {
        const handleClick = (event) => {
            const target = event.target;

            if (
                displayModal().account &&
                accountOptionsRef &&
                !accountOptionsRef.contains(target)
            ) {
                setDisplayModal({ account: false, notification: false });
            }

            if (
                displayModal().notification &&
                NotificationsRef &&
                !NotificationsRef.contains(target)
            ) {
                setDisplayModal({ account: false, notification: false });
            }
        }
        document.addEventListener("click", handleClick);

        onCleanup(() => document.removeEventListener('click', handleClick))
    }, { defer: true }))

    return <div class="flex items-center gap-x-4 md:gap-x-6">
        <HeaderNotification setDisplayModal={setDisplayModal} />
        <div class="relative">
            <button
                class="hover:opacity-90 transition-opacity group rounded-full"
                onClick={() => setDisplayModal(prev => ({
                    notification: false,
                    account: !prev.account
                }))}
                type="button"
                aria-label="ანგარიშის პარამეტრები"
                aria-expanded={displayModal().account}
                aria-controls="account-options"
                aria-haspopup="true"
            >
                <div class="relative">
                    <img
                        src={data()?.data ?? '/default_profile.png'}
                        alt='პროფილის სურათი'
                        onerror={(e) => e.target.src = '/default_profile.png'}
                        class="rounded-full border-2 border-white shadow-sm w-10 h-10 md:w-12 md:h-12 object-cover"
                        width={48}
                        height={48}
                        loading="lazy"
                    />
                    <span class="sr-only">ონლაინ მომხმარებელი</span>
                    <div class="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-white" aria-hidden="true"></div>
                </div>
            </button>
        </div>
        <Show when={displayModal().account}>
            <div
                ref={el => (accountOptionsRef = el)}
                class="absolute right-0 mt-2 z-50"
                id="account-options"
                role="menu"
                aria-orientation="vertical"
            >
                <Suspense>
                    <LazyAccountOptions />
                </Suspense>
            </div>
        </Show>
        <Show when={displayModal().notification}>
            <div
                ref={el => (NotificationsRef = el)}
                class="absolute z-50 right-4 top-full mt-2"
                role="dialog"
                aria-label="შეტყობინებები"
            >
                <Suspense>
                    <LazyNotifications />
                </Suspense>
            </div>
        </Show>
    </div>
}

export default HeaderActionsAuthorized