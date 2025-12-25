import { createAsync } from "@solidjs/router";
import { auth } from "./api/auth/ProtectRoutes";
import { LandingContent } from "~/components/landing/Landing";
import { Show } from "solid-js";
import { AuthorizedLanding } from "~/components/AuthorizedLanding/AuthorizedLanding";
import { WebSocketContextProvider } from "~/ws_context";

export default function Landing() {
  const is_auth = createAsync(auth, { deferStream: true })

  return <Show fallback={<LandingContent />} when={is_auth()}>
    <WebSocketContextProvider>
      <AuthorizedLanding />
    </WebSocketContextProvider>
  </Show>
}