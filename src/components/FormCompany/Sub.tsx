import { addDoc, collection, doc, runTransaction } from "firebase/firestore";
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
  FormErrorMessage,
} from "@chakra-ui/react";
import moment from "moment";

// import { AuthContext } from "../../Context/AuthContext";

type ComValue = {
  companyName: string;
  companyAddress: string;
  userName: string;
  userPhone: string;
  userTax: string;
  userPerson: string;
};

const FormAddCompany = () => {
  //   const Auth = useContext(AuthContext);
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
    try {
      runTransaction(db, async (transaction) => {
        const refReference = doc(db, "Reference", "Company");
        const data = await transaction.get(refReference);

        if (!data.exists()) {
          transaction.set(refReference, {
            number: 1,
          });
          return {
            number: 1,
          };
        } else {
          const value = parseInt(data.data()?.number) || 0;
          const number: number = value + 1;

          transaction.set(refReference, {
            number: number,
          });
          return {
            number: number,
          };
        }
      }).then(async (response) => {
        const { number } = response;
        const docRef = await addDoc(collection(db, "CompanyAdd"), {
          ...data,
          no: `บริษัทที่ ${number}`,
          createAt: createDate,
          //   createBy: Auth.uid,
          companyUpdate: updatedDate,
        });
        // console.log("Document written with ID: ", docRef.id);
      });
      toast({
        title: "เพิ่มข้อมูลบริษัทสำเร็จ",
        description: "ข้อมูลบริษัทได้ถูกเพิ่มแล้ว",
        status: "success",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
    } catch (e) {
      console.error("errors adding: ", e);
    }
    reset();
    setIsLoading(false);
  };

  return (
    <div>
      <Box>
        <Button
          onClick={onOpen}
          color="gray.100"
          bg="#4C7BF4"
          _hover={{ color: "white", bg: "#4C7BF4" }}
        >
          เพิ่มข้อมูลบริษัท
        </Button>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent w={{ base: "90%", sm: "90%", md: "30rem" }}>
          <ModalCloseButton />
          <ModalBody py="3rem">
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
                    minLength: {
                      value: 13,
                      message: "กรุณาใส่เลขประจำตัวให้ครบ 13 หลัก",
                    },
                    maxLength: {
                      value: 13,
                      message: "คุณใส่เลขประจำตัวเกิน 13 หลัก",
                    },
                  }}
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel>เลขประจำตัวผู้เสียภาษี</FormLabel>
                      <Input
                        type="number"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                      <FormErrorMessage>
                        {errors.userTax?.message}
                      </FormErrorMessage>
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
