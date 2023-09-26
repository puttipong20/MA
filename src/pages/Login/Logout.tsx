import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { LuLogOut } from "react-icons/lu";

import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../../services/config-db";

export default function LogoutButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const AuthCtx = useContext(AuthContext);

  const logout = () => {
    signOut(auth);
    onClose();
    AuthCtx.clearUser();
  };

  return (
    <Box w="100%">
      <Box
        w="100%"
        p="0.5rem"
        userSelect={"none"}
        cursor={"pointer"}
        transition={"all 0.3s"}
        borderRadius={"10px"}
        _hover={{ bg: "rgba(0,0,0,0.1)" }}
        onClick={onOpen}
      >
        <Text display="flex" alignItems={"center"} gap={"1rem"}>
          <LuLogOut />
          Logout
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Text textAlign={"center"}>ออกจากระบบ</Text>
          </ModalHeader>
          <ModalBody>
            <Text>ยืนยันการออกจากระบบ ?</Text>
          </ModalBody>
          <ModalFooter gap={"20px"}>
            <Button onClick={onClose}>ยกเลิก</Button>
            <Button colorScheme="red" onClick={logout}>
              ออกจากระบบ
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
