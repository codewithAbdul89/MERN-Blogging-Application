import { Toaster } from "react-hot-toast";
import AppRoutes from "./routes/AppRoutes.jsx";
import AuthInitializer from "./features/auth/AuthInitializer.jsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <AuthInitializer>
    {/* <> */}
      <ReactQueryDevtools initialIsOpen={false} />
      <AppRoutes />

      <Toaster
        position="top-right"
        toastOptions={{
          duration: 2000,
        }}
      />
      {/* </> */}
    </AuthInitializer>
  );
}

export default App;
