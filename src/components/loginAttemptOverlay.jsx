import { createResource, Show, useContext } from "solid-js";
import { get_temporary_device } from "~/routes/api/utils";
import { WSContext } from "~/ws_context";

export const LoginAttemptOverlay = ({ pending_verification_id }) => {
    const ctx = useContext(WSContext)
    const [data] = createResource(async () => {
        try {
            const res = await get_temporary_device(pending_verification_id);
            return res.json();
        } catch (err) {
            console.error(err);
        }
    });

    const approve_login_request = (id) => {
        const ws = ctx?.ctx()
        ws.send(JSON.stringify({
            type: 'approve-login',
            pending_verification_id: id
        }))
        ctx?.setStore('login_requests', req => req.filter(device_id => device_id !== id))
    }
    const reject_login_request = (id) => {
        const ws = ctx?.ctx()
        ws.send(JSON.stringify({
            type: 'reject-login',
            pending_verification_id: id
        }))
        ctx?.setStore('login_requests', req => req.filter(device_id => device_id !== id))
    }

    const close_popup = (id) => {
        ctx?.setStore('login_requests', req => req.filter(device_id => device_id !== id))
    }

    return (
        <Show when={data()} fallback={
            <div class="fixed inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
                <p class="text-white text-lg">დატვირთვა...</p>
            </div>
        }>
            <div class="fixed inset-0 p-4 flex justify-center items-center w-full h-full z-[1000] overflow-auto
                    before:fixed before:inset-0 before:w-full before:h-full before:bg-[rgba(0,0,0,0.5)]">
                <div class="w-full max-w-md bg-white shadow-lg rounded-xl p-6 relative">
                    <button onClick={() => close_popup(pending_verification_id)} type="button" id="closeButton" class="absolute top-4 right-4">
                        <img src="/svg/close.svg" width="32" height="32" alt="close" />
                    </button>

                    <div class="mt-6">
                        <h3 class="text-slate-900 text-lg font-bold-tbc font-semibold">
                            ახალი შესვლის მცდელობა
                        </h3>
                        <p class="text-slate-600 text-sm mt-2 leading-relaxed font-gsans font-medium">
                            თქვენს ანგარიშში განხორციელდა შესვლის მცდელობა.
                            გთხოვთ დაადასტუროთ, გეკუთვნით თუ არა ეს მოწყობილობა თქვენ.
                            თუ არ გეკუთვნით დაუყოვნებლივ შეცვალეთ პაროლი.
                        </p>
                    </div>

                    <div class="space-y-4 mt-6">
                        <div class="flex items-center gap-3">
                            <div class="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                <img src="/svg/device.svg" class="w-6 opacity-70" />
                            </div>
                            <div>
                                <p class="text-slate-900 font-gsans font-normal text-base">
                                    {data().device_vendor} {data().device_model || ""}
                                </p>
                                <p class="text-slate-500 text-sm font-gsans font-normal">
                                    {data().device_type === "mobile" ? "მობილური" : data().device_type === "desktop" ? "კომპიუტერი" : "მოწყობილობა"}
                                </p>
                            </div>
                        </div>

                        <div class="bg-slate-50 rounded-lg p-4 space-y-3 text-sm text-slate-700">
                            <div class="flex justify-between">
                                <span class="text-slate-500 font-gsans font-medium">IP:</span>
                                <span class="font-gsans font-normal">{data().ip_address}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-500 font-gsans font-medium">ბრაუზერი:</span>
                                <span class="font-gsans font-normal">{data().browser} {data().browser_version}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="text-slate-500 font-gsans font-medium">ოპერაციული სისტემა:</span>
                                <span class="font-gsans font-normal">{data().os} {data().os_version}</span>
                            </div>
                            <div class="flex flex-col">
                                <span class="text-slate-500 font-gsans font-medium">User Agent:</span>
                                <span class="break-all font-gsans font-normal text-right text-xs">{data().user_agent}</span>
                            </div>
                        </div>
                    </div>

                    <div class="flex gap-4 mt-8">
                        <button
                            onClick={() => reject_login_request(pending_verification_id)}
                            class="px-5 py-2.5 rounded-md cursor-pointer w-full text-slate-900 text-sm font-gsans font-medium bg-gray-200 hover:bg-gray-300 active:bg-gray-200"
                        >
                            უარყოფა
                        </button>
                        <button
                            onClick={() => approve_login_request(pending_verification_id)}
                            class="px-5 py-2.5 rounded-md cursor-pointer w-full text-white text-sm font-gsans font-medium bg-[#E98074] hover:bg-[#E85A4F] active:bg-[#E98074]"
                        >
                            დადასტურება
                        </button>
                    </div>
                </div>
            </div>
        </Show>
    );
};
