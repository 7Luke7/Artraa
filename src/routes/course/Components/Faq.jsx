export const Faq = () => {
    return <section class="bg-white rounded-lg p-6">
        <h2 class="text-xl font-semibold text-gray-900 mb-6">
            ხშირად დასმული კითხვები
        </h2>

        <div class="space-y-6" itemscope itemtype="https://schema.org/FAQPage">
            {[
                {
                    q: 'როგორ მივიღო წვდომა კურსზე?',
                    a: 'კურსის შეძენის შემდეგ, მიღებთ წვდომას ყველა მასალაზე სამუდამოდ. შეგიძლიათ იხილოთ ლექციები, ჩამოტვირთოთ მასალები და შეასრულოთ დავალებები.'
                },
                {
                    q: 'რამდენ ხანს მაქვს წვდომა კურსზე?',
                    a: 'სამუდამოდ. კურსის შეძენის შემდეგ გექნებათ ლიფტაიმ წვდომა ყველა მასალაზე, განახლებებსა და მომავალ დამატებებზე.'
                },
                {
                    q: 'შემიძლია თანხის დაბრუნება?',
                    a: 'დიახ, ჩვენ გვაქვს 30-დღიანი გარანტია. თუ კურსი არ მოგეწონებათ, შეგიძლიათ მოითხოვოთ სრული თანხის დაბრუნება 30 დღის განმავლობაში.'
                },
                {
                    q: 'კურსი ვისთვისაა შესაფერისი?',
                    a: 'ეს კურსი შესაფერისია როგორც დამწყებისთვის, ისე საშუალო დონის დეველოპერებისთვის, რომლებსაც სურთ რეაქტის გაღრმავებული ცოდნა.'
                }
            ].map((faq) => (
                <div
                    class="border-b pb-4 last:border-b-0"
                    itemprop="mainEntity"
                    itemscope
                    itemtype="https://schema.org/Question"
                >
                    <h3 class="font-medium text-gray-900 mb-2" itemprop="name">
                        {faq.q}
                    </h3>
                    <div class="text-gray-600" itemprop="acceptedAnswer" itemscope itemtype="https://schema.org/Answer">
                        <p itemprop="text">{faq.a}</p>
                    </div>
                </div>
            ))}
        </div>
    </section>
}