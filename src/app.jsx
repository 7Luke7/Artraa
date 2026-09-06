import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { ErrorBoundary, Suspense } from "solid-js";
import "~/styles/app.css"
import { MetaProvider } from "@solidjs/meta";
import { PageLoader } from "./components/PageLoader";
import { AppErrorFallback } from "./components/AppErrorFallback";

export default function App() {
  return (
    <Router
      root={props => (
        <MetaProvider>
          {/*
            Outside Suspense on purpose. A component that throws while
            suspended still throws, and a boundary inside would be torn down
            with the tree it was meant to catch - leaving the blank page this
            replaces.
          */}
          <ErrorBoundary fallback={(error, reset) => (
            <AppErrorFallback error={error} reset={reset} />
          )}>
            <Suspense fallback={<PageLoader />}>
              {props.children}
            </Suspense>
          </ErrorBoundary>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  );
}
