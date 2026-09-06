import { Title } from "@solidjs/meta"
import { Show } from "solid-js"

/**
 * What the application shows when a render throws.
 *
 * Before this existed, the root had a Suspense boundary and nothing else: one
 * error anywhere in the tree unmounted everything and left a blank white page,
 * with the reason visible only to whoever happened to have the console open.
 * A visitor could not tell a crash from a slow network, and had nothing to do
 * about either.
 *
 * The reset callback is Solid's own - it re-runs the boundary's children, so a
 * failure caused by a transient fetch recovers in place without a reload.
 */
export const AppErrorFallback = (props) => {
    // Message in development, where it is useful. In production it can carry
    // internals - a query fragment, a path, an id - and the visitor can act on
    // none of it.
    const detail = () => import.meta.env.DEV ? String(props.error?.message ?? props.error) : null

    return <>
        <Title>Artra - მოხდა შეცდომა</Title>
        <main class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div
                class="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full border border-gray-200"
                role="alert"
                aria-labelledby="app-error-title"
            >
                <div class="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <img src='/svg/close-white.svg' width={32} height={32} alt="" />
                </div>

                <h1
                    id="app-error-title"
                    class="text-xl font-gsans font-bold text-gray-900 mb-2"
                >
                    რაღაც შეცდომა მოხდა
                </h1>

                <p class="text-gray-700 mb-6 font-gsans font-normal leading-relaxed">
                    გვერდის ჩატვირთვა ვერ მოხერხდა.
                    <span class="block mt-1 text-sm text-gray-600">
                        სცადეთ ხელახლა — თუ პრობლემა გაგრძელდა, დაგვიკავშირდით.
                    </span>
                </p>

                <Show when={detail()}>
                    <pre class="mb-6 p-3 text-left text-xs font-mono text-red-700 bg-red-50 border border-red-100 rounded-lg overflow-x-auto">
                        {detail()}
                    </pre>
                </Show>

                <button
                    type="button"
                    onClick={() => props.reset()}
                    class="inline-block bg-[#E85A4F] px-6 py-3 rounded-lg text-white font-gsans font-medium transition-all hover:bg-[#d04a40] focus:outline-none focus:ring-4 focus:ring-[#E85A4F] focus:ring-opacity-50 shadow-md hover:shadow-lg"
                >
                    ხელახლა ცდა
                </button>

                <p class="mt-4 text-sm text-gray-500">
                    პრობლემა გაგრძელდა?{" "}
                    <a href="/contact" class="text-[#E85A4F] font-gsans font-medium hover:underline">
                        დაგვიკავშირდით
                    </a>
                </p>
            </div>
        </main>
    </>
}
