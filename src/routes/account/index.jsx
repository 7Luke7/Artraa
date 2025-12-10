import { createAsync, useSubmission } from "@solidjs/router"
import { get_user } from "../api/user/account"
import { Show } from "solid-js"

const Account = () => {
    const user = createAsync(get_user, { deferStream: true })

    return <Show when={user()} fallback={'loading...'}>
        <h3 class="text-lg font-semibold font-medium-bold text-gray-800 mb-4">პირადი ინფორმაცია</h3>
        <div class="space-y-6">
            <label class="block text-sm font-medium-tbc text-gray-700 mb-2">
                სახელი
            </label>
            <p class="bg-gray-100 w-fit px-4 py-2 rounded-lg text-md font-regular-tbc">{user().name}</p>
            <label class="block text-sm font-medium-tbc text-gray-700 mb-2">
                ელ. ფოსტა
            </label>
            <p class="bg-gray-100 w-fit px-4 py-2 rounded-lg text-md font-regular-tbc">{user().email}</p>
            <label class="block text-sm font-medium-tbc text-gray-700 mb-2">
                შემოუერთდა
            </label>
            <p class="block text-sm font-medium-tbc text-gray-700 mb-2">
                {user().parsed_created_at}
            </p>
        </div>
    </Show>
}

export default Account