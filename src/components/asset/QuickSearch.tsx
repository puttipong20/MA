/* eslint-disable react-hooks/exhaustive-deps */
import { SearchIcon } from '@chakra-ui/icons'
import { Box, Button, HStack, Input, Popover, PopoverContent, PopoverTrigger, Spinner, Text } from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function QuickSearch() {
    const [isSearching, setIsSearching] = useState(false)
    const [defaultOpen, setDefaultOpen] = useState(true);

    const sleep = async (s: number) => {
        return new Promise(resolve => setTimeout(resolve, s * 1000))
    }

    const initial = async () => {
        setDefaultOpen(true);
        await sleep(2)
        setDefaultOpen(false)
    }

    useEffect(() => {
        initial()
    }, [])

    


    return (
        <Box w="100%">
            <Popover placement={'left-start'} isOpen={defaultOpen}>
                <PopoverTrigger>
                    <Button colorScheme='blue' borderRadius={"50%"} w="45px" h="45px" onClick={() => { setDefaultOpen(!defaultOpen) }}><SearchIcon /></Button>
                </PopoverTrigger>
                <PopoverContent w="fit-content" bg={"#4C7BF4"} color="white">
                    <Box p="1rem">
                        <Text>กรอกข้อมูลเพื่อด่วนได้เลย!</Text>
                        <HStack>
                            <Input type="text" placeholder="Ex. ABC123, Project, Company" bg="#fff" color="black" />
                            {
                                isSearching ?
                                    <Spinner onClick={() => { setIsSearching(false) }} /> :
                                    <Text
                                        cursor={"pointer"}
                                        userSelect={"none"}
                                        color="rgb(255,255,255)"
                                        transition={"all 0.3s"}
                                        borderRadius={"10px"}
                                        // _hover={{ color: "rgb(255,255,255)", fontWeight: "bold" }}
                                        p={"0.25rem"} onClick={() => { setIsSearching(true) }}
                                        _hover={{bg:"rgba(255,255,255,0.5)"}}
                                    >
                                        ค้นหา
                                    </Text>
                            }
                        </HStack>
                    </Box>
                </PopoverContent>
            </Popover>
        </Box>
    )
}
