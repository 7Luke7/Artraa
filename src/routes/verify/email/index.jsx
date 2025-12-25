import { Footer } from "~/components/Footer";
import { EmailVerification } from "~/components/email_verification_form";
import { Title } from '@solidjs/meta';
import ProtectVerify from "~/components/protectVerifyRoute";

const Verify = () => {
  return <ProtectVerify>
    <Title>Artra - მეილით ვერიფიკაცია</Title>
    <div class="min-h-screen flex flex-col">
      <div class="flex-1 flex items-center bg-gray-50 justify-center">
        <EmailVerification />
      </div>
      <Footer margin='0' />
    </div>
  </ProtectVerify>
}
export default Verify