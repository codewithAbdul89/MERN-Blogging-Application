import "../../index.css";


export const ButtonLoader = ({ text = "Loading" }) => {
    return (
        <span>
            {text}
            <span className="inline-block w-6 text-left">
                <span className="animate-dots" />
            </span>
        </span>
    );
};

export default ButtonLoader;

{/* <Button
    type="submit"
    disabled={isPending}
>
    {isPending ? (
        <ButtonLoader text="Creating" />
    ) : (
        "Create Blog"
    )}
</Button> */}