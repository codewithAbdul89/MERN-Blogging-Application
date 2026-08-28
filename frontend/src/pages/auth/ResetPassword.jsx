import { RiLockPasswordLine } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { resetPasswordSchema } from "../../features/auth/authValidation";
import { useEffect } from "react";
import { useResetPassword } from "../../features/auth/authMutations";
import ButtonLoader from "../../components/ui/ButtonLoader";
import Loader from "../../components/ui/Loader";
import { Link, useNavigate, useParams } from "react-router-dom";

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

  return (
    <>
      {isPending && <Loader />}
      <section className="flex min-h-[calc(100vh-240px)]  w-full items-center justify-center sm:min-h-[calc(100vh-120px)]">
        <main className="w-[98%] rounded-3xl bg-background px-2.5 py-3.5 dark:bg-[#1b2431] sm:max-w-lg sm:p-4">
          {/* Starting from here */}
          <div className="bg-primary-light m-1 px-4 py-5 rounded-2xl shadow-xl ">
            {/* Icon */}

            <div className="mb-4 flex justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                <RiLockPasswordLine size={28} className="text-primary" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-primary  text-4xl font-bold font-heading text-center pt-3">
              Reset Your Password
            </h1>

            <h2 className="mt-1 text-text-secondary text-center">
              Enter your new password below.
            </h2>
            {/* Form */}
            <form
              className="mt-2 flex flex-col gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
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
                text={
                  isPending ? (
                    <ButtonLoader text="Reseting" />
                  ) : (
                    "Reset Password"
                  )
                }
                disabled={isPending}
                className="bg-primary w-full text-white/80 mt-3 hover:bg-primary-hover text-lg"
              />
            </form>
            {/* Back Button */}
            <p className="mt-4 text-center text-text-secondary">
              Remember your password?
              <Link
                to="/login"
                className="text-primary font-semibold hover:text-primary-hover hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </main>
      </section>
    </>
  );
}

export default ResetPassword;
