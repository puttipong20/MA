import { Box, Spinner, Text } from "@chakra-ui/react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./Pages/Login/Login";

import Layout from "./Layout/Layout";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import AuthCheck from "../src/Common/AuthCheck";
import ProjectPreviewComp from "./Pages/Projects/ProjectPreview";
import ProblemPreview from "./Pages/Report/ReportPreview";
import AddReport from "./Components/Report/AddReport";
import DetailPage from "./Pages/Projects/ProjectDetail";
import DetailForDev from "./Pages/DetailForDev/DetailForDev";
import PageCompany from "./Pages/Company/Companies";
import ContractPreview from "./Pages/Contract/ContractPreview";
import ContractUpdate from "./Common/ContractUpdate";

function App() {
  const navigate = useNavigate();
  const Auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const initial = async () => {
    setIsLoading(true);
    if (Auth.uid === "") {
      await AuthCheck(Auth, navigate);
      setIsLoading(false);
    } else {
      await ContractUpdate();
    }
    setIsLoading(false);
  };

  useEffect(() => {
    initial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <Box
        w="100vw"
        h="100vh"
        display="flex"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Text>Authen Checking . . .</Text>
        <Spinner />
      </Box>
    )
  } else {
    return (
      <Box w="100%" maxH="100vh" position={"relative"}>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <Layout>
                <PageCompany />
              </Layout>
            }
          />
          <Route
            path="/company/:company"
            element={
              <Layout>
                <ProjectPreviewComp />
              </Layout>
            }
          />
          <Route
            path="/company/:company/:projectID/:projectName/detail"
            element={
              <Layout>
                <DetailPage />
              </Layout>
            }
          />
          <Route
            path="/company/:company/:projectID/:projectName/detail/ContractRecord"
            element={
              <Layout>
                <ContractPreview />
              </Layout>
            }
          />
          <Route
            path="/company/:company/:projectID/:projectName/problemReport"
            element={
              <Layout>
                <ProblemPreview />
              </Layout>
            }
          />
          <Route
            path="/company/:company/:projectID/:projectName/addReport"
            element={<AddReport />}
          />
          <Route
            path="/company/:company/:projectID/:projectName/:problemID"
            element={<DetailForDev />}
          />
        </Routes>
      </Box>
    );
  }
}

export default App;
