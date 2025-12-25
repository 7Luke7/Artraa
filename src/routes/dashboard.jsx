import { A } from "@solidjs/router"
import { RenderProtectedRoute } from "~/components/RenderProtectedRoute"
import { Header } from "~/components/Header"

const User = (props) => {
  return (
    <RenderProtectedRoute>
      <div class="min-h-screen flex flex-col bg-gray-50">
        <Header />
        <div class="flex flex-1">
          <aside class="sticky top-[75px] h-[calc(100vh-75px)] overflow-y-auto w-[280px] bg-white border-r border-gray-200 hidden lg:block">
            <nav class="py-6 px-4">
              <ul class="space-y-2">

                {/* Dashboard */}
                <li>
                  <A
                    href="/dashboard"
                    activeClass="bg-gray-100 text-[#E85A4F] border-l-3 border-[#E85A4F]"
                    inactiveClass="hover:bg-gray-50"
                    end
                    class="text-slate-800 text-[15px] font-gsans font-medium flex items-center cursor-pointer rounded-lg px-4 py-3 transition-colors"
                  >
                    <div class="w-8 h-8 flex items-center justify-center mr-3 bg-gray-100 rounded-lg">
                      <img src="/svg/home.svg" width={24} height={24} />
                    </div>

                    <span class="overflow-hidden text-ellipsis font-gsans font-medium whitespace-nowrap flex-1">
                      მთავარი
                    </span>

                    <img src="/svg/arrow-right.svg" width={24} height={24} />
                  </A>
                </li>

                {/* Courses */}
                <li>
                  <A
                    href="/dashboard/courses"
                    activeClass="bg-gray-100 text-[#E85A4F] border-l-3 border-[#E85A4F]"
                    inactiveClass="hover:bg-gray-50"
                    end
                    class="text-slate-800 text-[15px] font-gsans font-medium flex items-center cursor-pointer rounded-lg px-4 py-3 transition-colors"
                  >
                    <div class="w-8 h-8 flex items-center justify-center mr-3 bg-gray-100 rounded-lg">
                      <img src="/svg/courses.svg" width={24} height={24} />
                    </div>

                    <span class="overflow-hidden text-ellipsis font-gsans font-medium whitespace-nowrap flex-1">
                      კურსები
                    </span>

                    <img src="/svg/arrow-right.svg" width={24} height={24} />
                  </A>
                </li>

              </ul>
            </nav>

          </aside>

          <section class="flex-1">
            {props.children}
          </section>
        </div>
      </div>
    </RenderProtectedRoute>
  );
};

export default User;
