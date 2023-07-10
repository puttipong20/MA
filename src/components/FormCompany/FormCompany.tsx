/* eslint-disable @typescript-eslint/no-explicit-any */
import { addDoc, collection } from "firebase/firestore";
import { useState, useContext } from "react";
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
  ModalHeader,
} from "@chakra-ui/react";
import moment from "moment";

import { AuthContext } from "../../context/AuthContext";

type ComValue = {
  companyName: string;
  companyAddress: string;
  userName: string;
  userPhone: string;
  userTax: string;
  userPerson: string;
};

const FormAddCompany = ({ refetch }: { refetch: () => void }) => {
  const Auth = useContext(AuthContext);
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<ComValue>();

  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const createDate = moment().format("DD-MM-YYYY HH:mm:ss");
  const updatedDate = moment().format("DD-MM-YYYY HH:mm:ss");

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const docRef = collection(db, "Company");
    await addDoc(docRef, {
      ...data,
      createdAt: createDate,
      companyUpdate: updatedDate,
      createBy: Auth.uid,
    })
      .then(() => {
        toast({
          title: "เพิ่มข้อมูลบริษัทสำเร็จ",
          description: "ข้อมูลบริษัทได้ถูกเพิ่มแล้ว",
          status: "success",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(() => {
        toast({
          title: `เพิ่มบริษัทไม่สำเร็จ`,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      })
      .finally(() => {
        refetch();
        setIsLoading(false);
        reset();
        onClose();
      });
  };

  return (
    <div>
      <Box>
        <Button
          onClick={onOpen}
          fontWeight={"normal"}
          color="gray.100"
          bg="#4C7BF4"
          _hover={{ opacity: 0.8 }}
        >
          เพิ่มข้อมูลบริษัท
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent w={{ base: "90%", sm: "90%", md: "30rem" }} p="1rem">
          <ModalCloseButton />
          <ModalHeader textAlign="center">เพิ่มข้อมูลบริษัท</ModalHeader>
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
                      <FormLabel>ชื่อบริษัท</FormLabel>
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
                      <FormLabel>ที่อยู่บริษัท</FormLabel>
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
                      <FormLabel>ชื่อผู้ติดต่อ</FormLabel>
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
                      <FormLabel>เบอร์โทรติดต่อ</FormLabel>
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
                      <FormLabel>เลขประจำตัวผู้เสียภาษี</FormLabel>
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
                        <FormLabel>ประเภทบุคคล</FormLabel>
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
    </div>
  );
};

export default FormAddCompany;
