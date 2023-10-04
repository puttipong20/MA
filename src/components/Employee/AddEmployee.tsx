/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

import { httpsCallable } from "firebase/functions";
import { functions } from "../../services/config-db";

const createUser = httpsCallable(functions, "addUser");

const AddEmployee: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, control, watch } = useForm();
  const [seePass, setSeePass] = useState(false);
  const toast = useToast();

  const onSubmit = (d: any) => {
    onClose();
    createUser({
      email: d.email,
      password: d.password,
      userName: d.username,
    })
      .then((res) => {
        console.log(res.data);
        toast({
          position: "top",
          title: "เสร็จสิ้น",
          description: `เพิ่ม ${res.data} แล้ว`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
      })
      .catch((e) => {
        console.log(e);
        toast({
          position: "top",
          title: "เกิดข้อผิดพลาด",
          description: `${e}`,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const pass = watch("password") || "";
  const conPass = watch("con-password") || "";
  return (
    <>
      <Box
        w="100%"
        p="0.5rem"
        userSelect={"none"}
        cursor={"pointer"}
        transition={"all 0.3s"}
        _hover={{ bg: "#0001" }}
        onClick={onOpen}
      >
        <Box display="flex" alignItems={"center"} gap={"1rem"}>
          <Text>เพิ่มพนักงาน</Text>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent borderRadius={'16px'}>
          <ModalCloseButton color={'#fff'}/>
          <ModalHeader bg="#4C7BF4" color={'#fff'} borderTopRadius={'16px'}>
            <Heading fontFamily={"inherit"} textAlign={"center"}>
              เพิ่มพนักงาน
            </Heading>
          </ModalHeader>
          <ModalBody >
            <Box>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Controller
                  name="username"
                  control={control}
                  defaultValue={""}
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel fontWeight={"bold"}>Username</FormLabel>
                      <Input type="text" {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name="email"
                  control={control}
                  defaultValue={""}
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel fontWeight={"bold"} mt="0.5rem">
                        Email
                      </FormLabel>
                      <Input type="email" {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name="password"
                  control={control}
                  defaultValue={""}
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel fontWeight={"bold"} mt="0.5rem">
                        Password
                      </FormLabel>
                      <Input
                        type={seePass ? "text" : "password"}
                        minLength={6}
                        {...field}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="con-password"
                  control={control}
                  defaultValue={""}
                  render={({ field }) => (
                    <FormControl isRequired>
                      <FormLabel fontWeight={"bold"} mt="0.5rem">
                        Confirmed Password
                      </FormLabel>
                      <Input
                        type={seePass ? "text" : "password"}
                        minLength={6}
                        {...field}
                      />
                    </FormControl>
                  )}
                />
                {pass !== conPass && (
                  <Box>
                    <Text color="red">รหัสผ่านไม่ตรงกัน !</Text>
                  </Box>
                )}
                {(pass == "" || conPass === "") && (
                  <Box>
                    <Text color="red">กรุณาป้อนรหัสผ่าน !</Text>
                  </Box>
                )}
                <Box>
                  <Checkbox
                    onChange={(e) => {
                      const c = e.currentTarget.checked;
                      setSeePass(c);
                    }}
                  >
                    ดูรหัสผ่าน
                  </Checkbox>
                </Box>
                <Box
                  w="100%"
                  display="flex"
                  justifyContent={"center"}
                  alignItems={"center"}
                  mt="1rem"
                >
                  <Button
                    type="submit"
                    isDisabled={
                      pass !== conPass || pass == "" || conPass === ""
                    }
                    bg="#4C7BF4" color={'#fff'}
                  >
                    เพิ่ม
                  </Button>
                </Box>
              </form>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default AddEmployee;
