import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes.jsx";
import AuthInitializer from "./features/auth/AuthInitializer.jsx";

function App() {
  return (
    <AuthInitializer>
      <AppRoutes />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </AuthInitializer>
  );
}

export default App;
