export const HowItWorks = () => {
  const steps = [
    {
      number: "1",
      title: "აირჩიე კურსი",
      description: "დაათვალიერე კურსები თემებისა და მიმართულებების მიხედვით და შეარჩიე შენთვის შესაბამისი.",
      icon: '/svg/calendar-time.svg'
    },
    {
      number: "2",
      title: "ისწავლე შენს ტემპში",
      description: "შენს გრაფიკზე მორგებულად ვიდეოები, სავარჯიშოები და პრაქტიკული დავალებები.",
      icon: '/svg/clock.svg'
    },
    {
      number: "3",
      title: "გამოიყენე მიღებული ცოდნა",
      description: "გაიარე პრაქტიკული დავალებები და მიიღე სერთიფიკატი დასრულების შემდეგ.",
      icon: '/svg/circle-check.svg'
    }
  ];

  return (
    <section 
      aria-labelledby="how-it-works-heading"
      class="container mb-16 md:mb-32"
    >
      <div class="text-center mb-12 md:mb-20">
        <h2 
          id="how-it-works-heading"
          class="text-3xl md:text-4xl lg:text-5xl font-gsans font-bold text-gray-900 mb-4 md:mb-6"
        >
          როგორ <span class="text-[#E85A4F]">მუშაობს</span> პლატფორმა
        </h2>
        <p class="text-lg md:text-xl font-gsans font-medium text-gray-600 leading-relaxed max-w-2xl mx-auto">
          ყველაფერი შექმნილია მარტივად რომ კონცენტრირდე სწავლაზე და არა ტექნიკურ დეტალებზე.
        </p>
      </div>
      <div 
        role="list" 
        aria-label="როგორ მუშაობს პლატფორმა: ნაბიჯები"
        class="grid gap-8 lg:gap-10 lg:grid-cols-3 relative"
      >
        <div 
          role="presentation" 
          class="hidden md:block absolute top-16 left-1/4 right-1/4 h-0.5 bg-gray-200 -z-10"
        ></div>
        
        {steps.map((step, index) => (
          <div 
            role="listitem"
            class="group relative"
            key={index}
            tabIndex="0"
            aria-labelledby={`step-${index}-title`}
            aria-describedby={`step-${index}-desc`}
          >
            <div class="flex flex-col items-center text-center md:px-4">
              <div class="relative mb-6">
                <div 
                  role="presentation"
                  class="absolute inset-0 rounded-full bg-[#E85A4F]/20 scale-0 group-hover:scale-100 transition-transform duration-300"
                ></div>
                <div 
                  class="relative flex h-20 w-20 items-center justify-center rounded-full bg-white border-2 border-[#E85A4F]/20 shadow-sm"
                  aria-hidden="true"
                >
                  <div class="absolute inset-0 rounded-full overflow-hidden opacity-5">
                    <div class="absolute inset-0" style={{
                      'background-image': 'radial-gradient(circle at 2px 2px, #E85A4F 1px, transparent 0)',
                      'background-size': '10px 10px'
                    }}></div>
                  </div>                  
                  <div class="relative flex flex-col items-center">
                    <span class="text-2xl font-gsans font-bold text-[#E85A4F] mb-1">
                      {step.number}
                    </span>
                      <img loading="lazy" src={step.icon} class="opacity-80" width={24} aria-hidden='true' height={24} alt='' />
                  </div>
                </div>
                <span class="sr-only">
                  ნაბიჯი {step.number} {step.number === "1" ? "დან" : step.number === "2" ? "დან" : "დან"}
                </span>
              </div>
              <div class="px-2">
                <h3 
                  id={`step-${index}-title`}
                  class="text-xl md:text-2xl font-gsans font-bold text-gray-900 mb-3 group-hover:text-[#E85A4F] transition-colors"
                >
                  {step.title}
                </h3>
                <p 
                  id={`step-${index}-desc`}
                  class="text-gray-600 font-gsans font-normal leading-relaxed text-base md:text-lg"
                >
                  {step.description}
                </p>
              </div>
              <div 
                role="presentation"
                class="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div class="h-1 w-8 bg-[#E85A4F] rounded-full mx-auto"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
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
            id="step-0-link"
            href="/courses" 
            class="inline-flex items-center gap-2 bg-[#E85A4F] hover:bg-[#D84A3F] text-white px-6 py-3 rounded-lg font-gsans font-bold transition-colors whitespace-nowrap"
            aria-label="იხილე ყველა კურსი - გადადგი პირველი ნაბიჯი"
          >
            <span>იხილე კურსები</span>
            <img loading="lazy" src='/svg/arrow-narrow-right.svg' width={24} height={24} aria-hidden='true' alt='' />
          </a>
        </div>
      </div>
      <div class="sr-only">
        <p>
          პლატფორმა მუშაობს სამი მარტივი ნაბიჯით: პირველად ირჩევთ კურსს, 
          შემდეგ სწავლობთ თქვენს ტემპში და ბოლოს იყენებთ მიღებულ ცოდნას პრაქტიკაში.
        </p>
      </div>
    </section>
  );
};