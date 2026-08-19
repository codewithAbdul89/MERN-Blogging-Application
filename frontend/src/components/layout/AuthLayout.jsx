import Logo from "../ui/logo.jsx";
import ThemeToggle from "../ui/ThemeToggle.jsx";

const AuthLayout = ({ children }) => {
    return (
        <div>
            <main className="min-h-screen bg-background">

                <nav className="bg-primary-light  flex justify-between items-center px-6 sm:px-14  duration-200 transition-all ">

                    <div>
                        <Logo className=" h-20 rounded-lg p-1 sm:h-18" />
                    </div>

                    <div>
                        <ThemeToggle />
                    </div>

                </nav>

                {children}
            </main>
        </div>
    );
};

export default AuthLayout;