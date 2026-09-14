function Tooltip({ text, children, disabled = false }) {
  return (
    <div className="group relative inline-flex">
      {children}

      {!disabled && (
        <span
          className="
            pointer-events-none
            absolute
            left-1/2
            top-full
            z-50
            mt-2
            -translate-x-1/2
            whitespace-nowrap
            rounded-lg
            bg-surface
            px-3
            py-1.5
            text-sm
            font-medium
            text-text-primary
            opacity-0
            shadow-lg
            transition-opacity
            duration-200
            group-hover:opacity-100
          "
        >
          {text}
        </span>
      )}
    </div>
  );
}

export default Tooltip;
