import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { MdCheckCircle, MdError } from "react-icons/md";

import Button from "../../components/ui/Button";
import { useVerifyRegisterEmail } from "../../features/auth/authMutations";
import ButtonLoader from "../../components/ui/ButtonLoader";

function VerificationEmailResult() {
  const [status, setStatus] = useState("");

  const { token } = useParams();

  const { mutateAsync: verifyEmailResult, isPending } =
    useVerifyRegisterEmail();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await verifyEmailResult(token);
        setStatus("success");
      } catch (error) {
        setStatus("pending");
        console.log("Verification Email Result Error : ", error);
      }
    };

    verifyEmail();
  }, []);

  if (isPending) {
    return (

      <section className="flex min-h-[calc(100vh-240px)]  w-full items-center justify-center">
        <main className="w-[98%] rounded-3xl bg-background px-2.5 py-3.5 dark:bg-[#1b2431] sm:max-w-lg sm:p-4">
          <div className="bg-primary-light m-1 px-4 py-5 rounded-3xl shadow-xl text-center">
          

            <h1 className="mt-4 text-2xl font-bold text-primary flex justify-center items-center">
              Verifying Your Email
                <ButtonLoader text=""/>
            </h1>

            <p className="mt-2 text-text-secondary">
              Please wait while we verify your email address.
            </p>
          </div>
        </main>
      </section>
    );
  }

  if (status === "success") {
    return (
      <section className="flex min-h-[calc(100vh-240px)]  w-full items-center justify-center">
        <main className="w-[98%] rounded-3xl bg-background px-2.5 py-3.5 dark:bg-[#1b2431] sm:max-w-lg sm:p-4">
          <div className="bg-primary-light text-center m-1 px-4 py-5 rounded-3xl shadow-xl">
            <MdCheckCircle size={70} className="mx-auto text-green-500" />

            <h1 className="mt-4 text-3xl font-bold text-primary">
              Email Verified!
            </h1>

            <p className="mt-2 text-text-secondary">
              Your email address has been successfully verified. Your account is
              now ready to use.
            </p>

            <Link to="/login" replace>
              <Button
                text="Continue to Login"
                className="mt-6 w-full bg-primary text-white/80 hover:bg-primary-hover"
              />
            </Link>
          </div>
        </main>
      </section>
    );
  }

  return (
    <section className="flex min-h-[calc(100vh-240px)]  w-full items-center justify-center">
      <main className="w-[98%] rounded-3xl bg-background px-2.5 py-3.5 dark:bg-[#1b2431] sm:max-w-lg sm:p-4">
        <div className="text-center bg-primary-light m-1 px-4 py-5 rounded-3xl shadow-xl">
          <MdError size={70} className="mx-auto text-danger" />

          <h1 className="mt-4 text-3xl font-bold text-primary">
            Verification Failed
          </h1>

          <p className="mt-2 text-text-secondary">
            This verification link is invalid or has expired. Please request a
            new verification email.
          </p>

          <Link to="/register/verify-email" replace>
            <Button
              text="Resend Verification Email"
              className="mt-6 w-full bg-primary text-white/80 hover:bg-primary-hover"
            />
          </Link>
        </div>
      </main>
    </section>
  );
}

export default VerificationEmailResult;
