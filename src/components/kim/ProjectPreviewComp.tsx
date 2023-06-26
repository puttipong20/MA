import {
    Box,
    // Badge,
    Text,
    Heading,
    InputGroup,
    Input,
    InputLeftElement,
    Flex,
    Button,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    // Tooltip,
    Spinner,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react'
import { useState, useEffect } from "react";
import { BsSearch } from 'react-icons/bs'

import { LuMoreHorizontal } from "react-icons/lu"
import { CgDetailsMore } from "react-icons/cg"
import { TiDocumentText } from "react-icons/ti"
import { AiOutlineEdit, AiOutlineReload } from "react-icons/ai"

import { useParams, useNavigate } from 'react-router-dom';

import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../../services/config-db';
import { Project, ProjectDetail } from '../../@types/Type';

import { search } from 'ss-search';
import DeleteProject from './DeleteProject';

import classes from "./ProjectPreview.module.css";

export default function ProjectPreviewComp() {
    const [isFetching, setIsFetching] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const [filterProject, setFilterProjects] = useState<Project[]>([]);
    const [companyName, setCompanyName] = useState("");
    const params = useParams();
    const navigate = useNavigate();

    const fetchingData = async () => {
        setIsFetching(true);
        // console.clear();
        // console.log(params);
        const projectCollection = collection(db, "Project")
        const q = query(projectCollection, where("companyID", "==", params["company"]), orderBy("createdAt", "desc"))

        const allProject: Project[] = [];
        // onSnapshot(q, docs => {
        //     docs.forEach((i) => {
        //         const project: Project = {
        //             projectId: i.id,
        //             detail: i.data() as ProjectDetail
        //         }
        //         setCompanyName(project.detail.companyName);
        //         allProject.push(project);
        //     })
        // })
        const companies = await getDocs(q)
        companies.forEach(i => {
            // console.log(i.data());
            // console.log(i.data());
            const project: Project = {
                projectId: i.id,
                detail: i.data() as ProjectDetail
            }
            setCompanyName(project.detail.companyName);
            allProject.push(project);
        }
        )
        setProjects(allProject);
        setFilterProjects(allProject);
        setIsFetching(false);
    }

    const onSearch = () => {
        const inputRef = document.getElementById("projectSearch") as HTMLInputElement;
        const value = inputRef.value;

        const searchField = ["detail.projectName"];
        const result = search(projects, searchField, value) as Project[];
        setFilterProjects(result);
    }

    useEffect(() => {
        fetchingData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params["project"], params["company"]])

    return (
        <Box w="100%">
            <Box h="20%">
                <Heading fontFamily={"inherit"}>ข้อมูล Projects</Heading>
                <Text>ข้อมูล projects ทั้งหมดของบริษัท <Text as="span" fontWeight={"bold"}>{companyName}</Text></Text>
                <Box>
                    <Flex w="100%" justifyContent={"space-between"}>
                        <InputGroup w="30%">
                            <InputLeftElement>
                                <BsSearch />
                            </InputLeftElement>
                            <Input type="text" placeholder='ค้นหา project' id="projectSearch" onChange={onSearch} />
                        </InputGroup>
                        <Button colorScheme='blue' isLoading={isFetching} onClick={fetchingData}><AiOutlineReload /></Button>
                    </Flex>
                </Box>
            </Box>
            {isFetching ?
                <Flex w="100%" h="30vh" align={"center"} justify={"center"}>
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                </Flex>
                :
                <Box w="100%" maxH="80vh" overflow={"auto"} className={classes.table} mt="0.5rem">
                    <Table textAlign={"center"}>
                        <Thead >
                            <Tr bg={"#4c7bf4"}>
                                <Th color="#fff" textAlign={"center"} fontWeight={"normal"} fontFamily={"inherit"}>ลำดับที่</Th>
                                <Th color="#fff" textAlign={"center"} fontWeight={"normal"} fontFamily={"inherit"}>Project</Th>
                                <Th color="#fff" textAlign={"center"} fontWeight={"normal"} w="20rem" fontFamily={"inherit"}>วันที่เริ่มต้นสัญญา MA</Th>
                                <Th color="#fff" textAlign={"center"} fontWeight={"normal"} w="20rem" fontFamily={"inherit"}>วันที่สิ้นสุดสัญญา MA</Th>
                                <Th color="#fff" textAlign={"center"} fontWeight={"normal"} fontFamily={"inherit"}>ค่าบริการ</Th>
                                <Th color="#fff" textAlign={"center"} fontWeight={"normal"} fontFamily={"inherit"}>สร้างเมื่อ</Th>
                                <Th color="#fff" textAlign={"center"} fontWeight={"normal"} fontFamily={"inherit"}>จำนวนรายการปัญหา</Th>
                                <Th color="#fff" textAlign={"center"} fontWeight={"normal"} fontFamily={"inherit"}>จัดการ</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {filterProject.length === 0 ?
                                <Tr>
                                    <Td colSpan={7} textAlign={"center"}>ไม่มีข้อมูล project ของบริษัทนี้</Td>
                                </Tr> :
                                filterProject.map((i, index) => {
                                    return (
                                        <Tr cursor={"pointer"} _hover={{ bg: "#eee" }} key={index}>
                                            <Td textAlign={"center"}>{index + 1}</Td>
                                            <Td textAlign={"center"}>{i.detail.projectName}</Td>
                                            <Td textAlign={"center"}>{i.detail.LastestMA.startMA}</Td>
                                            <Td textAlign={"center"}>{i.detail.LastestMA.endMA}</Td>
                                            <Td textAlign={"center"}>{i.detail.LastestMA.cost}</Td>
                                            <Td textAlign={"center"}>{i.detail.createdAt}</Td>
                                            <Td textAlign={"center"}><Button onClick={() => { navigate(`/company/${params["company"]}/${i.projectId}/${i.detail.projectName}/problemReport`) }}>ดูรายการปัญหา</Button></Td>
                                            <Td textAlign={"center"}>
                                                <Menu>
                                                    <MenuButton as={Button} colorScheme='blue'>
                                                        <LuMoreHorizontal />
                                                    </MenuButton>
                                                    <MenuList p={"0"} borderRadius={"0"}>
                                                        <MenuItem color={"gray"} onClick={() => { navigate(`/company/${params["company"]}/${i.projectId}/detail`) }}>
                                                            <Text w="20%" display="flex" justifyContent={"center"}><CgDetailsMore /></Text>ดูข้อมูล Project
                                                        </MenuItem>
                                                        <MenuItem color={"green"}>
                                                            <Text w="20%" display="flex" justifyContent={"center"}><AiOutlineEdit /></Text>แก้ไข
                                                        </MenuItem>
                                                        <MenuItem color={"blue"}>
                                                            <Text w="20%" display="flex" justifyContent={"center"}><TiDocumentText /></Text>การต่อสัญญา
                                                        </MenuItem>
                                                        <MenuItem color={"red"}>
                                                            <DeleteProject projectId={i.projectId} />
                                                            {/* <Text w="20%" display="flex" justifyContent={"center"}><RiDeleteBin7Line /></Text>ลบ Project */}
                                                        </MenuItem>
                                                    </MenuList>
                                                </Menu>
                                            </Td>
                                        </Tr>
                                    )
                                })}
                        </Tbody>
                    </Table>
                </Box>
            }
        </Box>
    )
}
