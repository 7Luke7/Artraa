import { Title } from "@solidjs/meta"
import {
    Show, For, Switch, Match, useContext,
    createSignal, createEffect, onCleanup, batch, lazy, Suspense
} from "solid-js"
import { createStore, produce } from "solid-js/store"
import { A } from "@solidjs/router"
import { Header } from "~/components/Header"
import { get_all_notifications_count, get_notifications, mark_all_notification_as_seen } from "~/routes/api/user/notifications"
import { WSContext } from "~/ws_context"

const LazyNotificationTools = lazy(() => import("~/components/LazyNotificationTools.jsx"))

const TYPE_CONFIG = {
    "უსაფრთხოება": {
        badge: "bg-red-100 text-red-700", iconBg: "bg-red-50",
        icon: <img src='/svg/lock.svg' width={16} height={16} alt="" />,
        action: { href: "/account/security", label: "მართეთ სეანსები", class: "text-[#E85A4F]" },
    },
    "გადახდა": {
        badge: "bg-green-100 text-green-700", iconBg: "bg-green-50",
        icon: <img src='/svg/receipt.svg' width={20} height={20} alt="" />,
        action: { href: "/account/billing", label: "იხილეთ დეტალურად", class: "text-green-600" },
    },
    "შეთავაზება": {
        badge: "bg-purple-100 text-purple-700", iconBg: "bg-purple-50",
        icon: <img src='/svg/gift.svg' width={20} height={20} alt="" />,
        action: { href: "/promotions", label: "იხილეთ შეთავაზება", class: "text-purple-600" },
    },
}

