import { get_security_details } from "~/routes/api/user/account"
import { PasswordSection } from "./PasswordSection"
import SessionsList from "./SessionsList"
import { createAsync } from "@solidjs/router"

const Security = () => {
  const security = createAsync(get_security_details, { deferStream: false })

    return (
        <>
            <div 
                class="mb-6 md:mb-8"
                role="region"
                aria-label="უსაფრთხოების პარამეტრები"
            >
                <h1 
                    class="text-xl md:text-2xl font-gsans font-bold text-gray-800"
                    id="security-heading"
                >
                    უსაფრთხოება
                </h1>
                <p class="text-gray-600 text-sm md:text-base font-gsans font-medium mt-1 md:mt-2">
                    მართე შენი ანგარიშის უსაფრთხოების პარამეტრები
                </p>
            </div>

            <Show when={security()}>
                <div 
                    class="flex flex-col gap-6 lg:gap-8"
                    aria-labelledby="security-heading"
                >
                    <PasswordSection security={security} />
                    <SessionsList security={security}/>
                </div>
            </Show>
        </>
    )
}

export default Security