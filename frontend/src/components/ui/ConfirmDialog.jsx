import { useRef } from "react";
import useOutsideClick from "../../hooks/useOutsideClick";

const ConfirmDialog = ({
  isOpen: isConfirmDialogOpen,
  onClose: onCloseConfirmDialog,
  heading,
  message,
  btnText,
  btnClassName,
  onBtnClick,
}) => {
  const confirmRef = useRef();

  useOutsideClick(confirmRef, onCloseConfirmDialog);

  if (!isConfirmDialogOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        ref={confirmRef}
        className="relative w-full max-w-md rounded-xl bg-white p-5 shadow-xl sm:p-6"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCloseConfirmDialog}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-3xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Heading */}
        <h2 className="pr-8 text-lg font-semibold font-heading text-gray-900 sm:text-xl">
          {heading}
        </h2>

        {/* Message */}
        <p className="mt-3 text-lg leading-relaxed text-gray-600 sm:text-base">
          {message}
        </p>

        {/* Buttons */}
        <div className="mt-6 flex  gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onBtnClick}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium  transition hover:opacity-80 cursor-pointer bg-danger text-white sm:w-auto"
          >
            {btnText}
          </button>

          <button
            type="button"
            onClick={onCloseConfirmDialog}
            className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 cursor-pointer sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;