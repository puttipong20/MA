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
} from '@chakra-ui/react'
import { RiDeleteBin7Line } from 'react-icons/ri'

interface Props {
    projectId: string
}

const DeleteProject: React.FC<Props> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const deleteProcess = () => {
        console.log(props.projectId)
        onClose();
    }

    return (
        <Box w="100%">
            <Text onClick={onOpen} display={"flex"}>
                <Text as="span" w="20%" textAlign={"center"} display="flex" justifyContent={"center"}><RiDeleteBin7Line /></Text>ลบ Project
            </Text>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>ยืนยันการลบ Project ?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            การกระทำต่อไปนี้ไม่สามารถย้อนกลับได้ หากลบ Project แล้วข้อมูลจะหายไปอย่างถาวร
                            ไม่สามารถกู้คืนใหม่ได้ ต้องเพิ่มข้อมูล Project ใหม่เมื่อต้องการใช้งาน ยืนยันการลบหรือไม่?
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button colorScheme='gray' onClick={onClose}>ยกเลิก</Button>
                        <Button colorScheme='red' onClick={deleteProcess}>ยืนยัน</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default DeleteProject;
