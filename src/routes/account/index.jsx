import { createAsync } from "@solidjs/router"
import { get_user } from "../api/user/account"
import { Show } from "solid-js"
import { Title } from "@solidjs/meta"

const Account = () => {
    const user = createAsync(get_user, { deferStream: true })

    return (
        <Show when={user()} fallback={
            <div 
                class="min-h-[400px] flex items-center justify-center" 
                aria-busy="true" 
                aria-label="მომხმარებლის ინფორმაცია იტვირთება"
            >
                <div class="text-center">
                    <div 
                        class="inline-block h-8 w-8 border-4 border-[#E98074] border-t-transparent rounded-full animate-spin"
                        aria-hidden="true"
                    ></div>
                    <p class="mt-4 text-gray-600">იტვირთება...</p>
                </div>
            </div>
        }>
            <Title>Artra - აქაუნთი</Title>
            
            <div 
                role="region" 
                aria-labelledby="personal-info-heading"
                class="max-w-4xl mx-auto"
            >
                <h3 
                    id="personal-info-heading"
                    class="text-lg font-gsans font-bold text-gray-800 mb-4 md:mb-6"
                >
                    პირადი ინფორმაცია
                </h3>
                
                <div class="space-y-4 md:space-y-6">
                    <section 
                        aria-labelledby="name-label"
                        class="bg-gray-50 rounded-lg p-4 md:p-5"
                    >
                        <label 
                            id="name-label"
                            for="name-display"
                            class="block text-sm font-gsans font-medium text-gray-700 mb-2"
                        >
                            სახელი
                        </label>
                        <p 
                            id="name-display"
                            class="bg-gray-100 w-full md:w-fit px-4 py-2 md:py-3 rounded-lg text-md font-gsans font-normal break-words"
                            aria-live="polite"
                        >
                            {user().name}
                        </p>
                    </section>
                    <section 
                        aria-labelledby="email-label"
                        class="bg-gray-50 rounded-lg p-4 md:p-5"
                    >
                        <label 
                            id="email-label"
                            for="email-display"
                            class="block text-sm font-gsans font-medium text-gray-700 mb-2"
                        >
                            ელ. ფოსტა
                        </label>
                        <p 
                            id="email-display"
                            class="bg-gray-100 w-full md:w-fit px-4 py-2 md:py-3 rounded-lg text-md font-gsans font-normal break-all"
                            aria-live="polite"
                        >
                            {user().email}
                        </p>
                    </section>
                    <section 
                        aria-labelledby="joined-label"
                        class="bg-gray-50 rounded-lg p-4 md:p-5"
                    >
                        <label 
                            id="joined-label"
                            for="joined-display"
                            class="block text-sm font-gsans font-medium text-gray-700 mb-2"
                        >
                            შემოუერთდა
                        </label>
                        <p 
                            id="joined-display"
                            class="bg-gray-100 w-full md:w-fit px-4 py-2 md:py-3 rounded-lg text-md font-gsans font-normal"
                            aria-live="polite"
                        >
                            <time datetime={user().created_at}>
                                {user().parsed_created_at}
                            </time>
                        </p>
                    </section>
                </div>
            </div>
        </Show>
    )
}

export default Account