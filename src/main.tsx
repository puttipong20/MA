import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import "./main.css";
import myTheme from "./theme.tsx";
import AuthContextProvider from "./context/AuthContext.tsx";
import CompanyContextProvider from "./context/CompanyContext.tsx";
import MAcontextProvider from "./context/MAContext.tsx";
import { QueryClient, QueryClientProvider } from "react-query"
import DataContextProvider from "./context/DataContext.tsx";

const queryClient = new QueryClient()
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ChakraProvider theme={myTheme}>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DataContextProvider>
          <AuthContextProvider>
            <MAcontextProvider>
              <CompanyContextProvider>
                <App />
              </CompanyContextProvider>
            </MAcontextProvider>
          </AuthContextProvider>
        </DataContextProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ChakraProvider>
);
