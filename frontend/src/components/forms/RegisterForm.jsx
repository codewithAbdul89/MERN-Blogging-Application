import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Button from "../ui/Button.jsx";
import ButtonLoader from "../ui/ButtonLoader.jsx";
import Input from "../ui/Input.jsx";

import {  registerSchema } from "../../features/auth/authValidation.js";
import { useRegister } from "../../features/auth/authMutations.js";
import { googleLogin, githubLogin } from "../../features/auth/authService.js";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../../constants/queryKeys.js";

function RegisterForm() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    setFocus,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    setFocus("userName");
  }, [setFocus]);

  const { mutateAsync: registerAccount, isPending } = useRegister();

  const onSubmit = async (data) => {
    try {
      await registerAccount(data);
      navigate("/register/verify-email", { replace: true });
    } catch (error) {
      console.error("Register error:", error);
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
    <div className="bg-primary-light m-1 px-3 py-5 rounded-3xl shadow-xl ">
      <h1 className="text-primary text-3xl font-bold font-heading text-center sm:text-4xl">
        Create Your Account
      </h1>

      <h2 className="mt-1 text-text-secondary text-center">
        Join Abdul's Blog and start sharing your ideas.
      </h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="User Name"
          id="userName"
          placeholder="abc@gmail.com"
          {...register("userName")}
          labelClassName="my-1"
          error={errors.userName?.message}
        />

        <Input
          label="Email"
          id="email"
          placeholder="abc@gmail.com"
          type="email"
          {...register("email")}
          labelClassName="my-1"
          error={errors.email?.message}
        />

        <Input
          label="Password"
          id="password"
          type="password"
          placeholder="abc$@123"
          {...register("password")}
          labelClassName="my-1"
          error={errors.password?.message}
        />

        <Input
          label="Confirm Password"
          id="confirmPassword"
          type="password"
          placeholder="abc$@123"
          className="mb-2"
          {...register("confirmPassword")}
          labelClassName="my-1"
          error={errors.confirmPassword?.message}
        />

        <div className="flex justify-center mb-2">
          <Button
            type="submit"
            text={isPending ? <ButtonLoader text="Registering" /> : "Register"}
            disabled={isPending}
            className="bg-primary w-full text-white/80 mt-2 hover:bg-primary-hover text-lg"
          />
        </div>
      </form>

      {/* Continue With */}

      <div className="flex items-center gap-3 py-1">
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
        Already have an account?
        <Link
          to="/login"
          className="text font-semibold text-primary hover:underline hover:text-primary-hover"
        >
          Login!
        </Link>
      </p>
    </div>
  );
}

export default RegisterForm;
