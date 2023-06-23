import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { ChakraBaseProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ChakraBaseProvider>
        <App />
      </ChakraBaseProvider>
    </BrowserRouter>
  </React.StrictMode>
);
