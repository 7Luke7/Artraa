import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { Suspense } from "solid-js";
import { Base, Meta, MetaProvider } from "@solidjs/meta";
import "~/styles/app.css"
import { WebSocketContextProvider } from "./ws_context";

export default function App() {
  return (
    <Router
      root={props => (
        <WebSocketContextProvider>
          <MetaProvider>
            <Meta name="viewport" content="width=device-width, initial-scale=1" />
            <Base target="_blank" href={import.meta.env.VITE_URL}></Base>
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        </WebSocketContextProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
