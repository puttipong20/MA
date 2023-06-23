import { doc, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../services/config-db";
import {
  Text,
  VStack,
  HStack,
  Flex,
  Heading,
  Container,
  Box,
  Stack,
} from "@chakra-ui/react";

type Cvalue = {
  companyName: string;
  companyAddress: string;
  userName: string;
  userPhone: string;
  userTax: string;
  userPerson: string;
  createAt: string;
  companyUpdate: string;
};

const ViewCompany: React.FC = () => {
  const [cValue, setCValue] = useState<Cvalue>();
  const { id } = useParams();

  async function fetchData() {
    onSnapshot(doc(db, "CompanyAdd", id as string), (doc) => {
      const data: Cvalue = {
        companyName: doc.data()?.companyName,
        companyAddress: doc.data()?.companyAddress,
        userName: doc.data()?.userName,
        userPhone: doc.data()?.userPhone,
        userTax: doc.data()?.userTax,
        userPerson: doc.data()?.userPerson,
        createAt: doc.data()?.createAt,
        companyUpdate: doc.data()?.companyUpdate,
      };
      setCValue(data);
    });
  }
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Flex justify="center" p="10" bg="#4C7BF4" color="white">
        <Heading fontFamily={"inherit"}>ข้อมูลบริษัท</Heading>
      </Flex>
      <form>
        <Container w="100%" mt="10" mb="10">
          <Box>
            <Stack mb="5" spacing={4}>
              <Box border="1px solid lightgray" p={4} borderRadius="10px">
                <VStack align="left">
                  <HStack alignItems="flex-start">
                    <Text w="30%" fontWeight="bold">
                      ชื่อบริษัท :
                    </Text>
                    <Text w="70%">{cValue?.companyName}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text w="30%" fontWeight="bold">
                      ที่อยู่บริษัท :
                    </Text>
                    <Text w="70%">{cValue?.companyAddress}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text w="30%" fontWeight="bold">
                      ชื่อผู้ติดต่อ :
                    </Text>
                    <Text w="70%">{cValue?.userName}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text w="30%" fontWeight="bold">
                      เบอร์โทรติดต่อ :
                    </Text>
                    <Text w="70%">{cValue?.userPhone}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text w="30%" fontWeight="bold">
                      เลขประจำตัวผู้เสียภาษี :
                    </Text>
                    <Text w="70%">{cValue?.userTax}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text w="30%" fontWeight="bold">
                      ประเภทบุคคล :
                    </Text>
                    <Text w="70%">{cValue?.userPerson}</Text>
                  </HStack>
                  <br />
                  <HStack alignItems="flex-start">
                    <Text w="30%" fontWeight="bold">
                      สร้างเมื่อ :
                    </Text>
                    <Text w="70%">{cValue?.createAt}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text w="30%" fontWeight="bold">
                      อัพเดทเมื่อ :
                    </Text>
                    <Text w="70%">{cValue?.companyUpdate}</Text>
                  </HStack>
                </VStack>
              </Box>
            </Stack>
          </Box>
        </Container>
      </form>
    </div>
  );
};

export default ViewCompany;
