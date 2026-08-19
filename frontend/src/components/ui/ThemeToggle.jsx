import { useTheme } from "../../hooks/useTheme.js";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
    const { currentTheme, toggleTheme } = useTheme();

    return (
        <button onClick={toggleTheme} className={`text-3xl hover:cursor-pointer  ${currentTheme === "dark" ? "text-primary" : ""}`}>
            {currentTheme === "dark" ? <FiSun /> : <FiMoon />}
        </button>
    );
};

export default ThemeToggle;