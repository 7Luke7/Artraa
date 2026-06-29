import { Meta, Title } from "@solidjs/meta";
import { Footer } from "../Footer"
import { Header } from "../Header"
import { LandingHero } from "./Hero"
import { HowItWorks } from "./HowItWorks";
import { FeaturedCourses } from "./FeaturedCourses";
import { createAsync } from "@solidjs/router";
import { unauthenticated_landing_data } from "~/routes/api/data_for_landing";
import { Show } from "solid-js";
import { HttpStatusCode } from "@solidjs/start";
import { FeaturedCategories } from "./FeaturedCategories";

export default () => {
    const data = createAsync(unauthenticated_landing_data, {deferStream: true}) 

    return <Show when={data()} fallback='loading...'>
        <HttpStatusCode code={data().ok ? 200 : 500}></HttpStatusCode>
        <Title>Artra - ხარისხიანი ონლაინ განათლება საქართველოში</Title>
        <Meta name="description" content="პრაქტიკული ონლაინ კურსები ქართველებისთვის. მშენებლობა, ტექნოლოგიები, ბიზნესი, დიზაინი და სხვა თანამედროვე პროფესიები. სამუდამო წვდომა, 30-დღიანი გარანტია." />
        <Meta name="keywords" content="ონლაინ კურსები, განათლება საქართველოში, ქართული ონლაინ კურსები, მშენებლობა, ტექნოლოგიები, ბიზნესი, დიზაინი, ვებ-დეველოპმენტი" />
        <Meta property="og:title" content="Artra - ხარისხიანი ონლაინ განათლება" />
        <Meta property="og:description" content="პრაქტიკული ონლაინ კურსები ქართველებისთვის" />
        <Meta property="og:image" content={`${import.meta.env.VITE_URL}/hero-landing.jpg`} />
        <Meta property="og:url" content={import.meta.env.VITE_URL} />
        <script
            type="application/ld+json"
            innerHTML={data().structuredData}
        />
        <div class="pt-10 w-full md:w-10/12 px-2 sm:px-4 md:px-6 mx-auto">
            <Header></Header>
            <LandingHero></LandingHero>
            <HowItWorks></HowItWorks>
            <FeaturedCategories></FeaturedCategories>
            <FeaturedCourses courses={data().courses}></FeaturedCourses>
        </div>
        <Footer></Footer>
    </Show>
}