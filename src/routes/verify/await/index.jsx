import { Title } from "@solidjs/meta";
import { revalidate } from "@solidjs/router";
import { onCleanup, onMount } from "solid-js";
import ProtectVerify from "~/components/protectVerifyRoute";
import { act_on_login_response } from "~/routes/api/auth/handle-forms/login_response";

const WaitingForApproval = () => {
    onMount(() => {
        const interval_id = setInterval(async () => {
            try {
                const res = await act_on_login_response()
                if (res.pending) return
                revalidate(['auth', 'protect-verify'])
            } catch (err) { }
        }, 2000)

        onCleanup(() => {
            clearInterval(interval_id)
        })
    });
    return <ProtectVerify>
        <Title>Artra - მოწყობილობის დადასტურება</Title>
        <main class="min-h-screen flex justify-center items-center">
            <div class="bg-white rounded-xl border border-gray-200 p-8 relative">
                <div class="text-center py-10">
                    <h2 class="text-xl font-gsans font-bold text-gray-900">⏳ ახალი მოწყობილობის ავტორიზაციისთვის გელოდებით</h2>
                    <p class="text-gray-600 mt-2">მომხმარებელმა უნდა დაუშვას თქვენი შესვლა სხვა მოწყობილობიდან.</p>
                </div>
            </div>
        </main>
    </ProtectVerify>
}

export default WaitingForApproval