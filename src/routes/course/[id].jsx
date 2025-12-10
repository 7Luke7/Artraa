import { Header } from "~/components/Header"
import { createAsync } from "@solidjs/router"
import { Show, For, createSignal } from "solid-js"
import { Accordion } from "~/components/accordion"
import { Footer } from "~/components/Footer"
import { Title } from "@solidjs/meta"
import { get_course_detail } from "../api/courses"

export const route = {
    preload: (props) => get_course_detail(props.params.id)
} 

const Course = (props) => {
    const course_detail = createAsync(() => get_course_detail(props.params.id), {deferStream: true})
    const [selectedSubscription, setSelectedSubscription] = createSignal("თვე")

    const handlePurchase = () => {
        alert(`Purchasing course with ${selectedSubscription()} subscription!`)
    }

    const subscriptionPlans = [
        { id: "თვე", name: "თვე", price: 29.99, savings: "" },
        { id: "90 დღე", name: "90 დღე", price: 79.99, savings: "10% დაზოგვა" },
        { id: "365 დღე", name: "365 დღე", price: 299.99, savings: "15% დაზოგვა" }
    ]

    const features = [
        { icon: '/svg/clock.svg', text: `${course_detail()?.courseLength || '8 კვირა'} ხანგრძლივობა` },
        { icon: '/svg/users.svg', text: `${course_detail()?.students || '150+'}-ზე მეტი სტუდენტი` },
    ]

    return <>
        <Title>Artra: {course_detail()?.title}</Title>
        <Header pid={"11"} />
        <Show when={course_detail()}>
            <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
                <div class="mx-auto px-14 py-8">
                    {/* Hero Section */}
                    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                        {/* Main Content */}
                        <div class="lg:col-span-2">
                            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                {/* Course Header */}
                                <div class="mb-8">
                                    <h1 class="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-4">
                                        {course_detail().title}
                                    </h1>
                                    <p class="text-xl text-gray-600 leading-relaxed mb-6">
                                        {course_detail().description}
                                    </p>
                                </div>

                                {/* Instructor Card */}
                                <div class="bg-gray-50 rounded-xl p-6 mb-8">
                                    <div class="flex items-center gap-4">
                                        <img 
                                            width={64} 
                                            height={64} 
                                            class="rounded-full border-4 border-white shadow-sm" 
                                            src='/default_profile.png' 
                                        />
                                        <div>
                                            <p class="text-sm font-medium text-gray-500 mb-1">ინსტრუქტორი</p>
                                            <h3 class="text-xl font-bold text-orange-500">
                                                {course_detail().instructor}
                                            </h3>
                                            <p class="text-gray-600 mt-1">გამოცდილი სპეციალისტი</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Features Grid */}
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                                    <For each={features}>
                                        {(feature) => (
                                            <div class="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                                                <div class="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg">
                                                    <img src={feature.icon} width={24} height={24} class="text-orange-600" />
                                                </div>
                                                <span class="font-medium text-gray-700">{feature.text}</span>
                                            </div>
                                        )}
                                    </For>
                                </div>

                                {/* Course Details Accordion */}
                                <div class="mb-8">
                                    <h3 class="text-2xl font-bold text-gray-900 mb-6">კურსის დეტალები</h3>
                                    <Accordion />
                                </div>
                            </div>
                        </div>

                        {/* Purchase Card */}
                        <div class="lg:col-span-1">
                            <div class="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-24 z-40 overflow-hidden">
                                {/* Course Image */}
                                <div class="relative">
                                    <img
                                        src={course_detail().thumbnail}
                                        alt={course_detail().title}
                                        class="w-full h-48 object-cover"
                                    />
                                </div>

                                <div class="p-6">
                                    {/* Pricing */}
                                    <div class="text-center mb-6">
                                        <div class="flex items-center justify-center gap-3 mb-2">
                                            <span class="text-4xl font-bold text-gray-900 flex items-center">
                                                ₾
                                                {course_detail().monthly_access_price}
                                            </span>
                                            <span class="text-xl text-gray-500 line-through flex items-center">
                                                ₾
                                                {course_detail().monthly_access_price + 5}
                                            </span>
                                        </div>
                                        <div class="inline-flex items-center px-3 py-1 bg-green-100 rounded-full">
                                            <span class="text-green-700 font-semibold text-sm">🎉 20% ფასდაკლება!</span>
                                        </div>
                                    </div>

                                    {/* Subscription Plans */}
                                    <div class="mb-6">
                                        <h4 class="font-bold text-gray-900 mb-4 text-lg">გამოწერის პაკეტები</h4>
                                        <div class="space-y-3">
                                            <For each={subscriptionPlans}>
                                                {(plan) => (
                                                    <label class={`
                                                        relative flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all
                                                        ${selectedSubscription() === plan.id 
                                                            ? 'border-orange-500 bg-orange-50 shadow-sm' 
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }
                                                    `}>
                                                        <input
                                                            type="radio"
                                                            name="subscription"
                                                            value={plan.id}
                                                            checked={selectedSubscription() === plan.id}
                                                            onChange={(e) => setSelectedSubscription(e.target.value)}
                                                            class="text-orange-500 focus:ring-orange-500"
                                                        />
                                                        <div class="flex-1">
                                                            <div class="flex justify-between items-center mb-1">
                                                                <span class="font-semibold text-gray-900">{plan.name}</span>
                                                                <span class="font-bold text-gray-900 text-lg">
                                                                    ₾
                                                                    {plan.price}
                                                                </span>
                                                            </div>
                                                            <Show when={plan.savings}>
                                                <span class="text-sm text-green-600 font-medium">{plan.savings}</span>
                                            </Show>
                                                        </div>
                                                    </label>
                                                )}
                                            </For>
                                        </div>
                                    </div>

                                    {/* Purchase Button */}
                                    <button
                                        onClick={handlePurchase}
                                        class="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl mb-4"
                                    >
                                        კურსის შეძენა
                                    </button>

                                    {/* Additional Benefits */}
                                    <div class="text-center">
                                        <div class="flex items-center justify-center gap-6 text-sm text-gray-600">
                                            <span class="flex items-center gap-1">
                                                🔒 გარანტია
                                            </span>
                                            <span class="flex items-center gap-1">
                                                📧 მხარდაჭერა
                                            </span>
                                            <span class="flex items-center gap-1">
                                                💳 უსაფრთხო გადახდა
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Section */}
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                            <div class="text-2xl font-bold text-orange-500 mb-2">{course_detail().students || '150+'}</div>
                            <div class="text-gray-600">დასწრებული სტუდენტი</div>
                        </div>
                        <div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                            <div class="text-2xl font-bold text-orange-500 mb-2">{course_detail().rating || '4.8'}</div>
                            <div class="text-gray-600">რეიტინგი</div>
                        </div>
                        <div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                            <div class="text-2xl font-bold text-orange-500 mb-2">{course_detail().courseLength || '8'}</div>
                            <div class="text-gray-600">კვირა</div>
                        </div>
                        <div class="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                            <div class="text-2xl font-bold text-orange-500 mb-2">24/7</div>
                            <div class="text-gray-600">მხარდაჭერა</div>
                        </div>
                    </div>
                </div>
            </div>
        </Show>

        <Footer margin={"50px"}></Footer>
    </>
}

export default Course