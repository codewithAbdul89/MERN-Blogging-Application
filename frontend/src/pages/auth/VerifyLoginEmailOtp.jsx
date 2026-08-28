import { useForm } from "react-hook-form";

import OtpVerification from "../../components/forms/OtpVerification";
import {
  useEmailLogin,
  useVerifyEmailOtp,
} from "../../features/auth/authMutations";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailLoginOtpSchema } from "../../features/auth/authValidation";
import { showError } from "../../utils/toast";

const VerifyLoginEmailOtp = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailLoginOtpSchema),
    defaultValues: {
      otp: "",
    },
  });

  const { mutateAsync: verifyOtp, isPending: otpVerifyPending } =
    useVerifyEmailOtp();

  // verify Login otp
  const onSubmit = async (otp) => {
    await verifyOtp({
      otp: otp,
    });

    navigate("/", { replace: true });
  };

  // Resend Otp Email

  const { mutateAsync: resendEmail, isPending: resendEmailPending } =
    useEmailLogin();

  const handleResend = async () => {
    const email = JSON.parse(sessionStorage.getItem("email"));
    if (!email) showError("Email is required.");
    await resendEmail(email);
    return true;
  };

  return (
    <section className="flex min-h-[calc(100vh-240px)]  w-full items-center justify-center sm:min-h-[calc(100vh-120px)]">
      <main className="w-[98%] rounded-3xl bg-background px-2.5 py-3.5 dark:bg-[#1b2431] sm:max-w-lg sm:p-4">
        {/* Starting from here */}
        <div className="bg-primary-light m-1 px-4 py-5 rounded-2xl shadow-xl ">
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
            isResending={resendEmailPending}
            initialTime={60}
            linkNavigate={"/email-login"}
          />
        </div>
      </main>
    </section>
  );
};

export default VerifyLoginEmailOtp;
