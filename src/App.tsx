import { Box, Container } from "@chakra-ui/react"
import { FC } from "react"
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import CompanyPage from "./pages/Company/PageCompany"
import ViewCompany from "./pages/Company/ViewCompany"

const App: FC = () => {
  return (
    <Box w="100%" maxH="100vh">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/companypage" element={<CompanyPage />} />
        <Route path="/companypage/:id" element={<ViewCompany />} />
      </Routes>
    </Box>
  );
}

export default App