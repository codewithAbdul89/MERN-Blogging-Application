import { MdOutlineEmail } from "react-icons/md";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { emailLoginSchema } from "../../features/auth/authValidation";
import { useEffect } from "react";
import { useEmailLogin } from "../../features/auth/authMutations";
import ButtonLoader from "../../components/ui/ButtonLoader";
import Loader from "../../components/ui/Loader";
import { Link, useNavigate } from "react-router-dom";

function EmailLogin() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(emailLoginSchema),
  });

  useEffect(() => {
    setFocus("email");
  }, [setFocus]);

  const { mutateAsync: emailLogin, isPending, isSuccess } = useEmailLogin();

  const onSubmit = async (data) => {
    try {
     await emailLogin(data);
      sessionStorage.setItem("email", JSON.stringify(data));
        navigate("/verify-login-otp");
      
      // console.log(JSON.parse(sessionStorage.getItem("email")));
    } catch (error) {
      console.error("Login error:", error);
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
            <div className="flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/70 dark:bg-[#1b2431]/50">
                <MdOutlineEmail
                  className="text-primary-light dark:text-white/80"
                  size={50}
                />
              </div>
            </div>
            {/* Main Heading */}
            <h1 className="text-text-primary  text-4xl font-bold font-heading text-center pt-3">
              Login With Email
            </h1>

            <h2 className="mt-1 text-text-secondary text-center">
              Enter your credentials to access your account.
            </h2>
            {/* Form */}
            <form
              className="mt-2 flex flex-col gap-2"
              onSubmit={handleSubmit(onSubmit)}
            >
              <Input
                label="Email"
                id="email"
                placeholder="abc@gmail.com"
                type="email"
                labelClassName="text-lg"
                {...register("email")}
                error={errors.email?.message}
              />

              <Button
                type="submit"
                text={
                  isPending ? <ButtonLoader text="Sending OTP.." /> : "Send OTP"
                }
                disabled={isPending}
                className="bg-primary w-full text-white/80 mt-2 hover:bg-primary-hover text-lg"
              />
            </form>
            {/* Back Button */}
            <Link to="/login" className="mt-1 block">
              <Button
                type="button"
                text={"Back to login page"}
                className="bg-primary w-full text-white/80 mt-2 hover:bg-primary-hover text-lg"
              />
            </Link>
          </div>
        </main>
      </section>
    </>
  );
}

export default EmailLogin;
