import { Box, Flex } from "@chakra-ui/react";

import AppSidebar from "../../components/kim/AppSidebar";

import classes from "./Project.module.css";

interface Props {
  children?: React.ReactNode;
}

const Project: React.FC<Props> = (props) => {
  return (
    <Flex h="100vh">
      <Box
        h="100%"
        overflowY={"auto"}
        className={classes.sidebar}
        px="10px"
        w="15%"
        minW={"15%"}
        mr="15px"
        boxShadow={"5px 5px 5px rgba(0,0,0,0.1)"}
        // color="#fff" bg="#0F141F"
        color="#0F141F"
        bg="#fff"
        fontFamily={"inherit"}
      >
        <AppSidebar />
      </Box>
      <Box w="calc(100% - 15%)" p="1rem" position="relative">
        {props.children}
      </Box>
    </Flex>
  );
};

export default Project;
