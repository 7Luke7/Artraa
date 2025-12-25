import { Meta, Title, Link } from "@solidjs/meta"
import { Footer } from "~/components/Footer"
import { A, useSubmission } from "@solidjs/router"
import { Show } from "solid-js"
import { ProtectAnonymousRoute } from "~/components/protectAnonymousRoutes"
import { findUserForReset } from "~/routes/api/auth/handle-forms/findUserForReset"

const FindUser = () => {
    const submission = useSubmission(findUserForReset)

    const GlobalField = () => submission.result?.field === 'global'
    const EmailField = () => submission.result?.field === 'email'
    const is_success = () => submission.result?.ok
    const is_hint = () => submission.result?.type === 'hint'
    const message = () => submission.result?.message

    return (
        <ProtectAnonymousRoute>
            <Title>Artra - პაროლის აღდგენა | მომხმარებლის ძებნა</Title>
            <Meta name="description" content="პაროლის აღდგენა Artra-ზე. შეიყვანეთ თქვენი ელ. ფოსტა პაროლის აღსადგენად. ონლაინ განათლების პლატფორმა" />
            <Meta name="keywords" content="Artra, პაროლის აღდგენა, Artra პაროლი, პაროლის შეცვლა, მომხმარებლის ძებნა, ონლაინ სწავლება" />
            <Meta property="og:title" content="Artra - პაროლის აღდგენა" />
            <Meta property="og:description" content="შეიყვანეთ თქვენი ელ. ფოსტა პაროლის აღსადგენად" />
            <Meta property="og:url" content={`${import.meta.env.VITE_URL}/reset/find`} />
            <Meta property="og:image" content={`${import.meta.env.VITE_URL}/og-reset.jpg`} />
            <Meta property="og:image:alt" content="Artra პაროლის აღდგენის გვერდი" />
            <script type="application/ld+json">
                {JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "WebPage",
                    "name": "Artra - პაროლის აღდგენა",
                    "description": "პაროლის აღდგენა Artra ონლაინ საგანმანათლებლო პლატფორმაზე",
                    "url": `${import.meta.env.VITE_URL}/reset/find`,
                    "inLanguage": "ka",
                    "mainEntity": {
                        "@type": "Service",
                        "name": "პაროლის აღდგენის სერვისი",
                        "description": "პაროლის აღდგენა ელ. ფოსტის მეშვეობით",
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
            <Link rel="canonical" href={`${import.meta.env.VITE_URL}/reset/find`} />

            <div class="flex flex-col items-center justify-center p-4 md:p-6">
                <main class="w-full max-w-md">
                    <form
                        action={findUserForReset}
                        method="POST"
                        aria-label="პაროლის აღდგენის ფორმა"
                        role="form"
                        class="p-4 md:p-6"
                    >
                        <div
                            aria-live="polite"
                            aria-atomic="true"
                            class="sr-only"
                        >
                            {submission.pending && "იძებნება მომხმარებელი..."}
                        </div>

                        <div class="text-center mb-8">
                            <h1 class="text-2xl lg:text-3xl font-gsans font-bold text-slate-900 mb-4">
                                პაროლის აღდგენა
                            </h1>
                            <p class="text-sm lg:text-[15px] font-gsans font-medium text-slate-600 leading-relaxed">
                                შეიყვანეთ თქვენი ელ. ფოსტა, რათა მიიღოთ პაროლის აღდგენის ინსტრუქცია
                            </p>
                        </div>

                        <Show when={GlobalField() && !is_success()}>
                            <div
                                class={`mb-6 p-3 border ${!is_hint() ? 'bg-red-50 border-red-200' : 'border-amber-200 bg-amber-50'} rounded-lg`}
                                role='alert'
                                aria-live="assertive"
                            >
                                <p class={`${!is_hint() ? 'text-red-800' : 'text-amber-800'} text-sm font-gsans font-medium`}>
                                    {message()}
                                </p>
                            </div>
                        </Show>
                        <Show when={is_success()}>
                            <div
                                role="status"
                                aria-live="polite"
                                aria-atomic="true"
                                class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md"
                            >

                                <p class="text-sm font-gsans font-medium text-green-800">
                                    {message()}
                                </p>
                            </div>
                        </Show>

                        <section class="space-y-6">
                            <div>
                                <label
                                    for="email-reset"
                                    class='text-sm text-slate-900 font-gsans font-medium mb-2 block'
                                >
                                    ელ. ფოსტა
                                </label>
                                <input
                                    id="email-reset"
                                    name="email"
                                    type="email"
                                    inputmode="email"
                                    autocomplete="username"
                                    maxLength={254}
                                    required
                                    aria-required="true"
                                    aria-invalid={EmailField() ? "true" : "false"}
                                    aria-describedby='email-constraints'
                                    class={`bg-slate-50 w-full text-sm font-gsans font-medium text-slate-900 px-4 py-3 rounded-md outline-0 border focus:bg-transparent transition-colors duration-200
                                    ${EmailField()
                                            ? 'border-red-500'
                                            : 'border-gray-200 focus:ring-2 focus:ring-[#E98074] focus:ring-opacity-30'
                                        }`}
                                    placeholder="მაგ: user@example.com"
                                    disabled={submission.pending}
                                />
                                <div id="email-constraints" aria-live={EmailField() ? 'assertive' : 'off'} role={EmailField() ? 'alert' : ''} class={`mt-2 font-gsans font-normal text-xs ${EmailField() ? 'text-red-600' : 'text-slate-600'}`}>
                                    {EmailField() ? message() : 'იგივე ელ. ფოსტა, რომლითაც დარეგისტრირდით'}
                                </div>
                            </div>
                        </section>

                        <div class="my-6">
                            <button
                                type="submit"
                                disabled={submission.pending}
                                aria-label={submission.pending ? "მომხმარებლის ძებნა მუშავდება" : "პაროლის აღდგენა"}
                                aria-busy={submission.pending}
                                class={`w-full py-3 px-4 text-[15px] font-gsans font-bold rounded-md text-white bg-[#E98074] hover:bg-[#E85A4F] duration-200 ease-in focus:outline-none focus:ring-4 focus:ring-[#E98074] focus:ring-opacity-50 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {submission.pending ? (
                                    <span class="flex items-center justify-center">
                                        <span class="inline-block h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                        მუშავდება...
                                    </span>
                                ) : 'გაგრძელება'}
                            </button>
                        </div>

                        <div class="text-center">
                            <A
                                href="/login"
                                target="_self"
                                class="text-[#E85A4F] hover:text-[#E98074] font-gsans font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 rounded"
                                aria-label="დაბრუნება შესვლის გვერდზე"
                            >
                                დაბრუნება შესვლის გვერდზე
                            </A>
                        </div>

                        <div class="mt-8 pt-6 border-t border-gray-100">
                            <p class="text-xs text-slate-500 text-center">
                                პაროლის აღდგენის პრობლემებზე დაგვიკავშირდით:{" "}
                                <a
                                    href={`mailto:${import.meta.env.VITE_EMAIL}`}
                                    class="text-[#E85A4F] hover:underline"
                                    aria-label={`ელ. ფოსტა ${import.meta.env.VITE_EMAIL}`}
                                >
                                    {import.meta.env.VITE_EMAIL}
                                </a>
                            </p>
                        </div>
                    </form>
                </main>
            </div>
            <Footer />
        </ProtectAnonymousRoute>
    )
}

export default FindUser