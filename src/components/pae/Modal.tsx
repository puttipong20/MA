import {
  Button,
  Box,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  Text,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { sendPasswordResetEmail } from "firebase/auth";
import { FC, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { auth } from "../../services/config-db";

const ResetModal: FC = () => {
  const ref = useRef(null);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const toast = useToast();
  //functions
  const resetPassword = (data: any) => {
    console.log(data);
    const email = data.userEmail;
    sendPasswordResetEmail(auth, email)
      .then(() => {
        toast({
          title: `Sending link.`,
          description: `Send Link to ${email} `,
          status: "success",
          duration: 1000,
          isClosable: true,
        });
        onClose();
      })
      .catch((e) => {
        console.log(e);
      });
  };
  return (
    <Box>
      <Text color={"white"} as="u" onClick={onOpen} cursor={"pointer"}>
        forgot password
      </Text>
      <Modal
        initialFocusRef={ref}
        isOpen={isOpen}
        onClose={onClose}
        isCentered={true}
      >
        <ModalOverlay />
        <ModalContent bg={"#4C7BF4"}>
          <ModalHeader color={"white"} minW={"100%"} textAlign={"center"}>
            Forgot Password
          </ModalHeader>
          <Divider />
          <Box p={5} my={0}>
            <Text color={"white"} fontSize={"16px"} textAlign={"center"}>
              Enter you email will send a link to reset you password.
            </Text>
          </Box>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <form onSubmit={handleSubmit(resetPassword)}>
              <Controller
                name="userEmail"
                control={control}
                defaultValue={""}
                rules={{ required: true }}
                render={({ field: { name, value, onChange } }) => (
                  <FormControl isInvalid={Boolean(errors[name])}>
                    <FormLabel color={"white"}>Email *</FormLabel>
                    <Input bg={"white"} value={value} onChange={onChange} />
                  </FormControl>
                )}
              />
              <Text></Text>
              <Flex justifyContent={"end"}>
                <Button
                  my={3}
                  type="submit"
                  onClick={() => console.log("first")}
                >
                  Submit
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ResetModal;
