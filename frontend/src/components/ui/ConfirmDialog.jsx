// import { useRef } from "react";
// import { createPortal } from "react-dom";

// import useOutsideClick from "../../hooks/useOutsideClick";

// const ConfirmDialog = ({
//   isOpen: isConfirmDialogOpen,
//   onClose: onCloseConfirmDialog,
//   heading,
//   message,
//   btnText,
//   onBtnClick,
// }) => {
//   const confirmRef = useRef();

//   useOutsideClick(confirmRef, onCloseConfirmDialog);

//   if (!isConfirmDialogOpen) {
//     return null;
//   }

//   return createPortal(
//     <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 px-4">
//       <div
//         ref={confirmRef}
//         className="relative w-full max-w-md rounded-xl bg-surface p-5 shadow-2xl sm:p-6"
//       >
//         {/* Close Button */}
//         <button
//           type="button"
//           onClick={onCloseConfirmDialog}
//           className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full text-3xl text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
//           aria-label="Close modal"
//         >
//           ×
//         </button>

//         {/* Heading */}
//         <h2 className="pr-8 font-heading text-lg font-semibold text-text-primary sm:text-xl">
//           {heading}
//         </h2>

//         {/* Message */}
//         <p className="mt-3 text-base leading-relaxed text-text-secondary">
//           {message}
//         </p>

//         {/* Buttons */}
//         <div className="mt-6 flex gap-3 sm:flex-row sm:justify-end">
//           <button
//             type="button"
//             onClick={onBtnClick}
//             className="w-full cursor-pointer rounded-lg bg-danger px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-80 sm:w-auto"
//           >
//             {btnText}
//           </button>

//           <button
//             type="button"
//             onClick={onCloseConfirmDialog}
//             className="w-full cursor-pointer rounded-lg bg-gray-700 shadow px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 sm:w-auto"
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>,
//     document.body,
//   );
// };

// export default ConfirmDialog;

import { useRef } from "react";
import { createPortal } from "react-dom";

import useOutsideClick from "../../hooks/useOutsideClick";

const ConfirmDialog = ({
  isOpen: isConfirmDialogOpen,
  onClose: onCloseConfirmDialog,
  heading,
  message,
  btnText,
  onBtnClick,
  usePortal = false,
  isPending = false,
}) => {
  const confirmRef = useRef(null);

  useOutsideClick(confirmRef, onCloseConfirmDialog);

  if (!isConfirmDialogOpen) {
    return null;
  }

  const dialog = (
    <div
      className="
        fixed inset-0 z-9999
        flex items-center justify-center
        bg-black/50 px-4
      "
    >
      <div
        ref={confirmRef}
        role="dialog"
        aria-modal="true"
        className="
          relative w-full max-w-md
          rounded-xl bg-surface
          p-5 shadow-2xl
          sm:p-6
        "
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onCloseConfirmDialog}
          disabled={isPending}
          className="
            absolute right-3 top-3
            flex h-8 w-8
            items-center justify-center
            rounded-full
            text-3xl text-gray-500
            transition
            hover:bg-gray-100
            hover:text-gray-800
            disabled:cursor-not-allowed
            disabled:opacity-50
          "
          aria-label="Close dialog"
        >
          ×
        </button>

        {/* Heading */}
        <h2
          className="
            pr-8
            font-heading
            text-lg font-semibold
            text-text-primary
            sm:text-xl
          "
        >
          {heading}
        </h2>

        {/* Message */}
        <p
          className="
            mt-3
            text-base
            leading-relaxed
            text-text-secondary
          "
        >
          {message}
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-3 sm:justify-end">
          {/* Confirm */}
          <button
            type="button"
            onClick={onBtnClick}
            disabled={isPending}
            className="
              w-full
              cursor-pointer
              rounded-lg
              bg-danger
              px-4 py-2.5
              text-sm font-medium
              text-white
              transition
              hover:opacity-80
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
          >
            {isPending ? "Processing..." : btnText}
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={onCloseConfirmDialog}
            disabled={isPending}
            className="
              w-full
              cursor-pointer
              rounded-lg
              bg-gray-700
              px-4 py-2.5
              text-sm font-medium
              text-white
              shadow
              transition
              hover:bg-gray-800
              disabled:cursor-not-allowed
              disabled:opacity-50
              sm:w-auto
            "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return usePortal ? createPortal(dialog, document.body) : dialog;
};

export default ConfirmDialog;
