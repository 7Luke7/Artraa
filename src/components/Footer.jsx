import { A } from "@solidjs/router"

export const Footer = ({margin, bg}) => {
    return <footer style={{"margin-top": margin ? margin : "120px"}} className={`w-full ${bg ? `bg-[${bg}]` : "bg-[#f4f2ec]"}`}>
        <div className="sm:w-[70%] xxs:w-[100%] xxs:grid xxs:grid-cols-2 p-5 flex-wrap xxs:gap-5 lg:gap-0 lg:flex justify-evenly m-auto">
            <nav className="list-none flex flex-col gap-3">
                <h2 className="text-sm font-[600] text-gray-900">ნავიგაცია</h2>
                <hr className="border-1 border-[#E85A4F]" />
                <li className="text-xs font-[600] text-gray-700">
                    <A href="/about">ჩვენ შესახებ</A>
                </li>
                <li className="text-xs font-[600] text-gray-700">
                    <A href="/rules">წესები და პირობები</A>
                </li>
            </nav>
            <main className="list-none flex flex-col gap-3">
                <h2 className="text-sm font-[600] text-gray-900">გადახდები</h2>
                <hr className="border-1 border-[#E85A4F]" />

                <li className="text-xs font-[600] text-gray-700">
                    <A href="/payments">გადახდის მეთოდები</A>
                </li>
            </main>
            <nav className="list-none flex flex-col gap-3">
                <h2 className="text-sm font-[600] text-gray-900">გამოგვყევი</h2>
                <hr className="border-1 border-[#E85A4F]" />
                <li className="text-xs font-[600] text-gray-700 flex items-center gap-2">
                    <img src='/svg/facebook.svg' alt="ფეისბუქი" loading="lazy" width={16} height={16}></img>
                    Facebook
                </li>
                <li className="text-xs font-[600] text-gray-700 flex items-center gap-2">
                    <img src='/svg/instagram.svg' alt="ინსტაგრამი" loading="lazy" width={16} height={16}></img>
                    Instagram
                </li>
                <li className="text-xs font-[600] text-gray-700 flex items-center gap-2">
                    <img src='/svg/tiktok.svg' alt="ტიკტოკი" loading="lazy" width={16} height={16}></img>
                    Tiktok</li>
                <li className="text-xs font-[600] text-gray-700 flex gap-2 items-center">
                    <img src='/svg/youtube.svg' alt="იუთუბი" loading="lazy" width={16} height={16}></img>
                    Youtube</li>
            </nav>
            <main className="list-none flex flex-col gap-3">
                <h2 className="text-sm font-[600] text-gray-900">კონტაქტი</h2>
                <hr className="border-1 border-[#E85A4F]" />
                <li className="text-xs font-[600] text-gray-700 flex items-center gap-2">
                    <img src='/svg/inbox-stroke.svg' alt="მეილი" loading="lazy" width={16} height={16}></img>
                    artra@edu.ge</li>
                <li className="text-xs font-[600] text-gray-700 flex items-center gap-2">
                    <img src='/svg/telephone.svg' alt="ტელეფონი" loading="lazy" width={16} height={16}></img>
                    +995 (32) 2 60 30 60 / *7007</li>
            </main>
        </div>
        <div className="xxs:w-[100%] sm:w-[60%] text-center p-5 m-auto">
            <p className="text-xs font-bold text-gray-600 pt-5">Copyright © {new Date().getFullYear()} Artra.edu.ge ყველა უფლება დაცულია.</p>
        </div>
    </footer>
}