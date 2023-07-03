import { Box, Button, Flex } from "@chakra-ui/react";
import AppSidebar from "../../components/kim/AppSidebar";
import classes from "./Project.module.css";
import { useState } from "react";
import { HamburgerIcon } from "@chakra-ui/icons";

interface Props {
  children?: React.ReactNode;
}

const Project: React.FC<Props> = (props) => {
  const [isTrigger, setIsTrigger] = useState<boolean>(false);
  return (
    <Flex h="100vh" position={"relative"}>
      {isTrigger ? (
        <Box
          h="100%"
          overflowY={"auto"}
          className={classes.sidebar}
          px="10px"
          w="30%"
          minW={["fit-content", "15%"]}
          mr="15px"
          boxShadow={"5px 5px 5px rgba(0,0,0,0.1)"}
          // color="#fff" bg="#0F141F"
          color="#0F141F"
          bg="#fff"
          // position={["absolute","relative"]}
          display={["flex", "block"]}
          zIndex={[2, 0]}
          fontFamily={"inherit"}
        >
          <AppSidebar />
        </Box>
      ) : (
        ""
      )}
      <Box w="calc(100% - 0%)" p="1rem" maxH="100%" overflow={"hidden"}>
        <Button bg="#4C7BF4" color="white" _hover={{opacity:"0.8"}} onClick={() => setIsTrigger(!isTrigger)} size="sm" ml="1rem">
          <HamburgerIcon />
        </Button>
        {props.children}
      </Box>
    </Flex>
  );
};

export default Project;
