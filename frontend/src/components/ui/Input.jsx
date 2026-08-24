const Input = ({
    className = "",
    label,
    ref,
    error,
    id,
    labelClassName = "",
    type = "text",
    ...props
}) => {

    return (
        <div>

            {
                label && (<label htmlFor={id} className={`text-text-secondary font-medium block my-2 px-1 ${labelClassName}`}>
                    {label}
                </label>)
            }

            <input
                {...props}
                type={type}
                id={id}
                ref={ref}
                className={`w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-text-primary placeholder:text-text-placeholder  outline-none  focus:border-primary  focus:ring-2  focus:ring-primary/20  ${className}`}
            />

            {
                error && (
                    <p className="text-sm text-danger p-1.5 px-2">
                        {error}
                    </p>
                )
            }
        </div>
    )
}

export default Input;