import { Meta, Title } from "@solidjs/meta";
import { Footer } from "../Footer"
import { Header } from "../Header"
import { LandingHero } from "./Hero"
import { generateLandingStructuredData } from "~/routes/api/lib/seo";
import { ContactCTA } from "./ContactCTA";
import { HowItWorks } from "./HowItWorks";
import { FeaturedCourses } from "./FeaturedCourses";
import { WhyChooseUs } from "./WhyChooseUs";
import { FeaturedCategories } from "./FeaturedCategories";

export const LandingContent = () => {
    const siteUrl = import.meta.env.VITE_SITE_URL;

    return <>
        <Title>Artra - ხარისხიანი ონლაინ განათლება საქართველოში</Title>
        <Meta name="description" content="პრაქტიკული ონლაინ კურსები ქართველებისთვის. ტექნოლოგიები, ბიზნესი, დიზაინი და სხვა თანამედროვე პროფესიები. სამუდამო წვდომა, 30-დღიანი გარანტია." />
        <Meta name="keywords" content="ონლაინ კურსები, განათლება საქართველოში, ქართული ონლაინ კურსები, ტექნოლოგიები, ბიზნესი, დიზაინი, ვებ-დეველოპმენტი" />
        <Meta property="og:title" content="Artra - ხარისხიანი ონლაინ განათლება" />
        <Meta property="og:description" content="პრაქტიკული ონლაინ კურსები ქართველებისთვის" />
        <Meta property="og:image" content={`${siteUrl}/hero-landing.jpg`} />
        <Meta property="og:url" content={siteUrl} />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ 
                __html: generateLandingStructuredData(siteUrl)
            }}
        />
        <div class="pt-10 w-full md:w-10/12 px-4 md:px-6 mx-auto">
            <Header></Header>
            <LandingHero></LandingHero>
            <HowItWorks></HowItWorks>
            <FeaturedCourses></FeaturedCourses>
            <WhyChooseUs></WhyChooseUs>
            <FeaturedCategories></FeaturedCategories>
            <ContactCTA></ContactCTA>
        </div>
        <Footer></Footer>
    </>
}