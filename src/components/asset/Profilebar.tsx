import {
  Box,
  HStack,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useContext } from "react";
// import { AiOutlineBell } from "react-icons/ai";
import LogoutButton from "../../pages/Login/Logout";
import { AuthContext } from "../../context/AuthContext";
import AddEmployee from "../Employee/AddEmployee";

const ProfileBar: React.FC = () => {
  const User = useContext(AuthContext);

  return (
    <HStack
      position="absolute"
      right="1rem"
      top="1rem"
      border="1px solid #0005"
      borderRadius={"20px"}
      w="fit-content"
      maxW={"30%"}
      px="1rem"
      py="0.25rem"
      boxShadow={"2px 2px 5px 1px #0005"}
    >
      <Text noOfLines={1}>{User.username}</Text>
      <Menu placement="bottom-start">
        <MenuButton>
          <Box
            h="50px"
            borderRadius={"50%"}
            overflow={"hidden"}
            w="50px"
            border="1px solid #0005"
            display="flex"
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Image
              src={"/img/empty.jpg"}
              fallbackSrc="/img/empty.jpg"
              maxH="100%"
            />
          </Box>
        </MenuButton>
        <MenuList p="0" borderRadius={0}>
          <MenuItem p="0">
            <AddEmployee />
          </MenuItem>
          <MenuItem p="0">
            <LogoutButton />
          </MenuItem>
        </MenuList>
      </Menu>
    </HStack>
  );
};

export default ProfileBar;
