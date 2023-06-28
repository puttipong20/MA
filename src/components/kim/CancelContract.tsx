import { CloseIcon } from '@chakra-ui/icons'
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
export default function CancelContract() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();
    
    const handleClick = () => {
        console.log("clicked!");
        onOpen();
    }

    return (
        <Box w="100%" p="0.5rem" onClick={handleClick} userSelect={"none"}>
            <Text color="red" w="100%" display="flex">
                <Text as="span" w="20%" textAlign={"center"}>
                    <CloseIcon />
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
