import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdEmail } from "react-icons/md";

import Button from "../ui/Button.jsx";
import ButtonLoader from "../ui/ButtonLoader.jsx";
import Input from "../ui/Input.jsx";

import { loginSchema } from "../../features/auth/authValidation.js";
import { useLogin } from "../../features/auth/authMutations.js";
import { googleLogin, githubLogin } from "../../features/auth/authService.js";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function LoginForm() {
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    setFocus("email");
    sessionStorage.removeItem("email");
  }, [setFocus]);

  const { mutateAsync: login, isPending } = useLogin();

  const onSubmit = async (data) => {
    try {
      console.log("Login data", data);
      await login(data);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Login error:", error);
    }
  };
  // OAUTH success handler
  useEffect(() => {
    const handleOAuthMessage = (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type === "OAUTH_SUCCESS") {
        navigate("/", { replace: true });
      }
    };

    window.addEventListener("message", handleOAuthMessage);

    return () => {
      window.removeEventListener("message", handleOAuthMessage);
    };
  }, [navigate]);

  return (
    <div className="bg-primary-light m-1 px-4 py-5 rounded-3xl shadow-xl">
      <h1 className="text-primary text-4xl font-bold font-heading text-center">
        Welcome Back
      </h1>

      <h2 className="mt-1 text-text-secondary text-center">
        Login to your account to continue.
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          id="email"
          placeholder="abc@gmail.com"
          type="email"
          {...register("email")}
          error={errors.email?.message}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="abc$@123"
          className="mb-2"
          {...register("password")}
          error={errors.password?.message}
          // value="abdul4"
        />

        {/* Remember me & Forgot Password */}

        <div className="flex justify-between items-center px-1 sm:px-3 pt-0.5">
          <div className="flex gap-2 justify-center items-center text-primary/80">
            <Input
              type="checkbox"
              {...register("rememberMe")}
              className=" w-4 h-4 sm:w-3.5 sm:h-3.5 accent-primary hover:opacity-60"
            />
            Remember me
          </div>
          <Link
            to="/forgot-password"
            className="block text-sm hover:underline hover:text-primary-hover text-primary/80 "
          >
            Forgot Password?
          </Link>
        </div>

        <div className="flex justify-center mb-2">
          <Button
            type="submit"
            text={isPending ? <ButtonLoader text="Logging in" /> : "Login"}
            disabled={isPending}
            className="bg-primary w-full text-white/80 mt-2 hover:bg-primary-hover text-lg"
          />
        </div>
      </form>

      {/* Continue with Email */}
      <Link className="w-full" to="/email-login">
        <Button
          className="bg-primary w-full text-white/80 cursor-pointer flex items-center gap-x-3 justify-center hover:bg-primary-hover"
          text={
            <>
              <MdEmail size={30} />
              Continue with Email
            </>
          }
        />
      </Link>

      <div className="flex items-center gap-3 py-2">
        <div className="h-px flex-1 bg-gray-200" />

        <span className="text-sm text-gray-500">or continue with</span>

        <div className="h-px flex-1 bg-gray-200" />
      </div>
      {/* OAuth */}
      <div className="flex  gap-x-5 justify-center items-center">
        <Button
          className="bg-primary w-full text-white/80 cursor-pointer flex items-center gap-x-3 justify-center hover:bg-primary-hover"
          onClick={googleLogin}
          text={
            <>
              <FcGoogle size={28} />
              Google
            </>
          }
        />

        <Button
          className="bg-primary w-full text-white/80 cursor-pointer flex items-center gap-x-3 justify-center hover:bg-primary-hover"
          onClick={githubLogin}
          text={
            <>
              <FaGithub size={28} />
              Github
            </>
          }
        />
      </div>

      <p className="text-text-secondary mt-2 py-1 text-center">
        Don't have an account?
        <Link
          to="/register"
          className="text font-semibold text-primary hover:underline hover:text-primary-hover"
        >
          Sign Up!
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
