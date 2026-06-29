import { createAsync } from "@solidjs/router";
import {
    Match,
    Suspense,
    Switch,
    createMemo,
    lazy
} from "solid-js";
import { get_instructor } from "../api/instructor";
import { RenderWebsocketRoutes } from "~/components/RenderWebsocketRoutes";

const InstructorNotFound = lazy(() => import('./Components/InstructorNotFound.jsx'))
const ExceptionContent = lazy(() => import('./Components/ExceptionContent.jsx'))
const InstructorMain = lazy(() => import('./Components/InstructorMain.jsx'))

const InstructorProfilePage = (props) => {
    const response = createAsync(() => get_instructor(props.params.slug), { deferStream: true });

    const instructor = createMemo(() => response()?.data);

    return (
        <RenderWebsocketRoutes>
            <Suspense>
                <Switch>
                    <Match when={response()?.status === 404}>
                        <InstructorNotFound />
                    </Match>
                    <Match when={response()?.status === 200 && instructor()}>
                        <InstructorMain instructor={instructor()} />
                    </Match>
                    <Match when={response()?.status === 500}>
                        <ExceptionContent />
                    </Match>
                </Switch>
            </Suspense>
        </RenderWebsocketRoutes>
    );
};

export default InstructorProfilePage;