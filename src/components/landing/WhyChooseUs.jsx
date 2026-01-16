export const WhyChooseUs = () => {
  const features = [
    {
      title: "პრაქტიკული კონტენტი",
      description: "კურსები დაფუძნებულია რეალურ მაგალითებზე და ამოცანებზე, რომლებიც ცოდნის გამოყენებაში დაგეხმარება."
    },
    {
      title: "გამოცდილი ინსტრუქტორები",
      description: "მასალა მზადდება სპეციალისტების მიერ, რომლებსაც აქვთ პრაქტიკული გამოცდილება საკუთარ სფეროში."
    },
    {
      title: "სწავლა შენს ტემპში",
      description: "შეუზღუდავი წვდომა გაძლევს საშუალებას ისწავლო ნებისმიერ დროს და დაუბრუნდე მასალას საჭიროებისას."
    },
    {
      title: "24/7 მხარდაჭერა",
      description: "პრობლემების შემთხვევაში ჩვენი გუნდი მუდმივად მზად არის დაგეხმაროთ ნებისმიერი კითხვისთვის."
    },
  ];

  return (
    <section class="container mb-20 md:mb-32">
      <div class="text-center mb-16 md:mb-20">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-gsans font-bold text-gray-900 mb-4 md:mb-6">
          რატომ <span class="text-[#E85A4F]">აირჩიოთ</span> Artra
        </h2>
        <p class="text-lg md:text-xl font-gsans font-medium text-gray-600 leading-relaxed max-w-2xl mx-auto">
          პლატფორმა შექმნილია სწავლის ხარისხზე ფოკუსით მარტივი, 
          გასაგები და რეალურ შედეგებზე ორიენტირებული.
        </p>
      </div>
      <div class="grid gap-6 md:gap-8 sm:grid-cols-2 2xl:grid-cols-4">
        {features.map((feature, index) => (
            <div key={index} class="h-full border border-gray-200 rounded-2xl p-6 md:p-8">
              <h3 class="text-lg font-gsans font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p class="text-gray-600 font-gsans font-normal leading-relaxed text-base">
                {feature.description}
              </p>
            </div>
        ))}
      </div>
    </section>
  );
};