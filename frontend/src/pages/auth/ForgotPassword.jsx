import { MdOutlineEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { emailSchema } from "../../features/auth/authValidation";
import { useEffect, useState } from "react";
import { useForgotPassword } from "../../features/auth/authMutations";
import ButtonLoader from "../../components/ui/ButtonLoader";
import Loader from "../../components/ui/Loader";
import { Link } from "react-router-dom";
import Timer from "../../components/ui/Timer";

function ForgotPassword() {
  const [resetKey, setResetKey] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hasSent, setHasSent] = useState(false);
  const [expireLabel, setExpireLabel] = useState("");

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const { mutateAsync: forgotPassword, isPending } = useForgotPassword();

  const onSubmit = async (data) => {
    // Don't send request while timer is running
    if (timeLeft > 0) {
      return;
    }

    try {
      await forgotPassword(data);

      // First request has been successfully sent
      setHasSent(true);

      // Start/reset timer
      setResetKey((prev) => prev + 1);

      setExpireLabel("Those link will expire with in 5 min.");
    } catch (error) {
      console.error("Forgot Password error:", error);
    }
  };

  return (
    <>
      {isPending && <Loader />}

      <section className="flex min-h-[calc(100vh-240px)] w-full items-center justify-center sm:min-h-[calc(100vh-120px)]">
        <main className="bg-background w-[98%] rounded-3xl px-2.5 py-3.5 sm:max-w-lg sm:p-4 dark:bg-[#1b2431]">
          <div className="bg-primary-light m-1 rounded-2xl px-4 py-5 shadow-xl">
            {/* Icon */}
            <div className="mb-4 flex justify-center">
              <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
                <MdOutlineEmail size={32} className="text-primary" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="font-heading text-primary pt-3 text-center text-4xl font-bold">
              Forgot Your Password
            </h1>

            <h2 className="text-text-secondary mt-1 text-center">
              Enter your email and we'll send you a link to reset it.
            </h2>

            {/* Form */}
            <form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Email Address"
                id="email"
                placeholder="abc@gmail.com"
                autoComplete="email"
                type="email"
                labelClassName="text-lg"
                {...register("email")}
                error={errors.email?.message}
              />

              {/* Timer */}
              <Timer initialTime={60} resetKey={resetKey} onTimeChange={setTimeLeft} />

              <p className="text-danger text-center">{expireLabel}</p>

              {/* Send / Resend Button */}
              <Button
                className="bg-primary hover:bg-primary-hover w-full text-lg text-white/80"
                type="submit"
                disabled={isPending || timeLeft > 0}
                text={
                  isPending ? (
                    <ButtonLoader text="Sending" />
                  ) : !hasSent ? (
                    "Send Reset Link"
                  ) : timeLeft > 0 ? (
                    <>
                      Resend Link after <span className="text-red-500">{timeLeft}s</span>
                    </>
                  ) : (
                    "Resend Reset Link"
                  )
                }
              />
            </form>

            {/* Back Button */}
            <p className="text-text-secondary mt-4 text-center">
              Remember your password?
              <Link
                to="/login"
                className="text-primary hover:text-primary-hover ml-1 font-semibold hover:underline"
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

export default ForgotPassword;
