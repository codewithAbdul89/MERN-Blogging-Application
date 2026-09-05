import { useTheme } from "../../hooks/useTheme.js";

const Logo = ({ className = "", loading = "eager" }) => {
  const lightLogo = "https://i.ibb.co/Y7mRFFBf/image.png";
  const darkLogo = "https://i.ibb.co/Hp1yRJ01/image.png";

  const { currentTheme } = useTheme();

  return (
    <img
      src={currentTheme === "dark" ? darkLogo : lightLogo}
      alt="Logo"
      loading={loading}
      className={` ${className}`}
    />
  );
};

export default Logo;
