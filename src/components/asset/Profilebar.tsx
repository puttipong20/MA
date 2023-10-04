import {
  Box,
  HStack,
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
import { BsPersonPlusFill } from "react-icons/bs";

const ProfileBar: React.FC = () => {
  const User = useContext(AuthContext);

  return (
    <HStack
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
            h="40px"
            overflow={"hidden"}
            w="40px"
            borderLeft="1px solid #0005"
            display="flex"
            justifyContent={"center"}
            alignItems={"center"}
          >
            <BsPersonPlusFill />
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
