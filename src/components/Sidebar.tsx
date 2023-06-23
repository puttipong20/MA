import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  Box,
  // Divider,
  Flex,
  HStack,
  Heading,
  Text,
  AccordionPanel,
  VStack,
} from "@chakra-ui/react";
import { useContext } from "react";
import { AiFillHome } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthContext";

interface Props {
  id: string;
  client?: string;
}

const Sidebar: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const Auth = useContext(AuthContext);
  // console.log(props);
  return (
    <Box w="max-content" h="100%" position="relative">
      <Heading
        cursor={"pointer"}
        onClick={() => {
          navigate("/");
        }}
        fontSize={"1.5rem"}
        fontFamily={"inherit"}
        my="1rem"
      >
        CRAFTING LAB
      </Heading>
      {/* <Divider /> */}
      <HStack justifyContent={"space-around"}>
        <Accordion allowToggle w="100%">
          <AccordionItem>
            <AccordionButton>
              <Flex w="100%" position="relative">
                <Box
                  w="fit-content"
                  h="fit-content"
                  position="absolute"
                  left="-10px"
                  top="50%"
                  transform={"translate(0%,-50%)"}
                  color="#4C7BF4"
                >
                  <AiFillHome />
                </Box>
                <Text fontWeight={"bold"} pl="10px">
                  Project
                </Text>
              </Flex>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel
              w="100%"
              justifyContent={"center"}
              textAlign={"left"}
            >
              <VStack pl="10px">
                {(Auth.detail.role === "admin"
                  ? true
                  : Auth.detail.company === "gogreen"
                    ? true
                    : false) && (
                    <Text
                      w="100%"
                      transition={"all 0.1s"}
                      fontWeight={props.id === "gogreen" ? "bold" : "normal"}
                      cursor="pointer"
                      onClick={() => {
                        navigate("/preview/gogreen");
                      }}
                      _hover={{ fontWeight: "bold" }}
                    >
                      Go Green
                    </Text>
                  )}
                {(Auth.detail.role === "admin"
                  ? true
                  : Auth.detail.company === "diwalai"
                    ? true
                    : false) && (
                    <Text
                      w="100%"
                      transition={"all 0.1s"}
                      fontWeight={props.id === "diwalai" ? "bold" : "normal"}
                      cursor="pointer"
                      onClick={() => {
                        navigate("/preview/diwalai");
                      }}
                      _hover={{ fontWeight: "bold" }}
                    >
                      Diwalai
                    </Text>
                  )}
                {(Auth.detail.role === "admin"
                  ? true
                  : Auth.detail.company === "saimai"
                    ? true
                    : false) && (
                    <Text
                      w="100%"
                      transition={"all 0.1s"}
                      fontWeight={props.id === "saimai" ? "bold" : "normal"}
                      cursor="pointer"
                      onClick={() => {
                        navigate("/preview/saimai");
                      }}
                      _hover={{ fontWeight: "bold" }}
                    >
                      Saimai
                    </Text>
                  )}
              </VStack>
            </AccordionPanel>
            {/* <Flex w="100%" justifyContent={"center"}>
                            <LogoutBtn />
                        </Flex> */}
          </AccordionItem>
        </Accordion>
      </HStack>
    </Box>
  );
};

export default Sidebar;
