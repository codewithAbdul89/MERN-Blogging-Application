const Avatar = ({
  src,
  alt = "User avatar",
  size = "md",
  className = "",
  ...props
}) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  };
    const imageSrc = src?.startsWith("/")
    ? `${import.meta.env.VITE_API_BASE_URL.replace("/api", "")}${src}`
    : src;
  

  return (
    <img
      {...props}
     src={imageSrc}
      alt={alt}
      className={`
                ${sizes[size] || sizes.md}
                rounded-full
                object-cover
                ${className}
            `}
    />
  );
};

export default Avatar;
