import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import "./main.css";
import myTheme from "./theme.tsx";
import AuthContextProvider from "./context/AuthContext.tsx";
import CompanyContextProvider from "./context/CompanyContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ChakraProvider theme={myTheme}>
    <BrowserRouter>
      <AuthContextProvider>
        <CompanyContextProvider>
          <App />
        </CompanyContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </ChakraProvider>
);
