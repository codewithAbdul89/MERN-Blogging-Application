import { useSelector } from "react-redux";
import Button from "../components/ui/Button";
import { useLogout } from "../features/auth/authMutations";
function Home() {
  const auth = useSelector((state) => state.auth);
  const { mutateAsync: logout, isPending } = useLogout();
  return (
    <>
      <div className="bg-background text-primary min-h-screen w-full">
        My name is {auth.user?.userName}
        <Button text={isPending?"Logging out ...":"LogOut"} onClick={logout} />
      </div>
    </>
  );
}

export default Home;
