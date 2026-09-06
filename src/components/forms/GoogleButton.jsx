import { createSignal, onMount, Show } from "solid-js"

/**
 * The "continue with Google" button.
 *
 * Google Identity Services renders this itself: the page supplies two
 * configuration divs and GIS replaces them once its script has loaded. That
 * makes the markup fiddly and identical everywhere it appears - it was copied
 * verbatim into the login and register screens, script loader included, and
 * had to be corrected in both whenever it was corrected at all.
 *
 * The button only appears if Google recognises the page's origin, which means
 * an HTTPS origin registered against the OAuth client. On the plain-HTTP
 * container address the test stack uses by default, GIS renders nothing at all
 * and the skeleton below is what a visitor sees.
 */
export const GoogleButton = (props) => {
    const [loaded, setLoaded] = createSignal(false)

    onMount(() => {
        // Loaded here rather than in the document head so it costs nothing on
        // the pages that do not offer Google sign-in.
        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client?hl=ka"
        script.defer = true
        script.onload = () => setLoaded(true)
        document.head.appendChild(script)
    })

    const noun = () => props.context === "signup" ? "Sign-Up" : "Sign-In"

    return (
        <section>
            <Show when={!loaded()}>
                <div
                    class="h-[44px] w-[300px] border border-gray-300 rounded-md bg-gray-50 animate-pulse"
                    aria-label={`Google ${noun()} იტვირთება`}
                    role="status"
                >
                </div>
            </Show>

            <div
                class={`transition-opacity duration-300 ${loaded() ? 'opacity-100' : 'opacity-0 h-0 w-full overflow-hidden'}`}
                aria-live="polite"
                aria-busy={!loaded()}
            >
                <div
                    id="g_id_onload"
                    data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                    // Must match an authorised redirect URI on the OAuth client,
                    // which is why it is built from VITE_URL and not from
                    // window.location: the value is fixed at build time and the
                    // console entry is registered against exactly that origin.
                    data-login_uri={`${import.meta.env.VITE_URL}/api/auth/google`}
                    data-context={props.context ?? "signin"}
                    data-ux_mode="redirect"
                    aria-hidden='true'
                    data-itp_support="true"
                >
                </div>
                <div
                    class="g_id_signin"
                    data-type="standard"
                    data-shape="rectangular"
                    data-theme="outline"
                    data-text="continue_with"
                    data-size="large"
                    data-locale="ka"
                    data-width='300'
                    data-logo_alignment="left"
                    aria-label="გაგრძელება Google ანგარიშით"
                >
                </div>
                <div class="sr-only" aria-live="polite">
                    {loaded() ? `Google ${noun()} ხელმისაწვდომია` : `Google ${noun()} იტვირთება`}
                </div>
            </div>
        </section>
    )
}
