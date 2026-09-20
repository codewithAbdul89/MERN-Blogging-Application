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

const DeleteBlog = () => {
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

  const { mutateAsync: verifyOtp, isPending: otpVerifyPending } = useVerifyDeleteBlogOtp();

  const { mutateAsync: deleteBlog, isPending: isDeletePending } = useDeleteBlog();

  const blogId = localStorage.getItem("blogId");

  // verify Login otp
  const onSubmit = async (otp) => {
    await verifyOtp({
      otp: otp,
    });

    await deleteBlog({ blogId });
    localStorage.removeItem("blogId");
    navigate(-1);
  };

  // Resend Otp Email

  const { mutateAsync: resendEmail, isPending: isResendEmailPending } = useSendDeleteBlogOtp();

  const handleResend = async () => {
    if (!blogId) showError("Blog Id is required.");
    await resendEmail({ blogId });
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
            initialTime={120}
            showBackButton
          />
        </div>
      </main>
    </section>,
    document.body
  );
};

export default DeleteBlog;
