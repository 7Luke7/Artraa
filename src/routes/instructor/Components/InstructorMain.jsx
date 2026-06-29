import { CourseCard } from "~/components/CourseCard";
import { Footer } from "~/components/Footer";
import { createSignal, For, lazy, Show } from "solid-js";
import { InstructorLayout } from "./InstructorLayout";
import { Header } from "~/components/Header";

const InstructorCourses = lazy(() => import("./InstructorCourses.jsx"))

export default ({ instructor }) => {
    const [activeTab, setActiveTab] = createSignal("about");

    return <main class="min-h-screen bg-gray-50 font-gsans">
        <div class="w-full md:w-10/12 xl:w-full 2xl:w-10/12 px-2 sm:px-4 md:px-6 mx-auto flex-1">
            <Header />
            <InstructorLayout setActiveTab={setActiveTab} instructor={instructor} activeTab={activeTab} />
            <Show when={activeTab() === "about"}>
                <div class="flex pb-20 flex-col xl:grid mt-5 xl:grid-cols-3 gap-8">
                    <div class="xl:col-span-2 flex flex-col gap-8 xl:order-none order-2">
                        <section aria-label="ბიოგრაფია">
                            <h2 class="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                <span class="w-1 h-5 bg-[#E85A4F] rounded-full inline-block" />
                                ბიოგრაფია
                            </h2>
                            <p class="text-sm text-gray-600 font-gsans font-normal leading-relaxed whitespace-pre-line">
                                {instructor.bio}
                            </p>
                        </section>
                        <section aria-label="ბიოგრაფია">
                            <div class="flex items-center justify-between">
                                <h2 class="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <span class="w-1 h-5 bg-[#E85A4F] rounded-full inline-block" />
                                    კურსები ({instructor.courses.course_count || 0})
                                </h2>
                                <button onClick={() => setActiveTab('courses')} class="text-sm font-gsans font-medium flex items-center cursor-pointer gap-x-1 text-[#E85A4F]">
                                    <span>ყველა</span>
                                    <img src='/svg/arrow-narrow-right-branded.svg' width={15} height={15} />
                                </button>
                            </div>
                            <Show
                                when={instructor.courses.course_count > 0}
                                fallback={
                                    <p class="text-sm text-gray-400 text-center py-16">კურსები არ მოიძებნა.</p>
                                }
                            >
                                <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                    <For each={instructor.courses.courses}>
                                        {(course) => <CourseCard course={course} />}
                                    </For>
                                </div>
                            </Show>
                        </section>
                    </div>
                    <div class="flex xs:flex-col sm:flex-row xl:flex-col gap-6 order-1 xl:order-none">
                        <Show when={instructor.education?.length > 0}>
                            <section class="bg-white xl:flex-0 flex-1 rounded-2xl border border-gray-100 shadow-sm p-5" aria-label="განათლება">
                                <h2 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg viewBox="0 0 24 24" class="w-4 h-4 text-[#E85A4F]" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342" />
                                    </svg>
                                    განათლება
                                </h2>
                                <div class="flex flex-col gap-4">
                                    <For each={instructor.education}>
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

                        <Show when={instructor.work_experience?.length > 0}>
                            <section class="bg-white flex-1 xl:flex-0 rounded-2xl border border-gray-100 shadow-sm p-5" aria-label="გამოცდილება">
                                <h2 class="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                                    <svg viewBox="0 0 24 24" class="w-4 h-4 text-[#E85A4F]" fill="none" stroke="currentColor" stroke-width="1.5">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                    გამოცდილება
                                </h2>
                                <div class="flex flex-col gap-5">
                                    <For each={instructor.work_experience}>
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
                    </div>
                </div>
            </Show>

            <Show when={activeTab() === "courses"}>
                <InstructorCourses
                    courses={instructor.courses.courses}
                    instructor_id={instructor.id}
                    course_count={instructor.courses.course_count}
                ></InstructorCourses>
            </Show>
        </div>
        <Footer />
    </main>
}