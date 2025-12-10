import { For } from "solid-js"
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

const Courses = () => {
    return <div class="grid p-8 grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <For each={[...sampleCourses, ...sampleCourses].filter((_, i) => i !== 5)}>
            {(lesson) => <LessonCard lesson={lesson} />}
        </For>
    </div>
}

export default Courses