import { useSelector } from "react-redux";
import Button from "../components/ui/Button";
import { Link } from "react-router-dom";
function Home() {
  const auth = useSelector((state) => state.auth);
  return (
    <>
      <div className="bg-background text-primary  w-full">
        My name is {auth.user?.userName}.
      </div>
    </>
  );
}

export default Home;
