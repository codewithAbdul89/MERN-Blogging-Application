import { MdOutlineEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { emailSchema } from "../../features/auth/authValidation";
import { useEffect } from "react";
import { useEmailLogin } from "../../features/auth/authMutations";
import ButtonLoader from "../../components/ui/ButtonLoader";
import Loader from "../../components/ui/Loader";
import { Link, useNavigate } from "react-router-dom";

function SendLoginEmailOtp() {
  const navigate = useNavigate();

  const emailData = JSON.parse(sessionStorage.getItem("email") || "null");

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: emailData?.email || "",
    },
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const { mutateAsync: sendEmailLoginOtp, isPending } = useEmailLogin();

  const onSubmit = async (data) => {
    try {
      await sendEmailLoginOtp(data);
      navigate("/verify-login-otp", {
        state: {
          flow: "verify-login-otp",
        },
      });
    } catch (error) {
      console.error("Send Login Email error:", error);
    }
  };

  return (
    <>
      {isPending && <Loader />}
      <section className="flex min-h-[calc(100vh-240px)] w-full items-center justify-center sm:min-h-[calc(100vh-120px)]">
        <main className="bg-background w-[98%] rounded-3xl px-2.5 py-3.5 sm:max-w-lg sm:p-4 dark:bg-[#1b2431]">
          {/* Starting from here */}
          <div className="bg-primary-light m-1 rounded-2xl px-4 py-5 shadow-xl">
            {/* Icon */}

            <div className="mb-4 flex justify-center">
              <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
                <MdOutlineEmail size={32} className="text-primary" />
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-primary font-heading pt-3 text-center text-4xl font-bold">
              Login With Email
            </h1>

            <h2 className="text-text-secondary mt-1 text-center">
              Enter your credentials to access your account.
            </h2>
            {/* Form */}
            <form className="mt-2 flex flex-col gap-2" onSubmit={handleSubmit(onSubmit)}>
              <Input
                label="Email"
                id="email"
                placeholder="abc@gmail.com"
                autoComplete="emial"
                type="email"
                labelClassName="text-lg"
                {...register("email")}
                error={errors.email?.message}
              />

              <Button
                type="submit"
                text={isPending ? <ButtonLoader text="Sending OTP.." /> : "Send OTP"}
                disabled={isPending}
                className="bg-primary hover:bg-primary-hover mt-2 w-full text-lg text-white/80"
              />
            </form>
            {/* Back Button */}
            <Link to="/login" className="mt-1 block">
              <Button
                type="button"
                text={"Back to login page"}
                className="bg-primary hover:bg-primary-hover mt-2 w-full text-lg text-white/80"
              />
            </Link>
          </div>
        </main>
      </section>
    </>
  );
}

export default SendLoginEmailOtp;
