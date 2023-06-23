import { Box, Image, useDisclosure } from "@chakra-ui/react";
import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalCloseButton
} from '@chakra-ui/react'

interface Props {
    src: string
}

const ImgShow: React.FC<Props> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const imageSize = "165px";
    return (
        <Box
            w={"100%"} h={imageSize}
            border="1px dashed gray" borderRadius={"13px"}
            display="flex"
            overflow={"hidden"}
            justifyContent={"center"} alignContent={"center"}
            onClick={onOpen}
            cursor={"pointer"}
        >
            <Image src={props.src} fit={"contain"} alt="not found" />
            <Modal isOpen={isOpen} onClose={onClose} isCentered={true} allowPinchZoom={true} size="4xl">
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody>
                        <Image
                            h="50vh"
                            src={props.src} alt="not found" mx="auto" />
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default ImgShow;