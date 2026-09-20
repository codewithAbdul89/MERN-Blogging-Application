import { useEffect, useRef, useState } from "react";
import { MdOutlineSecurity, MdTimer } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { FaPencil } from "react-icons/fa6";

import Button from "../ui/Button";

const OTP_LENGTH = 6;

const OtpVerification = ({
  title = "Enter OTP",
  description = "Enter the 6-digit code sent to your email.",
  onSubmit,
  onResend,
  error,
  isSubmitting = false,
  isResending = false,
  initialTime,
  linkNavigate,
  showBackButton = false,
}) => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));

  const [timeLeft, setTimeLeft] = useState(initialTime);

  const [resendTime, setResendTime] = useState(30);

  const [otpError, setOtpError] = useState("");

  const inputRefs = useRef([]);

  // Countdown timer

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    if (resendTime <= 0) return;

    const resendTimer = setInterval(() => {
      setResendTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(resendTimer);
  }, [resendTime]);

  // Format timer in min and sec
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  // OTP change
  const handleChange = (value, index) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      setOtpError("Only number are allowed.");
      return;
    }

    setOtpError("");

    const digit = value.slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;

    setOtp(newOtp);

    // Move to next input
    if (digit && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Automatically submit when complete
    if (digit && index === OTP_LENGTH - 1 && newOtp.every((value) => value !== "")) {
      onSubmit?.(newOtp.join(""));
    }
  };

  // Backspace
  const handleKeyDown = (event, index) => {
    if (event.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";

        setOtp(newOtp);
        return;
      }

      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }

    // Arrow navigation
    if (event.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (event.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Paste OTP
  const handlePaste = (event) => {
    event.preventDefault();

    const pastedData = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);

    if (!pastedData) return;

    const newOtp = Array(OTP_LENGTH).fill("");

    pastedData.split("").forEach((digit, index) => {
      newOtp[index] = digit;
    });

    setOtp(newOtp);

    const nextIndex = Math.min(pastedData.length, OTP_LENGTH - 1);

    inputRefs.current[nextIndex]?.focus();

    // Submit if complete
    if (pastedData.length === OTP_LENGTH) {
      onSubmit?.(pastedData);
    }
  };

  // Resend OTP

  const handleResend = async () => {
    if (resendTime > 0 || isResending) return;

    const success = await onResend?.();

    if (success !== false) {
      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeLeft(initialTime);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="w-full">
      {/* Icon */}
      <div className="mb-4 flex justify-center">
        <div className="bg-primary/10 flex h-14 w-14 items-center justify-center rounded-full">
          <MdOutlineSecurity size={32} className="text-primary" />
        </div>
      </div>
      {/* Title */}
      <h1 className="text-primary font-heading text-center text-4xl font-bold">{title}</h1>
      {/* Description */}
      <h2 className="text-text-secondary mt-1 text-center">{description}</h2>

      {/* OTP Inputs */}
      <div className="mt-6 flex justify-center gap-2 sm:gap-3">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(element) => {
              inputRefs.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digit}
            disabled={isSubmitting}
            onChange={(event) => handleChange(event.target.value, index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            onPaste={handlePaste}
            className="border-border bg-background text-text-primary focus:border-primary focus:ring-primary/20 h-12 w-10 rounded-lg border text-center text-lg font-semibold transition outline-none focus:ring-2 sm:h-14 sm:w-12 dark:bg-[#1b2431]"
          />
        ))}
      </div>

      {/* Resend */}
      <div className="smflex-row mt-5 flex flex-col items-center justify-center gap-1 text-sm">
        <span className="text-text-secondary">Didn't receive the code with in given time?</span>

        <button
          type="button"
          disabled={isResending || resendTime > 0}
          onClick={handleResend}
          className="text-primary cursor-pointer font-semibold transition hover:underline disabled:cursor-not-allowed disabled:opacity-30"
        >
          {isResending ? (
            "Sending..."
          ) : resendTime > 0 ? (
            <span>
              Resend OTP <span className="text-danger text-sm">after {resendTime}s</span>
            </span>
          ) : (
            "Resend OTP"
          )}
        </button>
      </div>

      {/* error */}
      {(otpError || error) && (
        <p className="text-danger py-1 text-center text-sm">{otpError || error}</p>
      )}

      {/* Timer */}
      <div className="bg-primary/10 mt-3 flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm">
        <MdTimer size={20} className="text-primary" />

        <span className="text-text-primary">Code expires in</span>

        <span className="text-primary font-semibold">{formatTime(timeLeft)}</span>
      </div>

      {/* Back Page Button */}
      {linkNavigate && (
        <Link className="mt-3 block" to={linkNavigate} replace>
          <Button
            className="bg-primary/80 hover:bg-primary-hover flex w-full cursor-pointer items-center justify-center gap-2 text-white/80"
            text={
              <>
                <FaPencil />
                Misspelled
              </>
            }
            disabled={isResending || isSubmitting}
          />
        </Link>
      )}

      {showBackButton && (
        <Button
          type="button"
          onClick={() => {
            localStorage.removeItem("blogId");
            navigate(-1);
          }}
          className="bg-primary/60 hover:bg-primary-hover mt-3 flex w-full cursor-pointer items-center justify-center gap-2 text-white/80"
          text="Cancel"
          disabled={isResending || isSubmitting}
        />
      )}
    </div>
  );
};

export default OtpVerification;
