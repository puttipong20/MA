import {
    Box,
    Text,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    // useToast,
} from '@chakra-ui/react'
import { AiOutlineEdit } from "react-icons/ai"
import EditForm from './EditForm';

interface Props {
    // companyId: string,
    projectId: string
}

const EditProject: React.FC<Props> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    // const toast = useToast();

    return (
        <Box w="100%">
            <Text onClick={onOpen} display={"flex"}>
                <Text as="span" w="20%" textAlign={"center"} display="flex" justifyContent={"center"}><AiOutlineEdit /></Text>แก้ไข
            </Text>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>แก้ไขรายละเอียด Project</ModalHeader>
                    <ModalBody>
                        <EditForm onClose={onClose} projectId={props.projectId} />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default EditProject;
