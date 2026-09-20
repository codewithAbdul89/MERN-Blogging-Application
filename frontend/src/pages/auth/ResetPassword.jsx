import { RiLockPasswordLine } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdError } from "react-icons/md";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { resetPasswordSchema } from "../../features/auth/authValidation";
import { useEffect } from "react";
import { useResetPassword } from "../../features/auth/authMutations";
import ButtonLoader from "../../components/ui/ButtonLoader";
import Loader from "../../components/ui/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useVerifyResetToken } from "../../features/auth/authQuery";

function ResetPassword() {
  const navigate = useNavigate();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    setFocus("newPassword");
  }, [setFocus]);

  const { isPending: isVerifyingToken, isError: isTokenInvalid } = useVerifyResetToken(token);

  const { mutateAsync: resetPassword, isPending } = useResetPassword();

  const onSubmit = async (data) => {
    try {
      await resetPassword({
        token,
        newPassword: data.newPassword,
      });

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Reset Password error:", error);
    }
  };

  if (isVerifyingToken || isPending) {
    return <Loader />;
  }

  return (
    <section className="flex min-h-[calc(100vh-240px)] w-full items-center justify-center sm:min-h-[calc(100vh-120px)]">
      <main
        className={`bg-background w-[98%] rounded-3xl px-2.5 py-3.5 sm:p-4 dark:bg-[#1b2431] ${isTokenInvalid ? "sm:max-w-md" : "sm:max-w-lg"}`}
      >
        {/* Starting from here */}
        <div className="bg-primary-light m-1 rounded-2xl px-4 py-5 shadow-xl">
          {/* Icon */}
          <div className="mb-4 flex justify-center">
            <div
              className={`${isTokenInvalid ? "bg-danger/30" : "bg-primary/10"} flex h-14 w-14 items-center justify-center rounded-full`}
            >
              {isTokenInvalid ? (
                <MdError RiLockPasswordLine size={50} className="text-danger/80" />
              ) : (
                <RiLockPasswordLine RiLockPasswordLine size={28} className="text-primary" />
              )}
            </div>
          </div>
          {isTokenInvalid ? (
            <div>
              <h1 className="text-primary font-heading pt-3 text-center text-2xl font-bold md:text-3xl">
                Invalid or expired link
              </h1>

              <p className="text-text-secondary mt-1 text-center">
                This password reset link is invalid or has expired.
              </p>

              <div className="mt-5 flex items-center justify-center">
                <Link
                  className="bg-primary hover:bg:primary/60 rounded-lg p-2.5 font-semibold text-white/80 transition-colors duration-300 hover:text-white/60"
                  to="/forgot-password"
                  replace
                >
                  Request a new link
                </Link>
              </div>
            </div>
          ) : (
            <>
              {/* Main Heading */}
              <h1 className="text-primary font-heading pt-3 text-center text-4xl font-bold">
                Reset Your Password
              </h1>

              <h2 className="text-text-secondary mt-1 text-center">
                Enter your new password below.
              </h2>
              {/* Form */}
              <form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
                <Input
                  label="New Password"
                  id="newPassword"
                  placeholder="abc$@123"
                  type="password"
                  labelClassName="text-lg"
                  {...register("newPassword")}
                  error={errors.newPassword?.message}
                />

                <Input
                  label=" Confirm Password"
                  id="confirmPassword"
                  placeholder="abc$@123"
                  type="password"
                  labelClassName="text-lg"
                  {...register("confirmPassword")}
                  error={errors.confirmPassword?.message}
                />

                <Button
                  type="submit"
                  text={isPending ? <ButtonLoader text="Reseting" /> : "Reset Password"}
                  disabled={isPending}
                  className="bg-primary hover:bg-primary-hover mt-3 w-full text-lg text-white/80"
                />
              </form>
              {/* Back Button */}
              <p className="text-text-secondary mt-4 text-center">
                Remember your password?
                <Link
                  to="/login"
                  className="text-primary hover:text-primary-hover font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>
            </>
          )}
        </div>
      </main>
    </section>
  );
}

export default ResetPassword;
