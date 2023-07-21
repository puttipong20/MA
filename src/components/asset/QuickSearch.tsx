/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { SearchIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    HStack,
    Highlight,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import { DataContext } from "../../context/DataContext";
import { search } from "ss-search";

type Company = {
    companyName: string,
    companyId: string,
    projects: { projectName: string, projectId: string }[]
}

export default function QuickSearch() {
    const [isSearching, setIsSearching] = useState(false);
    const [defaultOpen, setDefaultOpen] = useState(true);
    const [dataSearch, setDataSearch] = useState<Company[]>([]);
    const [searchValue, setSearchValue] = useState("");
    const { control } = useForm();
    const [toggleElem, setToggleElem] = useState(true);
    const DataCtx = useContext(DataContext)

    const sleep = async (s: number) => {
        return new Promise((resolve) => setTimeout(resolve, s * 1000));
    };

    const initial = async () => {
        setDefaultOpen(true);
        await sleep(2);
        setDefaultOpen(true);
    };

    useEffect(() => {
        initial();
    }, []);

    const keyHandler = (e: any) => {
        // console.log(e.key)
        if (e.key === "Enter") {
            // searchFunc();
            console.log("")
        }
    }

    const onSearch = (e: any) => {
        console.clear();
        const dataForSearch = DataCtx.data
        console.log(dataForSearch)
        const inputRef = e.target as HTMLInputElement;
        const searchField = ["companyName", "projects.projectName"];
        console.log(searchField)
        const value = inputRef.value;
        setSearchValue(value)
        if (value !== "") {
            const result = search(dataForSearch, searchField, value) as Company[]
            setDataSearch(result)
            console.log(result)
        } else {
            setDataSearch([])
        }
    }

    return (
        <Box w="100%">
            <Popover placement={"left-start"} isOpen={defaultOpen}>
                <PopoverTrigger>
                    <Button
                        colorScheme="blue"
                        borderRadius={"50%"}
                        w="45px"
                        h="45px"
                        onClick={() => {
                            setDefaultOpen(!defaultOpen);
                        }}
                    >
                        <SearchIcon />
                    </Button>
                </PopoverTrigger>
                <PopoverContent w="fit-content" bg={"#4C7BF4"} color="white">
                    <Box p="1rem">
                        <Text>
                            กรอกข้อมูลเพื่อค้นหาด่วนได้เลย!
                            <Text as="span" onClick={() => { setToggleElem(!toggleElem) }} fontSize={"3xl"} cursor={"pointer"}>+</Text>
                        </Text>
                        <HStack alignItems={"center"}>
                            <HStack justify={"flex-start"}>
                                <Controller
                                    name="searchValue"
                                    control={control}
                                    render={() => (
                                        <Input
                                            type="text"
                                            placeholder="Ex. ABC123, Project, Company"
                                            bg="#fff"
                                            color="black"
                                            onChange={onSearch}
                                            onKeyDown={keyHandler}
                                        />
                                    )}
                                />
                            </HStack>
                            <Box w="45px" display="flex" alignItems="center">
                                {isSearching ? (
                                    <Spinner
                                        onClick={() => {
                                            setIsSearching(false);
                                        }}
                                    />
                                ) : (
                                    <Text
                                        cursor={"pointer"}
                                        userSelect={"none"}
                                        color="rgb(255,255,255)"
                                        transition={"all 0.3s"}
                                        borderRadius={"10px"}
                                        // _hover={{ color: "rgb(255,255,255)", fontWeight: "bold" }}
                                        p={"0.25rem"}
                                        // onClick={() => {
                                        //     setIsSearching(true);
                                        //     searchFunc();
                                        // }}
                                        _hover={{ bg: "rgba(255,255,255,0.5)" }}
                                    >
                                        ค้นหา
                                    </Text>
                                )}
                            </Box>
                        </HStack>
                    </Box>
                    {
                        toggleElem &&
                        <Box p="1rem" pt="0">
                            <Text>ผลการค้นหา</Text>
                            <Box maxH="150px" overflowY={"auto"} bg="white" color="black">
                                {dataSearch.map((d, index) => {
                                    if (d.projects.length > 0) {
                                        return d.projects.map((p, index) => {
                                            const text = `${d.companyName} > ${p.projectName}`
                                            return (
                                                <Text key={index} m="0.25rem">
                                                    <Highlight
                                                        query={searchValue}
                                                        styles={{ bg: 'yellow' }}
                                                    >
                                                        {text}
                                                    </Highlight>
                                                </Text>
                                            )
                                        })
                                    } else {
                                        const text = `${d.companyName}`
                                        return (
                                            <Text key={index} m="0.25rem">
                                                <Highlight
                                                    query={searchValue}
                                                    styles={{ bg: 'yellow' }}
                                                >
                                                    {text}
                                                </Highlight>
                                            </Text>
                                        )
                                    }

                                })}
                            </Box>
                        </Box>

                    }
                </PopoverContent>
            </Popover>
        </Box>
    );
}
