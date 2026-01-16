import { Title } from "@solidjs/meta"
import { useSubmission } from "@solidjs/router"
import ProtectVerify from "~/components/protectVerifyRoute"
import { approve_with_device, approve_with_email } from "~/routes/api/auth/handle-forms/verification_options"

const PendingLogin = () => {
  const verificationMethods = [
    {
      action: approve_with_email,
      title: "კოდის შეყვანა",
      description: "შეიყვანეთ ელფოსტაზე მიღებული ერთჯერადი კოდი",
      icon: '/svg/arrow-narrow-right-branded.svg',
      ariaLabel: "ელფოსტაზე მიღებული კოდით დადასტურება"
    },
    {
      action: approve_with_device,
      title: "სხვა მოწყობილობით დადასტურება",
      description: "დაადასტურეთ შესვლა უკვე ავტორიზებული მოწყობილობიდან",
      icon: '/svg/arrow-narrow-right-branded.svg',
      ariaLabel: "სხვა მოწყობილობით დადასტურება"
    }
  ]

  const approve_with_email_submission = useSubmission(approve_with_email)
  const approve_with_device_submission = useSubmission(approve_with_device)

  const is_pending = () => approve_with_email_submission.pending || approve_with_device_submission.pending

  return <ProtectVerify>
        <Title>Artra - აირჩიე შესვლის მეთოდი</Title>
        <main class="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4 py-8">
          <div class="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-8 relative">
            <div class="text-center space-y-3">
              <div class="inline-flex items-center justify-center w-12 h-12 bg-orange-50 rounded-full mb-2">
                <img src='/svg/lock.svg' width={24} height={24} alt='' />
              </div>
              <h1 class="text-2xl font-gsans font-bold text-gray-900">
                შესვლა დადასტურებას საჭიროებს
              </h1>
              <p class="text-gray-600 font-gsans font-normal leading-relaxed">
                უსაფრთხოების მიზნით აირჩიეთ ვერიფიკაციის მეთოდი
              </p>
            </div>

            <div class="space-y-4">
              {verificationMethods.map((method) => (
                <form
                  action={method.action}
                  method="POST"
                  class="group relative"
                >
                  <button
                    type="submit"
                    disabled={is_pending()}
                    aria-label={method.ariaLabel}
                    aria-busy={is_pending()}
                    class={`w-full p-5 flex items-center justify-between rounded-xl border-2 bg-white
                      ${is_pending()
                        ? 'border-orange-300 opacity-60 bg-orange-50 cursor-wait'
                        : 'border-orange-100 active:scale-[0.99] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 hover:border-[#E85A4F] hover:bg-orange-50'
                      }`}
                  >
                    <div class="text-left space-y-1.5">
                      <h2 class={`font-gsans font-bold transition-colors
                        ${is_pending() ? 'text-[#E85A4F]' : 'text-gray-900 group-hover:text-[#E85A4F]'}`}>
                        {method.title}
                      </h2>
                      <p class="text-sm font-gsans font-normal text-gray-600 leading-snug">
                        {method.description}
                      </p>
                    </div>
                    <img
                      src={method.icon}
                      width={24}
                      height={24}
                      alt=""
                      class="group-hover:translate-x-1 transition-transform"
                    />
                  </button>
                </form>
              ))}
            </div>

            <div class="pt-4 border-t border-gray-100">
              <p class="text-center text-sm text-gray-500">
                თუ ვერ ახერხებთ დადასტურებას, სცადეთ მოგვიანებით ან{" "}
                <a
                  href={`mailto:${import.meta.env.VITE_EMAIL}`}
                  class="text-[#E85A4F] font-gsans font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-1 rounded"
                >
                  დაგვიკავშირდით
                </a>
              </p>
            </div>
          </div>
        </main>
  </ProtectVerify>
}

export default PendingLogin