import { useRef, useState } from "react";
import { FiChevronDown } from "react-icons/fi";

import useOutsideClick from "../../hooks/useOutsideClick.js";

import Tooltip from "../ui/Tooltip.jsx";

const Dropdown = ({ trigger, children, icon: Icon, tooltip, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const dropdownRef = useRef(null);

  useOutsideClick(dropdownRef, () => {
    setIsOpen(false);
  });

  const handleToggle = () => {
    setIsOpen((previous) => !previous);
  };

  return (
    <div ref={dropdownRef} className="relative">
      <Tooltip text={tooltip} disabled={!tooltip || isOpen}>
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={isOpen}
          aria-haspopup="menu"
          className={`flex cursor-pointer items-center justify-center rounded-full ${className}`}
        >
          {trigger}

          {Icon ? (
            <Icon className={`transition-transform duration-500 ${isOpen ? "rotate-90" : ""}`} />
          ) : (
            <FiChevronDown
              className={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
            />
          )}
        </button>
      </Tooltip>

      {isOpen && (
        <div
          className="absolute right-0 z-50 mt-2 max-w-38"
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
