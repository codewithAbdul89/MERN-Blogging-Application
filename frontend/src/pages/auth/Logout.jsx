import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { useLogout } from "../../features/auth/authMutations";
import { useModal } from "../../hooks/useModal";
import { CiLogout } from "react-icons/ci";

function Logout({ className = "" }) {
  const { mutateAsync: logout, isPending } = useLogout();

  const { isOpen, openModal, closeModal } = useModal();

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();

      closeModal();
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <>
      <Button
        className={`flex items-center gap-2 px-3 py-1 text-left font-normal hover:opacity-50 ${className}`}
        text={
          <>
            <CiLogout />
            <span>{isPending ? "Logging Out..." : "LogOut"}</span>
          </>
        }
        disabled={isPending}
        onClick={(event) => {
          event.stopPropagation();
          openModal();
        }}
      />

      <ConfirmDialog
        isOpen={isOpen}
        onClose={closeModal}
        heading="LogOut"
        message="Are you sure you want to logout?"
        btnText="Logout"
        isPending={isPending}
        onBtnClick={handleLogout}
      />
    </>
  );
}

export default Logout;
