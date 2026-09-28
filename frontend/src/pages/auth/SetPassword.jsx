import { useForm } from "react-hook-form";
import ButtonLoader from "../../components/ui/ButtonLoader";
import Input from "../../components/ui/Input";
import { useSetPassword, useLogout } from "../../features/auth/authMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { setPasswordSchema } from "../../features/auth/authValidation";
import { useEffect } from "react";
import Button from "../../components/ui/Button";
import { Link, replace } from "react-router-dom";
import Loader from "../../components/ui/Loader";

function SetPassword() {
  const {
    handleSubmit,
    register,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(setPasswordSchema),
  });

  useEffect(() => {
    setFocus("newPassword");
  }, [setFocus]);

  const { mutateAsync: SetPassword, isPending } = useSetPassword();

  const { mutateAsync: logout, isPending: isLogoutPending } = useLogout();

  const onSubmit = async (data) => {
    try {
      await SetPassword(data);
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-180px)] w-full items-center justify-center">
      {isLogoutPending || (isPending && <Loader />)}
      <main className="bg-background w-[98%] rounded-3xl px-2.5 py-3.5 sm:max-w-lg sm:p-4 dark:bg-[#1b2431]">
        <div className="bg-primary-light m-1 rounded-3xl px-4 py-5 shadow-xl">
          <h1 className="text-primary font-heading text-center text-4xl font-bold">
            Set Your Password
          </h1>

          <h2 className="text-text-secondary mt-1 text-center">
            Enter your credentials to set the password first time to your account.
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              label="New Password"
              id="newPassword"
              type="password"
              placeholder="abc$@123"
              className="mb-2"
              {...register("newPassword")}
              error={errors.newPassword?.message}
            />

            <Input
              label="Confirm Password"
              id="confirmPassword"
              type="password"
              placeholder="abc$@123"
              className="mb-2"
              {...register("confirmPassword")}
              error={errors.confirmPassword?.message}
            />

            <Button
              type="submit"
              text={isPending ? <ButtonLoader text="Seting Password" /> : "Set Password"}
              disabled={isPending}
              className="bg-primary hover:bg-primary-hover mt-2 w-full text-lg text-white/80"
            />
          </form>

          <Link to="/" className="mt-2 block">
            <Button
              text="Back to home"
              className="bg-primary hover:bg-primary-hover mt-2 w-full text-lg text-white/80"
            />
          </Link>
        </div>
      </main>
    </section>
  );
}

export default SetPassword;
