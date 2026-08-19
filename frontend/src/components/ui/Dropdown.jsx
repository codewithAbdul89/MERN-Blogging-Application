import { useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import useOutsideClick from "../../hooks/useOutsideClick.js";

const Dropdown = ({
    trigger,
    children,
    className = ""
}) => {

    const [isOpen, setIsOpen] = useState(false);

    const dropdownRef = useRef(null);

    useOutsideClick(dropdownRef, () => {
        setIsOpen(false);
    });

    const handleToggle = () => {
        setIsOpen((previous) => !previous);
    };

    return (
        <div
            ref={dropdownRef}
            className={`relative ${className}`}
        >

            {/* Trigger */}

            <button
                type="button"
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-haspopup="menu"
            >
                {trigger}

                <FiChevronDown
                    className={`
                        transition-transform
                        duration-500
                        ${isOpen ? "rotate-180" : ""}
                    `}
                />
            </button>


            {/* Dropdown Menu */}

            {isOpen && (
                <div
                    className=" absolute right-0 z-50 mt-2 min-w-48 rounded-lg border border-gray-200 bg-white p-1 shadow-lg"
                    role="menu"
                >
                    {children}
                </div>
            )}

        </div>
    );
};

export default Dropdown;



    // <Dropdown
    //     trigger={
    //       <div className="flex items-center gap-2">
    //         <Avatar
    //           src={"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuCzH4gszXLFCimlXsxi8jsz9iCL3BnQqCibHjJ4T3rw&s"}
    //           size="sm"
    //         />

    //         <span>
    //           Abdul Rehman
    //         </span>
    //       </div>
    //     }
    //   >
    //     <button className="block w-full px-3 py-2 text-left">
    //       Profile
    //     </button>

    //     <button className="block w-full px-3 py-2 text-left">
    //       Settings
    //     </button>

    //     <button className="block w-full px-3 py-2 text-left">
    //       Logout
    //     </button>
    //   </Dropdown>