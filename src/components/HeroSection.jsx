import { createSignal, For, onMount } from "solid-js"
import "swiper/css";
import "swiper/css/pagination";
import "./swiper-vertical.css";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { A } from "@solidjs/router"

export const CourseDisplay = ({ courses }) => {
    const [showCarousel, setShowCarousel] = createSignal(false)
    let swiperEl;
    let wholeWrapper;

    onMount(async () => {
        const { register } = await import("swiper/element");
        const { Pagination, Mousewheel } = await import("swiper/modules");
        
        register([Pagination, Mousewheel]);

        Object.assign(swiperEl, {
            direction: "vertical",
            slidesPerView: 1,
            parallax: true,
            speed: 600,
            modules: [Pagination, Mousewheel],
            mousewheel: {
                enabled: true,
                forceToAxis: true,
                releaseOnEdges: true
            },
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            on: {
                init() {
                    setShowCarousel(true);
                },
            },
        });

        swiperEl.initialize();
    });

    return <div ref={wholeWrapper} class="bg-[#EAE7DC] overflow-hidden min-h-screen relative">
        <Header is_auth={courses().is_auth}></Header>
        <swiper-container
            ref={swiperEl}
            init="false"
            class="swiper mySwiper"
            style={{ display: showCarousel() ? "block" : "none" }}
        >
            <Show when={courses().mock_data.length} fallback={<div>loading</div>}>
                <For each={courses().mock_data}>
                    {(c, i) => (
                        <swiper-slide lazy={false} class="h-[700px]">
                            <div class={`flex items-center ${i() === courses().mock_data.length - 1 ? "h-auto" : "h-full"} justify-between gap-x-5`}>
                                <div class="flex flex-col w-1/2 gap-y-6 h-[700px]">
                                    <h2 class="text-6xl leading-[1.05] tracking-wide font-bold-tbc text-[#E85A4F]">
                                        {c.title}
                                    </h2>
                                    <p class="text-base text-[#8E8D8A] font-medium-tbc tracking-wider">
                                        {c.description}
                                    </p>

                                    <div class="grid grid-cols-2 gap-4 text-base font-medium-tbc text-[#8E8D8A]">
                                        <div class="flex items-center gap-3">
                                            <img width={28} height={28} src='/svg/clock.svg' />
                                            <span class="font-bold">ხანგრძლივობა:</span> {c.courseLength}
                                        </div>
                                        <Show when={c.instructor}>
                                            <div class="flex items-center gap-3">
                                                <img width={24} height={24} class="rounded-full" src="/default_profile.png" />
                                                <span class="font-bold">ინსტრუქტორი:</span> {c.instructor}
                                            </div>
                                        </Show>

                                        <Show when={c.students}>
                                            <div class="flex items-center gap-3">
                                                <img src='/svg/users.svg' width={28} height={28} />
                                                <span class="font-bold">მოსწავლეები:</span> {c.students}
                                            </div>
                                        </Show>
                                        <Show when={c.monthly_access_price}>
                                            <div class="flex items-center gap-x-2">
                                                <img src='/svg/price-tag.svg' width={28} height={28} />
                                                <span class="font-bold-tbc font-bold text-base">ფასი: </span>
                                                <div class="flex items-center">
                                                    <img src='/svg/currency-lari.svg' width={20} height={20} />
                                                    <span>{c.monthly_access_price}</span>
                                                </div>
                                            </div>
                                        </Show>
                                        <Show when={c.rating}>
                                            <div class="flex items-center gap-3">
                                                <svg class="w-6 h-6 text-[#E98074]" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.963a1 1 0 00.95.69h4.159c.969 0 1.371 1.24.588 1.81l-3.37 2.448a1 1 0 00-.364 1.118l1.287 3.963c.3.921-.755 1.688-1.54 1.118l-3.37-2.448a1 1 0 00-1.175 0l-3.37 2.448c-.784.57-1.838-.197-1.54-1.118l1.287-3.963a1 1 0 00-.364-1.118L2.61 9.39c-.783-.57-.38-1.81.588-1.81h4.159a1 1 0 00.95-.69l1.286-3.963z" />
                                                </svg>
                                                <span class="font-bold">რეიტინგი:</span> {c.rating} / 5
                                            </div>
                                        </Show>
                                    </div>
                                    <A
                                        href={`/course/${c.id}`}
                                        class="mt-auto w-fit rounded bg-[#E98074] px-6 py-3 text-center font-medium-tbc font-bold text-white hover:bg-[#E85A4F] transition-colors"
                                    >
                                        ნახე მეტი
                                    </A>
                                </div>
                                <img
                                    src={c.thumbnail}
                                    loading={i() === 0 ? "eager" : "lazy"}
                                    alt="კურსი"
                                    class="rounded-r-2xl h-[700px]"
                                    width={700}
                                    height={700}
                                />
                            </div>
                        </swiper-slide>
                    )}
                </For>
                <swiper-slide>
                    <Footer margin={"80px"} bg={"transparent"}></Footer>
                </swiper-slide>
            </Show>
        </swiper-container>
        <div class="swiper-pagination" />
    </div>
}