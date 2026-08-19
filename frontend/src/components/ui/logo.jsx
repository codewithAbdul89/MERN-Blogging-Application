import { useTheme } from "../../hooks/useTheme.js";

const Logo = ({ className = "" }) => {

    // const lightLogo = "https://i.ibb.co/YFVYcf3T/Screenshot-2026-08-14-183432.png";
    // const darkLogo = "https://i.ibb.co/fzM1gGSc/image.png";
    
    const lightLogo = "https://i.ibb.co/Y7mRFFBf/image.png";
    const darkLogo = "https://i.ibb.co/Hp1yRJ01/image.png";

    const { currentTheme } = useTheme();

    return (
        <img
            src={currentTheme === "dark" ? darkLogo : lightLogo}
            alt="Logo"
            className={` ${className}`} />
    )

}

export default Logo;