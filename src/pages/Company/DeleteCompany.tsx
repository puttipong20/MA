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
} from "@chakra-ui/react";
import { deleteDoc, doc } from "firebase/firestore";
import React from "react";
import { db } from "../../services/config-db";
import { MdDelete } from "react-icons/md";

function DeleteCompany({ item, fetchData }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cancelRef = React.useRef(null);
  const handleRemove = async (id: any) => {
    const bookDoc = doc(db, "Company", id);
    await deleteDoc(bookDoc).then(async () => {
      await fetchData();
    });
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
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              ลบข้อมูล
            </AlertDialogHeader>

            <AlertDialogBody>คุณต้องการลบข้อมูล ใช่หรือไม่</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                fontFamily={"Prompt"}
                fontSize={"14px"}
                fontWeight={"600"}
                ref={cancelRef}
                onClick={onClose}
              >
                ยกเลิก
              </Button>
              <Button
                fontFamily={"Prompt"}
                fontSize={"14px"}
                fontWeight={"600"}
                colorScheme="red"
                onClick={() => {
                  handleRemove(item.id);
                  onClose();
                }}
                ml={5}
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
