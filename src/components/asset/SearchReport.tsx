/* eslint-disable react-hooks/exhaustive-deps */
import { QuestionIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import { Report, ReportDetail } from "../../@types/Type";
import { useEffect, useState } from "react";
import { search } from "ss-search";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/config-db";
import { useForm } from "react-hook-form";
import ReportCard from "./ReportCard";

const SearchReport: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { register, watch, reset } = useForm();

  const [allReports, setAllReports] = useState<Report[]>([]);
  const [filterReports, setFilterReports] = useState<Report[]>([]);

  const getAllReport = async () => {
    const reportCol = collection(db, "Report");
    const fetchReport = await getDocs(reportCol);
    const reports: Report[] = [];
    fetchReport.forEach((d) => {
      const report: Report = { id: d.id, docs: d.data() as ReportDetail };
      reports.push(report);
    });
    setAllReports(reports);
  };

  useEffect(() => {
    getAllReport();
  }, []);

  const searchValue = watch("searchRef") || "";

  const searchReport2 = () => {
    const value = (searchValue as string).trim();
    if (value === "") {
      setFilterReports([]);
    } else {
      const searchField = ["docs.ref", "docs.title", "docs.name"];
      const result = search(allReports, searchField, value) as Report[];
      setFilterReports(result);
    }
  };

  useEffect(() => {
    // console.clear();
    searchReport2();
  }, [searchValue]);

  return (
    <Box>
      <Button
        bg="#4c7bf4"
        color="white"
        _hover={{ opacity: "0.8" }}
        w="100%"
        justifyContent={"left"}
        borderRadius="16px"
        onClick={onOpen}
        gap={"0.5rem"}
      >
        <SearchIcon />
        <Text as="span">ค้นหาปัญหา</Text>
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          reset();
          onClose();
        }}
        size="6xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Text textAlign={"center"}>ค้นหาปัญหาที่ได้รับแจ้ง</Text>
          </ModalHeader>
          <ModalBody>
            <Box mb="1rem">
              <InputGroup>
                <InputLeftElement>
                  <SearchIcon />
                </InputLeftElement>
                <Input
                  type="text"
                  defaultValue={""}
                  placeholder="กรอกคำค้นหา"
                  {...register("searchRef")}
                />
                <InputRightElement>
                  <Tooltip label="ค้นหาจาก ชื่อผู้แจ้ง ชื่อปัญหา และ รหัสอ้างอิง">
                    <QuestionIcon />
                  </Tooltip>
                </InputRightElement>
              </InputGroup>
            </Box>
            <Heading fontFamily={"inherit"} fontSize={"1.25rem"}>
              รายงานปัญหา ({filterReports.length} ผลลัพธ์)
            </Heading>
            <Text fontSize={"0.75rem"} color="GrayText">
              กดที่รายการปัญหาเพื่อเข้าดูรายละเอียด
            </Text>
            <Table mt="0.5rem" position="relative">
              <Thead bg="#4c7bf4" position="sticky" top="-0.5rem">
                <Tr>
                  <Th
                    fontFamily={"inherit"}
                    fontWeight={"normal"}
                    fontSize={"1rem"}
                    color="#fff"
                    textAlign={"center"}
                  >
                    บริษัท
                  </Th>
                  <Th
                    fontFamily={"inherit"}
                    fontWeight={"normal"}
                    fontSize={"1rem"}
                    color="#fff"
                    textAlign={"center"}
                    w="7rem"
                  >
                    โปรเจกต์
                  </Th>
                  <Th
                    fontFamily={"inherit"}
                    fontWeight={"normal"}
                    fontSize={"1rem"}
                    color="#fff"
                    textAlign={"center"}
                    w="9rem"
                  >
                    รหัสอ้างอิง
                  </Th>
                  <Th
                    fontFamily={"inherit"}
                    fontWeight={"normal"}
                    fontSize={"1rem"}
                    color="#fff"
                    textAlign={"center"}
                  >
                    ปัญหาที่พบ
                  </Th>
                  <Th
                    fontFamily={"inherit"}
                    fontWeight={"normal"}
                    fontSize={"1rem"}
                    color="#fff"
                    textAlign={"center"}
                  >
                    ผู้แจ้ง
                  </Th>
                  <Th
                    fontFamily={"inherit"}
                    fontWeight={"normal"}
                    fontSize={"1rem"}
                    color="#fff"
                    textAlign={"center"}
                  >
                    วันที่แจ้ง
                  </Th>
                  <Th
                    fontFamily={"inherit"}
                    fontWeight={"normal"}
                    fontSize={"1rem"}
                    color="#fff"
                    textAlign={"center"}
                  >
                    สถานะ
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {filterReports.length > 0 ? (
                  filterReports
                    .sort((a, b) => {
                      if (a.docs.companyName === b.docs.companyName) {
                        return a.docs.ref?.localeCompare(
                          b.docs.ref as string
                        ) as number;
                      } else {
                        return a.docs.companyName.localeCompare(
                          b.docs.companyName
                        );
                      }
                    })
                    .map((r, i) => {
                      return <ReportCard key={i} report={r} />;
                    })
                ) : (
                  <Tr>
                    <Td colSpan={8} textAlign={"center"}>
                      กรุณากรอกคำค้นหา
                    </Td>
                  </Tr>
                )}
              </Tbody>
            </Table>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SearchReport;
