const Avatar = ({
  src,
  alt = "User avatar",
  userName = "",
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

  const initials = userName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (src === "") {
    return (
      <div
        {...props}
        aria-label={alt}
        className={`bg-primary/10 text-primary flex items-center justify-center ${
          sizes[size] || sizes.md
        } rounded-full font-semibold ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      {...props}
      src={src}
      loading="eager"
      className={`${sizes[size] || sizes.md} rounded-full object-cover ${className}`}
    />
  );
};

export default Avatar;
