// import React from 'react'
import { Box, Button, Flex, Input, InputGroup, InputLeftElement, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { BellIcon, InfoOutlineIcon, MoonIcon, SearchIcon } from '@chakra-ui/icons';
import { CgProfile } from 'react-icons/cg';

interface Props {
    role: string;
    company: string;
}

const ProfileMenuBar: React.FC<Props> = (props) => {
    return (
        <Flex align="center" justifyItems="center">
            <InputGroup>
                <InputLeftElement>
                    <SearchIcon color="gray" />
                </InputLeftElement>
                <Input borderRadius="20" placeholder="Search" mr="5%" />
            </InputGroup>
            <Box w="100%">
                <Flex align="center" justifyContent={"space-around"}>
                    <BellIcon color="gray" />
                    <MoonIcon color="gray" />
                    <InfoOutlineIcon color="gray" />
                    <Menu>
                        <MenuButton as={Button}>
                            <CgProfile />
                        </MenuButton>
                        <MenuList>
                            <MenuItem>{props.role}</MenuItem>
                            <MenuItem>{props.company}</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </Box>
        </Flex>
    )
}

export default ProfileMenuBar;