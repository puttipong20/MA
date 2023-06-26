import {
  Box, Spinner, Text,
} from "@chakra-ui/react";
import { Route, Routes, useNavigate } from "react-router-dom";
// import FormAddReport from "./pages/FormAddReport";
// import DetailForDev from "./pages/DetailForDev";
// import Preview from "./pages/Preview";
// import DetailForUser from "./pages/DetailForUser";
import Login from "./pages/pae/Login"
import Register from "./pages/pae/Register"

import Home from "./pages/Home";
import Project from "./pages/kim/Project";

import { useContext, useEffect, useState } from "react";
import { AuthContext } from "./context/AuthContext";
import AuthCheck from "./components/AuthCheck";
import TempCompPreview from "./pages/kim/TempCompPreview";
import ProjectPreviewComp from "./components/kim/ProjectPreviewComp";
import ProblemPreview from "./pages/kim/ProblemPreview";
import AddReport from "./pages/kim/AddReport";
import DetailPage from "./pages/kim/DetailPage";

function App() {
  const navigate = useNavigate();
  const Auth = useContext(AuthContext)
  const [isLoading, setIsLoading] = useState(false);

  const initial = async () => {
    setIsLoading(true)
    if (!Auth.uid) {
      await AuthCheck(Auth, navigate);
    }
    setIsLoading(false)
  }

  useEffect(() => {
    initial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) {
    <Box>
      <Text>Authen Checking</Text>
      <Spinner />
    </Box>
  } else {
    return (
      <Box w="100%" maxH="100vh">

        <Routes>
          {/* <Route path="/precompany" element={<PreCompany />} /> */}
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/preview/:id" element={<Preview />} /> */}
          <Route path="/login" element={<Login />} />
          {/* <Route path="/dev/:type/:id" element={<DetailForDev />} /> */}
          {/* <Route path="/detail/:id" element={<DetailForUser />} /> */}
          {/* <Route path="/Add/:id" element={<FormAddReport />} /> */}

          <Route path="/company" element={<Project />} />
          <Route path="/company/:company" element={<Project><ProjectPreviewComp /></Project>} />
          <Route path="/company/:company/:projectID/detail" element={<Project><DetailPage /></Project>} />
          {/* <Route path="/company/:company/:project/detail" element={<Project></Project>} /> */}
          <Route path="/company/:company/:projectID/:projectName/problemReport" element={<Project><ProblemPreview /></Project>} />
          <Route path="/company/:company/:projectID/:projectName/addReport" element={<AddReport />} />
          <Route path="/tempCompany" element={<TempCompPreview />} />
        </Routes>

        {/* <LogoutBtn /> */}
      </Box>
    )
  }
}

export default App;
