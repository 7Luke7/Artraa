import { Title } from "@solidjs/meta"
import { A } from "@solidjs/router"

export const VerificationUnauthorized = () => {
    return <>
        <Title>401 - არაიდენტიფიცირებული</Title>
        <main class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div
                class="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full border border-gray-200"
                role="alert"
                aria-labelledby="error-title"
            >
                <div class="w-12 h-12 bg-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <img src='/svg/close-white.svg' width={32} height={32} />
                </div>

                <h1
                    id="error-title"
                    class="text-xl font-gsans font-bold text-gray-900 mb-2"
                >
                    წვდომა შეზღუდულია
                </h1>

                <p class="text-gray-700 mb-6 font-gsans font-normal leading-relaxed">
                    ვერიფიკაციის გვერდზე წვდომა არ გაქვთ.
                    <span class="block mt-1 text-sm text-gray-600">
                        შესაძლოა თქვენი სესია ვადაგასულია ან არ გაიარეთ საჭირო ვალიდაცია.
                    </span>
                </p>

                <A
                    href="/login"
                    class="inline-block bg-[#E85A4F] px-6 py-3 rounded-lg text-white font-gsans font-medium transition-all hover:bg-[#d04a40] focus:outline-none focus:ring-4 focus:ring-[#E85A4F] focus:ring-opacity-50 shadow-md hover:shadow-lg"
                    aria-label="მთავარ გვერდზე გადასვლა"
                >
                    მთავარ გვერდზე დაბრუნება
                </A>

                <p class="mt-4 text-sm text-gray-500">
                    პრობლემა გაგრძელდა?{" "}
                    <a
                        href={`mailto:${import.meta.env.VITE_EMAIL}`}
                        class="text-[#E85A4F] hover:underline font-gsans font-medium"
                        aria-label={`ელ. ფოსტა ${import.meta.env.VITE_EMAIL}`}
                    >
                        {import.meta.env.VITE_EMAIL}
                    </a>
                </p>
            </div>
        </main>
    </>
}