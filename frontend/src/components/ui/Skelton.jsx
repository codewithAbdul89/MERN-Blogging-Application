const Skeleton = ({ className = "", ...props }) => {
  return (
    <div
      className={`
                animate-pulse
                [animation-duration:5s] 
                rounded-md
                bg-gray-200
                ${className}
            `}
      {...props}
    />
  );
};

export default Skeleton;
