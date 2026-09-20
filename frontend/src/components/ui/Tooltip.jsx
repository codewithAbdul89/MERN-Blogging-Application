import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";

function Tooltip({ text, children, disabled = false }) {
  const wrapperRef = useRef(null);

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
  });

  const updatePosition = () => {
    if (!wrapperRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();

    setPosition({
      top: rect.bottom + 8,
      left: rect.left + rect.width / 2,
    });
  };

  const showTooltip = () => {
    if (disabled) return;

    updatePosition();
    setVisible(true);
  };

  const hideTooltip = () => {
    setVisible(false);
  };

  useEffect(() => {
    if (!visible) return;

    const handleScroll = () => {
      updatePosition();
    };

    const handleResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [visible]);

  return (
    <>
      <div
        ref={wrapperRef}
        className="group relative inline-flex"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        {children}
      </div>

      {visible &&
        !disabled &&
        createPortal(
          <span
            className="
              pointer-events-none
              fixed
              z-9999
              -translate-x-1/2
              whitespace-nowrap
              rounded-lg
              bg-surface
              px-3
              py-1.5
              text-sm
              font-medium
              text-text-primary
              shadow-lg
              opacity-100
            "
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {text}
          </span>,
          document.body,
        )}
    </>
  );
}

export default Tooltip;