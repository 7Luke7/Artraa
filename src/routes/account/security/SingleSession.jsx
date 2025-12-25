import { Match, Show, Switch } from "solid-js"

export const SessionRow = (props) => {
    const {session, onApprove, onBlock, onUnblock, onLogout} = props
    return (
        <div
            role="listitem"
            class={`p-4 rounded-lg border flex flex-col gap-1 transition-all ${
                session.current_session
                    ? "bg-green-50 border-green-300"
                    : 'bg-gray-50 border-gray-200'
            }`}
            aria-label={`სესია: ${session.browser} ${session.os}, ${session.device_type}`}
        >
            <div class="flex flex-col md:flex-row md:items-center justify-between gap-2">
                <div>
                    <p class="font-gsans font-medium text-sm md:text-md text-gray-900">
                        <span class="font-gsans font-bold">ბრაუზერი:</span> {session.browser} {session.browser_version}
                    </p>
                    <p class="font-gsans font-medium text-sm md:text-md text-gray-900">
                        <span class="font-gsans font-bold">ოპერაციული სისტემა:</span> {session.os} {session.os_version}
                    </p>
                </div>
                
                <Switch>
                    <Match when={session.current_session}>
                        <span 
                            class="text-xs text-green-700 font-gsans font-medium bg-green-100 px-2 py-1 rounded-full self-start md:self-center"
                            aria-label="მიმდინარე სესია"
                        >
                            მიმდინარე სესია
                        </span>
                    </Match>
                    <Match when={session.session_id}>
                        <span 
                            class="text-xs text-green-700 font-gsans font-medium bg-green-100 px-2 py-1 rounded-full self-start md:self-center"
                            aria-label="აქტიური სესია"
                        >
                            აქტიური
                        </span>
                    </Match>
                    <Match when={session.status === 'pending'}>
                        <span 
                            class="text-xs text-amber-700 font-gsans font-medium bg-amber-100 px-2 py-1 rounded-full self-start md:self-center"
                            aria-label="დასტურის მოლოდინში"
                        >
                            დასტურის მოლოდინში
                        </span>
                    </Match>
                    <Match when={session.status === 'blocked'}>
                        <span 
                            class="text-xs text-red-700 font-gsans font-medium bg-red-100 px-2 py-1 rounded-full self-start md:self-center"
                            aria-label="დაბლოკილი სესია"
                        >
                            დაბლოკილი
                        </span>
                    </Match>
                    <Match when={!session.session_id}>
                        <span 
                            class="text-xs text-gray-600 font-gsans font-medium bg-gray-200 px-2 py-1 rounded-full self-start md:self-center"
                            aria-label="არააქტიური სესია"
                        >
                            არ არის აქტიური
                        </span>
                    </Match>
                </Switch>
            </div>

            <p class="text-sm text-gray-600 font-gsans font-normal mt-1">
                <span class="font-gsans font-medium">მოწყობილობა:</span> {session.device_type} {session.device_vendor} {session.device_model}
            </p>

            <p class="text-sm font-gsans font-normal text-gray-600">
                <span class="font-gsans font-medium">ბოლოს შესვლა:</span> {session.last_used}
            </p>
            
            <Show when={!session.current_session}>
                <div class="flex flex-wrap gap-2 mt-3">
                    <Switch>
                        <Match when={session.status === "pending"}>
                            <button
                                type="button"
                                class="px-3 py-1.5 text-xs rounded-md bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                                onClick={() => onApprove(session.pending_verification_id)}
                                aria-label={`დაეთანხმე სესიას ${session.browser}-ზე ${session.os}-ზე`}
                            >
                                დაშვება
                            </button>

                            <button
                                type="button"
                                class="px-3 py-1.5 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                onClick={() => onBlock(session.id, session.pending_verification_id, session.status)}
                                aria-label={`დაბლოკე სესია ${session.browser}-ზე ${session.os}-ზე`}
                            >
                                დაბლოკვა
                            </button>
                        </Match>

                        <Match when={session.status === "blocked"}>
                            <button
                                type="button"
                                class="px-3 py-1.5 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                onClick={() => onUnblock(session.id)}
                                aria-label={`განბლოკე სესია ${session.browser}-ზე ${session.os}-ზე`}
                            >
                                განბლოკვა
                            </button>
                        </Match>

                        <Match when={session.status === "trusted" && !session.current_session}>
                            <Show when={session.session_id}>
                                <button
                                    type="button"
                                    class="px-3 py-1.5 text-xs rounded-md bg-amber-600 text-white hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-colors"
                                    onClick={() => onLogout(session.id, session.session_id)}
                                    aria-label={`დასრულდეს სესია ${session.browser}-ზე ${session.os}-ზე`}
                                >
                                    სეანსის დასრულება
                                </button>
                            </Show>

                            <button
                                type="button"
                                class="px-3 py-1.5 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
                                onClick={() => onBlock(session.id, session.session_id, session.status)}
                                aria-label={`დაბლოკე სესია ${session.browser}-ზე ${session.os}-ზე`}
                            >
                                დაბლოკვა
                            </button>
                        </Match>
                    </Switch>
                </div>
            </Show>
        </div>
    )
}