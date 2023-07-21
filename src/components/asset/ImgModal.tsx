import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  Image,
} from "@chakra-ui/react";

interface Props {
  src: string;
}

const ImgModal: React.FC<Props> = (props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      border="1px dashed lightgray"
      borderRadius="10px"
      overflow={"hidden"}
      bg="gray.100"
      onClick={onOpen}
      cursor={"pointer"}
    >
      <Image src={props.src} />
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true} size="3xl">
        <ModalOverlay />
        <ModalContent >
          <ModalCloseButton />
          <ModalBody >
            <Image src={props.src} mx="auto" maxH="80vh" maxW="100%" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ImgModal;
