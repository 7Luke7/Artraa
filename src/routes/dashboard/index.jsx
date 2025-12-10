import { For, createSignal } from "solid-js"
import { LessonCard } from "~/components/LessonCard"

const sampleCourses = [
    {
        id: 1,
        title: "ვებ დეველოპმენტი",
        description: "სრული კურსი HTML, CSS და JavaScript-ში",
        progress: 75,
        lessons: 24,
        duration: "12 კვირა",
        category: "პროგრამირება",
        icon: "/svg/autocad-icon.svg",
    },
    {
        id: 2,
        title: "UI/UX დიზაინი",
        description: "მომხმარებლის ინტერფეისის დიზაინის საფუძვლები",
        progress: 30,
        lessons: 18,
        duration: "8 კვირა",
        category: "დიზაინი",
        icon: "/svg/autocad-icon.svg",
    },
    {
        id: 3,
        title: "მონაცემთა სტრუქტურები",
        description: "ალგორითმები და მონაცემთა სტრუქტურები",
        progress: 100,
        lessons: 32,
        duration: "16 კვირა",
        category: "პროგრამირება",
        icon: "/svg/autocad-icon.svg",
    },
    {
        id: 4,
        title: "React Solid.js",
        description: "თანამედროვე ფრონტენდ დეველოპმენტი",
        progress: 10,
        lessons: 28,
        duration: "14 კვირა",
        category: "პროგრამირება",
        icon: "/svg/autocad-icon.svg",
    }
]

const recentActivity = [
    {
        id: 1,
        type: "lesson_completed",
        title: "დაასრულე გაკვეთილი 'JavaScript Arrays'",
        course: "ვებ დეველოპმენტი",
        time: "2 საათის წინ",
        icon: "/svg/check-circle.svg",
        color: "bg-green-100 text-green-600"
    },
    {
        id: 2,
        type: "quiz_passed",
        title: "გაიარა ტესტი 'HTML Basics'",
        course: "ვებ დეველოპმენტი",
        time: "1 დღის წინ",
        icon: "/svg/quiz.svg",
        color: "bg-blue-100 text-blue-600"
    },
    {
        id: 3,
        type: "course_started",
        title: "დაიწყო ახალი კურსი 'UI/UX დიზაინი'",
        course: "UI/UX დიზაინი",
        time: "2 დღის წინ",
        icon: "/svg/play-circle.svg",
        color: "bg-purple-100 text-purple-600"
    },
    {
        id: 4,
        type: "achievement",
        title: "მიიღე სამახსოვრო 'Fast Learner'",
        course: "სისტემა",
        time: "3 დღის წინ",
        icon: "/svg/trophy.svg",
        color: "bg-yellow-100 text-yellow-600"
    }
]

const statistics = {
    totalStudyTime: "48 საათი",
    averageScore: 86,
    streak: 7,
    completedCourses: 2
}

const Home = () => {
    const [activeTab, setActiveTab] = createSignal("all");

    return <main class="p-8 space-y-8">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm font-medium-tbc">აქტიური კურსები</p>
                        <p class="text-2xl font-bold text-gray-800 mt-2">{sampleCourses.length}</p>
                    </div>
                    <div class="w-12 h-12 flex items-center justify-center bg-blue-50 rounded-lg">
                        <img src="/svg/courses.svg" class="w-6 h-6 text-blue-500" />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm font-medium-tbc">დასრულებული გაკვეთილები</p>
                        <p class="text-2xl font-bold text-gray-800 mt-2">84</p>
                    </div>
                    <div class="w-12 h-12 flex items-center justify-center bg-green-50 rounded-lg">
                        <img src="/svg/check-circle.svg" class="w-6 h-6 text-green-500" />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm font-medium-tbc">საერთო საათები</p>
                        <p class="text-2xl font-bold text-gray-800 mt-2">{statistics.totalStudyTime}</p>
                    </div>
                    <div class="w-12 h-12 flex items-center justify-center bg-orange-50 rounded-lg">
                        <img src="/svg/clock.svg" class="w-6 h-6 text-orange-500" />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div class="flex items-center justify-between">
                    <div>
                        <p class="text-gray-500 text-sm font-medium-tbc">დასრულებული კურსები</p>
                        <p class="text-2xl font-bold text-gray-800 mt-2">{statistics.completedCourses}</p>
                    </div>
                    <div class="w-12 h-12 flex items-center justify-center bg-purple-50 rounded-lg">
                        <img src="/svg/trophy.svg" class="w-6 h-6 text-purple-500" />
                    </div>
                </div>
            </div>
        </div>
        <div>
            {/* Courses Header with Tabs */}
            <div class="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                <div>
                    <h2 class="text-xl font-semibold text-gray-800">ჩემი კურსები</h2>
                    <p class="text-gray-500 text-sm mt-1">გააგრძელე სწავლა სადაც დატოვე</p>
                </div>
                <div class="flex space-x-2 mt-4 sm:mt-0 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab("all")}
                        class={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab() === "all" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                    >
                        ყველა
                    </button>
                    <button
                        onClick={() => setActiveTab("active")}
                        class={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab() === "active" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                    >
                        აქტიური
                    </button>
                    <button
                        onClick={() => setActiveTab("completed")}
                        class={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab() === "completed" ? "bg-white shadow-sm" : "hover:bg-white/50"}`}
                    >
                        დასრულებული
                    </button>
                </div>
            </div>

            {/* Course Cards Grid */}
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
                <For each={[...sampleCourses, ...sampleCourses].filter((_, i) => i !== 5)}>
                    {(lesson) => <LessonCard lesson={lesson} />}
                </For>
            </div>
        </div>
    </main>
}

export default Home