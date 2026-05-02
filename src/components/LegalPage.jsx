import { Header } from "~/components/Header"
import { Footer } from "~/components/Footer"
import { For } from "solid-js"

export function LegalPage(props) {
    const formatBody = (body) =>
        Array.isArray(body) ? body : [body]

    return (
        <div class="min-h-screen flex flex-col bg-gray-50">
            <div class="w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto flex-1">
                <Header />

                <article class="py-10 md:py-14 max-w-3xl">
                    <header class="mb-10">
                        <h1 class="text-3xl md:text-4xl font-gsans font-bold text-gray-900 mb-2">{props.title}</h1>
                        <p class="text-sm text-gray-400 font-gsans">
                            ბოლო განახლება: {props.lastUpdated}
                        </p>
                    </header>

                    <div class="space-y-8">
                        <For each={props.sections}>
                            {(section, i) => (
                                <section class="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm">
                                    <h2 class="text-lg font-gsans font-bold text-gray-900 mb-4 flex items-start gap-3">
                                        <span class="shrink-0 w-7 h-7 rounded-lg bg-[#E85A4F]/10 text-[#E85A4F] flex items-center justify-center text-xs font-bold">
                                            {i() + 1}
                                        </span>
                                        {section.heading}
                                    </h2>
                                    <div class="space-y-3 pl-10">
                                        <For each={formatBody(section.body)}>
                                            {para => (
                                                <p class="text-gray-600 font-gsans text-sm leading-relaxed">{para}</p>
                                            )}
                                        </For>
                                        {section.bullets && (
                                            <ul class="space-y-1.5 mt-2">
                                                <For each={section.bullets}>
                                                    {item => (
                                                        <li class="flex items-start gap-2 text-gray-600 font-gsans text-sm">
                                                            <span class="mt-1.5 shrink-0 w-1.5 h-1.5 rounded-full bg-[#E85A4F]" />
                                                            {item}
                                                        </li>
                                                    )}
                                                </For>
                                            </ul>
                                        )}
                                    </div>
                                </section>
                            )}
                        </For>
                    </div>
                </article>
            </div>
            <Footer />
        </div>
    )
}