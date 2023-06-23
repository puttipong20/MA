/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Divider, Heading } from "@chakra-ui/react";
import DevDetailComp from "../Components/DevDetailComp";
// import DetailForUser from "./DetailForUser";
import ProblemRequest from "../component/ProblemRequest";
// import DevEditDetailComp from "../Components/DevEditDetailComp";

function DetailForDev() {
  return (
    <Box pb="10">
      <Box background={"#4C7BF4"} color="white" p="2.5rem">
        <Heading as="h3" fontFamily={"inherit"} textAlign={"center"}>
          แจ้งปัญหาการใช้งานระบบ
        </Heading>
      </Box>

      <Box>
        <Box>
          <ProblemRequest />
        </Box>

        <Divider my="20px" />

        <Box>
          <DevDetailComp />
        </Box>
      </Box>
    </Box>
  );
}

export default DetailForDev;
