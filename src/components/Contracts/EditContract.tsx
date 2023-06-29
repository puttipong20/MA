import {
  Box,
  Flex,
  useDisclosure,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Button,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { RiEditLine } from "react-icons/ri";
import moment from "moment";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { db } from "../../services/config-db";
import { MA } from "../../@types/Type";

const EditContract = ({ data, id }: any) => {
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<MA>();

  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const EditDate = moment().format("DD-MM-YYYY HH:mm:ss");

  useEffect(() => {
    if (data) {
      setValue("startMA", data?.startMA);
      setValue("endMA", data?.endMA);
      setValue("cost", data?.cost);
    }
    console.log(data);
  }, []);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    if (id) {
      const DocRef = doc(db, "Project", id);
      await updateDoc(DocRef, {
        ...data,
      })
        .then(() => {
          toast({
            title: "อัพเดทสัญญาสำเร็จ",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
          setIsLoading(false);
        })
        .catch((e) => {
          console.error(e);
          toast({
            title: "อัพเดทสัญญาไม่สำเร็จ",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
        });
      console.log(DocRef)
    }
    reset();
    onClose();
  };

  return (
    <>
      <Box onClick={onOpen} w="100%" h="100%" display="flex">
        <Flex
          color="green"
          fontSize="16px"
          fontFamily="Prompt"
          fontWeight="400"
          align="center"
          ml="8"
        >
          <RiEditLine color="green" />
          <Text ml="2">แก้ไขสัญญา</Text>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent w={{ base: "90%", sm: "90%", md: "30rem" }}>
          <ModalCloseButton />
          <ModalHeader>แก้ไขข้อมูลสัญญา</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                <Controller
                  name="startMA"
                  control={control}
                  defaultValue=""
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel>วันเริ่มต้นสัญญาใหม่</FormLabel>
                      <Input
                        type="date"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="endMA"
                  control={control}
                  defaultValue=""
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel>วันสิ้นสุดสัญญาใหม่</FormLabel>
                      <Input
                        type="date"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="cost"
                  control={control}
                  defaultValue={0}
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel>ค่าบริการ</FormLabel>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0.00"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="note"
                  control={control}
                  defaultValue=""
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel>หมายเหตุ</FormLabel>
                      <Input
                        type="text"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormControl>
                  )}
                />
              </Stack>
              <Flex justify="center" mt="5">
                <Button mr="68px" onClick={() => reset()}>
                  เคลียร์
                </Button>
                <Button
                  type="submit"
                  color="gray.100"
                  bg="#4C7BF4"
                  _hover={{ color: "white", bg: "#4C7BF4" }}
                  isLoading={isLoading}
                >
                  บันทึก
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditContract;
