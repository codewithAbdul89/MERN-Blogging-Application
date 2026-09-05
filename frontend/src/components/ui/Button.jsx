import { twMerge } from "tailwind-merge";
const Button = ({
  ref,
  text,
  type = "button",
  disabled = false,
  className = "",
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled}
      className={twMerge(
        `
                rounded-lg
                px-4
                py-2
                font-semibold
                transition-colors
                duration-200
                disabled:cursor-not-allowed
                disabled:opacity-70
                cursor-pointer  
            `,
        className,
      )}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
