import { A, createAsync } from "@solidjs/router";
import {
    For,
    Match,
    Show,
    Switch,
    createMemo,
} from "solid-js";
import { get_instructor } from "../api/instructor";
import { CourseCard } from "~/components/CourseCard";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";

const InstructorProfilePage = (props) => {
    const response = createAsync(() => get_instructor(props.params.slug), { deferStream: true });
    const instructor = createMemo(() => response()?.data);
    /*
                <Title>{metaTitle}</Title>
            <Meta name="description" content={metaDescription} />
            <Meta name="keywords" content={`${course.title}, ონლაინ კურსი, განათლება`} />
            <Meta property="og:title" content={metaTitle} />
            <Meta property="og:description" content={metaDescription} />
            <Meta property="og:image" content={metaImage} />
            <Meta property="og:url" content={courseUrl} />

    */
    return (
        <>
        <main class="min-h-screen bg-gray-50 font-gsans">
            <Switch>
                <Match when={response()?.status === 404}>
                    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-4 text-center">
                        <div class="w-20 h-20 rounded-full bg-[#E85A4F]/10 flex items-center justify-center">
                            <svg viewBox="0 0 24 24" class="w-10 h-10 text-[#E85A4F]" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                            </svg>
                        </div>
                        <h2 class="text-xl font-semibold text-gray-800">ინსტრუქტორი ვერ მოიძებნა</h2>
                        <A href="/courses" class="text-sm text-[#E85A4F] hover:underline">კურსების ნახვა</A>
                    </div>
                </Match>

                <Match when={response()?.status === 200 && instructor()}>
                    <div class="w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto flex-1">
                        <Header />
                        <div class="flex flex-col sm:flex-row gap-5 -mt-16 sm:-mt-20 items-start sm:items-end">
                            <img
                                src={instructor()?.profile_picture_link ?? "/default_profile.png"}
                                alt={instructor()?.name}
                                class="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl object-cover border-4 border-white shadow-xl"
                                width={144}
                                height={144}
                                loading="eager"
                            />

                            <div class="flex-1 pb-2">
                                <div class="flex flex-wrap items-start gap-3">
                                    <div>
                                        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                                            {instructor()?.name}
                                        </h1>
                                        <Show when={instructor()?.headline}>
                                            <p class="text-sm text-gray-500 mt-1 font-gsans">{instructor().headline}</p>
                                        </Show>
                                    </div>
                                    <div class="flex items-center gap-2 flex-wrap">
                                        <For each={instructor().socialLinks}>
                                            {([platform, url]) => (
                                                <Show when={url}>
                                                    <a
                                                        href={url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        aria-label={platform}
                                                        class="w-8 h-8 rounded-full bg-gray-100 hover:bg-[#E85A4F] hover:text-white text-gray-600
                                     flex items-center justify-center transition-colors duration-150"
                                                    >
                                                        <img src="/svg/facebook.svg" width={16} height={16} alt="" />
                                                    </a>
                                                </Show>
                                            )}
                                        </For>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="grid grid-cols-3 gap-3 mt-8">
                            {[
                                {
                                    icon: (
                                        <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                                        </svg>
                                    ),
                                    label: "მოსწავლე",
                                    value: (instructor()?.total_students ?? 0).toLocaleString(),
                                    color: "text-[#E85A4F]",
                                },
                                {
                                    icon: (
                                        <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
                                        </svg>
                                    ),
                                    label: "კურსი",
                                    value: instructor()?.total_courses ?? 0,
                                    color: "text-blue-500",
                                },
                                {
                                    icon: (
                                        <svg viewBox="0 0 24 24" class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="1.5">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                        </svg>
                                    ),
                                    label: "რეიტინგი",
                                    value: Number(instructor()?.average_rating ?? 0).toFixed(1),
                                    color: "text-amber-500",
                                },
                            ].map((stat) => (
                                <div class="flex flex-col items-center gap-1.5 bg-white rounded-2xl border border-gray-100 shadow-sm py-4 px-3">
                                    <span class={stat.color}>{stat.icon}</span>
                                    <span class="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</span>
                                    <span class="text-xs text-gray-400 font-gsans">{stat.label}</span>
                                </div>
                            ))}
                        </div>

                        <div class="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20">

                            <div class="lg:col-span-2 flex flex-col gap-8">

                                <Show when={instructor()?.bio}>
                                    <section aria-label="ბიოგრაფია">
                                        <h2 class="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                            <span class="w-1 h-5 bg-[#E85A4F] rounded-full inline-block" />
                                            ჩემს შესახებ
                                        </h2>
                                        <p class="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                            {instructor().bio}
                                        </p>
                                    </section>
                                </Show>
                                <Show when={instructor()?.courses?.length > 0}>
                                    <section aria-label="კურსები">
                                        <h2 class="text-base font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <span class="w-1 h-5 bg-[#E85A4F] rounded-full inline-block" />
                                            კურსები ({instructor().courses.length})
                                        </h2>
                                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <For each={instructor().courses}>
                                                {(course) => <CourseCard course={course} />}
                                            </For>
                                        </div>
                                    </section>
                                </Show>
                            </div>

                            <div class="flex flex-col gap-6">

                                <Show when={instructor().education.length > 0}>
                                    <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" aria-label="განათლება">
                                        <h2 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <svg viewBox="0 0 24 24" class="w-4 h-4 text-[#E85A4F]" fill="none" stroke="currentColor" stroke-width="1.5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                                            </svg>
                                            განათლება
                                        </h2>
                                        <div class="flex flex-col gap-4">
                                            <For each={instructor().education}>
                                                {(edu) => (
                                                    <div class="flex gap-3">
                                                        <div class="mt-1 w-2 h-2 rounded-full bg-[#E85A4F] shrink-0" />
                                                        <div>
                                                            <p class="text-sm font-semibold text-gray-800">{edu.degree ?? edu.title}</p>
                                                            <p class="text-xs text-gray-500">{edu.institution ?? edu.school}</p>
                                                            <Show when={edu.year ?? edu.graduation_year}>
                                                                <p class="text-xs text-gray-400 mt-0.5">{edu.year ?? edu.graduation_year}</p>
                                                            </Show>
                                                        </div>
                                                    </div>
                                                )}
                                            </For>
                                        </div>
                                    </section>
                                </Show>

                                <Show when={instructor().work_experience.length > 0}>
                                    <section class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5" aria-label="გამოცდილება">
                                        <h2 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <svg viewBox="0 0 24 24" class="w-4 h-4 text-[#E85A4F]" fill="none" stroke="currentColor" stroke-width="1.5">
                                                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                            გამოცდილება
                                        </h2>
                                        <div class="flex flex-col gap-5">
                                            <For each={instructor().work_experience}>
                                                {(job) => (
                                                    <div class="flex gap-3">
                                                        <div class="mt-1 w-2 h-2 rounded-full bg-[#E85A4F] shrink-0" />
                                                        <div>
                                                            <p class="text-sm font-semibold text-gray-800">{job.position ?? job.title}</p>
                                                            <p class="text-xs text-gray-500">{job.company}</p>
                                                            <Show when={job.duration ?? (job.start_year && `${job.start_year} – ${job.end_year ?? "დღემდე"}`)}>
                                                                <p class="text-xs text-gray-400 mt-0.5">
                                                                    {job.duration ?? `${job.start_year} – ${job.end_year ?? "დღემდე"}`}
                                                                </p>
                                                            </Show>
                                                        </div>
                                                    </div>
                                                )}
                                            </For>
                                        </div>
                                    </section>
                                </Show>

                                <Show when={instructor()?.created_at}>
                                    <div class="text-xs text-gray-400 text-center font-gsans">
                                        გახდა ინსტრუქტორი:{" "}
                                        {new Date(instructor().created_at).toLocaleDateString("ka-GE", {
                                            year: "numeric",
                                            month: "long",
                                        })}
                                    </div>
                                </Show>
                            </div>
                        </div>
                    </div>
                </Match>

                <Match when={response()?.status === 500}>
                    <div class="flex flex-col items-center justify-center min-h-[60vh] gap-3 px-4 text-center">
                        <p class="text-gray-500 font-gsans text-sm">შეცდომა მოხდა. სცადეთ თავიდან.</p>
                        <button
                            onClick={() => window.location.reload()}
                            class="text-sm text-[#E85A4F] hover:underline font-gsans"
                        >
                            განახლება
                        </button>
                    </div>
                </Match>
            </Switch>
        </main>
        <Footer></Footer>
       </>
    );
}

export default InstructorProfilePage