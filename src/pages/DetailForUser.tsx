import { Box, Button, Divider, Flex, Heading } from "@chakra-ui/react";
import DevEditDetailComp from "../Components/DevEditDetailComp";
import Request from "../component/ProblemRequest";
import { useNavigate } from "react-router-dom";

function DetailForUser() {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/preview/:id");
  };

  return (
    <Box pb="10">
      <Box background={"#4C7BF4"} color="white" p="2.5rem">
        <Heading fontFamily={"inherit"} textAlign={"center"}>
          แจ้งปัญหาการใช้งานระบบ
        </Heading>
      </Box>

      <Box>
        <Request />
      </Box>

      <Divider my="20px" />

      <Box>
        <DevEditDetailComp />
      </Box>

      <Box>
        <Flex justify="center">
          <Button
            mt="10"
            onClick={handleBack}
            bg="#4C7BF4"
            color="gray.100"
            _hover={{ bg: "#4C7BF4", color: "white" }}
          >
            กลับหน้าหลัก
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}

export default DetailForUser;
