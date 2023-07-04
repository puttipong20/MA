import {
  Box,
  Center,
  Container,
  HStack,
  VStack,
  Text,
  Button,
  Divider,
} from "@chakra-ui/react";
import { useContext } from "react";
import { MAcontext } from "../../context/MAContext";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import moment from "moment";
import classes from "../../pages/kim/ProblemPreview.module.css";

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
              <HStack w="100%" justifyContent="flex-start" alignItems="center">
                <VStack
                  pt="1rem"
                  justifyContent="flex-start"
                  alignItems="flex-star"
                  spacing="2px"
                >
                  <Button
                    onClick={() => {
                      navigate(-1);
                    }}
                    bg="#4C7BF4"
                    color="#fff"
                    size="sm"
                    w="40px"
                    _hover={{ opacity: 0.8 }}
                  >
                    <ArrowBackIcon />
                  </Button>
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
              <Box
                mt="1rem"
                pb="0.5rem"
                borderRadius="20px"
                w="100%"
                h="100%"
                maxH="68vh"
                overflowY={"auto"}
                boxShadow={"1px 1px 1px rgb(0,0,0,0.1)"}
                className={classes.table}
              >
                {MACtx.ma.updateLogs.sort((a, b) => {
                  const dateA = new Date(a.timeStamp) as any
                  const dateB = new Date(b.timeStamp) as any
                  return dateB - dateA
                }).map((u, index) => {
                  return (
                    <Box
                      key={index}
                      boxShadow="0 4px 6px rgba(76, 123, 244, 0.5)"
                      p="4"
                      pb="5"
                      borderRadius="16px"
                      w="98%"
                      ml="1rem"
                    >
                      <HStack>
                        <Text fontSize="16px" fontWeight="bold">
                          ครั้งที่ {MACtx.ma.updateLogs.length - index}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text fontSize="16px" fontWeight="bold">
                          แก้ไขเมื่อ :
                        </Text>
                        <Text>
                          {moment(u.timeStamp).format("DD/MM/YYYY HH:mm:ss")}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text fontSize="16px" fontWeight="bold">
                          แก้ไขโดย :
                        </Text>
                        <Text>
                          {u.updatedBy.username}
                        </Text>
                      </HStack>
                      <HStack>
                        <Text fontSize="16px" fontWeight="bold">
                          หมายเหตุ :
                        </Text>
                        <Text>{u.note}</Text>
                      </HStack>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Container>
      </div>
    );
  }
};

export default ContractPreview;
