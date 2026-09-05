import { useForm } from "react-hook-form";
import ButtonLoader from "../../components/ui/ButtonLoader";
import Input from "../../components/ui/Input";
import {
  useChangePassword,
  useLogout,
} from "../../features/auth/authMutations";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePasswordSchema } from "../../features/auth/authValidation";
import { useEffect } from "react";
import Button from "../../components/ui/Button";
import { Link } from "react-router-dom";
import Loader from "../../components/ui/Loader";

function ChangePassword() {
  const {
    handleSubmit,
    register,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
  });

  useEffect(() => {
    setFocus("previousPassword");
  }, [setFocus]);

  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const { mutateAsync: logout, isPending: isLogoutPending } = useLogout();

  const onSubmit = async (data) => {
    try {
      await changePassword(data);
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <section className="flex min-h-[calc(100vh-180px)]  w-full items-center justify-center">
      {isLogoutPending || isPending && <Loader/>}
      <main className="w-[98%] rounded-3xl bg-background px-2.5 py-3.5 dark:bg-[#1b2431] sm:max-w-lg sm:p-4">
        <div className="bg-primary-light m-1 px-4 py-5 rounded-3xl shadow-xl">
          <h1 className="text-primary text-4xl font-bold font-heading text-center">
            Change Your Password
          </h1>

          <h2 className="mt-1 text-text-secondary text-center">
            Enter your credentials to update your account password.
          </h2>

          <form onSubmit={handleSubmit(onSubmit)}>
            {/* previousPassword */}
            <Input
              label="Previous Password"
              id="previousPassword"
              type="password"
              placeholder="abc$@123"
              className="mb-2"
              {...register("previousPassword")}
              error={errors.previousPassword?.message}
              passwordIcon
            />

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
              text={
                isPending ? (
                  <ButtonLoader text="Changing Password" />
                ) : (
                  "Change Password"
                )
              }
              disabled={isPending}
              className="bg-primary w-full text-white/80 mt-2 hover:bg-primary-hover text-lg"
            />
          </form>

          <Link to="/" className="mt-2 block">
            <Button
              text="Back to home"
              className="bg-primary w-full text-white/80 mt-2 hover:bg-primary-hover text-lg"
            />
          </Link>
        </div>
      </main>
    </section>
  );
}

export default ChangePassword;
