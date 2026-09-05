import LoginForm from "../../components/forms/LoginForm.jsx";

function Login() {
  return (
    <section className="flex min-h-[calc(100vh-180px)]  w-full items-center justify-center">
      <main className="w-[98%] rounded-3xl bg-background px-2.5 py-3.5  dark:border border-border/50 sm:max-w-lg sm:p-4">
        <LoginForm />
      </main>
    </section>
  );
}

export default Login;