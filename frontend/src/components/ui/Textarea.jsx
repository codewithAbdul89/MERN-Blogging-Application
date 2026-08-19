const Textarea = ({
    ref,
    label,
    error,
    id,
    className = "",
    ...props
}) => {
    return (
        <div className="flex flex-col gap-1">

            {label && (
                <label htmlFor={id}>
                    {label}
                </label>
            )}

            <textarea
                ref={ref}
                id={id}
                className={`w-full rounded-lg border px-3 py-2 ${className}`}
                {...props}
            />

            {error && (
                <p className="text-sm text-red-500">
                    {error}
                </p>
            )}

        </div>
    );
};

export default Textarea;