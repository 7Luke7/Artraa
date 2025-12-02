import { Meta, Title } from "@solidjs/meta";
import { Header } from "~/components/Header";
import { Footer } from "~/components/Footer";
import { A, useSubmission } from "@solidjs/router";
import { Show } from "solid-js";
import "~/components/google-btn.css"
import { register } from "../api/auth/handle-forms/register";
import { ProtectAnonymousRoute } from "~/components/protectAnonymousRoutes";

const Register = () => {
    const submission = useSubmission(register)
    
    const continue_with_google = () => {
        const width = 500;
        const height = 600;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;

        const popup = window.open(
            '/api/auth/google',
            'Continue with google',
            `width=${width},height=${height},top=${top},left=${left}`
        );

        if (!popup) return alert('Popup blocked! Please allow popups.');

        const listener = (event) => {
            if (event.origin !== window.location.origin) return;

            const data = event.data;
            if (data.success) {
                window.removeEventListener('message', listener);
                window.location = '/dashboard'
            } else if (data.success === false) {
                window.removeEventListener('message', listener);
            }
        };
        window.addEventListener('message', listener)
    }

    return (
        <ProtectAnonymousRoute>
            <Title>Artra - რეგისტრაცია</Title>
            <Meta name="description" content="Artra - რეგისტრაცია" />
            <Meta name="keywords" content="Artra, Artra რეგისტრაცია, რეგისტრაცია Artra" />

            <Header bg={"#fff"}></Header>
            <div class="lg:min-h-[70vh] flex flex-col items-center justify-center p-6">
                <main class="grid lg:grid-cols-2 items-start gap-10 max-w-6xl max-lg:max-w-lg w-full">
                    <div class="h-full flex flex-col justify-between">
                        <div>
                            <h1 class="lg:text-5xl text-4xl font-bold font-bold-tbc text-slate-900 !leading-tight">
                                Artra - განათლება
                            </h1>
                            <p class="text-[15px] font-medium-tbc mt-6 text-slate-600 leading-relaxed">
                                საუკეთესო პლატფორმა საინჟინრო ტექნოლოგიების პროგრამების შესასწავლად, <b>Artra</b> გთავაზობთ ვიდეო კურსებს, ფაილებს, წიგნებს.
                            </p>
                        </div>
                        <p class="text-[15px] font-medium-tbc mt-6 lg:mt-12 text-slate-600">
                            უკვე გაქვს ანგარიში?{" "}
                            <A href="/login" class="text-[#E98074] font-medium-tbc hover:underline ml-1">
                                შესვლა
                            </A>
                        </p>
                    </div>
                    <div class="lg:ml-auto w-full">
                        <form action={register} method="POST">
                            <h2 class="text-slate-900 text-3xl font-bold-tbc font-semibold mb-8">
                                რეგისტრაცია
                            </h2>

                            <Show when={submission.result?.error_message}>
                                <div class="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                                    <p class="text-red-800 font-medium-tbc text-sm">
                                        {submission.result.error_message}
                                    </p>
                                </div>
                            </Show>

                            <div class="space-y-6">
                                <div class="flex space-x-6">
                                    <div class="w-1/2">
                                        <label class="text-sm text-slate-900 font-medium-tbc mb-2 block">სახელი</label>
                                        <input
                                            name="სახელი"
                                            class="bg-slate-50 w-full text-sm font-medium-tbc text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-[#E98074] focus:bg-transparent"
                                            placeholder="შეიყვანეთ სახელი"
                                        />
                                    </div>
                                    <div class="w-1/2">
                                        <label class="text-sm text-slate-900 font-medium-tbc mb-2 block">გვარი</label>
                                        <input
                                            name="გვარი"
                                            class="bg-slate-50 w-full text-sm font-medium-tbc text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-[#E98074] focus:bg-transparent"
                                            placeholder="შეიყვანეთ გვარი"
                                        />
                                    </div>
                                </div>

                                <div class="flex space-x-6">
                                    <div class="w-1/2">
                                        <label class="text-sm text-slate-900 font-medium-tbc mb-2 block">მეილი</label>
                                        <input
                                            name="მეილი"
                                            class="bg-slate-50 w-full text-sm font-medium-tbc text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-[#E98074] focus:bg-transparent"
                                            placeholder="შეიყვანეთ მეილი"
                                        />
                                    </div>
                                    <div class="w-1/2">
                                        <label class="text-sm text-slate-900 font-medium-tbc mb-2 block">პაროლი</label>
                                        <input
                                            name="პაროლი"
                                            type="password"
                                            class="bg-slate-50 w-full text-sm font-medium-tbc text-slate-900 px-4 py-3 rounded-md outline-0 border border-gray-200 focus:border-[#E98074] focus:bg-transparent"
                                            placeholder="შეიყვანეთ პაროლი"
                                        />
                                    </div>
                                </div>

                                <div class="flex items-center">
                                    <input
                                        id="remember"
                                        type="checkbox"
                                        name="დამიმახსოვრე"
                                        class="h-4 w-4 accent-[#E85A4F]"
                                    />
                                    <label for="remember" class="ml-3 block text-sm text-slate-900">
                                        დამიმახსოვრე
                                    </label>
                                </div>
                            </div>
                            <div class="my-6">
                                <button
                                    type="submit"
                                    disabled={submission.pending}
                                    class={`w-full py-2.5 px-4 text-[15px] font-medium-tbc font-bold rounded-md text-white bg-[#E98074] ${!submission.pending && 'hover:bg-[#E85A4F]'} duration-200 ease-in focus:outline-none cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    {submission.pending ? 'მუშავდება...' : 'გაგრძელება'}
                                </button>
                            </div>

                            <div class="mb-6 flex items-center gap-4">
                                <hr class="w-1/2 border-slate-300" />
                                <p class="text-xs font-bold font-medium-tbc text-slate-900 text-center">ან</p>
                                <hr class="w-1/2 border-slate-300" />
                            </div>
                        </form>
                        <button onClick={continue_with_google} class="gsi-material-button">
                            <div class="gsi-material-button-state"></div>
                            <div class="gsi-material-button-content-wrapper">
                                <div class="gsi-material-button-icon">
                                    <img src='/svg/google-btn.svg' width={40} height={40} />
                                </div>
                                <span class="gsi-material-button-contents">გაგრძელება Google-ით</span>
                            </div>
                        </button>
                    </div>
                </main>
            </div>
            <Footer />
        </ProtectAnonymousRoute>
    );
}

export default Register