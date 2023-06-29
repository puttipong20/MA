import { useState, useContext } from "react";
import {
  Box,
  Button,
  Flex,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
  useToast,
  ModalFooter,
} from "@chakra-ui/react";
import { collection, getDoc, doc, updateDoc } from "firebase/firestore";
import { ImCancelCircle } from "react-icons/im";
import { db } from "../../services/config-db";
import { MA } from "../../@types/Type";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";

interface Props {
  projectID: string;
  maID: string;
  reload: () => void;
}

const CancelContract: React.FC<Props> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const Auth = useContext(AuthContext);

  const cancelContract = async () => {
    setIsLoading(true);
    const projectRef = doc(db, "Project", props.projectID);
    const MAref = collection(projectRef, "MAlogs");
    const MAdoc = doc(MAref, props.maID);
    const MAhistory = (await getDoc(MAdoc)).data() as MA;
    const oldUpdateLog = MAhistory.updateLogs;
    const newUpdateLog = {
      note: "cancel contract",
      timeStamp: moment().format("YYYY-MM-DD HH:mm:ss"),
      updatedBy: Auth.uid,
    };
    const updatedLog = [...oldUpdateLog, newUpdateLog];
    // console.log(updatedLog)
    await updateDoc(MAdoc, { updateLogs: updatedLog, status: "cancel" }).then(
      () => {
        toast({
          title: "ยกเลิกสัญญาสำเร็จ",
          status: "success",
          duration: 3000,
          position: "top",
        });
      }
    );
    onClose();
    props.reload();
    setIsLoading(false);
  };

  return (
    <Box w="100%" p={"0.5rem"} userSelect={"none"}>
      <Text
        color="red"
        fontWeight={"bold"}
        w="100%"
        display="flex"
        alignItems={"center"}
        onClick={onOpen}
      >
        <Text as="span" w="20%" display={"flex"} justifyContent={"center"}>
          <ImCancelCircle />
        </Text>
        ยกเลิกสัญญา
      </Text>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ยกเลิกสัญญา</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody>
            <Box>
              <Text>ต้องการยกเลิกสัญญาหรือไม่</Text>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Flex gap={"20px"}>
              <Button onClick={onClose}>ปิด</Button>
              <Button
                onClick={cancelContract}
                colorScheme="red"
                isLoading={isLoading}
              >
                ยกเลิกสัญญา
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default CancelContract;
