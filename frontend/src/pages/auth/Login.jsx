import React from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import ThemeToggle from "../../components/ui/ThemeToggle.jsx";
import { useTheme } from "../../hooks/useTheme.js";
import Button from "../../components/ui/Button.jsx";
import Input from "../../components/ui/Input.jsx";
import AuthLayout from "../../components/layout/AuthLayout.jsx";



function Login() {

  const { currentTheme } = useTheme();

  const backgroundImage =
    currentTheme === "dark"
      ? "https://i.ibb.co/xqRgdsrZ/dark.jpg"
      : "https://i.ibb.co/KxYPJkFZ/lightf.jpg";

  return (
    <AuthLayout>
      <section
        className=" min-h-screen w-full bg-cover bg-center bg-no-repeat  duration-200 transition-all flex flex-col items-center "
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >

        <main className="bg-background w-[98%]  rounded-2xl px-2 py-3.5 sm:max-w-md sm:p-4">

          <div className="bg-primary-light m-1 px-4 py-5 rounded-2xl shadow-xl ">

            <h1 className="text-text-primary text-centner text-4xl font-bold font-heading ">Welcome Back</h1>

            <p className="mt-1 text-text-secondary">Login to your account to continue.</p>

            {/* Form */}
            <form>

              {/*Email  */}
              <Input
                label="Email"
                id="Email"
                placeholder="abc@gmail.com"
                error="Hello"
              />

              {/*Email  */}
              <Input
                label="Password"
                id="password"
                error="World"
                type="password"
                placeholder="abcde123"
                className="mb-2"
              />

              <div className="flex justify-center mb-2">
                <Button
                  type="submit"
                  text="Login"
                  className="bg-primary w-full text-white/80 mt-2  hover:bg-primary-hover text-lg"
                />
              </div>

            </form>

            {/* Links */}

            <div className="flex flex-col gap-y-2 justify-center items-center">

              <Button
                className="bg-primary w-full text-white/80  cursor-pointer  flex items-center gap-x-3 justify-center hover:bg-primary-hover"
                text={
                  <>
                    <FcGoogle size={28} />
                    Continue with Google
                  </>
                }
              />

              <Button
                className="bg-primary w-full text-white/80  cursor-pointer flex items-center gap-x-3 justify-center hover:bg-primary-hover"
                text={
                  <>
                    <FaGithub size={28} />
                    Continue with Github
                  </>
                }
              />
            </div>

            <p className="text-text-secondary mt-2 py-1 px-6">Don't have an account?
              <a href="/signup" className="text-primary font-semibold hover:text-primary-hover hover:opacity-30 text-decoration decoration-secondary underline text-lg"> SignUp!</a>
            </p>

          </div>

        </main>


      </section >
    </AuthLayout>
  );
}

export default Login;