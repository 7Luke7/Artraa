import { createAsync } from "@solidjs/router";
import { auth } from "./api/auth/ProtectRoutes";
import { lazy, Match, Switch } from "solid-js";

const LazyLandingContent = lazy(() => import("~/components/landing/Landing.jsx"))
const LazyAuthorizedLanding = lazy(() => import("~/components/AuthorizedLanding/AuthorizedLanding.jsx"))

export default function Landing() {
  const is_auth = createAsync(auth, { deferStream: false, initialValue: "loading" })

  return <Switch>
      <Match when={!is_auth()}>
        <LazyLandingContent />  
      </Match>
      <Match when={is_auth() && is_auth() !== "loading"}>
        <LazyAuthorizedLanding />
      </Match>
    </Switch>
}