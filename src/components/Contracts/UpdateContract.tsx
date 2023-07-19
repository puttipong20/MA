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
import { AiOutlineDelete } from "react-icons/ai"
import { db } from "../../services/config-db";
import { MA } from "../../@types/Type";
import moment from "moment";
import { AuthContext } from "../../context/AuthContext";

interface Props {
    projectID: string;
    maID: string;
    reload: () => void;
    status: "deleted" | "cancel";
}

const UpdateContract: React.FC<Props> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();
    const Auth = useContext(AuthContext);

    let action = "";
    props.status === "cancel" ? action = "ยกเลิก" : action = "ลบ"

    const updateContract = async () => {
        setIsLoading(true);
        const projectRef = doc(db, "Project", props.projectID);
        const MAref = collection(projectRef, "MAlogs");
        const MAdoc = doc(MAref, props.maID);
        const MAhistory = (await getDoc(MAdoc)).data() as MA;
        const oldUpdateLog = MAhistory.updateLogs;
        const newUpdateLog = {
            note: `${action}สัญญา`,
            timeStamp: moment().format("YYYY-MM-DD HH:mm:ss"),
            updatedBy: { username: Auth.username, uid: Auth.uid },
        };
        const updatedLog = [...oldUpdateLog, newUpdateLog];
        // console.log(updatedLog)
        await updateDoc(MAdoc, { updateLogs: updatedLog, status: props.status }).then(
            () => {
                toast({
                    title: `${action}สัญญาสำเร็จ`,
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
          color={props.status === "cancel" ? "red" : "orange"}
          w="100%"
          display="flex"
          alignItems={"center"}
          onClick={onOpen}
        >
          <Text as="span" w="20%" display={"flex"} justifyContent={"center"}>
            {props.status === "cancel" ? (
              <ImCancelCircle />
            ) : (
              <AiOutlineDelete />
            )}
          </Text>
          {action}สัญญา
        </Text>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{action}สัญญา</ModalHeader>
            {/* <ModalCloseButton /> */}
            <ModalBody>
              <Box>
                <Text>ต้องการ{action}สัญญาหรือไม่</Text>
              </Box>
            </ModalBody>
            <ModalFooter>
              <Flex gap={"20px"}>
                <Button fontSize="14px" w="5rem" onClick={onClose}>
                  ปิด
                </Button>
                <Button
                  fontSize="14px"
                  w="6rem"
                  color="#fff"
                  bg="red.500"
                  _hover={{ opacity: "0.8" }}
                  onClick={updateContract}
                  isLoading={isLoading}
                >
                  {action}สัญญา
                </Button>
              </Flex>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    );
};

export default UpdateContract;
