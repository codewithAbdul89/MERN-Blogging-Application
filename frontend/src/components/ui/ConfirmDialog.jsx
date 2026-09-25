import { createPortal } from "react-dom";

const ConfirmDialog = ({
  isOpen,
  onClose,
  heading,
  message,
  btnText,
  onBtnClick,
  isPending = false,
}) => {
  if (!isOpen) {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 px-4"
      onMouseDown={(event) => {
        // Close only when clicking the backdrop itself
        if (event.target === event.currentTarget && !isPending) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-heading"
        className="bg-surface relative w-full max-w-md rounded-xl p-5 shadow-2xl sm:p-6"
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          aria-label="Close dialog"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full text-3xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          ×
        </button>

        {/* Heading */}
        <h2
          id="confirm-dialog-heading"
          className="font-heading text-text-primary pr-8 text-lg font-semibold sm:text-xl"
        >
          {heading}
        </h2>

        {/* Message */}
        <p className="text-text-secondary mt-3 text-base leading-relaxed">{message}</p>

        {/* Buttons */}
        <div className="mt-6 flex gap-3 sm:justify-end">
          {/* Confirm */}
          <button
            type="button"
            onClick={onBtnClick}
            disabled={isPending}
            className="bg-danger w-full cursor-pointer rounded-lg px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {isPending ? "Processing..." : btnText}
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="w-full cursor-pointer rounded-lg bg-gray-700 px-4 py-2.5 text-sm font-medium text-white shadow transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
