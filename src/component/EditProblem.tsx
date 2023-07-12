import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
  VStack,
  Modal,
  useDisclosure,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
} from "@chakra-ui/react";
import { doc, updateDoc } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { db } from "../services/config-db";
import moment from "moment";
import { MdUpload } from "react-icons/md";
import ImageComp from "../components/kim/ImageComp";
import { AuthContext } from "../context/AuthContext";

type PValue = {
  title: string;
  detail: string;
  phone: string;
  line: string;
  email: string;
  createAt: string;
  name: string;
  RepImg: [];
};

const EditProblem = ({ data, id }: any) => {
  const [imageUpload, setImageUpload] = useState<string[]>([]);
  useEffect(() => {
    // console.log(data);
    if (data !== undefined && data.RepImg !== undefined) {
      setImageUpload(data.RepImg);
    }
  }, [data]);

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors },
  } = useForm<PValue>();

  const [filesUpload, setFilesUpload] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const AuthCtx = useContext(AuthContext);

  const editDateAt = moment().format("YYYY-MM-DD HH:mm:ss");

  useEffect(() => {
    if (data) {
      setValue("title", data?.problem);
      setValue("detail", data?.details);
      setValue("phone", data?.phone);
      setValue("line", data?.lineID);
      setValue("email", data?.email);
      setValue("name", data?.name);
      setValue("RepImg", data?.RepImg);
    }
  }, [data]);

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // console.log(id);
    if (id) {
      const DocRef = doc(db, "Report", id);
      await updateDoc(DocRef, {
        ...data,
        latestReportUpdate: {
          timestamp: moment().format("YYYY-MM-DD HH:mm:ss"),
          uid: AuthCtx.uid,
          username: AuthCtx.username,
        },
        RepImg: imageUpload,
      })
        .then(() => {
          toast({
            title: "อัพเดทข้อมูลสำเร็จ",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
          reset();
          onClose();
          // console.log(data);
        })
        .catch((e) => {
          console.error(e);
          toast({
            title: "อัพเดทข้อมูลไม่สำเร็จ",
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
        });
    }
    setIsLoading(false);
  };

  const uploadFile = (event: any) => {
    const uploadFiles: File[] = Array.from(event.target.files || []);
    setFilesUpload((prevFiles) => [...prevFiles, ...uploadFiles]);
    const files = event.target.files;
    const promises: Promise<any>[] = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      const promise = new Promise((resolve) => {
        reader.onload = (e: any) => {
          resolve(e.target.result);
        };
      });

      reader.readAsDataURL(files[i]);
      promises.push(promise);
    }

    Promise.all(promises).then((results) => {
      setImageUpload([...imageUpload, ...results]);
    });
  };

  const removeFile = (index: number) => {
    setFilesUpload(filesUpload.filter((i) => i !== filesUpload[index]));
    setImageUpload(imageUpload.filter((i) => i !== imageUpload[index]));
  };

  return (
    <>
      <Button
        onClick={() => {
          onOpen();
        }}
        w="max-content"
        h="100%"
        bg="yellow.200"
        _hover={{ opacity: 0.8 }}
      >
        <Flex
          color="green"
          fontSize="16px"
          fontFamily="Prompt"
          fontWeight="400"
          align="center"
        >
          <Text>แก้ไขรายละเอียด</Text>
        </Flex>
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
        <ModalOverlay />
        <ModalContent w={{ base: "90%", sm: "90%", md: "30rem" }} p="1rem">
          <ModalCloseButton />
          <ModalHeader textAlign="center">แก้ไขข้อมูล</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                <Controller
                  name="createAt"
                  control={control}
                  defaultValue={editDateAt}
                  rules={{ required: true }}
                  render={({ field: { value, onChange, onBlur } }) => (
                    <FormControl isReadOnly>
                      <FormLabel color="#1B2559">วันที่ แก้ไข</FormLabel>
                      <Input
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        borderRadius="12px"
                        type="datetime-local"
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="title"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel color="#1B2559">ปัญหาที่พบ</FormLabel>
                      <Input
                        placeholder="ระบุปัญหาที่พบ"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        borderRadius="12px"
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="detail"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel color="#1B2559">รายละเอียด</FormLabel>
                      <Textarea
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="ใส่รายละเอียดเพิ่มเติม..."
                        borderRadius="12px"
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="name"
                  control={control}
                  defaultValue=""
                  rules={{ required: true }}
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel color="#1B2559">ชื่อผู้แจ้งปัญหา</FormLabel>
                      <Input
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="ระบุชื่อของคุณ"
                        borderRadius="12px"
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  defaultValue=""
                  render={({ field: { value, onChange, onBlur } }) => (
                    <FormControl>
                      <FormLabel color="#1B2559">เบอร์โทร</FormLabel>
                      <Input
                        type="tel"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="ระบุเบอร์โทรที่ใช้ในการติดต่อ"
                        borderRadius="12px"
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="line"
                  control={control}
                  defaultValue=""
                  render={({ field: { value, onChange, onBlur } }) => (
                    <FormControl>
                      <FormLabel color="#1B2559">ไลน์</FormLabel>
                      <Input
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="ระบุไลน์ ID ที่ใช้ในการติดต่อ"
                        borderRadius="12px"
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue=""
                  render={({ field: { value, onChange, onBlur } }) => (
                    <FormControl>
                      <FormLabel color="#1B2559">อีเมล</FormLabel>
                      <Input
                        type="email"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="ระบุอีเมลที่ใช้ในการติดต่อ"
                        borderRadius="12px"
                      />
                    </FormControl>
                  )}
                />
                <Box>
                  <Text pb="3" color="#1B2559">
                    อัพโหลดไฟล์รูปเพิ่มเติม
                  </Text>
                  <Box p="20px">
                    <Grid
                      templateColumns={"repeat(3,1fr)"}
                      w={imageUpload.length >= 3 ? "fit-content" : "100%"}
                      gap={"1.5rem"}
                      mx="auto"
                    >
                      {imageUpload.map((i, index) => {
                        return (
                          <ImageComp
                            key={index}
                            src={i}
                            index={index}
                            removeHandle={removeFile}
                          />
                        );
                      })}
                      <Box>
                        <label htmlFor="editImageInput">
                          <VStack
                            textAlign={"center"}
                            border="1px dashed gray"
                            justifyContent={"center"}
                            p={4}
                            h="165PX"
                            w="100%"
                            borderRadius="10px"
                            cursor={"pointer"}
                            userSelect={"none"}
                            bg="#FAFCFE"
                          >
                            <Flex color="#4c7bf4" fontSize={"2rem"}>
                              <MdUpload />
                            </Flex>
                            <Text
                              color="#4c7bf4"
                              fontWeight="bold"
                              fontSize={"0.9rem"}
                            >
                              คลิกเพื่ออัพโหลดไฟล์
                            </Text>
                            <Text color="#8F9BBA" fontSize={"0.6rem"}>
                              PNG,JPG are allowed
                            </Text>
                          </VStack>
                        </label>
                        <Input
                          type="file"
                          display="none"
                          id="editImageInput"
                          accept="image/png, image/jpeg"
                          onChange={uploadFile}
                          multiple
                        />
                      </Box>
                    </Grid>
                  </Box>
                </Box>
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

export default EditProblem;
