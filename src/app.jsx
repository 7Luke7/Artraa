import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { Base, Meta, MetaProvider } from "@solidjs/meta";
import "~/styles/app.css"
import { RenderWSContextConditional } from "./RenderWSContextConditional";

export default function App() {
  return (
    <Router
      root={props => (
        <RenderWSContextConditional>
          <MetaProvider>
            <Meta name="viewport" content="width=device-width, initial-scale=1" />
            <Base target="_blank" href={import.meta.env.VITE_URL}></Base>
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        </RenderWSContextConditional>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
