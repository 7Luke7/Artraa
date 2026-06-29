import { createEffect, createSignal, lazy, on, onCleanup, Show, Suspense } from "solid-js";
import { HeaderNotification } from "./Header_Notification";
import { A } from "@solidjs/router";

const LazyNotifications = lazy(() => import("./LazyNotifications.jsx"))
const LazyAccountOptions = lazy(() => import("./LazyAccountOptions.jsx"))

export default (props) => {
    const { avatar } = props
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

    return (
        <div class="hidden lg:flex items-center gap-x-4 md:gap-x-6">
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
                    <img
                        src={avatar}
                        onError={(e) => e.currentTarget.src = '/default_profile.png'}
                        alt='პროფილის სურათი'
                        class="rounded-full border-2 border-white shadow-sm w-10 h-10 md:w-12 md:h-12 object-cover"
                        width={48}
                        height={48}
                        loading="lazy"
                    />
                </button>

                <Show when={displayModal().account}>
                    <div
                        ref={el => (accountOptionsRef = el)}
                        class="absolute right-[-50px] top-[64px] mt-2 z-50"
                        id="account-options"
                        role="menu"
                        aria-orientation="vertical"
                    >
                        <Suspense>
                            <LazyAccountOptions />
                        </Suspense>
                    </div>
                </Show>
            </div>

            <Show when={displayModal().notification}>
                <div
                    ref={el => (NotificationsRef = el)}
                    class="
                        fixed inset-x-0 top-[64px] z-50
                        md:absolute md:inset-x-auto md:right-4 md:top-[78px] md:mt-2
                    "
                    role="dialog"
                    aria-label="შეტყობინებები"
                >
                    <Suspense>
                        <LazyNotifications />
                    </Suspense>
                </div>
            </Show>
        </div>
    )
}