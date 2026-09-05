import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import ButtonLoader from "../../components/ui/ButtonLoader";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useLogout } from "../../features/auth/authMutations";
import { useModal } from "../../hooks/useModal";
import { CiLogout } from "react-icons/ci";

function Logout({ className = "" }) {
  const { mutateAsync: logout, isPending } = useLogout();

  const { isOpen, openModal, closeModal } = useModal();

  const navigate = useNavigate();

  return (
    <>
      <Button
        className={` px-3 py-1 text-left font-normal flex  items-center gap-2  hover:text-primary ${className} `}
        text={
          isPending ? (
            <ButtonLoader text="Logging Out" />
          ) : (
            <>
              <CiLogout />
              <span>LogOut</span>
            </>
          )
        }
        onClick={(e) => {
          e.stopPropagation();
          openModal();
        }}
      />
      <ConfirmDialog
        isOpen={isOpen}
        onClose={closeModal}
        heading="LogOut"
        message="Are you sure you want to logout?"
        btnText="Logout"
        btnClassName="bg-danger text-white"
        onBtnClick={async () => {
          try {
            await logout();
            navigate("/");
            closeModal();
          } catch (error) {
            console.error("Logout error:", error);
          }
        }}
      />
    </>
  );
}

export default Logout;
