import { useEffect } from "react";

export const useOutsideClick = (ref, callback) => {

    useEffect(() => {

        const handleClick = (event) => {

            if (
                ref.current &&
                !ref.current.contains(event.target)
            ) {
                callback();
            }

        };

        document.addEventListener("mousedown", handleClick);

        return () => {
            document.removeEventListener("mousedown", handleClick);
        };

    }, [ref, callback]);

};

export default useOutsideClick;



// const {
//     isOpen,
//     openModal,
//     closeModal
// } = useModal();

// const dropdownRef = useRef(null);

// useOutsideClick(dropdownRef, closeModal);

// return (
//     <>
//         <button onClick={openModal}>
//             Profile
//         </button>

//         {isOpen && (
//             <div ref={dropdownRef}>
//                 <p>Profile</p>
//                 <p>Settings</p>
//                 <p>Logout</p>
//             </div>
//         )}
//     </>
// );