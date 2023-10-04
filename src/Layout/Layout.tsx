import { Box, Flex } from "@chakra-ui/react";
import AppSidebar from "./AppSidebar";
import ProfileBar from "../components/asset/Profilebar";

interface Props {
  children?: React.ReactNode;
}

const Layout: React.FC<Props> = (props) => {
  return (
    <Flex h="100vh" maxW={'100%'} overflowX={'auto'} m={0} p={0}>
      <Box minW={'100%'} maxH="100%" >
        <Flex justifyContent={'space-between'} m={4} >
          <AppSidebar />
          <ProfileBar />
        </Flex>
        {props.children}
      </Box>
    </Flex>
  );
};

export default Layout;
