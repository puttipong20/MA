/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Flex,
  useDisclosure,
  Text,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import { deleteDoc, doc } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../../services/config-db";
import { MdDelete } from "react-icons/md";

function DeleteCompany({ item, fetchData }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const cancelRef = React.useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async (id: any) => {
    setIsLoading(true);
    const bookDoc = doc(db, "Company", id);
    await deleteDoc(bookDoc).then(async () => {
      toast({
        title: "ลบบริษัทสำเร็จ",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      fetchData();
      onClose();
    });
    setIsLoading(false);
  };

  return (
    <>
      <Box onClick={onOpen} w="100%" h="100%" display="flex">
        <Flex
          color="red"
          fontSize="16px"
          fontFamily="Prompt"
          fontWeight="400"
          align="center"
          ml="8"
        >
          <MdDelete color="red" />
          <Text ml="2">ลบข้อมูล</Text>
        </Flex>
      </Box>
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius={"16px"}>
            <AlertDialogHeader
            borderTopRadius={'16px'}
              bg="#4c7bf4"
              color="#fff"
              fontSize="lg"
              fontWeight="bold"
            >
              ลบข้อมูล
            </AlertDialogHeader>

            <AlertDialogBody>
              คุณต้องการลบข้อมูลบริษัท ใช่หรือไม่
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                w="5rem"
                fontSize="14px"
                ref={cancelRef}
                onClick={onClose}
                borderRadius={'16px'}
                bg={'none'}
                border={'1px solid #ccc'}
              >
                ยกเลิก
              </Button>
              <Button
                w="5rem"
                fontSize="14px"
                bg="red.500"
                color="#fff"
                _hover={{ opacity: "0.8" }}
                onClick={() => {
                  handleRemove(item.companyId);
                }}
                isLoading={isLoading}
                ml={5}
                borderRadius={'16px'}
              >
                ลบข้อมูล
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default DeleteCompany;
