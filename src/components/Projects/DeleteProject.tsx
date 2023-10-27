import {
  Box,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useState, useContext } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../services/config-db";
import { CompanyDetail } from "../../@types/Type";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";
import { MdDelete } from "react-icons/md";

interface Props {
  companyId: string;
  projectId: string;
}

const DeleteProject: React.FC<Props> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deleting, isDeleting] = useState(false);
  const toast = useToast();
  const AuthCtx = useContext(AuthContext);

  const deleteProcess = async () => {
    // console.clear();
    isDeleting(true);
    const companyRef = doc(db, "Company", props.companyId);
    const projectRef = doc(db, "Project", props.projectId);

    const company = await getDoc(companyRef);
    const companyDetail = company.data() as CompanyDetail;
    // const filterProject = companyDetail.projects?.filter(i => i.id !== props.projectId)
    const filterProject:
      | { projectName: string; id: string; status: "enable" | "disable" }[]
      | undefined = companyDetail.projects?.map((i) => {
      if (i.id === props.projectId) {
        return { ...i, status: "disable" };
      } else {
        return i;
      }
    });
    const updateCompany: CompanyDetail = {
      ...companyDetail,
      projects: filterProject,
    };
    await updateDoc(companyRef, updateCompany);
    await updateDoc(projectRef, {
      status: "disable",
      latestUpdate: {
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
        uid: AuthCtx.uid,
        username: AuthCtx.username,
      },
    });
    toast({
      title: "ลบโปรเจคเรียบร้อยแล้ว",
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "top",
    });
    onClose();
    isDeleting(false);
  };

  return (
    <Box w="100%">
      <Text onClick={onOpen} display={"flex"}>
        <Text
          as="span"
          w="20%"
          textAlign={"center"}
          display="flex"
          justifyContent={"center"}
          align="center"
          mt="1px"
        >
          <MdDelete />
        </Text>
        ลบ Project
      </Text>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius={"16px"}>
          <ModalHeader borderTopRadius={"16px"} bg="#4c7bf4" color="#fff">
            ยืนยันการลบ Project ?
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>ยืนยันการลบหรือไม่?</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              borderRadius={"16px"}
              bg={"none"}
              border={"1px solid #ccc"}
              w="5rem"
              fontSize="14px"
              mr="5"
              onClick={onClose}
            >
              ยกเลิก
            </Button>
            <Button
              w="5rem"
              fontSize="14px"
              bg="red.500"
              color="#fff"
              _hover={{ opacity: "0.8" }}
              onClick={deleteProcess}
              isLoading={deleting}
              borderRadius={"16px"}
            >
              ยืนยัน
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DeleteProject;
