import { ChevronRightIcon, DeleteIcon, SearchIcon } from '@chakra-ui/icons'
import {
    Box,
    Button,
    HStack,
    Heading,
    Highlight,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalHeader,
    ModalOverlay,
    Tag,
    TagLabel,
    Text,
    useDisclosure,
    useToast
} from '@chakra-ui/react'
import { Company, ProjectDetail, Report, ReportDetail } from '../../@types/Type';
import { useState } from "react"
import { useNavigate } from 'react-router-dom';
import { search } from 'ss-search';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../services/config-db';
import moment from 'moment';

interface Props {
    searchValue: string,
    data: Company[]
}

const QuickSearchModal: React.FC<Props> = (props) => {
    const { isOpen, onClose, onOpen } = useDisclosure();
    const navigate = useNavigate();
    const [detail, setDetail] = useState<Company[]>(props.data);
    const toast = useToast();
    const [searchValue, setSearchValue] = useState(props.searchValue);
    const [isSearching, setIsSearching] = useState(false);
    const [reportFound, setReportFound] = useState<Report>()
    const [companyReport, setCompanyReport] = useState("")

    const wait = "รอรับเรื่อง";
    const process = "กำลังดำเนินการ";
    const done = "เสร็จสิ้น";

    const searchReport = async () => {
        setIsSearching(true)
        const reportCol = collection(db, "Report")
        const qReport = query(reportCol, where("ref", "==", props.searchValue.toUpperCase()))
        await getDocs(qReport).then(async (found) => {
            if (found.size !== 0) {
                const reportDetail: ReportDetail = found.docs[0].data() as ReportDetail
                setReportFound({ id: found.docs[0].id, docs: reportDetail })
                const projectDoc = doc(db, "Project", reportDetail.projectID)
                await getDoc(projectDoc).then((d) => {
                    const projectData: ProjectDetail = d.data() as ProjectDetail;
                    setCompanyReport(projectData.companyID);
                }).then(() => {
                    toast({
                        title: "พบรายงานปัญหา",
                        status: "success",
                        position: "top",
                        isClosable: true,
                        duration: 3000,
                    })
                })

            } else {
                setReportFound(undefined)
                toast({
                    title: "ไม่พบรายงานปัญหาจากรหัสอ้างอิงดังกล่าว",
                    status: "error",
                    description: "กรุณาตรวจสอบรหัสอ้างอิงอีกครั้ง",
                    position: "top",
                    isClosable: true,
                    duration: 3000,
                })
            }
        })
        setIsSearching(false)
    }

    return (
        <Box>
            <Button bg="#4c7bf4" color="white" _hover={{}} onClick={onOpen}><SearchIcon /></Button>

            <Modal isOpen={isOpen} onClose={() => { setReportFound(undefined); onClose() }}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader>
                        <Text textAlign={"center"}>ผลการค้นหา</Text>
                    </ModalHeader>
                    <ModalBody>
                        <Box mb="1rem">
                            <Heading fontFamily={"inherit"} fontSize={"1.25rem"}>บริษัท (Company)</Heading>
                            {
                                props.data.map((c, index) => {
                                    if (c.detail.companyName.toLowerCase().includes(props.searchValue.toLowerCase())) {
                                        return (
                                            <Text key={index} _hover={{ pl: "0.5rem" }} transition={"all 0.1s"} cursor={"pointer"}
                                                onClick={() => {
                                                    navigate(`/company/${c.companyId}`);
                                                    onClose()
                                                }}
                                            >
                                                <Highlight query={props.searchValue} styles={{ fontWeight: "bold" }}>
                                                    {c.detail.companyName}
                                                </Highlight>
                                            </Text>
                                        )
                                    }
                                })
                            }
                        </Box>
                        <Box mb="1rem">
                            <Heading fontFamily={"inherit"} fontSize={"1.25rem"}>โปรเจกต์ (Project)</Heading>
                            {
                                props.data.map((c) => {
                                    return c.detail.projects?.map((p, index) => {
                                        if (p.projectName.toLowerCase().includes(props.searchValue.toLowerCase())) {
                                            return (
                                                <Text key={index} _hover={{ pl: "0.5rem" }} transition={"all 0.1s"} cursor={"pointer"}
                                                    onClick={() => {
                                                        navigate(`/company/${c.companyId}/${p.id}/${p.projectName}/detail`);
                                                        onClose()
                                                    }
                                                    }
                                                >
                                                    <Highlight query={props.searchValue} styles={{ fontWeight: "bold" }}>
                                                        {`${c.detail.companyName} > ${p.projectName}`}
                                                    </Highlight>
                                                </Text>
                                            )
                                        }
                                    })
                                })
                            }
                        </Box>
                        <Box>
                            <Heading fontFamily={"inherit"} fontSize={"1.25rem"}>รายงานปัญหา (Report)</Heading>
                            <HStack>
                                <Text>ค้นหาปัญหาจากรหัส : <Text as="span">{props.searchValue}</Text></Text>
                                <Button onClick={searchReport} isLoading={isSearching} colorScheme='blue'><SearchIcon /></Button>
                                <Button onClick={() => { setReportFound(undefined) }} colorScheme='red'><DeleteIcon /></Button>
                            </HStack>
                            {
                                reportFound &&
                                <Box border="1px solid black" borderRadius={"16px"} p="1rem" mt="1rem">
                                    <HStack>
                                        <Text w="8rem" fontWeight={"bold"}>โปรเจกต์</Text>
                                        <Text>: {reportFound.docs.projectName}</Text>
                                    </HStack>
                                    <HStack>
                                        <Text w="8rem" fontWeight={"bold"}>รหัสอ้างอิง</Text>
                                        <Text>: {reportFound.docs.ref}</Text>
                                    </HStack>
                                    <HStack>
                                        <Text w="8rem" fontWeight={"bold"}>ปัญหาที่พบ</Text>
                                        <Text>: {reportFound.docs.title}</Text>
                                    </HStack>
                                    <HStack>
                                        <Text w="8rem" fontWeight={"bold"}>ผู้แจ้งปัญหา</Text>
                                        <Text>: {reportFound.docs.name}</Text>
                                    </HStack>
                                    <HStack>
                                        <Text w="8rem" fontWeight={"bold"}>วันที่</Text>
                                        <Text>: {moment(reportFound.docs.createAt).format("DD/MM/YYYY HH:mm:ss")}</Text>
                                    </HStack>
                                    <HStack>
                                        <Text w="8rem" fontWeight={"bold"}>สภานะ</Text>
                                        <Text display="flex" alignItems={"center"}>:
                                            <Tag
                                                w="100%"
                                                ml="0.25rem"
                                                bg={
                                                    reportFound.docs.RepStatus === wait
                                                        ? "yellow.300"
                                                        : reportFound.docs.RepStatus === done
                                                            ? "green.600"
                                                            : reportFound.docs.RepStatus === process
                                                                ? "gray.400"
                                                                : "red.300"
                                                }
                                                color={
                                                    reportFound.docs.RepStatus === wait
                                                        ? "black"
                                                        : "white"
                                                }
                                            >
                                                <TagLabel w="100%" textAlign={"center"}>
                                                    {reportFound.docs.RepStatus}
                                                </TagLabel>
                                            </Tag>
                                        </Text>
                                    </HStack>
                                    {/* /company/:company/:projectID/:projectName/:problemID */}
                                    <Box w="fit-content" m="auto" mt="1rem">
                                        <Button
                                            onClick={() => {
                                                navigate(`/company/${companyReport}/${reportFound.docs.projectID}/${reportFound.docs.projectName}/${reportFound.id}`)
                                            }}
                                        >กดเพื่อเข้าดูปัญหา <Text as="span" color="blue" ><ChevronRightIcon /></Text></Button>
                                    </Box>
                                </Box>

                            }
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default QuickSearchModal;
