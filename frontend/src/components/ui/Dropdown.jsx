import { useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";
import useOutsideClick from "../../hooks/useOutsideClick.js";

const Dropdown = ({ trigger, children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => {
    setIsOpen(false);
  });

  const handleToggle = () => {
    setIsOpen((previous) => !previous);
  };

  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger */}

      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex justify-center items-center  cursor-pointer"
      >
        {trigger}

        <FiChevronDown
          className={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""} `}
        />
      </button>

      {/* Dropdown Menu */}

      {isOpen && (
        <div
          className=" absolute right-0 z-50 mt-2 min-w-38 max-w-38"
          role="menu"
          onClick={() => setIsOpen(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
