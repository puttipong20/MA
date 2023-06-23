import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Text,
  FormControl,
  FormLabel,
  Heading,
  Input,
  useToast,
  FormErrorMessage,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { FC, useContext, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../services/config-db";
import ResetModal from "../components/Modal";
import { AuthContext } from "../context/AuthContext";
import { doc, getDoc } from "firebase/firestore";

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
  //funcionts
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const submitData = (data: any) => {
    console.log(data);
    const email = data.email;
    const password = data.password;
    signInWithEmailAndPassword(auth, email, password)
      .then(async (currentUser) => {
        setIsLoading(true);
        const user = currentUser.user;
        if (user) {
          const uid = user.uid;
          const userDetail = await getDoc(doc(db, "Profiles", uid))
          if (userDetail.exists()) {
            Auth.setNewUser(uid, userDetail.data() as { role: string, company: string })
          }
          toast({
            title: "Loggin is success.",
            description: `${user.email} is loggin`,
            status: "success",
            duration: 1000,
            isClosable: true,
            position: "top",
          });
          // console.log(Auth)
          if (Auth.detail.company) navigate(`/preview/${Auth.detail.company}`);
          setIsLoading(false)

        }
      })
      .catch((e) => {
        console.log(e);
        toast({
          title: "Loggin is success.",
          description: `password or email is invalid.`,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      });
  };
  return (
    <Container p={0} m={0} maxW={"100%"}>
      <Button>hello world</Button>
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
              <Box textAlign={"end"}>
                <ResetModal />
              </Box>
              <Center>
                <Flex alignItems={"center"}>
                  <Button bgColor={"white"} type="submit" my={5} isLoading={isLoading}>
                    Login
                  </Button>
                  <Box>
                    <Link to={"/register"}>
                      <Text mx={5} color={"white"}>
                        Register
                      </Text>
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

export default Login;