export default function NotificationsPage() {
    const ctx = useContext(WSContext)

    const [store, setStore] = createStore({
        notifications: [],
        loading: true,
        total: 0,
        cursor: { created_at: null, id: null },
    })
    const [openTools, setOpenTools] = createSignal(null)
    let sentinelEl
    let lastCursor = null

    const hasMore = () => store.total > store.notifications.length
    const hasAny  = () => store.notifications.length > 0
    const unreadExists = () => store.notifications.some(n => !n.seen)

    const fetchPage = async (cursor = { created_at: null, id: null }) => {
        setStore("loading", true)
        try {
            const res = await get_notifications(cursor)
            if (!res.ok) throw new Error("error")
            setStore(produce(s => {
                s.loading = false
                for (const item of res.data) s.notifications.push(item)
                if (res.data.length > 0) {
                    const last = res.data[res.data.length - 1]
                    s.cursor = { created_at: last.created_at, id: last.id }
                }
            }))
        } catch {
            setStore("loading", false)
        }
    }

    ;(async () => {
        try {
            const total = await get_all_notifications_count()
            if (total) setStore("total", total)
            await fetchPage()
        } catch (e) { console.error(e) }
    })()

    // Infinite scroll via IntersectionObserver on a sentinel
    createEffect(() => {
        if (!sentinelEl) return
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (
                    entry.isIntersecting &&
                    hasMore() &&
                    !store.loading &&
                    store.cursor.id !== lastCursor
                ) {
                    lastCursor = store.cursor.id
                    fetchPage(store.cursor)
                }
            })
        }, { rootMargin: "200px" })
        observer.observe(sentinelEl)
        onCleanup(() => observer.disconnect())
    })

    // Close tools on outside click
    createEffect(() => {
        if (openTools() === null) return
        const handler = () => setOpenTools(null)
        document.addEventListener("click", handler)
        onCleanup(() => document.removeEventListener("click", handler))
    })

    const markAllSeen = async () => {
        try {
            const res = await mark_all_notification_as_seen(true)
            if (!res.ok) return
            batch(() => {
                ctx?.setStore("notification_count", 0)
                setStore("notifications", n => !n.seen, "seen", true)
            })
        } catch (e) { console.error(e) }
    }

    const handleRemove = (id, seen) => {
        batch(() => {
            if (!seen) ctx?.setStore("notification_count", c => Math.max(0, c - 1))
            setStore(produce(s => {
                const idx = s.notifications.findIndex(n => n.id === id)
                if (idx !== -1) s.notifications.splice(idx, 1)
                s.total = Math.max(0, s.total - 1)
            }))
            setOpenTools(null)
        })
    }

    return (
        <>
            <Title>შეტყობინებები - Artra</Title>

            <div class="min-h-screen flex flex-col bg-gray-50">
                <div class="w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto flex-1">
                    <Header />

                    <div class="py-6 max-w-2xl mx-auto">
                        {/* Page header */}
                        <div class="flex items-center justify-between mb-6">
                            <div class="flex items-center gap-2.5">
                                <h1 class="text-2xl font-gsans font-bold text-gray-900">შეტყობინებები</h1>
                                <Show when={store.total > 0}>
                                    <span class="px-2 py-0.5 text-xs font-gsans font-bold rounded-full bg-[#E85A4F]/10 text-[#E85A4F]">
                                        {store.total}
                                    </span>
                                </Show>
                            </div>

                            <Show when={hasAny() && unreadExists()}>
                                <button
                                    onClick={markAllSeen}
                                    class="flex items-center gap-1.5 text-xs font-gsans font-medium text-gray-500 hover:text-[#E85A4F] transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M7 12l5 5l10 -10"/><path d="M2 12l5 5m5 -5l5 -5"/>
                                    </svg>
                                    ყველას წაკითხვა
                                </button>
                            </Show>
                        </div>

                        {/* List */}
                        <Show
                            when={hasAny()}
                            fallback={
                                <Show when={!store.loading} fallback={<PageSkeleton />}>
                                    <EmptyState />
                                </Show>
                            }
                        >
                            <div class="space-y-2">
                                <For each={store.notifications}>
                                    {(notif) => {
                                        const config = TYPE_CONFIG[notif.notif_type]
                                        return (
                                            <article class={`relative bg-white border rounded-2xl p-4 group transition-all ${notif.seen ? "border-gray-200" : "border-[#E85A4F]/20 bg-[#E85A4F]/[0.015]"}`}>
                                                <div class="flex items-start gap-3">
                                                    {/* Icon */}
                                                    <Show when={config}>
                                                        <div class={`w-9 h-9 rounded-xl ${config.iconBg} flex items-center justify-center shrink-0`}>
                                                            {config.icon}
                                                        </div>
                                                    </Show>

                                                    <div class="flex-1 min-w-0 pr-7">
                                                        <div class="flex items-start justify-between gap-2 mb-1">
                                                            <div class="flex items-center gap-2 min-w-0">
                                                                <Show when={!notif.seen}>
                                                                    <span class="w-2 h-2 rounded-full bg-[#E85A4F] shrink-0" />
                                                                </Show>
                                                                <h2 class="font-gsans font-semibold text-sm text-gray-900 truncate">
                                                                    {notif.title}
                                                                </h2>
                                                            </div>
                                                            <span class="text-[11px] text-gray-400 font-gsans shrink-0">
                                                                {notif.parsed_notification}
                                                            </span>
                                                        </div>

                                                        <Show when={config}>
                                                            <span class={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-gsans font-medium mb-2 ${config.badge}`}>
                                                                {notif.notif_type}
                                                            </span>
                                                        </Show>

                                                        <p class="text-sm font-gsans text-gray-500 leading-relaxed">
                                                            {notif.description}
                                                        </p>

                                                        <Show when={config?.action}>
                                                            <A
                                                                href={config.action.href}
                                                                class={`inline-flex items-center gap-1.5 mt-2.5 text-xs font-gsans font-medium hover:underline underline-offset-2 ${config.action.class}`}
                                                            >
                                                                {config.action.label}
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                                                                    <path d="M17 7l-10 10"/><path d="M8 7l9 0l0 9"/>
                                                                </svg>
                                                            </A>
                                                        </Show>
                                                    </div>
                                                </div>

                                                {/* Tools */}
                                                <div class="absolute right-3 top-3">
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setOpenTools(p => p === notif.id ? null : notif.id) }}
                                                        class="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                                                            <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
                                                        </svg>
                                                    </button>
                                                    <Suspense>
                                                        <Show when={openTools() === notif.id}>
                                                            <div class="absolute right-0 top-full mt-1 z-50" onClick={e => e.stopPropagation()}>
                                                                <LazyNotificationTools
                                                                    notification={notif}
                                                                    store={store}
                                                                    setStore={setStore}
                                                                    onRemove={handleRemove}
                                                                    ctx={ctx}
                                                                />
                                                            </div>
                                                        </Show>
                                                    </Suspense>
                                                </div>
                                            </article>
                                        )
                                    }}
                                </For>

                                {/* Infinite scroll sentinel */}
                                <Show when={hasMore()}>
                                    <div ref={el => (sentinelEl = el)} class="py-4 flex justify-center">
                                        <div class="relative w-6 h-6">
                                            <div class="absolute inset-0 rounded-full border-2 border-gray-200" />
                                            <div class="absolute inset-0 rounded-full border-2 border-transparent border-t-[#E85A4F] animate-spin" />
                                        </div>
                                    </div>
                                </Show>
                            </div>
                        </Show>
                    </div>
                </div>
            </div>
        </>
    )
}

function EmptyState() {
    return (
        <div class="flex flex-col items-center justify-center py-20 text-center">
            <div class="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-5">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M10 5a2 2 0 1 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"/>
                    <path d="M9 17v1a3 3 0 0 0 6 0v-1"/>
                </svg>
            </div>
            <p class="font-gsans font-bold text-gray-900 mb-2">შეტყობინება არ არის</p>
            <p class="text-sm text-gray-400 font-gsans">ახალი შეტყობინებები აქ გამოჩნდება</p>
        </div>
    )
}

function PageSkeleton() {
    return (
        <div class="space-y-2 animate-pulse">
            {Array.from({ length: 5 }).map(() => (
                <div class="bg-white border border-gray-200 rounded-2xl p-4 flex gap-3">
                    <div class="w-9 h-9 rounded-xl bg-gray-100 shrink-0" />
                    <div class="flex-1 space-y-2">
                        <div class="h-4 bg-gray-100 rounded w-3/4" />
                        <div class="h-3 bg-gray-100 rounded-full w-20" />
                        <div class="h-3 bg-gray-100 rounded w-full" />
                        <div class="h-3 bg-gray-100 rounded w-5/6" />
                    </div>
                </div>
            ))}
        </div>
    )
}