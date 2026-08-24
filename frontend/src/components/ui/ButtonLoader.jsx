import "../../index.css";


export const ButtonLoader = ({ text = "Loading" }) => {
    return (
        <span className="flex items-center justify-center">
            {text}
            <span className="inline-block w-6 text-left text-xl">
                <span className="animate-dots" />
            </span>
        </span>
    );
};

export default ButtonLoader;
