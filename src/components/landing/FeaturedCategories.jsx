const CATEGORIES = [
  {
    title: "ვებ-დეველოპმენტი",
    description: "Frontend და Backend ტექნოლოგიები",
    slug: "web-development",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    count: "45+ კურსი",
    color: "from-blue-500 to-cyan-400"
  },
  {
    title: "ბიზნესი",
    description: "მენეჯმენტი, მარკეტინგი, ფინანსები",
    slug: "business",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    count: "32+ კურსი",
    color: "from-green-500 to-emerald-400"
  },
  {
    title: "დიზაინი",
    description: "UI/UX, გრაფიკული და 3D დიზაინი",
    slug: "design",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    count: "28+ კურსი",
    color: "from-purple-500 to-pink-400"
  },
  {
    title: "ენები",
    description: "ინგლისური და სხვა უცხო ენები",
    slug: "languages",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    count: "25+ კურსი",
    color: "from-amber-500 to-orange-400"
  },
  {
    title: "მარკეტინგი",
    description: "დიჯიტალ და სოციალური მედია მარკეტინგი",
    slug: "marketing",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    count: "18+ კურსი",
    color: "from-red-500 to-rose-400"
  },
  {
    title: "AI & მონაცემთა მეცნიერება",
    description: "ხელოვნური ინტელექტი და ანალიტიკა",
    slug: "ai-data-science",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
      </svg>
    ),
    count: "22+ კურსი",
    color: "from-indigo-500 to-violet-400"
  },
  {
    title: "ხელოვნება & კრეატივი",
    description: "მუსიკა, ფოტოგრაფია, ვიდეო პროდაქცია",
    slug: "arts-creativity",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    count: "15+ კურსი",
    color: "from-fuchsia-500 to-purple-400"
  },
  {
    title: "პერსონალური განვითარება",
    description: "პროდუქტიულობა, ლიდერობა, კომუნიკაცია",
    slug: "personal-development",
    icon: (
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    count: "20+ კურსი",
    color: "from-teal-500 to-cyan-400"
  }
];

export const FeaturedCategories = () => {
  return (
    <section class="container mb-20 md:mb-32">
      {/* Header Section */}
      <div class="text-center mb-16 md:mb-20">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-gsans font-bold text-gray-900 mb-4 md:mb-6">
          აღმოაჩინე <span class="text-[#E85A4F]">კატეგორიები</span>
        </h2>
        <p class="text-lg md:text-xl font-gsans font-medium text-gray-600 leading-relaxed max-w-2xl mx-auto mb-8">
          აირჩიე მიმართულება და დაიწყე სწავლა შენთვის საინტერესო სფეროში.
        </p>
        
        {/* Category Count Badge */}
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E85A4F]/10 text-[#E85A4F] text-sm font-gsans font-medium">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clip-rule="evenodd" />
          </svg>
          <span>სულ {CATEGORIES.reduce((acc, cat) => acc + parseInt(cat.count), 0)}+ კურსი</span>
        </div>
      </div>

      {/* Categories Grid */}
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-12">
        {CATEGORIES.map((category, index) => (
          <a
            href={`/courses?category=${category.slug}`}
            class="group relative block"
            key={index}
          >
            <div class="h-full bg-white rounded-2xl border border-gray-200 p-6 hover:border-[#E85A4F]/50 hover:shadow-xl transition-all duration-300 overflow-hidden">
              {/* Background Gradient Overlay */}
              <div class={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${category.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300 -translate-y-12 translate-x-12`}></div>
              
              {/* Icon with Gradient Background */}
              <div class={`relative mb-6 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br ${category.color} text-white`}>
                {category.icon}
              </div>

              {/* Content */}
              <h3 class="relative text-xl font-gsans font-bold text-gray-900 mb-2 group-hover:text-[#E85A4F] transition-colors">
                {category.title}
              </h3>
              <p class="relative text-gray-600 font-gsans font-normal mb-4 leading-relaxed">
                {category.description}
              </p>
              
              {/* Course Count */}
              <div class="relative flex items-center justify-between">
                <span class="text-sm font-gsans font-medium text-gray-500">
                  {category.count}
                </span>
                <div class="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg class="w-5 h-5 text-[#E85A4F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* CTA Section */}
      <div class="mt-12 md:mt-16">
        <div class="bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-200 p-8 md:p-12">
          <div class="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div class="text-center lg:text-left">
              <h3 class="text-2xl md:text-3xl font-gsans font-bold text-gray-900 mb-3">
                ვერ იპოვე შენი მიმართულება?
              </h3>
              <p class="text-gray-600 font-gsans font-normal text-lg max-w-xl">
                დაგვიკავშირდით და დაგეხმარებით აირჩიოთ კურსი, რომელიც შენს მიზნებს შეესაბამება.
              </p>
            </div>
            
            <div class="flex flex-col sm:flex-row gap-4">
              <a
                href="/courses"
                class="inline-flex items-center justify-center gap-2 bg-[#E85A4F] hover:bg-[#D84A3F] text-white px-8 py-4 rounded-lg font-gsans font-bold transition-colors"
              >
                <span>იხილე ყველა კურსი</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              
              <a
                href="/contact"
                class="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 px-8 py-4 rounded-lg font-gsans font-bold transition-colors"
              >
                <span>კონსულტაცია</span>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </a>
            </div>
          </div>
          
          {/* Quick Categories Preview */}
          <div class="mt-10 pt-8 border-t border-gray-200">
            <div class="text-center">
              <p class="text-gray-600 font-gsans font-medium mb-6">პოპულარული კატეგორიები:</p>
              <div class="flex flex-wrap justify-center gap-3">
                {CATEGORIES.slice(0, 5).map((category) => (
                  <a
                    href={`/courses?category=${category.slug}`}
                    class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-gsans font-medium text-gray-700 transition-colors"
                  >
                    {category.icon}
                    <span>{category.title}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};