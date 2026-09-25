function Select({
  options = [],
  placeholder = "Select an option",
  error,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      <select
        className={`
          h-12
          w-full
          rounded-lg
          border
          bg-background
          px-4
          text-text-primary
          outline-none
          transition

          focus:border-primary
          focus:ring-2
          focus:ring-primary/20

          disabled:cursor-not-allowed
          disabled:opacity-60

          ${
            error
              ? "border-danger"
              : "border-border"
          }

          ${className}
        `}
        {...props}
      >
        <option value="">
          {placeholder}
        </option>

        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>

      {error && (
        <p className="mt-1 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export default Select;