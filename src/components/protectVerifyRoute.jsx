import { createAsync } from "@solidjs/router"
import { HttpStatusCode } from "@solidjs/start";
import { Show } from "solid-js"
import { ProtectVerifyRoute } from "~/routes/api/auth/ProtectRoutes"
import { VerificationUnauthorized } from "./VerificationUnauthorized";

const ProtectVerify = (props) => {
  const authResult = createAsync(ProtectVerifyRoute, { deferStream: true });

  return (
    <>
      <HttpStatusCode
        code={authResult()}
      />
      <Show fallback={<VerificationUnauthorized />} when={authResult() === 200}>
          {props.children}
      </Show>
    </>
  );
}

export default ProtectVerify