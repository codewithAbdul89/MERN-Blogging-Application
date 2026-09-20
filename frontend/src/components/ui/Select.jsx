const Select = ({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
  ...props
}) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`
        w-full
        rounded-lg
        border border-border
        bg-background
        px-3 py-2
        text-sm
        text-text-primary
        outline-none
        transition-colors
        focus:border-primary
        ${className}
      `}
      {...props}
    >
      <option value="">{placeholder}</option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;