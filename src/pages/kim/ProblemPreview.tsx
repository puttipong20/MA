/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef } from "react";
import {
    Box,
    Button,
    Flex,
    FormControl,
    HStack,
    Heading,
    Input,
    InputGroup,
    InputLeftAddon,
    Select,
    Spinner,
    Table,
    Tag,
    TagLabel,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";

import { BsSearch } from "react-icons/bs";
import { search } from "ss-search";
import { Controller, useForm } from "react-hook-form";

import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/config-db";
import { Report, ReportDetail } from "../../@types/Type";

import classes from "./ProblemPreview.module.css"

import moment from "moment";

export default function ProblemPreview() {
    const { control, watch } = useForm();
    const [isFetching, setIsFetching] = useState(false);
    const [reports, setReports] = useState<Report[]>([]);
    const [filterReports, setFilterReports] = useState<Report[]>([]);
    const searchRef = useRef<HTMLInputElement>(null);
    const params = useParams();
    const navigate = useNavigate();

    const statusFilter = watch("statusFilter") || "";
    const wait = "รอรับเรื่อง";
    const process = "กำลังดำเนินการ";
    const done = "เสร็จสิ้น";
    // const cancel = "ยกเลิก"

    const fetchingReport = async () => {
        setIsFetching(true);
        // console.clear();
        const collRef = collection(db, "Report")
        const q = query(collRef, where("projectID", "==", params["projectID"]))
        const fetchReport = await getDocs(q)
        const allReport: Report[] = [];
        fetchReport.forEach((r) => {
            const report: Report = {
                id: r.id,
                docs: r.data() as ReportDetail
            }
            allReport.push(report);
        })
        setReports(allReport);
        setFilterReports(allReport)
        setIsFetching(false);
    }
    const projectName = params["projectName"];
    useEffect(() => {
        fetchingReport();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params["projectID"]])

    const onSearch = () => {
        // const searchInput = document.getElementById("searchInput") as HTMLInputElement;
        const value = searchRef.current?.value
        const searchText = value + " " + statusFilter || "";
        const searchField = ["docs.title", "docs.ref", "docs.RepStatus"];
        // console.clear();
        // console.log(searchText)
        const result = search(reports, searchField, searchText) as Report[];
        // console.log(result)
        setFilterReports(result);
    };

    useEffect(() => {
        onSearch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter])

    return (
        <Box w="100%" h="100%">
            <Box position="relative">
                <Flex>
                    <Box>
                        <Text>รายงานปัญหา / {projectName}</Text>
                        <Heading>{projectName}</Heading>
                        {/* <Text>Current UID : {props.uid}</Text> */}
                    </Box>
                </Flex>
            </Box>

            <Box my="20px">
                <Flex justifyContent={"flex-start"} gap="20px">
                    <InputGroup w="auto" borderRadius={"16px"}>
                        <InputLeftAddon
                            background="#F4F7FE"
                            border="none"
                            borderRadius={"16px 0 0 16px"}
                        >
                            <BsSearch />
                        </InputLeftAddon>
                        <Input
                            type="text"
                            background="#F4F7FE"
                            border="none"
                            placeholder="Search by refID, problem"
                            borderRadius={"16px"}
                            id="searchInput"
                            focusBorderColor={"none"}
                            ref={searchRef}
                            // onKeyDown={keyHandle}
                            onChange={onSearch}
                        />
                    </InputGroup>
                    <Button
                        background={"#1B2559"}
                        color="white"
                        borderRadius="16px"
                        onClick={onSearch}
                        _active={{ opacity: "1" }}
                        _hover={{ opacity: "1" }}
                    >
                        ค้นหา
                    </Button>
                    <Box>
                        <Controller
                            name="statusFilter"
                            defaultValue={""}
                            control={control}
                            render={({ field }) => (
                                <FormControl>
                                    <HStack>
                                        <Text>สถานะ</Text>
                                        <Select {...field}>
                                            <option value="">ทั้งหมด</option>
                                            <option value="รอรับเรื่อง">รอรับเรื่อง</option>
                                            <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                                            <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                                            <option value="ยกเลิก">ยกเลิก</option>
                                        </Select>
                                    </HStack>
                                </FormControl>
                            )}
                        />
                    </Box>
                </Flex>

                <Flex justifyContent={"flex-end"}>
                    <Button
                        bg={"#4c7bf4"}
                        color="#fff"
                        fontWeight={"normal"}
                        onClick={() => {
                            // console.log(props)
                            navigate(`/company/${params["company"]}/${params["projectID"]}/${params["projectName"]}/addReport`);
                        }}
                        _hover={{ opacity: "1" }}
                        _active={{ opacity: "1" }}
                        borderRadius={"16px"}
                    >
                        แจ้งปัญหาการใช้งานระบบ
                    </Button>
                </Flex>
            </Box>
            <Box maxW="100%" overflowX="auto" className={classes.table}>
                <Table>
                    <Thead>
                        <Tr background={"#4c7bf4"}>
                            <Th
                                fontWeight={"normal"}
                                fontSize="16px"
                                minW="10rem"
                                color="#fff"
                                textAlign="center"
                                fontFamily={"inherit"}
                            >
                                No.
                            </Th>
                            <Th
                                fontWeight={"normal"}
                                fontSize="16px"
                                minW="10rem"
                                color="#fff"
                                textAlign="center"
                                fontFamily={"inherit"}
                            >
                                วันที่
                            </Th>
                            <Th
                                fontWeight={"normal"}
                                fontSize="16px"
                                minW="10rem"
                                color="#fff"
                                textAlign="center"
                                fontFamily={"inherit"}
                            >
                                ปัญหาที่พบ
                            </Th>
                            <Th
                                fontWeight={"normal"}
                                fontSize="16px"
                                minW="10rem"
                                color="#fff"
                                textAlign="center"
                                fontFamily={"inherit"}
                            >
                                ชื่อผู้แจ้งปัญหา
                            </Th>
                            <Th
                                fontWeight={"normal"}
                                fontSize="16px"
                                minW="12.5rem"
                                color="#fff"
                                textAlign="center"
                                fontFamily={"inherit"}
                            >
                                ข้อมูลการติดต่อ
                            </Th>
                            <Th
                                fontWeight={"normal"}
                                fontSize="16px"
                                minW="10rem"
                                color="#fff"
                                textAlign="center"
                                fontFamily={"inherit"}
                            >
                                ชื่อผู้รับเรื่อง
                            </Th>
                            <Th
                                fontWeight={"normal"}
                                fontSize="16px"
                                minW="10rem"
                                color="#fff"
                                textAlign="center"
                                fontFamily={"inherit"}
                            >
                                การดำเนินการ
                            </Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {isFetching ?
                            <Tr>
                                <Td colSpan={7} textAlign={"center"}>
                                    Loading . . .
                                    <Spinner />
                                </Td>
                            </Tr> : (
                                filterReports.length === 0 ?
                                    <Tr>
                                        <Td colSpan={7} textAlign={"center"}>ยังไม่มีข้อมูลการรายงาน</Td>
                                    </Tr> :
                                    filterReports.map((r, index) => {
                                        return (
                                            <Tr key={index}
                                                _hover={{ bg: "#eee" }}
                                                cursor={"pointer"}
                                                onClick={() => {
                                                    navigate(`/company/${params["company"]}/${params["projectID"]}/${params["projectName"]}/${r.id}`)
                                                }}
                                            >
                                                <Td textAlign={"center"}>{r.docs.ref}</Td>
                                                <Td textAlign={"center"}>{moment(r.docs.createAt).format("DD/MM/YYYY HH:mm:ss")}</Td>
                                                <Td textAlign={"center"}>{r.docs.title}</Td>
                                                <Td textAlign={"center"}>{r.docs.name}</Td>
                                                <Td>
                                                    {r.docs.phone}<br />
                                                    {r.docs.line}<br />
                                                    {r.docs.email}
                                                </Td>
                                                <Td textAlign={"center"}>{r.docs.solution?.accepter || "-"}</Td>
                                                <Td textAlign={"center"}>                    <Tag
                                                    w="100%"
                                                    h="40px"
                                                    colorScheme={
                                                        wait.includes(r.docs.RepStatus)
                                                            ? "yellow"
                                                            : r.docs.RepStatus === done
                                                                ? "green"
                                                                : r.docs.RepStatus === process
                                                                    ? "orange"
                                                                    : "red"
                                                    }
                                                >
                                                    <TagLabel w="100%" textAlign={"center"}>
                                                        {r.docs.RepStatus}
                                                    </TagLabel>
                                                </Tag></Td>
                                            </Tr>
                                        )
                                    })
                            )
                        }
                    </Tbody>
                </Table>
            </Box>

        </Box>
    )
}
