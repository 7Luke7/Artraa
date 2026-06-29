import { Link, Meta, Title } from "@solidjs/meta"
import { Footer } from "~/components/Footer"
import { useSubmission } from "@solidjs/router"
import { createSignal, onMount, Show } from "solid-js"
import { login } from "../api/auth/handle-forms/login"
import { ProtectAnonymousRoute } from "~/components/protectAnonymousRoutes"

const Login = (props) => {
    const submission = useSubmission(login)
    const [showPassword, setShowPassword] = createSignal(false);
    const [googleLoaded, setGoogleLoaded] = createSignal(false)

    const PasswordField = () => submission.result?.field === 'password'
    const EmailField = () => submission.result?.field === 'email'
    const GlobalField = () => submission.result?.field === 'global'
    const message = () => submission.result?.message
    onMount(() => {
        const script = document.createElement("script");
        script.src = "https://accounts.google.com/gsi/client?hl=ka";
        script.defer = true;
        script.onload = () => setGoogleLoaded(true);
        document.head.appendChild(script);
    });
    return (
        <ProtectAnonymousRoute>
            <Title>Artra - შესვლა</Title>
            <Meta name="description" content="შედით თქვენს Artra ანგარიშში - ონლაინ საგანმანათლებლო პლატფორმაზე. განაგრძეთ სწავლა სხვადასხვა საგნებში და გაიღრმავეთ თქვენი ცოდნა" />
            <Meta name="keywords" content="Artra, Artra შესვლა, Artra ანგარიში, შესვლა Artra, ონლაინ სწავლება, ონლაინ განათლება, ონლაინ კურსები, ელერნინგი, ციფრული განათლება, საქართველო" />

            <Meta property="og:title" content="Artra - შესვლა" />
            <Meta property="og:description" content="შედით თქვენს Artra ანგარიშში - ონლაინ საგანმანათლებლო პლატფორმაზე" />
            <Meta property="og:url" content={`${import.meta.env.VITE_URL}/login`} />
            <Meta property="og:image" content={`${import.meta.env.VITE_URL}/og-login.jpg`} />
            <Meta property="og:image:alt" content="Artra შესვლის გვერდი" />
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Artra - შესვლა",
                    "description": "შედით თქვენს Artra ანგარიშში - ონლაინ საგანმანათლებლო პლატფორმაზე. განაგრძეთ სწავლა სხვადასხვა საგნებში და გაიღრმავეთ თქვენი ცოდნა",
                    "url": `${import.meta.env.VITE_URL}/login`,
                    "inLanguage": "ka",
                    "mainEntity": {
                        "@type": "Service",
                        "name": "ონლაინ ავტორიზაცია",
                        "description": "ავტორიზაცია ონლაინ საგანმანათლებლო პლატფორმაზე",
                        "provider": {
                            "@type": "EducationalOrganization",
                            "name": "Artra",
                            "description": "ონლაინ საგანმანათლებლო პლატფორმა",
                            "url": `${import.meta.env.VITE_URL}`
                        },
                        "areaServed": {
                            "@type": "Country",
                            "name": "საქართველო"
                        }
                    }
                })}
            </script>
            <Link rel="canonical" href={`${import.meta.env.VITE_URL}/login`} />

            <div class="flex flex-col items-center lg:my-20 my-10">
                <main class="px-4 lg:w-2/6">
                    <h1 class="sr-only">Artra - შესვლა</h1>
                    <p class="sr-only">შედით თქვენს ანგარიშში</p>

                    <div class="mb-8 text-center">
                        <h1 class="text-2xl lg:text-3xl font-gsans font-bold text-slate-900 mb-2">
                            Artra - შესვლა
                        </h1>
                        <p class="text-sm text-slate-600 font-gsans font-medium">
                            შედით თქვენს ანგარიშში
                        </p>
                    </div>

                    <div class="w-full">
                        <form
                            action={login}
                            method="POST"
                            aria-labelledby="login-form-title"
                            aria-describedby={GlobalField() ? 'global-error' : 'login-form-description'}
                            role="form"
                            class="lg:bg-transparent rounded-lg lg:rounded-none md:p-6 lg:p-0"
                        >
                            <input type='hidden' name='next_page' value={props.location.search} />
                            <h2 id="login-form-title" class="sr-only">
                                შესვლის ფორმა
                            </h2>
                            <p id="login-form-description" class="sr-only">
                                შეავსეთ თქვენი ანგარიშის მონაცემები შესასვლელად
                            </p>

                            <h3 class="hidden lg:block text-slate-900 text-2xl xl:text-3xl font-gsans font-bold mb-6 xl:mb-8">
                                შესვლა
                            </h3>

                            <Show when={GlobalField()}>
                                <div
                                    id="global-error"
                                    role="alert"
                                    aria-live="assertive"
                                    aria-atomic="true"
                                    class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md"
                                >
                                    <p class="text-sm font-gsans font-medium text-red-800">
                                        {message()}
                                    </p>
                                    <p class="text-xs text-red-700 mt-1">
                                        გთხოვთ შეამოწმოთ ყველა ველი და სცადოთ თავიდან.
                                    </p>
                                </div>
                            </Show>
                            <div class="sr-only" aria-live="polite" aria-atomic="true">
                                {submission.pending && "შესვლა მუშავდება..."}
                            </div>

                            <div class="space-y-5 md:space-y-6">
                                <div class="flex flex-col sm:gap-4 md:gap-6">
                                    <section class="mb-4 sm:mb-0">
                                        <label
                                            for="email"
                                            class="text-sm text-slate-900 font-gsans font-medium mb-2 block"
                                        >
                                            მეილი
                                        </label>
                                        <input
                                            name="email"
                                            required
                                            aria-required='true'
                                            maxlength="254"
                                            id="email"
                                            type="email"
                                            title="გთხოვთ შეიყვანოთ სწორი ელ.ფოსტის მისამართი"
                                            disabled={submission.pending}
                                            aria-invalid={EmailField() ? 'true' : 'false'}
                                            aria-describedby={EmailField() ? "email-error" : undefined}
                                            autocomplete='username'
                                            class={`bg-slate-50 w-full text-sm font-gsans font-medium text-slate-900 px-4 py-3 rounded-md outline-0 border focus:bg-transparent transition-colors duration-200
                                                    ${EmailField()
                                                    ? 'border-red-500'
                                                    : 'border-gray-200 focus:ring-2 focus:ring-[#E98074] focus:ring-opacity-30'
                                                }`}
                                            placeholder="შეიყვანეთ მეილი"
                                        />
                                        <Show when={EmailField()}>
                                            <div
                                                id="email-error"
                                                role="alert"
                                                aria-live='assertive'
                                                class="mt-2 text-sm text-red-600 font-gsans font-medium"
                                            >
                                                {message()}
                                            </div>
                                        </Show>
                                    </section>

                                    <section>
                                        <label
                                            for="current-password"
                                            class="text-sm text-slate-900 font-gsans font-medium mb-2 block"
                                        >
                                            პაროლი
                                        </label>
                                        <div class="relative">
                                            <input
                                                id='current-password'
                                                autocomplete='current-password'
                                                name="password"
                                                required
                                                aria-required='true'
                                                minlength="8"
                                                maxlength="128"
                                                pattern="^[\S]+$"
                                                title="პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს, space-ის გარეშე"
                                                disabled={submission.pending}
                                                type={showPassword() ? 'text' : 'password'}
                                                aria-invalid={PasswordField() ? 'true' : 'false'}
                                                aria-describedby='password-constraints'
                                                class={`bg-slate-50 outline-0 w-full text-slate-900 pl-4 pr-10 py-3 rounded-md border focus:bg-transparent text-sm font-gsans font-medium transition-colors duration-200
                                                                ${PasswordField()
                                                        ? 'border-red-500'
                                                        : 'border-gray-200 focus:ring-2 focus:ring-[#E98074] focus:ring-opacity-30'
                                                    }`}
                                                placeholder="შეიყვანეთ პაროლი"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword())}
                                                class="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#E98074] focus:ring-offset-2 transition-colors duration-200"
                                                aria-label={showPassword() ? "პაროლის დამალვა" : "პაროლის ჩვენება"}
                                                aria-controls="current-password"
                                                aria-expanded={showPassword()}
                                                disabled={submission.pending}
                                            >
                                                <Show
                                                    when={showPassword()}
                                                    fallback={
                                                        <img
                                                            src="/svg/eye.svg"
                                                            width={20}
                                                            height={20}
                                                            aria-hidden="true"
                                                        />
                                                    }
                                                >
                                                    <img
                                                        src="/svg/eye-closed.svg"
                                                        width={20}
                                                        height={20}
                                                        aria-hidden="true"
                                                    />
                                                </Show>
                                            </button>
                                        </div>
                                        <div id="password-constraints" aria-live={PasswordField() ? 'assertive' : 'off'} role={PasswordField() ? 'alert' : ''} class={`mt-2 font-gsans font-normal text-xs ${PasswordField() ? 'text-red-600' : 'text-slate-600'}`}>
                                            {PasswordField() ? message() : 'მინიმუმ 8 სიმბოლო, space-ის გარეშე'}
                                        </div>
                                    </section>
                                </div>

                                <section class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                    <div class="flex items-center">
                                        <input
                                            id="remember-me"
                                            type="checkbox"
                                            name="remember_me"
                                            class="h-4 w-4 accent-[#E85A4F]"
                                            disabled={submission.pending}
                                        />
                                        <label
                                            for="remember-me"
                                            class="ml-3 font-gsans font-medium block text-sm text-slate-900"
                                        >
                                            დამიმახსოვრე
                                        </label>
                                    </div>

                                    <div>
                                        <p class="text-sm font-gsans font-medium text-slate-600">
                                            არ გაქვთ ანგარიში?{" "}
                                            <a
                                                target="_self"
                                                aria-label="ანგარიშის შექმნა Artra-ზე"
                                                href="/register"
                                                class="text-[#E85A4F] font-gsans font-medium hover:underline ml-1"
                                            >
                                                რეგისტრაცია
                                            </a>
                                        </p>
                                    </div>
                                </section>
                                <div class="text-sm">
                                    <a
                                        href="/reset/find"
                                        aria-label="პაროლის აღდგენა Artra-ზე"
                                        class="text-[#E85A4F] font-gsans font-medium hover:underline ml-1"
                                    >
                                        დაგავიწყდა პაროლი?
                                    </a>
                                </div>
                            </div>

                            <div class="my-6">
                                <button
                                    type="submit"
                                    disabled={submission.pending}
                                    aria-label={submission.pending ? "შესვლა მუშავდება" : "შესვლა"}
                                    aria-busy={submission.pending}
                                    aria-describedby={GlobalField() ? 'global-error' : undefined}
                                    class='w-full py-3 px-4 text-[15px] font-gsans font-bold rounded-md text-white bg-[#E98074] hover:bg-[#E85A4F] duration-200 ease-in cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {submission.pending ? (
                                        <span class="flex items-center justify-center">
                                            <span class="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                            მუშავდება...
                                        </span>
                                    ) : 'შესვლა'}
                                </button>
                            </div>

                            <div class="mb-6">
                                <p class="text-xs font-gsans font-medium text-slate-600 text-center md:text-left">
                                    შესვლით თქვენ ეთანხმებით ჩვენს{" "}
                                    <a
                                        href="/terms"
                                        class="text-[#E85A4F] hover:underline"
                                        aria-label="წესები და პირობები"
                                    >
                                        წესებს და პირობებს
                                    </a>{" "}
                                    და{" "}
                                    <a
                                        href="/privacy"
                                        class="text-[#E85A4F] hover:underline"
                                        aria-label="კონფიდენციალურობის პოლიტიკა"
                                    >
                                        კონფიდენციალურობის პოლიტიკას
                                    </a>.
                                </p>
                            </div>

                            <div class="mb-6">
                                <div class="flex items-center">
                                    <hr class="flex-grow border-t border-slate-300" />
                                    <span class="flex-shrink mx-4 text-sm text-slate-600 font-gsans font-medium whitespace-nowrap">
                                        ან შედით Google-ით
                                    </span>
                                    <hr class="flex-grow border-t border-slate-300" />
                                </div>
                            </div>
                        </form>

                        <section>
                            <Show when={!googleLoaded()}>
                                <div
                                    class="h-[44px] w-[300px] border border-gray-300 rounded-md bg-gray-50 animate-pulse"
                                    aria-label="Google Sign-Up იტვირთება"
                                    role="status"
                                >
                                </div>
                            </Show>

                            <div
                                class={`transition-opacity duration-300 ${googleLoaded() ? 'opacity-100' : 'opacity-0 h-0 w-full overflow-hidden'}`}
                                aria-live="polite"
                                aria-busy={!googleLoaded()}
                            >
                                <div
                                    id="g_id_onload"
                                    data-client_id={import.meta.env.VITE_GOOGLE_CLIENT_ID}
                                    data-login_uri={`${import.meta.env.VITE_URL}/api/auth/google`}
                                    data-context="signin"
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
                                    {googleLoaded() ? "Google Sign-In ხელმისაწვდომია" : "Google Sign-In იტვირთება"}
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
            <Footer></Footer>
        </ProtectAnonymousRoute>
    )
}

export default Login