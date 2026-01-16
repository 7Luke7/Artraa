import { createMemo, For } from "solid-js"
import { SessionRow } from "./SingleSession"
import { createSignal, useContext } from "solid-js"
import {
    block_deviee,
    unblock_devicee
} from "~/routes/api/user/account"
import { WSContext } from "~/ws_context"

export default function SessionsList(props) {
    const ctx = useContext(WSContext)
    const { security } = props
    const session_list = createMemo(() => security().sessions)
    const [sessions, setSessions] = createSignal(session_list())

    const wsSend = (payload) => {
        const ws = ctx?.ctx()
        ws?.send(JSON.stringify(payload))
    }

    const approveLogin = (pending_verification_id) => {
        setSessions(prev => prev.map((s) => (
            s.pending_verification_id === pending_verification_id ? {
                ...s,
                status: 'trusted'
            } : s
        )))

        wsSend({ type: "approve-login", pending_verification_id })
    }

    const blockDevice = async (device_id, session_id, status) => {
        setSessions(prev => prev.map(s => (
            s.id === device_id ? { ...s, status: "blocked", session_id: null }
                : s
        )))

        try {
            if (status === "pending") {
                wsSend({ type: "reject-login", pending_verification_id: session_id })
            } else if (session_id) {
                wsSend({ type: "block-device", device_id, session_id })
            } else {
                const res = await block_deviee(device_id)
                if (!res.ok) throw new Error()
            }
        } catch {
            setSessions(prev => prev.map(s => (
                s.id === device_id ? { ...s, status: session_list().find(ss => ss.id === device_id)['status'], session_id: null }
                    : s
            )))
        }
    }

    const unblockDevice = async (id) => {
        setSessions(prev => prev.map(s => (
            s.id === id ? { ...s, status: "trusted" } : s
        )))
        try {
            const res = await unblock_devicee(id)
            if (!res.ok) throw new Error()
        } catch {
            setSessions(prev => prev.map(s => (
                s.id === id ? { ...s, status: session_list().find(ss => ss.id === id)['status'] } : s
            )))
        }
    }

    const logoutDevice = (device_id, session_id) => {
        setSessions(prev => prev.map(s => (
            s.id === device_id
                ? { ...s, session_id: null }
                : s
        )))

        wsSend({ type: "logout-device", device_id, session_id })
    }
    return (
        <div
            class="w-full"
            role="region"
            aria-labelledby="sessions-heading"
        >
            <h3
                id="sessions-heading"
                class="text-lg font-gsans font-medium text-gray-800 mb-4 md:mb-6"
            >
                აქტიური სესიები
            </h3>

            <div
                class="space-y-3 pr-2"
                role="list"
                aria-label="ავტორიზაციის სესიების სია"
            >
                <For each={sessions()}>
                    {(session) => (
                        <SessionRow
                            session={session}
                            onApprove={approveLogin}
                            onBlock={blockDevice}
                            onUnblock={unblockDevice}
                            onLogout={logoutDevice}
                        />
                    )}
                </For>
            </div>
        </div>
    )
}