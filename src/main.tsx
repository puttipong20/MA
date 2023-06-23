import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import "./main.css";
import myTheme from "./theme.tsx";
import AuthContextProvider from "./context/AuthContext.tsx";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ChakraProvider theme={myTheme}>
    <BrowserRouter>
      <AuthContextProvider>
          <App />
      </AuthContextProvider>
    </BrowserRouter>
  </ChakraProvider>
);
