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
} from '@chakra-ui/react'
import { ImCancelCircle } from "react-icons/im"
export default function CancelContract() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const handleClick = () => {
        console.log("clicked!");
        onOpen();
        toast({
            title: 'เพิ่มโปรเจคสำเร็จ.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: "top",
        })
    }

    return (
        <Box w="100%" p={"0.5rem"} onClick={handleClick} userSelect={"none"}>
            <Text color="red" fontWeight={"bold"} w="100%" display="flex" alignItems={"center"}>
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
                            <Button onClick={onClose} colorScheme='red'>ยกเลิก</Button>
                        </Flex>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}
