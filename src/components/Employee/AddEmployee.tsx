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
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { BsPersonPlusFill } from "react-icons/bs";
import { useForm, Controller } from "react-hook-form";
import { useState } from "react";

const AddEmployee: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { handleSubmit, control, watch } = useForm();
  const [seePass, setSeePass] = useState(false);

  const onSubmit = (d: any) => {
    console.log(d);
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
        // borderRadius={"10px"}
        _hover={{ bg: "#0001" }}
        onClick={onOpen}
      >
        <Text display="flex" alignItems={"center"} gap={"1rem"}>
          <BsPersonPlusFill />
          เพิ่มพนักงาน
        </Text>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalBody>
            <Box>
              <Heading fontFamily={"inherit"} textAlign={"center"}>
                เพิ่มพนักงาน
              </Heading>
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
                    colorScheme="green"
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
