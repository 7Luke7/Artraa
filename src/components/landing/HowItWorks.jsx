export const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "აირჩიე კურსი",
      description: "დაათვალიერე კურსები თემებისა და მიმართულებების მიხედვით და შეარჩიე შენთვის შესაბამისი.",
      icon: (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      )
    },
    {
      number: "2",
      title: "ისწავლე შენს ტემპში",
      description: "შენს გრაფიკზე მორგებულად — ვიდეოები, სავარჯიშოები და პრაქტიკული დავალებები.",
      icon: (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      number: "3",
      title: "გამოიყენე მიღებული ცოდნა",
      description: "გაიარე პრაქტიკული დავალებები და მიიღე სერთიფიკატი დასრულების შემდეგ.",
      icon: (
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
  ];

  return (
    <section class="container mb-16 md:mb-32">
      {/* Header Section */}
      <div class="text-center mb-12 md:mb-20">
        <h2 class="text-3xl md:text-4xl lg:text-5xl font-gsans font-bold text-gray-900 mb-4 md:mb-6">
          როგორ <span class="text-[#E85A4F]">მუშაობს</span> პლატფორმა
        </h2>
        <p class="text-lg md:text-xl font-gsans font-medium text-gray-600 leading-relaxed max-w-2xl mx-auto">
          ყველაფერი შექმნილია მარტივად — რომ კონცენტრირდე სწავლაზე და არა ტექნიკურ დეტალებზე.
        </p>
      </div>

      {/* Steps Grid */}
      <div class="grid gap-8 md:gap-10 md:grid-cols-3 relative">
        {/* Connecting Line - Desktop Only */}
        <div class="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gray-200 -z-10"></div>
        
        {steps.map((step, index) => (
          <div 
            class="group relative"
            key={index}
          >
            <div class="flex flex-col items-center text-center md:px-4">
              {/* Number Badge with Icon */}
              <div class="relative mb-6">
                {/* Outer Ring - Hover Effect */}
                <div class="absolute inset-0 rounded-full bg-[#E85A4F]/20 scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                
                {/* Number Circle */}
                <div class="relative flex h-20 w-20 items-center justify-center rounded-full bg-white border-2 border-[#E85A4F]/20 shadow-sm">
                  {/* Background Pattern */}
                  <div class="absolute inset-0 rounded-full overflow-hidden opacity-5">
                    <div class="absolute inset-0" style={{
                      'background-image': 'radial-gradient(circle at 2px 2px, #E85A4F 1px, transparent 0)',
                      'background-size': '10px 10px'
                    }}></div>
                  </div>
                  
                  {/* Number and Icon */}
                  <div class="relative flex flex-col items-center">
                    <span class="text-2xl font-gsans font-bold text-[#E85A4F] mb-1">
                      {step.number}
                    </span>
                    <div class="text-[#E85A4F] opacity-80">
                      {step.icon}
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div class="px-2">
                <h3 class="text-xl md:text-2xl font-gsans font-bold text-gray-900 mb-3 group-hover:text-[#E85A4F] transition-colors">
                  {step.title}
                </h3>
                <p class="text-gray-600 font-gsans font-normal leading-relaxed text-base md:text-lg">
                  {step.description}
                </p>
              </div>

              {/* Decorative Element */}
              <div class="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div class="h-1 w-8 bg-[#E85A4F] rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div class="mt-16 md:mt-24 text-center">
        <div class="inline-flex flex-col sm:flex-row items-center gap-4 bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-200">
          <div class="text-left">
            <h4 class="text-lg font-gsans font-bold text-gray-900 mb-1">
              მზად ხარ დაიწყო?
            </h4>
            <p class="text-gray-600 font-gsans font-normal text-sm">
              დაათვალიერე ყველა კურსი და იპოვე შენთვის შესაფერისი
            </p>
          </div>
          <a 
            href="/courses" 
            class="inline-flex items-center gap-2 bg-[#E85A4F] hover:bg-[#D84A3F] text-white px-6 py-3 rounded-lg font-gsans font-bold transition-colors whitespace-nowrap"
          >
            <span>იხილე კურსები</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};