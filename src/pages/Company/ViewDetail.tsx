/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
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
  createBy: { uid: string; username: string };
  updateBy: { uid: string; username: string };
};

const ViewCompany = ({ data }: any) => {
  const [cValue, setCValue] = useState<Cvalue>();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    // console.log(data)
    setCValue(data);
  }, [data]);

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
        <ModalContent w={{ base: "90%", sm: "90%", md: "30rem" }} p="1rem">
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
                  <Flex justify="flex-end">
                    <HStack fontSize="14px" color="gray.400">
                      <Text mt="-1.25rem">สร้างเมื่อ :</Text>
                      <Text>
                        <Text>{cValue?.createdAt}</Text>
                        <Text>{cValue?.createBy.username}</Text>
                      </Text>
                    </HStack>
                  </Flex>
                  <Flex justify="flex-end">
                    <HStack fontSize="14px" color="gray.400">
                      <Text mt="-1.25rem">อัพเดทเมื่อ :</Text>
                      {!cValue?.updateBy ? (
                        <Text fontSize="14px" color="gray.400">
                          ยังไม่มีการอัพเดท
                        </Text>
                      ) : (
                        <Text>
                          <Text>{cValue?.companyUpdate} </Text>
                          <Text>{cValue?.updateBy.username}</Text>
                        </Text>
                      )}
                    </HStack>
                  </Flex>
                  {/* <HStack alignItems="flex-start">
                    <Text w="50%" fontWeight="bold">
                      สร้างเมื่อ :
                    </Text>
                    <Text w="50%">
                      <Text as="span">{cValue?.createdAt}</Text>
                      <br />
                      <Text as="span" fontSize="14px" color="gray.400">
                        {cValue?.createBy.username}
                      </Text>
                    </Text>
                  </HStack> */}
                  {/* <HStack alignItems="flex-start">
                    <Text w="50%" fontWeight="bold">
                      อัพเดทเมื่อ :
                    </Text>
                    {!cValue?.updateBy ? (
                      <Text fontSize="14px" color="gray.400">
                        ยังไม่มีการอัพเดท
                      </Text>
                    ) : (
                      <Text w="50%">
                        <Text as="span">{cValue?.companyUpdate} </Text>
                        <br />
                        <Text as="span" fontSize="14px" color="gray.400">
                          {cValue?.updateBy.username}
                        </Text>
                      </Text>
                    )}
                  </HStack> */}
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
