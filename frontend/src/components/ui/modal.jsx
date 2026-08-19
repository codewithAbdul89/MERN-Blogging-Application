const Modal = ({
    isOpen,
    onClose,
    children
}) => {

    if (!isOpen) {
        return null;
    }

    return (
        <div>
            {children}
        </div>
    );
};

export default Modal;



{/* <Modal
    isOpen={isOpen}
    onClose={closeModal}
>
    <h2>Edit Profile</h2>
    <p>My modal content</p>
</Modal> */}