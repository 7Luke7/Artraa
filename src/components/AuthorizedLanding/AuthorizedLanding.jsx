import { Title } from "@solidjs/meta"
import { Header } from "../Header"
import { Footer } from "../Footer"
import { createAsync } from "@solidjs/router"
import { Show, For } from "solid-js"
import { get_user, getRecommendations, getUserCourses } from "~/routes/api/user/landing"
import { CourseCard } from "../CourseCard"
import { RenderProtectedRoute } from "../RenderProtectedRoute"

export default () => {
    const user = createAsync(get_user)
    const userCourses = createAsync(getUserCourses)
    const recommendations = createAsync(getRecommendations)

    return (
        <RenderProtectedRoute>
            <Title>ჩემი სწავლა - Artra</Title>
            <main class="min-h-screen bg-gray-50 pb-16">
                <div class="pt-10 w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto">
                    <Header />
                    <div class="mb-8 py-8">
                        <h1 class="text-3xl md:text-4xl font-bold font-gsans text-gray-900">
                            გამარჯობა, {user()} 👋
                        </h1>
                        <p class="text-gray-600 mt-2 font-gsans font-normal">განაგრძე სწავლა იქიდან, სადაც შეჩერდი</p>
                    </div>
                    <section class="mb-12">
                        <div class="flex items-center justify-between mb-5">
                            <h2 class="text-2xl font-bold font-gsans text-gray-900">
                                ჩემი კურსები
                            </h2>
                            <a
                                href="/dashboard"
                                class="text-sm font-gsans font-medium flex items-center self-end gap-x-1 text-[#E85A4F]"
                            >
                                <span>ყველა</span> 
                                <img src='/svg/arrow-narrow-right-branded.svg' width={15} height={15} />
                            </a>
                        </div>                        
                        <Show when={userCourses()?.length > 0} fallback={
                            <div class="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
                                <div class="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 class="text-xl font-bold font-gsans text-gray-900 mb-2">კურსები ჯერ არ გაქვს</h3>
                                <p class="text-gray-500 mb-6 font-gsans font-normal">დაიწყე სწავლა ახალი კურსით</p>
                                <a href="/courses" class="inline-block px-6 py-3 bg-[#E85A4F] font-gsans text-white rounded-lg hover:bg-[#d84a3f] transition">
                                    კურსების დათვალიერება
                                </a>
                            </div>
                        }>
                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                                <For each={userCourses()}>
                                    {(course) => (
                                        <div class="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100">
                                            <div class="relative aspect-video overflow-hidden">
                                                <a href={`/course/${course.slug}`}>
                                                    <img
                                                        src={course.thumbnail_url}
                                                        alt={course.title}
                                                        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                </a>
                                                <div class="absolute top-3 right-3">
                                                    <span class="text-xs bg-black/60 text-white px-2 py-1 rounded-md backdrop-blur-sm">
                                                        {Math.floor(course.total_duration / 60)} საათი
                                                    </span>
                                                </div>
                                            </div>
                                            <div class="p-5">
                                                <div class="flex items-center gap-2 mb-2">
                                                    <img
                                                        src={course.avatar}
                                                        onError={(e) => e.currentTarget.src = '/default_profile.png'}
                                                        alt={course.instructor_name}
                                                        class="w-6 h-6 rounded-full object-cover"
                                                    />
                                                    <span class="text-sm text-gray-600">{course.instructor_name}</span>
                                                </div>

                                                <h3 class="font-bold font-gsans text-gray-900 text-lg mb-2 line-clamp-2 hover:text-[#E85A4F] transition">
                                                    <a href={`/course/${course.slug}`}>{course.title}</a>
                                                </h3>

                                                <p class="text-gray-500 text-sm line-clamp-2 mb-4">{course.description}</p>

                                                <div class="space-y-2">
                                                    <div class="flex justify-between text-sm">
                                                        <span class="text-gray-600">პროგრესი</span>
                                                        <span class="font-medium text-[#E85A4F]">{Math.round(course.progress_percentage)}%</span>
                                                    </div>
                                                    <div class="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                                        <div
                                                            class="bg-[#E85A4F] h-2 rounded-full transition-all duration-500"
                                                            style={{ width: `${course.progress_percentage}%` }}
                                                        />
                                                    </div>
                                                    <div class="flex justify-between text-xs text-gray-500">
                                                        <span>{course.completed_lessons || 0}/{course.total_lessons} ლექცია</span>
                                                        <a href={`/course/${course.slug}/learn`} class="text-[#E85A4F] hover:underline">
                                                            {course.progress_percentage === 100 ? 'გადახედვა' : 'გაგრძელება'} →
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </For>
                            </div>
                        </Show>
                    </section>

                    <Show when={recommendations()?.length > 0}>
                        <section>
                            <div class="mb-6">
                                <h2 class="text-2xl font-bold font-gsans text-gray-900">შეიძლება მოგეწონოს</h2>
                                <p class="text-gray-500 font-gsans mt-1">რეკომენდაციები შენი ინტერესებიდან გამომდინარე</p>
                            </div>

                            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                                <For each={recommendations()}>
                                    {(course) => <CourseCard course={course} />}
                                </For>
                            </div>
                        </section>
                    </Show>
                </div>
            </main>

            <Footer />
        </RenderProtectedRoute>
    )
}