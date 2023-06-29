import { Box, Center, Container, HStack, VStack, Text } from "@chakra-ui/react";
import React from "react";

const ContractPreview = () => {
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
                  <Box>
                      <Box>
                          
                      </Box>
                  </Box>
        </Box>
      </Container>
    </div>
  );
};

export default ContractPreview;
