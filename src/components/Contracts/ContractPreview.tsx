import {
  Box,
  Center,
  Container,
  HStack,
  VStack,
  Text,
  Divider,
  Button,
} from "@chakra-ui/react";
import { useContext } from "react";
import { MAcontext } from "../../context/MAContext";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
const ContractPreview = () => {
  const navigate = useNavigate();
  const MACtx = useContext(MAcontext);

  if (!MACtx.ma) {
    navigate(-1);
  } else {
    return (
      <div className="container">
        <Container maxW="100%" pb="10">
          <Box>
            <Center w="100%" mb="1rem">
              <HStack
                w="100%"
                justifyContent="flex-start"
                alignItems="center"
              >
                <Button onClick={() => { navigate(-1) }} colorScheme={"blue"}><ArrowBackIcon /></Button>
                <VStack
                  // pt="1rem"
                  justifyContent="flex-start"
                  alignItems="flex-star"
                  spacing="2px"
                >
                  <Text
                    fontWeight="600"
                    lineHeight="25.2px"
                    fontSize="18px"
                    fontFamily="Prompt"
                  >
                    ประวัติการแก้ไข
                  </Text>
                  <Text fontSize="16px" fontFamily="Prompt" color="#000000">
                    ข้อมูลการแก้ไข
                  </Text>
                </VStack>
              </HStack>
            </Center>
            <Divider my="1rem" />
            <Box>
              <Box>
                {MACtx.ma.updateLogs.map((u, index) => (
                  <Box key={index}>
                    <HStack>
                      <Text>ครั้งที่ {index + 1}</Text>
                    </HStack>
                    <HStack>
                      <Text>แก้ไขเมื่อ :</Text>
                      <Text>{u.timeStamp}</Text>
                    </HStack>
                    <HStack>
                      <Text>แก้ไขโดย :</Text>
                      <Text>{u.updatedBy}</Text>
                    </HStack>
                    <HStack>
                      <Text>หมายเหตุ :</Text>
                      <Text>{u.note}</Text>
                    </HStack>
                    <Divider my="1rem" />
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    );
  }
};

export default ContractPreview;
