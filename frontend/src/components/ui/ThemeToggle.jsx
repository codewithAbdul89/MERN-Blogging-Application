import { twMerge } from "tailwind-merge";
import { useTheme } from "../../hooks/useTheme.js";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = ({ className = "", children, onclickfun }) => {
  const { currentTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={() => {
        onclickfun?.();
        toggleTheme();
      }}
      className={twMerge(
        "text-3xl cursor-pointer",
        className,
        currentTheme === "dark" && "text-primary"
      )}
    >
      {children || (currentTheme === "dark" ? <FiSun /> : <FiMoon />)}
    </button>
  );
};

export default ThemeToggle;