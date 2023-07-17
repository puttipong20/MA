import { Box, Spinner, Text } from "@chakra-ui/react";
import { Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login";

import Layout from "./Layout/Layout";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import AuthCheck from "../src/Common/AuthCheck";
import ProjectPreviewComp from "./pages/Projects/ProjectPreview";
import ProblemPreview from "./pages/Report/ReportPreview";
import AddReport from "./components/Report/AddReport";
import DetailPage from "./pages/Projects/ProjectDetail";
import DetailForDev from "./pages/DetailForDev/DetailForDev";
import PageCompany from "./pages/Company/Companies";
import ContractPreview from "./pages/Contract/ContractPreview";
import ContractUpdate from "./Common/ContractUpdate";
import QuickSearch from "./components/asset/QuickSearch";

function App() {
  const navigate = useNavigate();
  const Auth = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(true);

  const initial = async () => {
    setIsLoading(true);
    if (Auth.uid === "") {
      await AuthCheck(Auth, navigate);
      setIsLoading(false);
    }
    // else {
    //   await ContractUpdate();
    // }
    setIsLoading(false);
  };

  useEffect(() => {
    if (Auth.uid !== "") {
      ContractUpdate();
    }
  }, [Auth.uid])

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
    );
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

        <Box position="absolute" bottom="0.75rem" right="1rem">
          <QuickSearch />
        </Box>
      </Box>
    );
  }
}

export default App;
