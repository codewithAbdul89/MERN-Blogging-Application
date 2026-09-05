import { MdOutlineEmail } from "react-icons/md";

import Input from "../../components/ui/Input";
import ButtonLoader from "../../components/ui/ButtonLoader";
import { useEffect, useState } from "react";
import { useResendVerificationEmail } from "../../features/auth/authMutations";
import Button from "../../components/ui/Button";
import Timer from "../../components/ui/Timer";
import { Navigate } from "react-router-dom";

function VerifyRegisteredEmail() {
const [resetKey, setResetKey] = useState(1);
const [timeLeft, setTimeLeft] = useState(0);
const [hasSent, setHasSent] = useState(true);

  const [email, setEmail] = useState(() => {
    return localStorage.getItem("email");
  });

  const { mutateAsync: resendLink, isPending } = useResendVerificationEmail();

  useEffect(() => {
    const handleStorageChange = () => {
      setEmail(localStorage.getItem("email"));
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleResend = async (e) => {
    e.preventDefault();
    // Don't send request while timer is running
    if (timeLeft > 0) {
      return;
    }

    try {
      await resendLink({
        email,
      });

      // First request has been successfully sent
      setHasSent(true);

      // Start/reset timer
      setResetKey((prev) => prev + 1);
    } catch (error) {
      console.error("Resend Verification Email error:", error);
    }
  };

  if (!email) {
    return <Navigate to="/login" replace />;
  }

  return (
    <section className="flex min-h-[calc(100vh-180px)]  w-full items-center justify-center">
      <main className="w-[98%] rounded-3xl bg-background px-2.5 py-3.5 dark:bg-[#1b2431] sm:max-w-lg sm:p-4">
        <div className="bg-primary-light m-1 px-4 py-5 rounded-3xl shadow-xl">
          <div className="mb-4 flex justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <MdOutlineEmail size={32} className="text-primary" />
            </div>
          </div>

          <h1 className="text-primary text-4xl font-bold font-heading text-center">
            Verify Your Email
          </h1>

          <h2 className="mt-4 text-text-secondary text-center">
            A verification email has been sent to your email address. Please
            verify your email first. Also, check your spam folder if you don't
            see it in your inbox.
          </h2>
          <form onSubmit={handleResend} className="mt-6">
            <Input label={"Your Email"} id="email" disabled value={email} />

            {/* Timer */}
            <Timer
              initialTime={30}
              resetKey={resetKey}
              onTimeChange={setTimeLeft}
            />

            <p className="text-danger text-center py-3">
              Those verification link will expire with in 24 hours.
            </p>

            <Button
              className=" w-full bg-primary text-lg text-white/80 hover:bg-primary-hover"
              type="submit"
              disabled={isPending || timeLeft > 0}
              text={
                isPending ? (
                  <ButtonLoader text="Resending Email" />
                ) : !hasSent ? (
                  "Resend Email"
                ) : timeLeft > 0 ? (
                  <>
                    You can resend Link after{" "}
                    <span className="text-red-500">{timeLeft}s</span>.
                  </>
                ) : (
                  "Resend Email"
                )
              }
            />
          </form>
        </div>
      </main>
    </section>
  );
}

export default VerifyRegisteredEmail;
