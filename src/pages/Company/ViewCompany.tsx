import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../services/config-db";
import {
  Text,
  VStack,
  HStack,
  Flex,
  Box,
  Stack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
} from "@chakra-ui/react";
import { MdOutlineHomeWork } from "react-icons/md";

type Cvalue = {
  companyName: string;
  companyAddress: string;
  userName: string;
  userPhone: string;
  userTax: string;
  userPerson: string;
  createdAt: string;
  companyUpdate: string;
};

const ViewCompany = ({id}:any) => {
  const [cValue, setCValue] = useState<Cvalue>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  async function fetchData() {
    onSnapshot(doc(db, "Company", id), (doc) => {
      const data: Cvalue = {
        companyName: doc.data()?.companyName,
        companyAddress: doc.data()?.companyAddress,
        userName: doc.data()?.userName,
        userPhone: doc.data()?.userPhone,
        userTax: doc.data()?.userTax,
        userPerson: doc.data()?.userPerson,
        createdAt: doc.data()?.createdAt,
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
    <>
      <Box onClick={onOpen} w="100%" h="100%" display="flex">
        <Flex
          color="gray"
          fontSize="16px"
          fontFamily="Prompt"
          fontWeight="400"
          align="center"
          ml="8"
        >
          <MdOutlineHomeWork color="gray" />
          <Text ml="2">ดูข้อมูลบริษัท</Text>
        </Flex>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent w={{ base: "90%", sm: "90%", md: "30rem" }}>
          <ModalCloseButton />
          <ModalHeader textAlign="center">ข้อมูลบริษัท</ModalHeader>
          <ModalBody>
            <form>
              <Stack>
                <VStack align="left">
                  <HStack alignItems="flex-start">
                    <Text w="50%" fontWeight="bold">
                      ชื่อบริษัท :
                    </Text>
                    <Text w="50%">{cValue?.companyName}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text w="50%" fontWeight="bold">
                      ที่อยู่บริษัท :
                    </Text>
                    <Text w="50%">{cValue?.companyAddress}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text w="50%" fontWeight="bold">
                      ชื่อผู้ติดต่อ :
                    </Text>
                    <Text w="50%">{cValue?.userName}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text w="50%" fontWeight="bold">
                      เบอร์โทรติดต่อ :
                    </Text>
                    <Text w="50%">{cValue?.userPhone}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text w="50%" fontWeight="bold">
                      เลขประจำตัวผู้เสียภาษี :
                    </Text>
                    <Text w="50%">{cValue?.userTax}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text w="50%" fontWeight="bold">
                      ประเภทบุคคล :
                    </Text>
                    <Text w="50%">{cValue?.userPerson}</Text>
                  </HStack>
                  <br />
                  <HStack alignItems="flex-start">
                    <Text w="50%" fontWeight="bold">
                      สร้างเมื่อ :
                    </Text>
                    <Text w="50%">{cValue?.createdAt}</Text>
                  </HStack>
                  <HStack alignItems="flex-start">
                    <Text w="50%" fontWeight="bold">
                      อัพเดทเมื่อ :
                    </Text>
                    <Text w="50%">{cValue?.companyUpdate}</Text>
                  </HStack>
                </VStack>
              </Stack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ViewCompany;
