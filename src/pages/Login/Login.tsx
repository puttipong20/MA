import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FC, useContext, useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/config-db";
import ResetModal from "./ResetPass";
import { AuthContext } from "../../context/AuthContext";

const Login: FC = () => {
  //hook state
  const navigate = useNavigate();
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const Auth = useContext(AuthContext)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitData = (data: any) => {
    setIsLoading(true);
    const email = data.email;
    const password = data.password;
    signInWithEmailAndPassword(auth, email, password)
      .then(async (currentUser) => {
        const user = currentUser.user;
        if (user !== null) {
          const uid = user.uid;
          Auth.setNewUser(uid, user.displayName ? user.displayName : user.email as string)
          toast({
            title: "Loggin is success.",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
          navigate("/")
          setIsLoading(false)
        }
      })
      .catch(() => {
        setIsLoading(false)
        toast({
          title: "Loggin fail",
          description: `password or email is invalid.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      });
  };

  useEffect(() => {
    if (Auth.uid !== "") {
      navigate("/")
    }
  })

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
                <Heading color={"white"}>Log In</Heading>
              </Center>
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
                      border="1px solid #eee"
                      _focus={{ border: "1px solid #fff" }}
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
                      border="1px solid #eee"
                      _focus={{ border: "1px solid #fff" }}
                    />
                  </FormControl>
                )}
              />
              <Box textAlign={"end"}>
                <ResetModal />
              </Box>
              <Center>
                <Flex alignItems={"center"}>
                  <Button bgColor={"white"} type="submit" my={5} isLoading={isLoading}>
                    Login
                  </Button>
                  <Box>
                    {/* <Link to={"/register"}>
                      <Text mx={5} color={"white"}>
                        Register
                      </Text>
                    </Link> */}
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

export default Login;
