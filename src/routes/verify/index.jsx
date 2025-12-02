import { Footer } from "~/components/Footer";
import { EmailVerification } from "~/components/verification";
import { Title } from '@solidjs/meta';
import { A, createAsync } from "@solidjs/router";
import { Switch, Match, Show } from "solid-js"
import { ProtectVerifyRoute } from "../api/auth/ProtectRoutes";
import { HttpStatusCode } from "@solidjs/start";
import { ProtectAnonymousRoute } from "~/components/protectAnonymousRoutes";

const Verify = () => {
  const authResult = createAsync(ProtectVerifyRoute, { deferStream: true })

  return (
    <ProtectAnonymousRoute>
      <Show when={authResult()}>
        <HttpStatusCode code={authResult().status} />
        <Title>Artra - ვერიფიკაცია</Title>
        <Switch>
          <Match when={!authResult().allowed}>
            <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
              <div class="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full border border-gray-200">
                <p class="text-gray-700 mb-6 font-regular-tbc leading-relaxed">
                  {authResult().message}
                </p>

                <A
                  href="/login"
                  class="inline-block bg-[#E85A4F] px-5 py-2.5 rounded-xl text-white font-medium-tbc transition shadow-md hover:shadow-lg"
                >
                  შესვლის გვერდზე დაბრუნება
                </A>
              </div>
            </div>
          </Match>


          <Match when={authResult().allowed}>
            <div class="min-h-screen flex flex-col">
              <div class="flex-1 flex items-center bg-gray-50 justify-center">
                <EmailVerification />
              </div>
              <Footer margin='0' />
            </div>
          </Match>
        </Switch>
      </Show>
    </ProtectAnonymousRoute>
  )
}
export default Verify