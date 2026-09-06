import { Link, Meta, Title } from "@solidjs/meta";
import { Footer } from "~/components/Footer";
import { useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import { register } from "../api/auth/handle-forms/register";
import { ProtectAnonymousRoute } from "~/components/protectAnonymousRoutes";
import { TextField } from "~/components/forms/TextField";
import { PasswordField } from "~/components/forms/PasswordField";
import { GoogleButton } from "~/components/forms/GoogleButton";

const Register = () => {
    const submission = useSubmission(register)

    const message = () => submission.result?.message
    const passwordFailed = () => submission.result?.field === 'password'
    const emailFailed = () => submission.result?.field === 'email'
    const givenNameFailed = () => submission.result?.field === 'given_name'
    const familyNameFailed = () => submission.result?.field === 'family_name'
    const globalFailed = () => submission.result?.field === 'global'
    return (
        <ProtectAnonymousRoute>
            <Title>Artra - რეგისტრაცია</Title>
            <Meta name="description" content="შექმენით ახალი ანგარიში Artra-ზე - ონლაინ საგანმანათლებლო პლატფორმაზე. შეისწავლეთ სხვადასხვა საგნები და გაიღრმავეთ თქვენი ცოდნა" />
            <Meta name="keywords" content="Artra, Artra რეგისტრაცია, Artra ახალი ანგარიში, რეგისტრაცია Artra, ონლაინ სწავლება, ონლაინ განათლება, ონლაინ კურსები, ელერნინგი, ციფრული განათლება, საქართველო" />
            <Meta property="og:title" content="Artra - რეგისტრაცია" />
            <Meta property="og:description" content="შექმენით ახალი ანგარიში Artra-ზე - ონლაინ საგანმანათლებლო პლატფორმაზე" />
            <Meta property="og:url" content={`${import.meta.env.VITE_URL}/register`} />
            <Meta property="og:image" content={`${import.meta.env.VITE_URL}/og-register.jpg`} />
            <Meta property="og:image:alt" content="Artra რეგისტრაციის გვერდი" />
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Artra - რეგისტრაცია",
                    "description": "შექმენით ახალი ანგარიში Artra-ზე - ონლაინ საგანმანათლებლო პლატფორმაზე. შეისწავლეთ სხვადასხვა საგნები და გაიღრმავეთ თქვენი ცოდნა",
                    "url": `${import.meta.env.VITE_URL}/register`,
                    "inLanguage": "ka",
                    "mainEntity": {
                        "@type": "Service",
                        "name": "ონლაინ რეგისტრაცია",
                        "description": "რეგისტრაცია ონლაინ საგანმანათლებლო პლატფორმაზე",
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
            <Link rel="canonical" href={`${import.meta.env.VITE_URL}/register`} />
            <div class="flex flex-col items-center lg:my-20 my-10">
                <main class="w-10/12">
                    <h1 class="sr-only">Artra - რეგისტრაცია</h1>
                    <p class="sr-only">შექმენით ანგარიში ონლაინ კურსებისთვის</p>

                    <div class="lg:hidden mb-6">
                        <h1 id="header" class="text-2xl font-gsans font-bold text-slate-900 mb-3">
                            Artra - რეგისტრაცია
                        </h1>
                        <p class="text-sm text-slate-600 font-gsans font-medium">
                            შექმენით ანგარიში ონლაინ კურსებისთვის
                        </p>
                    </div>

                    <div class="lg:grid lg:grid-cols-2 lg:gap-8 xl:gap-10 lg:items-start">
                        <div class="hidden lg:flex flex-col justify-between h-full">
                            <section class="mb-8" aria-labelledby="platform-description">
                                <h2 id="platform-description" class="text-3xl xl:text-4xl font-gsans font-bold text-slate-900 !leading-tight">
                                    Artra - ონლაინ განათლება
                                </h2>
                                <p class="text-[15px] font-gsans font-medium mt-4 xl:mt-6 text-slate-600 leading-relaxed">
                                    შექმენით ანგარიში და დაიწყეთ სწავლა <strong>Artra</strong>-ზე - საუკეთესო ონლაინ საგანმანათლებლო პლატფორმაზე საქართველოში.
                                    ჩვენ გთავაზობთ ვიდეო კურსებს სხვადასხვა დარგში.
                                </p>

                                <ul class="mt-4 space-y-2 text-sm text-slate-700">
                                    <li class="flex items-center">
                                        <span class="text-green-600 mr-2">✓</span>
                                        მრავალფეროვანი საგნები და კურსები
                                    </li>
                                    <li class="flex items-center">
                                        <span class="text-green-600 mr-2">✓</span>
                                        გამოცდილი ინსტრუქტორები
                                    </li>
                                    <li class="flex items-center">
                                        <span class="text-green-600 mr-2">✓</span>
                                        ხარისხიანი სასწავლო მასალები
                                    </li>
                                    <li class="flex items-center">
                                        <span class="text-green-600 mr-2">✓</span>
                                        მოქნილი სწავლის გრაფიკი
                                    </li>
                                </ul>
                            </section>

                            <p class="text-[15px] font-gsans font-medium text-slate-600">
                                უკვე გაქვს ანგარიში?{" "}
                                <a
                                    target="_self"
                                    aria-label="შესვლა Artra-ზე"
                                    href="/login"
                                    class="text-[#E85A4F] font-gsans font-medium hover:underline ml-1"
                                >
                                    შესვლა
                                </a>
                            </p>
                        </div>

                        <div class="w-full">
                            <form
                                action={register}
                                method="POST"
                                aria-labelledby="registration-form-title"
                                aria-describedby={globalFailed() ? 'global-error' : 'registration-form-description'}
                                role="form"
                                class="lg:bg-transparent rounded-lg lg:rounded-none md:p-6 lg:p-0"
                            >
                                <h2 id="registration-form-title" class="sr-only">
                                    რეგისტრაციის ფორმა
                                </h2>
                                <p id="registration-form-description" class="sr-only">
                                    შეავსეთ თქვენი პირადი ინფორმაცია ახალი ანგარიშის შესაქმნელად
                                </p>

                                <h3 class="hidden lg:block text-slate-900 text-2xl xl:text-3xl font-gsans font-bold mb-6 xl:mb-8">
                                    რეგისტრაცია
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
                                    {submission.pending && "რეგისტრაცია მუშავდება..."}
                                </div>

                                <div class="space-y-5 md:space-y-6">
                                    <div class="flex flex-col sm:flex-row sm:gap-4 md:gap-6">
                                        <section class="sm:w-1/2 w-full mb-4 sm:mb-0">
                                            <TextField
                                                id="given-name"
                                                name="given_name"
                                                label="სახელი"
                                                required
                                                aria-required='true'
                                                minlength="2"
                                                maxlength="50"
                                                title="მხოლოდ ასოები, მინიმუმ 2 სიმბოლო"
                                                autocomplete='given-name'
                                                disabled={submission.pending}
                                                placeholder="შეიყვანეთ სახელი"
                                                invalid={givenNameFailed()}
                                                message={message()}
                                            />
                                        </section>

                                        <section class="sm:w-1/2 w-full">
                                            <TextField
                                                id="family-name"
                                                name="family_name"
                                                label="გვარი"
                                                required
                                                aria-required='true'
                                                minlength="2"
                                                maxlength="50"
                                                title="მხოლოდ ასოები, მინიმუმ 2 სიმბოლო"
                                                autocomplete='family-name'
                                                disabled={submission.pending}
                                                placeholder="შეიყვანეთ გვარი"
                                                invalid={familyNameFailed()}
                                                message={message()}
                                            />
                                        </section>
                                    </div>

                                    <div class="flex flex-col sm:flex-row sm:gap-4 md:gap-6">
                                        <section class="sm:w-1/2 w-full mb-4 sm:mb-0">
                                            <TextField
                                                id="email"
                                                name="email"
                                                label="მეილი"
                                                type="email"
                                                required
                                                aria-required='true'
                                                maxlength="254"
                                                title="გთხოვთ შეიყვანოთ სწორი ელ.ფოსტის მისამართი"
                                                autocomplete='email'
                                                disabled={submission.pending}
                                                placeholder="შეიყვანეთ მეილი"
                                                invalid={emailFailed()}
                                                message={message()}
                                            />
                                        </section>

                                        <section class="sm:w-1/2 w-full">
                                            <PasswordField
                                                id="new-password"
                                                name="password"
                                                label="პაროლი"
                                                autocomplete='new-password'
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

                                        <div class="lg:hidden">
                                            <p class="text-sm font-gsans font-medium text-slate-600">
                                                უკვე გაქვთ ანგარიში?{" "}
                                                <a
                                                    target="_self"
                                                    aria-label="შესვლა Artra-ზე"
                                                    href="/login"
                                                    class="text-[#E85A4F] font-gsans font-medium hover:underline ml-1"
                                                >
                                                    შესვლა
                                                </a>
                                            </p>
                                        </div>
                                    </section>
                                </div>

                                <div class="my-6">
                                    <button
                                        type="submit"
                                        disabled={submission.pending}
                                        aria-label={submission.pending ? "რეგისტრაცია მუშავდება" : "რეგისტრაცია"}
                                        aria-busy={submission.pending}
                                        aria-describedby={globalFailed() ? 'global-error' : undefined}
                                        class='w-full py-3 px-4 text-[15px] font-gsans font-bold rounded-md text-white bg-[#E98074] hover:bg-[#E85A4F] duration-200 ease-in cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed'
                                    >
                                        {submission.pending ? (
                                            <span class="flex items-center justify-center">
                                                <span class="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                                მუშავდება...
                                            </span>
                                        ) : 'შექმენი ანგარიში'}
                                    </button>
                                </div>

                                <div class="mb-6">
                                    <p class="text-xs font-gsans font-medium text-slate-600 text-center md:text-left">
                                        რეგისტრაციით თქვენ ეთანხმებით ჩვენს{" "}
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

                            <GoogleButton context="signup" />
                        </div>
                    </div>
                </main>
            </div>
            <Footer />
        </ProtectAnonymousRoute>
    );
}

export default Register