import { Link, Meta, Title } from "@solidjs/meta"
import { Footer } from "~/components/Footer"
import { useSubmission } from "@solidjs/router"
import { Show } from "solid-js"
import { login } from "../api/auth/handle-forms/login"
import { ProtectAnonymousRoute } from "~/components/protectAnonymousRoutes"
import { TextField } from "~/components/forms/TextField"
import { PasswordField } from "~/components/forms/PasswordField"
import { GoogleButton } from "~/components/forms/GoogleButton"

const Login = (props) => {
    const submission = useSubmission(login)

    const passwordFailed = () => submission.result?.field === 'password'
    const emailFailed = () => submission.result?.field === 'email'
    const globalFailed = () => submission.result?.field === 'global'
    const message = () => submission.result?.message
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
                            aria-describedby={globalFailed() ? 'global-error' : 'login-form-description'}
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

                            <Show when={globalFailed()}>
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
                                        <TextField
                                            id="email"
                                            name="email"
                                            label="მეილი"
                                            type="email"
                                            required
                                            aria-required='true'
                                            maxlength="254"
                                            title="გთხოვთ შეიყვანოთ სწორი ელ.ფოსტის მისამართი"
                                            disabled={submission.pending}
                                            autocomplete='username'
                                            placeholder="შეიყვანეთ მეილი"
                                            invalid={emailFailed()}
                                            message={message()}
                                        />
                                    </section>

                                    <section>
                                        <PasswordField
                                            id="current-password"
                                            name="password"
                                            label="პაროლი"
                                            autocomplete='current-password'
                                            required
                                            aria-required='true'
                                            minlength="8"
                                            maxlength="128"
                                            pattern="^[\S]+$"
                                            title="პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს, space-ის გარეშე"
                                            disabled={submission.pending}
                                            placeholder="შეიყვანეთ პაროლი"
                                            invalid={passwordFailed()}
                                            message={message()}
                                            hint="მინიმუმ 8 სიმბოლო, space-ის გარეშე"
                                        />
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
                                    aria-describedby={globalFailed() ? 'global-error' : undefined}
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

                        <GoogleButton context="signin" />
                    </div>
                </main>
            </div>
            <Footer></Footer>
        </ProtectAnonymousRoute>
    )
}

export default Login