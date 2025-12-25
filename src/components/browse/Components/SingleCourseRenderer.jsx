import { A } from "@solidjs/router";
import { For } from "solid-js";

export const SignleCourseRenderer = (props) => {
  const { c } = props;

  return (
    <div class="w-full mx-auto p-2">
      <div class="bg-white shadow-md w-full rounded-lg overflow-hidden h-[300px] flex flex-col md:flex-row">
        <A class="w-[300px] h-[300px] flex-shrink-0" href={`/course/${c.publicId}`}>
          <img
            class="w-[300px] h-[300px]"
            width={300}
            height={300}
            src={c.thumbnail_src}
            alt={c.main_title}
            fetchpriority="high"
          />
        </A>

        <div class="p-2 flex w-full flex-col relative justify-between">
          <div>
            <div class="flex justify-between items-start">
              <A href={`/course/${c.publicId}`}>
                <h2 class="text-lg font-bold text-gray-800">
                  {c.main_title}
                </h2>
              </A>
              {c.place_name_ka && (
                <span class="bg-green-600 absolute opacity-[0.9] right-2 top-0 text-white text-xs font-semibold font-[thin-font] px-2 py-1 rounded-full">
                  {c.place_name_ka.slice(0, 50)}...
                </span>
              )}
            </div>

            <A href={`/course/${c.publicId}`}>
              <p class="mt-2 text-xs font-[normal-font] text-gray-600">
                {c.main_description}
              </p>
            </A>
            <p class="mt-2 text-gray-800 font-[bolder-font] text-xs">
              {c.main_category}
            </p>

            <div class="mt-1 flex flex-wrap gap-1">
              <For each={c.categories}>
                {(sc) => (
                  <span class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs font-[thin-font] font-semibold">
                    {sc}
                  </span>
                )}
              </For>
            </div>
          </div>

          <div class="mt-4 border-t pt-2">
            <div class="flex gap-x-2">
              <div class="flex flex-col items-start p-2 bg-gray-50 rounded-lg shadow-sm">
                <A href={`/course/${c.publicId}`}>
                  <p class="text-lg font-[normal-font] font-semibold text-gray-900">
                    ₾
                    {c.main_price}
                  </p>
                </A>
                <p class="mt-1 text-xs font-[normal-font] text-gray-500">
                  გამოქვეყნდა: {c.display_created_at}
                </p>
              </div>

              <div class="flex flex-col items-start p-2 bg-gray-50 rounded-lg shadow-sm">
                <A href={`/course/${c.publicId}`}>
                  <p class="text-lg font-bold text-gray-900">
                    {c.avgrating}
                  </p>
                </A>
                <p class="mt-1 text-xs font-[normal-font] text-gray-500">
                  შესრულებული: {c.completed_count}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
