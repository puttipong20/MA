/* eslint-disable @typescript-eslint/no-explicit-any */
import { doc, updateDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { db } from "../../services/config-db";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Stack,
  useDisclosure,
  Textarea,
  useToast,
  Radio,
  RadioGroup,
  Text,
  ModalHeader,
} from "@chakra-ui/react";
import moment from "moment";
import { RiEditLine } from "react-icons/ri";

type ComValue = {
  companyName: string;
  companyAddress: string;
  userName: string;
  userPhone: string;
  userTax: string;
  userPerson: string;
};

const FormEditCompany = ({ data, id }: any) => {
  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<ComValue>();

  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const updatedDate = moment().format("DD-MM-YYYY HH:mm:ss");

  useEffect(() => {
    if (data) {
      setValue("companyName", data?.companyName);
      setValue("companyAddress", data?.companyAddress);
      setValue("userName", data?.userName);
      setValue("userPhone", data?.userPhone);
      setValue("userTax", data?.userTax);
      setValue("userPerson", data?.userPerson);
    }
    //eslint-disable-next-line
  }, [data]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);

    if (id) {
      const DocRef = doc(db, "Company", id);
      await updateDoc(DocRef, {
        ...data,
        companyUpdate: updatedDate,
      })
        .then(() => {
          toast({
            title: "อัพเดทบริษัทสำเร็จ",
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
            title: "อัพเดทบริษัทไม่สำเร็จ",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
        });
    }
    reset();
    onClose();
    // window.location.reload();
  };

  return (
    <>
      <Box
        onClick={() => {
          console.log(data);
          onOpen();
        }}
        w="100%"
        h="100%"
        display="flex"
      >
        <Flex
          color="green"
          fontSize="16px"
          fontFamily="Prompt"
          fontWeight="400"
          align="center"
          ml="8"
        >
          <RiEditLine color="green" />
          <Text ml="2">แก้ไข</Text>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent w={{ base: "90%", sm: "90%", md: "30rem" }} p="1rem">
          <ModalCloseButton />
          <ModalHeader textAlign="center">แก้ไขข้อมูลบริษัท</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                <Controller
                  name="companyName"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel fontSize="16px">ชื่อบริษัท</FormLabel>
                      <Input
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="ระบุชื่อบริษัท"
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="companyAddress"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel fontSize="16px">ที่อยู่บริษัท</FormLabel>
                      <Textarea
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="ระบุที่อยู่บริษัท"
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="userName"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel fontSize="16px">ชื่อผู้ติดต่อ</FormLabel>
                      <Input
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="ระบุชื่อผู้ติดต่อ"
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="userPhone"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel fontSize="16px">เบอร์โทรติดต่อ</FormLabel>
                      <Input
                        type="tel"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="ระบุเบอร์โทรศัพท์"
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="userTax"
                  control={control}
                  defaultValue=""
                  rules={{
                    required: true,
                  }}
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel fontSize="16px">
                        เลขประจำตัวผู้เสียภาษี
                      </FormLabel>
                      <Input
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="ระบุเลขประจำตัวผู้เสียภาษี"
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="userPerson"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field: { name, value, onChange, onBlur } }) => {
                    return (
                      <FormControl isInvalid={Boolean(errors[name])}>
                        <FormLabel fontSize="16px">ประเภทบุคคล</FormLabel>
                        <RadioGroup
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                        >
                          <Stack direction="row">
                            <Radio value="บุคคลธรรมดา">บุคคลธรรมดา</Radio>
                            <Radio value="นิติบุคคล">นิติบุคคล</Radio>
                          </Stack>
                        </RadioGroup>
                      </FormControl>
                    );
                  }}
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

export default FormEditCompany;
