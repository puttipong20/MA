import { Box, Button, Flex } from "@chakra-ui/react";
import AppSidebar from "./AppSidebar";
import classes from "./Layout.module.css";
import { useState } from "react";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import QuickSearch from "../components/asset/QuickSearch";

interface Props {
  children?: React.ReactNode;
}

const Layout: React.FC<Props> = (props) => {
  const [isTrigger, setIsTrigger] = useState<boolean>(false);
  return (
    <Flex h="100vh" position={"relative"}>
      <Box
        h="100%"
        overflowY={"auto"}
        className={classes.sidebar}
        px="10px"
        w="20%-18%"
        // display={[isTrigger ? "block" : "none", !isTrigger ? "none" : "block"]}
        // display={{isTrigger ? "block" : "none", !isTrigger ? "none" : "block"}}
        display={{
          base: `${isTrigger ? "block" : "none"}`,
          lg: `${!isTrigger ? "none" : "block"}`,
        }}
        minW={["fit-content", "30%", "15%"]}
        mr="15px"
        boxShadow={"5px 5px 5px rgba(0,0,0,0.1)"}
        // color="#fff" bg="#0F141F"
        color="#0F141F"
        bg="#fff"
        position={["absolute", "static"]}
        zIndex={[5, 0]}
        fontFamily={"inherit"}
      >
        <AppSidebar
          setTriggle={() => {
            setIsTrigger(!isTrigger);
          }}
        />
      </Box>
      <Box w="calc(100% - 0%)" p="1rem" maxH="100%" overflow={"hidden"}>
        <Button
          bg="#4C7BF4"
          color="white"
          _hover={{ opacity: "0.8" }}
          onClick={() => setIsTrigger(!isTrigger)}
          size="sm"
          ml="1rem"
          borderRadius="16px"
        >
          {isTrigger ? <CloseIcon /> : <HamburgerIcon />}
        </Button>
        {props.children}
      </Box>
      <Box position="absolute" bottom="0.75rem" right="1rem">
        <QuickSearch />
      </Box>
    </Flex>
  );
};

export default Layout;
