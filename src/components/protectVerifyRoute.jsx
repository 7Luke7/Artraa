import { A, createAsync } from "@solidjs/router"
import { HttpStatusCode } from "@solidjs/start";
import { Match, Switch } from "solid-js"
import { ProtectVerifyRoute } from "~/routes/api/auth/ProtectRoutes"
import { VerificationUnauthorized } from "./VerificationUnauthorized";

const ProtectVerify = (props) => {
  const authResult = createAsync(ProtectVerifyRoute, { deferStream: true });

  return (
    <>
      <HttpStatusCode
        code={authResult()?.status}
      />
      <Switch>
        <Match when={authResult()?.status === 401}>
          <VerificationUnauthorized />
        </Match>

        <Match when={authResult()?.status === 200}>
          {props.children}
        </Match>
      </Switch>
    </>
  );
}

export default ProtectVerify