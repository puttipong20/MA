import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Text,
  useToast,
} from "@chakra-ui/react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../services/config-db";
import { doc, setDoc } from "firebase/firestore";

const Register: FC = () => {
  // hook state
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const toast = useToast();
  const wRole = watch("role");
  //functions
  const submitData = (data: any) => {
    // console.log(data);
    const email = data.email;
    const password = data.password;
    const cPassword = data.confirmPassword;
    if (cPassword == password) {
      try {
        createUserWithEmailAndPassword(auth, email, password).then(
          async (userAuth) => {
            const user = userAuth.user;
            if (user) {
              await setDoc(doc(db, "Profiles", user.uid), {
                ...data,
                uid: user.uid,
              });
              toast({
                title: "Account created.",
                description: `${user.email} is added`,
                status: "success",
                duration: 1000,
                isClosable: true,
                position: "top",
              });
              navigate("/login");
            }
          }
        );
      } catch (e) {
        console.log(e);
      }
    } else {
      toast({
        title: "Something went wrong.",
        description: "Password or Confirm password is invalid.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  };
  return (
    <Container p={0} m={0} maxW={"100%"}>
      <Box
        w={"100%"}
        h={"100vh"}
        my={"auto"}
        bgGradient="linear(to-r, #e5f1e3, #8fb1e9)"
      >
        <Flex alignItems={"center"} h={"100vh"} justifyContent={"center"}>
          <Box bgColor={"#4C7BF4"} width={"md"} p={9} borderRadius={"10px"}>
            <form onSubmit={handleSubmit(submitData)}>
              <Center>
                <Heading color={"white"}>Register</Heading>
              </Center>
              <Controller
                name="role"
                defaultValue={""}
                control={control}
                rules={{ required: true }}
                render={({ field: { name, onChange } }) => (
                  <FormControl isInvalid={Boolean(errors[name])} my={4}>
                    <Select
                      color={`white`}
                      onChange={onChange}
                      placeholder="---- Role ----"
                    >
                      <option style={{ color: "black" }} value="admin">
                        Admin
                      </option>
                      <option style={{ color: "black" }} value="client">
                        Client
                      </option>
                    </Select>
                  </FormControl>
                )}
              />
              {wRole == "client" && (
                <Controller
                  name="company"
                  defaultValue={""}
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { name, onChange } }) => (
                    <FormControl isInvalid={Boolean(errors[name])} my={4}>
                      <FormLabel color={"white"}>Company *</FormLabel>
                      <Select
                        color={`white`}
                        onChange={onChange}
                        placeholder="---- Company ----"
                      >
                        <option style={{ color: "black" }} value="gogreen">
                          Gogreen
                        </option>
                        <option style={{ color: "black" }} value="diwalai">
                          Diwalai
                        </option>
                        <option style={{ color: "black" }} value="saimai">
                          SaiMai
                        </option>
                      </Select>
                    </FormControl>
                  )}
                />
              )}
              <Controller
                name="username"
                defaultValue={""}
                control={control}
                rules={{ required: true }}
                render={({ field: { name, value, onChange } }) => (
                  <FormControl isInvalid={Boolean(errors[name])} my={4}>
                    <FormLabel color={"white"}>Username *</FormLabel>
                    <Input color={"white"} value={value} onChange={onChange} />
                  </FormControl>
                )}
              />
              <Controller
                name="email"
                defaultValue={""}
                control={control}
                rules={{
                  required: true,
                  pattern: {
                    value: /[a-z0-9]+@[a-z]+\.[a-z]{2,3}/,
                    message: "example: aaa@gmail.com",
                  },
                }}
                render={({ field: { name, value, onChange } }) => (
                  <FormControl isInvalid={Boolean(errors[name])} my={4}>
                    <FormLabel color={"white"}>Email *</FormLabel>
                    <Input
                      type="email"
                      color={"white"}
                      value={value}
                      onChange={onChange}
                    />
                    <FormErrorMessage color={"black"}>
                      {errors.email?.message as string}
                    </FormErrorMessage>
                  </FormControl>
                )}
              />
              <Controller
                name="password"
                defaultValue={""}
                control={control}
                rules={{ required: true }}
                render={({ field: { name, value, onChange } }) => (
                  <FormControl isInvalid={Boolean(errors[name])}>
                    <FormLabel color={"white"}>Password *</FormLabel>
                    <Input
                      type="password"
                      color={"white"}
                      value={value}
                      onChange={onChange}
                    />
                  </FormControl>
                )}
              />
              <Controller
                name="confirmPassword"
                defaultValue={""}
                control={control}
                rules={{ required: true }}
                render={({ field: { name, value, onChange } }) => (
                  <FormControl isInvalid={Boolean(errors[name])}>
                    <FormLabel color={"white"}>Confirm Password *</FormLabel>
                    <Input
                      type="password"
                      color={"white"}
                      value={value}
                      onChange={onChange}
                    />
                  </FormControl>
                )}
              />
              <Center>
                <Flex alignItems={"center"}>
                  <Button
                    bgColor={"white"}
                    type="reset"
                    onClick={() => reset()}
                    my={5}
                  >
                    Reset
                  </Button>
                  <Button bgColor={"white"} type="submit" my={5} mx={5}>
                    Register
                  </Button>
                  <Box>
                    <Link to={"/login"}>
                      <Text color={"white"}>Login</Text>
                    </Link>
                  </Box>
                </Flex>
              </Center>
            </form>
          </Box>
        </Flex>
      </Box>
    </Container>
  );
};

export default Register;
