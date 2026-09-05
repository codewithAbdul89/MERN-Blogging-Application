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

  return (
    <img
      {...props}
      src={src}
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
