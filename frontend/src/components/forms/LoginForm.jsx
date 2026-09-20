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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import { QUERY_KEYS } from "../../constants/queryKeys.js";
import { setUser } from "../../features/auth/authSlice.js";

function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

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
      await login(data);

      navigate(from, { replace: true });
    } catch (error) {
      const errorCode = error.response?.data?.errorCode;

      if (errorCode === "EMAIL_NOT_VERIFIED") {
        localStorage.setItem("email", data.email);
        navigate("/register/verify-email", {
          state: {
            flow: "register-verify-email",
          },
        });
        return;
      }

      console.error("Login error:", error);
    }
  };
  // OAUTH success handler
  useEffect(() => {
    const handleOAuthMessage = async (event) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      if (event.data?.type !== "OAUTH_SUCCESS") {
        return;
      }

      try {
        sessionStorage.setItem("justLoggedIn", "1");

        localStorage.setItem("hasSession", "1");

        await queryClient.refetchQueries({
          queryKey: QUERY_KEYS.CURRENT_USER,
        });

        const currentUser = queryClient.getQueryData(QUERY_KEYS.CURRENT_USER);

        if (currentUser?.data?.user) {
          dispatch(setUser(currentUser.data.user));

          navigate("/", {
            replace: true,
          });
        }
      } catch (error) {
        console.error("OAuth authentication failed:", error);
      }
    };

    window.addEventListener("message", handleOAuthMessage);

    return () => {
      window.removeEventListener("message", handleOAuthMessage);
    };
  }, [navigate, queryClient, dispatch]);

  return (
    <div className="bg-primary-light m-1 rounded-3xl px-4 py-5 shadow-xl">
      <h1 className="text-primary font-heading text-center text-4xl font-bold">Welcome Back</h1>

      <h2 className="text-text-secondary mt-1 text-center">Login to your account to continue.</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          id="email"
          placeholder="abc@gmail.com"
          type="email"
          autoComplete="emial"
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
          passwordIcon
        />

        {/* Remember me & Forgot Password */}

        <div className="flex items-center justify-between px-1 pt-0.5 sm:px-3">
          <div className="text-primary/80 flex items-center justify-center gap-2">
            <Input
              type="checkbox"
              {...register("rememberMe")}
              className="accent-primary h-4 w-4 hover:opacity-60 sm:h-3.5 sm:w-3.5"
            />
            Remember me
          </div>
          <Link
            to="/forgot-password"
            className="hover:text-primary-hover text-primary/80 block text-sm hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mb-2 flex justify-center">
          <Button
            type="submit"
            text={isPending ? <ButtonLoader text="Logging in" /> : "Login"}
            disabled={isPending}
            className="bg-primary hover:bg-primary-hover mt-2 w-full text-lg text-white/80"
          />
        </div>
      </form>

      {/* Continue with Email */}
      <Link className="w-full" to="/email-login">
        <Button
          className="bg-primary hover:bg-primary-hover flex w-full cursor-pointer items-center justify-center gap-x-3 text-white/80"
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
      <div className="flex items-center justify-center gap-x-5">
        <Button
          className="bg-primary hover:bg-primary-hover flex w-full cursor-pointer items-center justify-center gap-x-3 text-white/80"
          onClick={googleLogin}
          text={
            <>
              <FcGoogle size={28} />
              Google
            </>
          }
        />

        <Button
          className="bg-primary hover:bg-primary-hover flex w-full cursor-pointer items-center justify-center gap-x-3 text-white/80"
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
          className="text text-primary hover:text-primary-hover font-semibold hover:underline"
        >
          Sign Up!
        </Link>
      </p>
    </div>
  );
}

export default LoginForm;
