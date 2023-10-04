/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Center,
  Container,
  HStack,
  VStack,
  Text,
  Button,
  Divider,
  Grid,
} from "@chakra-ui/react";
import { useContext } from "react";
import { MAcontext } from "../../context/MAContext";
import { useNavigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";
import moment from "moment";
import classes from "../../pages/Report/ReportPreview.module.css";

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
                    borderRadius={'16px'}
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
                    pt="1rem"
                  >
                    ประวัติการแก้ไข
                  </Text>
                  <Text fontSize="16px" fontFamily="Prompt">
                    ข้อมูลการแก้ไข
                  </Text>
                </VStack>
              </HStack>
            </Center>
            <Divider my="1rem" />
            <Box
              w="100%"
              overflowY={"auto"}
              h="64vh"
              p="1rem"
              className={classes.table}
            >
              <Grid
                h={"max-content"}
                templateColumns={{
                  base: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                }}
                gap={"15px"}
                w="100%"
                pb="2rem"
              >
                {MACtx.ma.updateLogs
                  .sort((a, b) => {
                    const dateA = new Date(a.timeStamp) as any;
                    const dateB = new Date(b.timeStamp) as any;
                    return dateB - dateA;
                  })
                  .map((u, index) => {
                    return (
                      <Box
                        key={index}
                        boxShadow="rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px"
                        p="4"
                        pb="5"
                        borderRadius="16px"
                        w="100%"
                      >
                        <HStack>
                          <Text fontSize="16px" fontWeight="bold">
                            ครั้งที่ {MACtx.ma.updateLogs.length - index}
                          </Text>
                        </HStack>
                        <HStack>
                          <Text minW="4.5rem" fontSize="16px" fontWeight="bold">
                            แก้ไขเมื่อ
                          </Text>
                          <Text>
                            :{" "}
                            {moment(u.timeStamp).format("DD/MM/YYYY HH:mm:ss")}
                          </Text>
                        </HStack>
                        <HStack alignItems={"start"}>
                          <Text minW="4.5rem" fontSize="16px" fontWeight="bold">
                            แก้ไขโดย
                          </Text>
                          <Text>: {u.updatedBy.username}</Text>
                        </HStack>
                        <HStack alignItems={"start"}>
                          <Text minW="4.5rem" fontSize="16px" fontWeight="bold">
                            หมายเหตุ
                          </Text>
                          <Text>: {u.note}</Text>
                        </HStack>
                      </Box>
                    );
                  })}
              </Grid>
            </Box>
          </Box>
        </Container>
      </div>
    );
  }
};

export default ContractPreview;
