import { A } from "@solidjs/router"

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    
    return (
        <footer 
            className="w-full bg-gray-50 border-t border-gray-200 pt-10"
            role="contentinfo"
            aria-label="საიტის ქვედა ნაწილი"
        >
            <div className="w-10/12 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-10">
                    <div className="space-y-4">
                        <h2 className="text-lg font-gsans font-bold text-gray-900">
                            ნავიგაცია
                        </h2>
                        <hr 
                            className="border-2 border-[#E85A4F] w-12" 
                            aria-hidden="true" 
                        />
                        <nav aria-label="ნავიგაციის ბმულები">
                            <ul className="space-y-3">
                                <li>
                                    <A 
                                        href="/about" 
                                        className="text-base font-gsans font-normal text-gray-700 hover:text-[#E85A4F] transition-colors block py-1 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                        aria-label="ჩვენ შესახებ"
                                    >
                                        ჩვენ შესახებ
                                    </A>
                                </li>
                                <li>
                                    <A 
                                        href="/rules" 
                                        className="text-base font-gsans font-normal text-gray-700 hover:text-[#E85A4F] transition-colors block py-1 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                        aria-label="წესები და პირობები"
                                    >
                                        წესები და პირობები
                                    </A>
                                </li>
                                <li>
                                    <A 
                                        href="/privacy" 
                                        className="text-base font-gsans font-normal text-gray-700 hover:text-[#E85A4F] transition-colors block py-1 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                        aria-label="კონფიდენციალურობის პოლიტიკა"
                                    >
                                        კონფიდენციალურობის პოლიტიკა
                                    </A>
                                </li>
                                <li>
                                    <A 
                                        href="/courses" 
                                        className="text-base font-gsans font-normal text-gray-700 hover:text-[#E85A4F] transition-colors block py-1 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                        aria-label="კურსები"
                                    >
                                        კურსები
                                    </A>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-lg font-gsans font-bold text-gray-900">
                            გადახდები
                        </h2>
                        <hr 
                            className="border-2 border-[#E85A4F] w-12" 
                            aria-hidden="true" 
                        />
                        <div aria-label="გადახდის მეთოდები">
                            <ul className="space-y-3">
                                {/* <li className="text-base font-gsans font-normal text-gray-700 py-1 flex items-center">
                                    <span className="mr-2" aria-hidden="true">💳</span>
                                    ბარათით გადახდა
                                </li>
                                <li className="text-base font-gsans font-normal text-gray-700 py-1 flex items-center">
                                    <span className="mr-2" aria-hidden="true">🏦</span>
                                    ბანკის გადარიცხვა
                                </li> */}
                            </ul>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-lg font-gsans font-bold text-gray-900">
                            გამოგვყევი
                        </h2>
                        <hr 
                            className="border-2 border-[#E85A4F] w-12" 
                            aria-hidden="true" 
                        />
                        <nav aria-label="სოციალური მედიის ბმულები">
                            <ul className="space-y-4">
                                <li>
                                    <a 
                                        href="https://facebook.com/artra" 
                                        target="_blank" 
                                        rel="noopener noreferrer nofollow"
                                        className="text-base font-gsans font-normal text-gray-700 hover:text-[#E85A4F] transition-colors flex items-center gap-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                        aria-label="Artra Facebook-ზე (ახალ ფანჯარაში გაიხსნება)"
                                    >
                                        <div 
                                            className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg"
                                        >
                                            <img 
                                                src='/svg/facebook.svg' 
                                                aria-hidden="true"
                                                alt="" 
                                                loading="lazy" 
                                                width={24} 
                                                height={24}
                                            />
                                        </div>
                                        Facebook
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="https://instagram.com/artra" 
                                        target="_blank" 
                                        rel="noopener noreferrer nofollow"
                                        className="text-base font-gsans font-normal text-gray-700 hover:text-[#E85A4F] transition-colors flex items-center gap-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                        aria-label="Artra Instagram-ზე (ახალ ფანჯარაში გაიხსნება)"
                                    >
                                        <div 
                                            className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg"
                                        >
                                            <img 
                                                src='/svg/instagram.svg' 
                                                alt="" 
                                                aria-hidden="true"
                                                loading="lazy" 
                                                width={24} 
                                                height={24}
                                            />
                                        </div>
                                        Instagram
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="https://tiktok.com/@artra" 
                                        target="_blank" 
                                        rel="noopener noreferrer nofollow"
                                        className="text-base font-gsans font-normal text-gray-700 hover:text-[#E85A4F] transition-colors flex items-center gap-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                        aria-label="Artra TikTok-ზე (ახალ ფანჯარაში გაიხსნება)"
                                    >
                                        <div 
                                            className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg"
                                        >
                                            <img 
                                                src='/svg/tiktok.svg' 
                                                aria-hidden="true"
                                                alt="" 
                                                loading="lazy" 
                                                width={24} 
                                                height={24}
                                            />
                                        </div>
                                        TikTok
                                    </a>
                                </li>
                                <li>
                                    <a 
                                        href="https://youtube.com/@artra" 
                                        target="_blank" 
                                        rel="noopener noreferrer nofollow"
                                        className="text-base font-gsans font-normal text-gray-700 hover:text-[#E85A4F] transition-colors flex items-center gap-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                        aria-label="Artra YouTube-ზე (ახალ ფანჯარაში გაიხსნება)"
                                    >
                                        <div 
                                            className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg"
                                        >
                                            <img 
                                                src='/svg/youtube.svg' 
                                                alt="" 
                                                aria-hidden="true"
                                                loading="lazy" 
                                                width={24} 
                                                height={24}
                                            />
                                        </div>
                                        YouTube
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    
                    <div className="space-y-4">
                        <h2 className="text-lg font-gsans font-bold text-gray-900">
                            კონტაქტი
                        </h2>
                        <hr 
                            className="border-2 border-[#E85A4F] w-12" 
                            aria-hidden="true" 
                        />
                        <address className="not-italic" aria-label="საკონტაქტო ინფორმაცია">
                            <ul className="space-y-4">
                                <li className="text-base font-gsans font-normal text-gray-700 flex items-start gap-3 py-2">
                                    <div 
                                        className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0"
                                    >
                                        <img 
                                            src='/svg/inbox-stroke.svg' 
                                            alt="" 
                                            aria-hidden="true"
                                            loading="lazy" 
                                            width={24} 
                                            height={24}
                                        />
                                    </div>
                                    <div>
                                        <div className="font-gsans font-medium">ელ. ფოსტა</div>
                                        <a 
                                            href={`mailto:${import.meta.env.VITE_EMAIL}`} 
                                            className="hover:text-[#E85A4F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                            aria-label={`გაგზავნეთ ელ. ფოსტა ${import.meta.env.VITE_EMAIL}-ზე`}
                                        >
                                            {import.meta.env.VITE_EMAIL}
                                        </a>
                                    </div>
                                </li>
                                <li className="text-base font-gsans font-normal text-gray-700 flex items-start gap-3 py-2">
                                    <div 
                                        className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0"
                                    >
                                        <img 
                                            src='/svg/telephone.svg' 
                                            alt="" 
                                            aria-hidden="true"
                                            loading="lazy" 
                                            width={24} 
                                            height={24}
                                        />
                                    </div>
                                    <div>
                                        <div className="font-gsans font-medium">ტელეფონი</div>
                                        <a 
                                            href="tel:+995322603060" 
                                            className="hover:text-[#E85A4F] transition-colors block focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                            aria-label="დაგვირეკეთ ნომერზე +995 32 2 60 30 60"
                                        >
                                            +995 (32) 2 60 30 60
                                        </a>
                                    </div>
                                </li>
                                <li className="text-base font-gsans font-normal text-gray-700 flex items-start gap-3 py-2">
                                    <div 
                                        className="w-9 h-9 flex items-center justify-center bg-gray-100 rounded-lg flex-shrink-0"
                                    >
                                        <img 
                                            src='/svg/map-pin.svg' 
                                            alt="" 
                                            aria-hidden="true"
                                            loading="lazy" 
                                            width={24} 
                                            height={24} 
                                        />
                                    </div>
                                    <div>
                                        <div className="font-gsans font-medium">მისამართი</div>
                                        <div>თბილისი, საქართველო</div>
                                    </div>
                                </li>
                            </ul>
                        </address>
                    </div>
                </div>
                
                <div className="border-t border-gray-200 pt-8 pb-6">
                    <div className="text-center">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
                            <A 
                                href="/" 
                                className="text-[#E85A4F] text-2xl font-sans font-[800] tracking-[0.15em] focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                aria-label="მთავარი გვერდი"
                            >
                                ARTRA
                            </A>
                            <nav aria-label="იურიდიული ბმულები">
                                <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                                    <A 
                                        href="/terms" 
                                        className="text-sm font-gsans font-normal text-gray-600 hover:text-[#E85A4F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                        aria-label="მომსახურების წესები და პირობები"
                                    >
                                        წესები
                                    </A>
                                    <A 
                                        href="/privacy" 
                                        className="text-sm font-gsans font-normal text-gray-600 hover:text-[#E85A4F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                        aria-label="კონფიდენციალურობის პოლიტიკა"
                                    >
                                        კონფიდენციალურობა
                                    </A>
                                    <A 
                                        href="/cookies" 
                                        className="text-sm font-gsans font-normal text-gray-600 hover:text-[#E85A4F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                        aria-label="ქუქი-ფაილების პოლიტიკა"
                                    >
                                        ქუქი-ფაილები
                                    </A>
                                    <A 
                                        href="/sitemap.xml" 
                                        className="text-sm font-gsans font-normal text-gray-600 hover:text-[#E85A4F] transition-colors focus:outline-none focus:ring-2 focus:ring-[#E85A4F] focus:ring-offset-2 focus:rounded"
                                        aria-label="საიტის რუკა"
                                    >
                                        საიტის რუკა
                                    </A>
                                </div>
                            </nav>
                        </div>
                        <p className="text-sm font-sans font-[800] text-gray-600 pt-4">
                            Copyright © {currentYear} Artra.edu.ge ყველა უფლება დაცულია.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}