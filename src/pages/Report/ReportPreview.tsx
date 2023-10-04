/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useRef, useContext } from "react";
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  HStack,
  Input,
  InputGroup,
  InputLeftAddon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineReload } from "react-icons/ai";
import { useParams, useNavigate } from "react-router-dom";

import { BsArchiveFill, BsSearch } from "react-icons/bs";
import { search } from "ss-search";
import { Controller, useForm } from "react-hook-form";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../services/config-db";
import { ProjectDetail, Report, ReportDetail } from "../../@types/Type";
import classes from "./ReportPreview.module.css";
import moment from "moment";
import { CompanyContext } from "../../context/CompanyContext";
import { BiArrowBack, BiDotsHorizontalRounded } from "react-icons/bi";
import axios from "axios";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

interface ActionProps {
  reportId: string;
  isArchive: boolean;
  refetch: () => void;
}

const ActionMenu: React.FC<ActionProps> = (props) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isArchive = props.isArchive;
  const done = props.refetch;
  const toast = useToast();

  const toArchive = async (set: boolean) => {
    setIsUpdating(true);
    await axios
      .post(
        // "https://us-central1-craftinglab-dev.cloudfunctions.net/updateReport", //dev
        "http://127.0.0.1:5001/craftinglab-dev/us-central1/addReport_v2", //test
        {
          reportId: props.reportId,
          isArchive: set,
        }
      )
      .then(() => {
        toast({
          title: "อัพเดทสำเร็จ",
          status: "success",
          duration: 3000,
          position: "top",
          isClosable: true,
        });
        done();
      });
    setIsUpdating(false);
    onClose();
  };

  return (
    <>
      <Menu>
        <MenuButton as={Button} bg={'none'} borderRadius={'16px'} border={'1px solid #ccc'}>
          <BiDotsHorizontalRounded />
        </MenuButton>
        <MenuList p="0">
          {isArchive ? (
            <MenuItem _hover={{ bg: "#ddd" }} onClick={onOpen}>
              ยกเลิกจัดเก็บ
            </MenuItem>
          ) : (
            <MenuItem _hover={{ bg: "#ddd" }} onClick={onOpen}>
              จัดเก็บ
            </MenuItem>
          )}
        </MenuList>
      </Menu>
      {isArchive ? (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>ยกเลิกการจัดเก็บรายงาน ?</ModalHeader>
            <ModalFooter>
              <Button mr={3} onClick={onClose} w="5rem" variant={"ghost"}>
                ปิด
              </Button>
              <Button
                w="5rem"
                bg="#4c7bf4"
                onClick={() => {
                  toArchive(false);
                }}
                isLoading={isUpdating}
                color="#fff"
              >
                ยืนยัน
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      ) : (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>ยืนยันการจัดเก็บรายงาน ?</ModalHeader>
            <ModalFooter>
              <Button mr={3} onClick={onClose} w="5rem" variant={"ghost"}>
                ปิด
              </Button>
              <Button
                w="5rem"
                bg="#4c7bf4"
                color="#fff"
                onClick={() => {
                  toArchive(true);
                }}
                isLoading={isUpdating}
              >
                ยืนยัน
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default function ProblemPreview() {
  const { control, watch } = useForm();
  const [isFetching, setIsFetching] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [archiveReports, setArchiveReport] = useState<Report[]>([]);
  const [showReport, setShowReport] = useState<Report[]>([]);

  const [seeArchive, setSeeArchive] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const params = useParams();
  const navigate = useNavigate();
  const Company = useContext(CompanyContext);
  const backPath = `/company/${params["company"]}`;

  const statusFilter = watch("statusFilter") || "";
  const wait = "รอรับเรื่อง";
  const process = "กำลังดำเนินการ";
  const done = "เสร็จสิ้น";
  // const cancel = "ยกเลิก"

  const getFireBaseId = async () => {
    const projectRef = doc(db, "Project", params["projectID"] as string);
    const projectDetail = (await getDoc(projectRef)).data() as ProjectDetail;
    const firebaseId = projectDetail.firebaseId;
    // Company.setFirebaseId(firebaseId)
    return firebaseId;
  };

  const fetchingReport = async () => {
    setIsFetching(true);
    const firebaseId = await getFireBaseId();

    const collRef = collection(db, "Report");
    const q = query(collRef, where("firebaseId", "==", firebaseId));
    const fetchReport = await getDocs(q);
    const allReport: Report[] = [];
    fetchReport.forEach((r) => {
      const report: Report = {
        id: r.id,
        docs: r.data() as ReportDetail,
      };
      Company.setFirebaseId((r.data() as ReportDetail).firebaseId);
      allReport.push(report);
    });
    const sorted_reports = allReport.sort((a, b) => {
      const dateA = new Date(a.docs.createAt) as any;
      const dateB = new Date(b.docs.createAt) as any;

      return dateB - dateA;
    });

    const archive: Report[] = [];
    const normal: Report[] = [];
    sorted_reports.forEach((r) => {
      if (r.docs.isArchive) {
        archive.push(r);
      } else {
        normal.push(r);
      }
    });
    setReports(normal);
    setArchiveReport(archive);
    setShowReport(seeArchive ? archive : normal);
    setIsFetching(false);
  };

  useEffect(() => {
    setShowReport(seeArchive ? archiveReports : reports);
  }, [seeArchive]);

  const projectName = params["projectName"];
  useEffect(() => {
    fetchingReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params["projectID"]]);

  const onSearch = () => {
    // const searchInput = document.getElementById("searchInput") as HTMLInputElement;
    const value = searchRef.current?.value;
    const searchText = value + " " + statusFilter || "";
    const searchField = [
      "docs.title",
      "docs.ref",
      "docs.RepStatus",
      "docs.name",
    ];
    // console.clear();
    const result = search(
      seeArchive ? archiveReports : reports,
      searchField,
      searchText
    ) as Report[];
    setShowReport(result);
  };

  useEffect(() => {
    onSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  // สร้าง State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า
  const totalPages = Math.ceil(showReport.length / itemsPerPage);

  // อัพเดตข้อมูลในหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = showReport.slice(startIndex, endIndex);

  const startPage = Math.max(currentPage - 1, 1);
  const endPage = Math.min(currentPage + 1, totalPages);

  // สร้างปุ่ม Pagination
  const pages = [];
  if (startPage > 1) {
    pages.push(1);
    if (startPage > 2) {
      pages.push("...");
    }
  }
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push("...");
    }
    pages.push(totalPages);
  }

  return (
    <Container maxW="100%" pb="10">
      <Box>
        <Center w="100%" mb="1rem">
          <HStack
            w="100%"
            justifyContent="flex-start"
            alignItems="center"
            pt="1rem"
          >
            <Button
              mt="-1.5rem"
              borderRadius="16px"
              bg="#4C7BF4"
              color="#fff"
              size="sm"
              w="40px"
              _hover={{ opacity: 0.8 }}
              onClick={() => {
                navigate(backPath);
              }}
            >
              <BiArrowBack />
            </Button>
            <VStack
              justifyContent="flex-start"
              alignItems="flex-star"
              spacing="2px"
            >
              <Text
                fontWeight="600"
                lineHeight="25.2px"
                fontSize="18px"
                fontFamily="Prompt"
              >
                รายงานปัญหา / {projectName}
              </Text>
              <Text fontSize="16px" fontFamily="Prompt">
                {projectName} {seeArchive ? "(รายการที่จัดเก็บ)" : ""}
              </Text>
            </VStack>
          </HStack>
        </Center>
        <Flex
          justify={["flex-end", "space-between"]}
          flexDir={["column", "column", "column", "row", "row", "row"]}
        >
          <Flex
            justifyContent="flex-start"
            gap="20px"
            flexDir={["column", "row", "row", "row", "row", "row"]}
          >
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
                borderRadius="16px"
                id="searchInput"
                focusBorderColor={"none"}
                ref={searchRef}
                onChange={onSearch}
              />
            </InputGroup>
            <Box>
              <Controller
                name="statusFilter"
                defaultValue={""}
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <HStack>
                      <Text>สถานะ</Text>
                      <Select borderRadius={'16px'} {...field}>
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
          <Flex mt={["0.5rem", "0.5rem", "0.5rem", "0", "0", "0"]}>
            <Button
              bg={seeArchive ? "#4c7bf4" : "#fff"}
              color={seeArchive ? "#fff" : "#4c7bf4"}
              fontWeight={"normal"}
              _hover={{ opacity: 0.8 }}
              ml={{ base: "0rem", md: "1rem", lg: "0" }}
              mr="0.5rem"
              border="1px solid #4c7bf4"
              borderRadius="16px"
              isLoading={isFetching}
              onClick={() => {
                setSeeArchive(!seeArchive);
              }}
            >
              <BsArchiveFill />
            </Button>
            <Button
              bg={"#4c7bf4"}
              color="#fff"
              fontWeight={"normal"}
              _hover={{ opacity: 0.8 }}
              mr="0.5rem"
              isLoading={isFetching}
              onClick={fetchingReport}
              borderRadius="16px"
            >
              <AiOutlineReload />
            </Button>
            <Button
              bg={"#4c7bf4"}
              color="#fff"
              fontWeight={"normal"}
              _hover={{ opacity: 0.8 }}
              onClick={() => {
                navigate(
                  `/company/${params["company"]}/${params["projectID"]}/${params["projectName"]}/addReport`
                );
              }}
              _active={{ opacity: "1" }}
              borderRadius={"16px"}
              ml={{ base: "0", md: "1rem", lg: "0" }}
            >
              แจ้งปัญหาการใช้งานระบบ
            </Button>
          </Flex>
        </Flex>
      </Box>
      <Box
        mt="1rem"
        borderRadius="16px"
        border="1px"
        borderColor="#f4f4f4"
        w="100%"
        h="100%"
        // maxH="67vh"
        overflowY={"auto"}
        boxShadow={"1px 1px 1px rgb(0,0,0,0.1)"}
        className={classes.table}
      >
        <Table w="100%">
          <Thead position="sticky" top={0} zIndex="0">
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
                เบอร์โทรติดต่อ
              </Th>
              <Th
                fontWeight={"normal"}
                fontSize="16px"
                minW="12.5rem"
                color="#fff"
                textAlign="center"
                fontFamily={"inherit"}
              >
                ไลน์
              </Th>
              <Th
                fontWeight={"normal"}
                fontSize="16px"
                minW="12.5rem"
                color="#fff"
                textAlign="center"
                fontFamily={"inherit"}
              >
                อีเมลล์
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
              <Th
                fontWeight={"normal"}
                fontSize="16px"
                minW="10rem"
                color="#fff"
                textAlign="center"
                fontFamily={"inherit"}
              >
                จัดการ
              </Th>
            </Tr>
          </Thead>
          <Tbody>
            {isFetching ? (
              <Tr>
                <Td colSpan={7} textAlign={"center"}>
                  Loading . . .
                  <Spinner />
                </Td>
              </Tr>
            ) : showReport.length === 0 ? (
              <Tr>
                <Td colSpan={7} textAlign={"center"}>
                  ยังไม่มีข้อมูลการรายงาน{seeArchive ? "ที่จัดเก็บ" : ""}
                </Td>
              </Tr>
            ) : (
              currentItems.map((r, index) => {
                const goToReport = () =>
                  navigate(
                    `/company/${params["company"]}/${params["projectID"]}/${params["projectName"]}/${r.id}`
                  );
                return (
                  <Tr
                    key={index}
                    _hover={{ bg: "#eee" }}
                    cursor={"pointer"}
                    onClick={() => {
                      Company.setReport(r.id);
                    }}
                  >
                    <Td textAlign={"center"} onClick={goToReport}>
                      {r.docs.ref}
                    </Td>
                    <Td textAlign={"center"} onClick={goToReport}>
                      {moment(r.docs.createAt).format("DD/MM/YYYY HH:mm:ss")}
                    </Td>
                    <Td textAlign={"center"} onClick={goToReport}>
                      {r.docs.title}
                    </Td>
                    <Td textAlign={"center"} onClick={goToReport}>
                      {r.docs.name}
                    </Td>
                    <Td textAlign={"center"} onClick={goToReport}>
                      {r.docs.phone === "" ? "-" : r.docs.phone}
                    </Td>
                    <Td textAlign={"center"} onClick={goToReport}>
                      {r.docs.line === "" ? "-" : r.docs.line}
                    </Td>
                    <Td textAlign={"center"} onClick={goToReport}>
                      {r.docs.email === "" ? "-" : r.docs.email}
                    </Td>
                    <Td textAlign={"center"} onClick={goToReport}>
                      {r.docs.solution?.accepter || "-"}
                    </Td>
                    <Td textAlign={"center"} onClick={goToReport}>
                      {" "}
                      <Tag
                        borderRadius="16px"
                        w="100%"
                        h="40px"
                        bg={
                          r.docs.RepStatus === wait
                            ? "yellow.300"
                            : r.docs.RepStatus === done
                            ? "green.500"
                            : r.docs.RepStatus === process
                            ? "gray.400"
                            : "red.500"
                        }
                        color={r.docs.RepStatus === wait ? "black" : "white"}
                      >
                        <TagLabel w="100%" textAlign={"center"}>
                          {r.docs.RepStatus}
                        </TagLabel>
                      </Tag>
                    </Td>
                    <Td textAlign={'center'}>
                      <ActionMenu
                        reportId={r.id}
                        refetch={fetchingReport}
                        isArchive={r.docs.isArchive}
                      />
                    </Td>
                  </Tr>
                );
              })
            )}
          </Tbody>
        </Table>
      </Box>
      <Flex>
        <Button
          onClick={() => {
            if (currentPage > 1) {
              setCurrentPage(currentPage - 1);
            }
          }}
          disabled={currentPage === 1}
          mt="2"
          mr="1"
          bg="none"
          borderRadius="50%"
          size="sm"
        >
          {currentPage > 1 ? <FaAngleLeft /> : null}
        </Button>
        {pages.map((page: any, index) => (
          <Button
            key={index}
            onClick={() => setCurrentPage(page)}
            disabled={page === currentPage || page === "..."}
            mt="2"
            mr="1"
            borderRadius="50%"
            bg={page === currentPage ? "blue" : "#4C7BF4"}
            color="#fff"
            _hover={{ opacity: 0.8 }}
            size="sm"
          >
            {page}
          </Button>
        ))}
        <Button
          onClick={() => {
            if (currentPage < totalPages) {
              setCurrentPage(currentPage + 1);
            }
          }}
          disabled={currentPage === totalPages}
          mt="2"
          bg="none"
          borderRadius="50%"
          size="sm"
        >
          {currentPage < totalPages ? <FaAngleRight /> : null}
        </Button>
        <Text ml="1" mt="1rem" color="gray.500" fontSize="12px">
          Page {currentPage} to {totalPages}
        </Text>
      </Flex>
    </Container>
  );
}
