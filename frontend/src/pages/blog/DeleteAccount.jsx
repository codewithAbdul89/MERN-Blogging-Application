import { useForm } from "react-hook-form";

import OtpVerification from "../../components/forms/OtpVerification";

import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { OtpSchema } from "../../features/auth/authValidation";
import { showError } from "../../utils/toast";
import {
  useDeleteBlog,
  useSendDeleteBlogOtp,
  useVerifyDeleteBlogOtp,
} from "../../features/blog/blogMutations";
import { createPortal } from "react-dom";
import Loader from "../../components/ui/Loader";
import {
  useDeleteAccount,
  useSendDeleteAccountOtp,
  useVerifyDeleteAccountOtp,
} from "../../features/user/userMutations";

const DeleteAccount = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(OtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { mutateAsync: verifyOtp, isPending: otpVerifyPending } = useVerifyDeleteAccountOtp();

  const { mutateAsync: deleteBlog, isPending: isDeletePending } = useDeleteAccount();

  // verify Login otp
  const onSubmit = async (otp) => {
    await verifyOtp({
      otp: otp,
    });

    await deleteBlog();
    navigate("/");
  };

  // Resend Otp Email

  const { mutateAsync: resendEmail, isPending: isResendEmailPending } = useSendDeleteAccountOtp();

  const handleResend = async () => {
    await resendEmail();
    return true;
  };

  const isPending = otpVerifyPending || isDeletePending || isResendEmailPending;

  if (isPending) return <Loader />;

  return createPortal(
    <section className="fixed inset-0 z-9999 flex items-center justify-center bg-black/80 px-2">
      <main className="bg-background w-[98%] max-w-lg rounded-3xl px-2.5 py-3.5 sm:p-4 dark:bg-[#1b2431]">
        <div className="bg-primary-light m-1 rounded-2xl px-4 py-5 shadow-xl">
          <OtpVerification
            title="Enter OTP"
            description="Enter the 6-digit code sent to your email."
            onSubmit={(otp) => {
              setValue("otp", otp, {
                shouldValidate: true,
              });

              handleSubmit(onSubmit)();
            }}
            onResend={handleResend}
            error={errors.otp?.message}
            isSubmitting={otpVerifyPending}
            isResending={isResendEmailPending}
            initialTime={300}
            showBackButton
          />
        </div>
      </main>
    </section>,
    document.body
  );
};

export default DeleteAccount;
