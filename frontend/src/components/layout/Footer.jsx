import { Link } from "react-router-dom";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import Logo from "../ui/logo";
import Logout from "../../pages/auth/Logout";
import { useSelector } from "react-redux";

function Footer() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-7xl px-4 py-4 md:py-10">
        {/* Main Footer */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo */}
          <div>
            <Link to="/" className="text-2xl font-bold text-text-primary">
              <Logo
                className="h-24 w-45 rounded-lg p-1 sm:h-20"
                loading="eager"
              />
            </Link>

            <p className="mt-3 max-w-sm text-sm leading-6 text-text-secondary">
              Share your thoughts, discover new ideas, and connect with a
              community of writers and readers.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-text-primary">Quick Links</h3>
            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/"
                className="text-sm text-text-secondary transition hover:text-primary"
              >
                Home
              </Link>

              <Link
                to="/category"
                className="text-sm text-text-secondary transition hover:text-primary"
              >
                Categories
              </Link>

              <Link
                to="/search"
                className="text-sm text-text-secondary transition hover:text-primary"
              >
                Search
              </Link>

              <Link
                to="/contact"
                className="text-sm text-text-secondary transition hover:text-primary"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold text-text-primary">Account</h3>

            <div className="mt-4 flex flex-col gap-3">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="text-sm text-text-secondary transition hover:text-primary"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    className="text-sm text-text-secondary transition hover:text-primary"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <Logout className="p-0 text-sm text-text-secondary transition hover:text-primary " />
              )}
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="font-semibold text-text-primary">Follow Us</h3>

            <div className="mt-4 flex items-center gap-4">
              <a
                href="https://github.com/codewithAbdul89/MERN-Blogging-Application"
                aria-label="GitHub"
                target="blank"
                className="text-text-secondary transition hover:text-primary"
              >
                <FaGithub size={20} />
              </a>

              <a
                href="https://www.linkedin.com/in/abdul-rehman-826136353/"
                aria-label="LinkedIn"
                target="blank"
                className="text-text-secondary transition hover:text-primary"
              >
                <FaLinkedin size={20} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Abdul's BlogSpace. All rights reserved.
          </p>

          <div className="flex gap-5">
            <Link to="/" className="transition hover:text-primary">
              Privacy
            </Link>

            <Link to="/" className="transition hover:text-primary">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
