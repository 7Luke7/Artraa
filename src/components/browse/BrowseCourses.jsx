// import { createAsync } from "@solidjs/router";
// import { CourseRenderer } from "./Components/CourseRenderer";
// import { Show } from "solid-js";
// import { CourseFilters } from "./Components/Filters";
// import { CourseServices } from "./Components/SortCourses";
// import { CoursePagination } from "./Components/CoursePagination";

// export const BrowseCourses = () => {
//   const courses = createAsync(async () => await fetch(`${import.meta.env.VITE_URL}/api/courses`), {deferStream: true})

//     return (
//       <div class="flex">
//         <Show when={courses()}>
//           <CourseFilters
//             parent={courses().parent}
//             main={courses().main}
//             currentSearchURL={courses().query}
//             category={courses().category}
//             displayCategories={courses().displayCategories}
//             priceFrom={courses().priceFrom}
//             priceTo={courses().priceTo}
//             city={courses().city}
//             sort={courses().sort}
//             region={courses().region}
//             min_price_filter={courses().min_price_filter}
//             max_price_filter={courses().max_price_filter}
//           ></CourseFilters>
//           <div class="flex flex-col w-full">
//             <main class="flex sticky top-[46px] py-2 bg-white z-[10] border-b items-center justify-between px-4">
//               <p class="font-[thin-font] text-xs font-bold">
//                 ნაჩვენებია 1–დან {courses().total_count <= 16 ? <>
//                 {courses().total_count}-მდე შედეგი 
//                 <span class="text-dark-green-hover">"{courses().category}"</span>
//                 -ის ძებნისას
//                 </>
//                 : <>
//                   16-მდე                  
//                   სულ {courses().total_count}-ზე მეტი შედეგი მოიძებნა 
//                   <span class="text-dark-green-hover">"{courses().category}"</span>
//                   -ის ძებნისას
//                 </>
//                 };
//               </p>
//               <CourseServices 
//                 currentSearchParams={courses().sort}
//                 currentSearchURL={courses().query}
//                 sort={courses().sort}
//               ></CourseServices>
//             </main>
//             <CourseRenderer
//               courses={courses().courses}
//             ></CourseRenderer>
//               <CoursePagination
//                 links={courses().links}
//                 pageCount={courses().pageCount}    
//                 right_btn_link={courses().last_btn_link}        
//                 left_btn_link={courses().first_btn_link}        
//               ></CoursePagination>
//           </div>
//         </Show>
//       </div>
//   );
// };

export const BrowseCourses = () => {
    return <div>hi</div>
}