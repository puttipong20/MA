import { Box, Spinner, Text } from "@chakra-ui/react";
import { Route, Routes, useNavigate } from "react-router-dom";
// import FormAddReport from "./pages/FormAddReport";
// import DetailForDev from "./pages/DetailForDev";
// import Preview from "./pages/Preview";
// import DetailForUser from "./pages/DetailForUser";
import Login from "./pages/pae/Login";
// import Register from "./pages/pae/Register";

import Home from "./pages/Home";
import Project from "./pages/kim/Project";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import AuthCheck from "./components/AuthCheck";
import ProjectPreviewComp from "./components/kim/ProjectPreviewComp";
import ProblemPreview from "./pages/kim/ProblemPreview";
import AddReport from "./pages/kim/AddReport";
import DetailPage from "./pages/kim/DetailPage";
import DetailForDev from "./pages/kim/DetailForDev";
import PageCompany from "./pages/Company/PageCompany";
import ContractPreview from "./components/Contracts/ContractPreview";
import ContractUpdate from "./components/ContractUpdate";

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
          <Route path="/home" element={<Home />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <Project>
                <PageCompany />
              </Project>
            }
          />
          <Route
            path="/company/:company"
            element={
              <Project>
                <ProjectPreviewComp />
              </Project>
            }
          />
          <Route
            path="/company/:company/:projectID/:projectName/detail"
            element={
              <Project>
                <DetailPage />
              </Project>
            }
          />
          <Route
            path="/company/:company/:projectID/:projectName/detail/ContractRecord"
            element={
              <Project>
                <ContractPreview />
              </Project>
            }
          />
          <Route
            path="/company/:company/:projectID/:projectName/problemReport"
            element={
              <Project>
                <ProblemPreview />
              </Project>
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
