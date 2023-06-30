import { useContext } from 'react'
import {
    Box,
    Button,
    Menu,
    MenuButton,
    MenuList,
    // MenuItem,
    // MenuItemOption,
    // MenuGroup,
    // MenuOptionGroup,
    // MenuDivider,
    VStack,
} from '@chakra-ui/react'

import { AuthContext } from '../context/AuthContext';
import { LuLogOut } from 'react-icons/lu';
import { auth } from '../services/config-db';
import { signOut } from 'firebase/auth';

export default function ProfileMenu() {
    const Auth = useContext(AuthContext);

    const logout = () => {
        signOut(auth);
        Auth.clearUser();
    }

    return (
        <Box>
            <Menu>
                <MenuButton as={Button}>
                    Profile
                </MenuButton>
                <MenuList p="0">
                    <VStack p="0" zIndex={'popover'} spacing={0} m="0" w="100%" align={"left"}>
                        <Button leftIcon={<LuLogOut />} onClick={logout}>Logout</Button>
                    </VStack>
                </MenuList>
            </Menu>
        </Box>
    )
}
