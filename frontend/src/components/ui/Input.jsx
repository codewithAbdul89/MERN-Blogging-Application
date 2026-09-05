import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

const Input = ({
  className = "",
  label,
  ref,
  error,
  id,
  labelClassName = "",
  type: inputType = "text",
  passwordIcon = false,
  ...props
}) => {
  const [type, setType] = useState(inputType);

  return (
    <div className="relative">
      {label && (
        <label
          htmlFor={id}
          className={`text-text-secondary font-medium block my-2 px-1 ${labelClassName}`}
        >
          {label}
        </label>
      )}

      <input
        {...props}
        type={type}
        id={id}
        ref={ref}
        className={twMerge(
          `w-full rounded-lg border border-border bg-surface
   px-4 py-2.5 text-text-primary
   placeholder:text-text-placeholder
   outline-none
   focus:border-primary
   focus:ring-2
   focus:ring-primary/20
   disabled:cursor-not-allowed
   disabled:opacity-80 `,
          className,
        )}
      />

      {passwordIcon && (
        <button
          type="button"
         className={`text-primary/50 absolute right-2 ${error?"top-[47%]":"top-[65%]"}  -translate-y-1/2 cursor-pointer`}
          onClick={() =>
            setType((prevType) =>
              prevType === "password" ? "text" : "password",
            )
          }
        >
          {type === "text" ? <FaEyeSlash size={20}/> : <FaEye size={20} />}
        </button>
      )}

      {error && <p className="text-sm text-danger p-1.5 px-2">{error}</p>}
    </div>
  );
};

export default Input;
