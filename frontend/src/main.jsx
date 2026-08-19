import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { QueryClientProvider } from "@tanstack/react-query"


import './index.css';
import App from './App.jsx';
import { store } from './app/store.js';
import { setAxiosContext } from './api/axiosContext.js';
import { ThemeProvider } from './context/ThemeContext.jsx';
import ThemeToggle from './components/ui/ThemeToggle.jsx';
import queryClient from './api/queryClient.js';


setAxiosContext({
    
    getAccessToken: () => store.getState().auth.accessToken,
});



createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <QueryClientProvider client={queryClient}>
            <ThemeProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </ThemeProvider>
        </QueryClientProvider>
    </Provider>
);
