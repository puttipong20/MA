import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import "./main.css";
import myTheme from "./theme.tsx";
import LayoutContextProvider from "./Context/LayoutContext.tsx";
import AuthContextProvider from "./Context/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ChakraProvider theme={myTheme}>
    <BrowserRouter>
      <AuthContextProvider>
        <LayoutContextProvider>
          <App />
        </LayoutContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </ChakraProvider>
);
