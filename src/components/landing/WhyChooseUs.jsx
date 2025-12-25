export const WhyChooseUs = () => {
  const features = [
    {
      title: "პრაქტიკული კონტენტი",
      description: "კურსები დაფუძნებულია რეალურ მაგალითებზე და ამოცანებზე, რომლებიც ცოდნის გამოყენებაში დაგეხმარება.",
      icon: (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      color: "bg-blue-50 border-blue-100 text-blue-600"
    },
    {
      title: "გამოცდილი ინსტრუქტორები",
      description: "მასალა მზადდება სპეციალისტების მიერ, რომლებსაც აქვთ პრაქტიკული გამოცდილება საკუთარ სფეროში.",
      icon: (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "bg-green-50 border-green-100 text-green-600"
    },
    {
      title: "სწავლა შენს ტემპში",
      description: "შეუზღუდავი წვდომა გაძლევს საშუალებას ისწავლო ნებისმიერ დროს და დაუბრუნდე მასალას საჭიროებისას.",
      icon: (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-purple-50 border-purple-100 text-purple-600"
    },
    {
      title: "სერთიფიკატები",
      description: "დასრულების შემდეგ მიიღეთ სერთიფიკატი, რომელიც დაამტკიცებს თქვენს ახალ უნარებს.",
      icon: (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-amber-50 border-amber-100 text-amber-600"
    },
    {
      title: "24/7 მხარდაჭერა",
      description: "პრობლემების შემთხვევაში ჩვენი გუნდი მუდმივად მზად არის დაგეხმაროთ ნებისმიერი კითხვისთვის.",
      icon: (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      color: "bg-red-50 border-red-100 text-red-600"
    },
    {
      title: "ადაპტირებადი სასწავლო გეგმა",
      description: "კურსები მორგებულია ყველა დონის მოსმენელზე — დამწყებიდან პროფესიონალამდე.",
      icon: (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: "bg-indigo-50 border-indigo-100 text-indigo-600"
    }
  ];

  return (
    <section class="container mb-20 md:mb-32 px-4 md:px-6">
      {/* Header Section */}
      <div class="text-center mb-16 md:mb-20">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-gsans font-bold text-gray-900 mb-4 md:mb-6">
          რატომ <span class="text-[#E85A4F]">აირჩიოთ</span> Artra
        </h2>
        <p class="text-lg md:text-xl font-gsans font-medium text-gray-600 leading-relaxed max-w-2xl mx-auto">
          პლატფორმა შექმნილია სწავლის ხარისხზე ფოკუსით — მარტივი, 
          გასაგები და რეალურ შედეგებზე ორიენტირებული.
        </p>
        
        {/* Decorative Elements */}
        <div class="flex justify-center gap-2 mt-8">
          <div class="w-3 h-3 rounded-full bg-[#E85A4F]/30"></div>
          <div class="w-3 h-3 rounded-full bg-[#E85A4F]/50"></div>
          <div class="w-3 h-3 rounded-full bg-[#E85A4F]"></div>
          <div class="w-3 h-3 rounded-full bg-[#E85A4F]/50"></div>
          <div class="w-3 h-3 rounded-full bg-[#E85A4F]/30"></div>
        </div>
      </div>

      {/* Features Grid */}
      <div class="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div 
            class="group relative"
            key={index}
          >
            {/* Card */}
            <div class="h-full bg-white border border-gray-200 rounded-2xl p-6 md:p-8 hover:border-[#E85A4F]/50 hover:shadow-lg transition-all duration-300">
              {/* Icon Container */}
              <div class={`mb-6 inline-flex items-center justify-center w-14 h-14 rounded-2xl border ${feature.color}`}>
                {feature.icon}
              </div>

              {/* Content */}
              <h3 class="text-xl md:text-2xl font-gsans font-bold text-gray-900 mb-3 group-hover:text-[#E85A4F] transition-colors">
                {feature.title}
              </h3>
              <p class="text-gray-600 font-gsans font-normal leading-relaxed text-base md:text-lg">
                {feature.description}
              </p>

              {/* Hover Indicator */}
              <div class="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="inline-flex items-center gap-2 text-sm font-gsans font-medium text-[#E85A4F]">
                  <span>გაიგე მეტი</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};