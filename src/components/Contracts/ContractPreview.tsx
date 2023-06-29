import {
  Box,
  Center,
  Container,
  HStack,
  VStack,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useState } from "react";
import { MA } from "../../@types/Type";

const ContractPreview = () => {
  const [recordCont, setRecordCont] = useState<{ id: string; ma: MA }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="container">
      <Container maxW="100%" pb="10">
        <Box>
          <Center w="100%" mb="1rem">
            <HStack
              w="100%"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <VStack
                pt="1rem"
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
              <HStack>
                <Text>หมายเหตุ :</Text>
                <Text>{ }</Text>
              </HStack>
              <HStack>
                <Text>แก้ไขเมื่อ :</Text>
                <Text>12/12/12</Text>
              </HStack>
              <HStack>
                <Text>แก้ไขโดย :</Text>
                <Text>แอดมิน</Text>
              </HStack>
              <Divider my="1rem" />
            </Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default ContractPreview;
