import { Show, For, Switch, Match, useContext, createSignal, createEffect, on, onCleanup, batch, onMount, createMemo } from "solid-js";
import { A } from "@solidjs/router";
import { get_all_notifications_count, get_notifications } from "~/routes/api/user/notifications";
import { WSContext } from "~/ws_context";
import { NotificationTools } from "./NotificationTools";
import { MainNotificationTools } from "./MainNotificationTools";
import { createStore, produce } from "solid-js/store";
import { createVirtualizer } from "@tanstack/solid-virtual";

const Notifications = () => {
  const [store, setStore] = createStore({
    'notifications': [],
    'loading': true,
    'total_notifications': 0,
    'cursor': { created_at: null, id: null }
  })
  const [notificationTools, setNotificationTools] = createSignal()
  const [displayMainTools, setDisplayMainTools] = createSignal(false)
  const ctx = useContext(WSContext)
  let mainToolsRef
  let itemToolsRef

  const getNotificationTypeStyle = (type) => {
    switch (type) {
      case "უსაფრთხოება": return "bg-red-100 text-red-800";
      case "გადახდა": return "bg-green-100 text-green-800";
      case "შეთავაზება": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }

  const retreive_notifications = async (props = { created_at: null, id: null }) => {
    if (!store.loading) setStore('loading', true)
    try {
      const notifications = await get_notifications(props)
      if (!notifications.ok) throw new Error('error')
      const data = notifications.data
      batch(() => {
        setStore('loading', false);
        setStore(produce(state => {
          for (const item of data) {
            state.notifications.push(item);
          }
          if (data.length > 0) {
            const last = data[data.length - 1];
            state.cursor = { created_at: last.created_at, id: last.id };
          }
        }));
      });
    } catch (error) {
      setStore('loading', false)
    }
  }

  const hasNotifications = createMemo(() => store.notifications.length > 0)
  const totalNotificationsBadge = createMemo(() => store.total_notifications)
  const hasMoreNotifications = createMemo(() => Number(store.total_notifications) !== store.notifications.length)

  onMount(() => {
    new Promise(async (res, rej) => {
      const notification_amout = await get_all_notifications_count()
      if (!notification_amout) rej('error')
      setStore('total_notifications', notification_amout)
      res()
    }).then(async () => await retreive_notifications())
      .catch((err) => console.log(err))
  })

  createEffect(on([notificationTools, displayMainTools], () => {
    const handleClickOutside = (e) => {
      if (!mainToolsRef?.contains(e.target)) setDisplayMainTools(false)
      if (!itemToolsRef?.contains(e.target)) setNotificationTools(false)
    }
    document.addEventListener('click', handleClickOutside);
    onCleanup(() => document.removeEventListener('click', handleClickOutside));
  }, { defer: true }));

  const InfiniteScrollLoader = createMemo(() => (
    <div class="relative border-b border-gray-100 flex flex-col gap-2 py-4 px-4">
      <div class="absolute left-3.5 top-1/2 w-2.5 h-2.5 bg-gray-200 rounded-full animate-pulse"></div>
      <div class="absolute left-2 top-4">
        <div class="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
      <div class="flex items-start pr-6 justify-between gap-3 ml-8">
        <div class="flex-1 min-w-0 space-y-2">
          <div class="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          <div class="h-3 bg-gray-200 rounded-full animate-pulse w-20"></div>
        </div>
        <div class="h-3 bg-gray-200 rounded animate-pulse w-16 mt-0.5 ml-2"></div>
      </div>
      <div class="mt-2 ml-8 space-y-1">
        <div class="h-3 bg-gray-200 rounded animate-pulse w-full"></div>
        <div class="h-3 bg-gray-200 rounded animate-pulse w-5/6"></div>
      </div>
      <div class="mt-3 ml-8">
        <div class="h-6 bg-gray-200 rounded-lg animate-pulse w-32"></div>
      </div>
      <div class="absolute right-2 top-3">
        <div class="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    </div>
  ));

  let scrollEl

  const rowVirtualizer = createVirtualizer(() => ({
    count: store.notifications?.length,
    getScrollElement: () => scrollEl,
    estimateSize: () => 202,
    overscan: 4,
    gap: 20,
    getItemKey: (index) =>
      index === 0
        ? "__loader__"
        : store.notifications[index - 1]?.id,
  }))

  let lastRequestedCursor = null;

  createEffect(() => {
    const items = rowVirtualizer.getVirtualItems()
    const last = items.at(-1)
    if (!last) return

    if (
      last.index >= store.notifications.length - 1 &&
      hasMoreNotifications() &&
      !store.loading &&
      store.cursor.id !== lastRequestedCursor
    ) {
      lastRequestedCursor = store.cursor.id
      retreive_notifications(store.cursor)
    }
  })

  return (
    /**
     * Sizing strategy:
     *  - Mobile  (<md): full viewport width, max-height = 80dvh so it never
     *    covers the entire screen and the user can tap outside to close.
     *  - md+: fixed 420 px wide dropdown, max-height 70vh (original behaviour).
     */
    <div class="
      w-screen max-h-[80dvh]
      md:w-[420px] md:max-h-[70vh]
      bg-white
      shadow-2xl border border-gray-100
      md:rounded-xl
      transition-all duration-150
      flex flex-col
      overflow-hidden
    ">
      <div class="flex flex-col flex-1 overflow-hidden relative">
        {/* Sticky header */}
        <div class="sticky top-0 z-40 px-4 py-4
             font-gsans font-medium
             bg-white/95 backdrop-blur
             border-b border-gray-100 flex justify-between items-center shrink-0">
          <div class="flex items-center space-x-2">
            <h2 class="text-base text-gray-900">
              შეტყობინებები
            </h2>
            <span class="px-2 py-1 text-xs font-gsans font-medium rounded-full bg-[#E85A4F]/10 text-[#E85A4F]">
              {totalNotificationsBadge()}
            </span>
          </div>
          <Show when={hasNotifications()}>
            <button
              onClick={() => batch(() => {
                setDisplayMainTools(prev => !prev)
                setNotificationTools(false)
              })}
              class="p-1.5 rounded-full relative z-30
                     text-gray-400 hover:text-gray-700
                     hover:bg-gray-200/50 transition-colors"
            >
              <img src='/svg/dots.svg' width={24} height={24} />
              <Show when={displayMainTools()}>
                <div ref={mainToolsRef} class="absolute right-0 top-full mt-2 z-50">
                  <MainNotificationTools ctx={ctx} store={store} hasNotifications={hasNotifications} setStore={setStore} />
                </div>
              </Show>
            </button>
          </Show>
        </div>

        {/* Scrollable list */}
        {hasNotifications()
          ? <div
              ref={el => scrollEl = el}
              class="flex-1 overflow-y-auto overscroll-contain"
            >
              <div
                style={{
                  height: `${rowVirtualizer.getTotalSize()}px`,
                  width: '100%',
                  position: 'relative',
                }}
              >
                <For each={rowVirtualizer.getVirtualItems()}>
                  {(virtualRow) => {
                    const isLoader = virtualRow.index === store.notifications.length;
                    const notif = store.notifications[virtualRow.index];

                    return (
                      <div
                        key={virtualRow.key}
                        data-index={virtualRow.index}
                        ref={(el) => {
                          el.dataset.index = `${virtualRow.index}`;
                          rowVirtualizer.measureElement(el)
                        }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: `${virtualRow.size}px`,
                          transform: `translateY(${virtualRow.start}px)`,
                        }}
                      >
                        {isLoader ? (
                          hasMoreNotifications() ? InfiniteScrollLoader() : null
                        ) : (
                          <div class='relative border-b border-gray-100 flex flex-col gap-2 p-4 text-sm text-gray-700
                              transition-all duration-200 group'>
                            <Show when={!notif.seen}>
                              <div class="absolute left-3.5 top-1/2 w-2.5 h-2.5 rounded-full bg-[#E85A4F]"></div>
                            </Show>

                            <div class="absolute left-2 top-4">
                              <Switch>
                                <Match when={notif.notif_type === "უსაფრთხოება"}>
                                  <div class="w-6 h-6 rounded-full bg-red-50 flex items-center justify-center">
                                    <img src='/svg/lock.svg' width={20} height={20} alt="" />
                                  </div>
                                </Match>
                                <Match when={notif.notif_type === "გადახდა"}>
                                  <div class="w-6 h-6 rounded-full bg-green-50 flex items-center justify-center">
                                    <img src='/svg/receipt.svg' width={20} height={20} alt="" />
                                  </div>
                                </Match>
                                <Match when={notif.notif_type === "შეთავაზება"}>
                                  <div class="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center">
                                    <img src='/svg/gift.svg' width={20} height={20} alt="" />
                                  </div>
                                </Match>
                              </Switch>
                            </div>

                            <div class="flex items-start pr-6 justify-between gap-3 ml-8">
                              <div class="flex-1 min-w-0">
                                <span class="font-gsans font-medium text-sm leading-snug text-gray-900 block truncate">
                                  {notif.title}
                                </span>
                                <div class="mt-1">
                                  <span class={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-gsans font-medium
                                    ${getNotificationTypeStyle(notif.notif_type)}`}>
                                    {notif.notif_type}
                                  </span>
                                </div>
                              </div>
                              <span class="text-xs text-gray-400 whitespace-nowrap mt-0.5 font-gsans font-normal shrink-0 ml-2">
                                {notif.parsed_notification}
                              </span>
                            </div>

                            <span class="font-gsans font-normal text-gray-600 leading-relaxed text-sm mt-2 ml-8">
                              {notif.description}
                            </span>

                            <Show when={notif.notif_type === "უსაფრთხოება"}>
                              <div class="mt-3 ml-8">
                                <A
                                  class="inline-flex items-center gap-1.5 text-xs font-gsans font-medium
                                    text-[#E85A4F] hover:text-[#D9534F] hover:underline underline-offset-2"
                                  href="/account/security"
                                >
                                  <img src='/svg/external-link.svg' width={16} height={16} alt='' />
                                  მართეთ სეანსები
                                </A>
                              </div>
                            </Show>

                            <Show when={notif.notif_type === "გადახდა"}>
                              <div class="mt-3 ml-8">
                                <A
                                  class="inline-flex items-center gap-1.5 text-xs font-gsans font-medium
                                    text-green-600 hover:text-green-700 hover:underline underline-offset-2"
                                  href="/account/billing"
                                >
                                  <img src='/svg/external-green-link.svg' width={16} height={16} alt='' />
                                  იხილეთ დეტალურად
                                </A>
                              </div>
                            </Show>

                            <Show when={notif.notif_type === "შეთავაზება"}>
                              <div class="mt-3 ml-8">
                                <A
                                  class="inline-flex items-center gap-1.5 text-xs font-gsans font-medium px-3 py-1.5
                                    bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg
                                    hover:from-purple-600 hover:to-pink-600 transition-all shadow-sm hover:shadow"
                                  href="/promotions"
                                >
                                  <img src='/svg/promotion.svg' width={16} height={16} alt='' />
                                  იხილეთ შეთავაზება
                                </A>
                              </div>
                            </Show>

                            <div class="absolute right-2 top-3 flex items-center gap-x-1 z-20">
                              <button
                                type="button"
                                onClick={() => batch(() => {
                                  setNotificationTools(prev => prev === notif.id ? null : notif.id)
                                  setDisplayMainTools(false)
                                })}
                                class="p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity
                                  text-gray-400 hover:text-gray-700 hover:bg-gray-200/50"
                              >
                                <img src="/svg/dots.svg" width={16} height={16} />
                              </button>
                              <Show when={notificationTools() && notificationTools() === notif.id}>
                                <div ref={itemToolsRef} class="absolute right-1 top-6 mt-2 z-50">
                                  <NotificationTools
                                    notification={notif}
                                    store={store}
                                    setStore={setStore}
                                    ctx={ctx}
                                  />
                                </div>
                              </Show>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  }}
                </For>
              </div>
            </div>
          : <p class="text-sm p-4 font-gsans font-medium text-gray-900">შეტყობინებები ცარიელია</p>
        }
      </div>
    </div>
  );
};

export default Notifications
