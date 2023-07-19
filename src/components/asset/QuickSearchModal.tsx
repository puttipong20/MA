/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronRightIcon, DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  HStack,
  Heading,
  Highlight,
  Input,
  InputGroup,
  InputLeftElement,
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
  useToast,
} from "@chakra-ui/react";
import {
  Company,
  ProjectDetail,
  Report,
  ReportDetail,
} from "../../@types/Type";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { search } from "ss-search";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../services/config-db";
import moment from "moment";
import { useForm } from "react-hook-form";

interface Props {
  searchValue: string;
  data: Company[];
}

const QuickSearchModal: React.FC<Props> = (props) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const navigate = useNavigate();
  const { register, watch, reset } = useForm();

  const [detail, setDetail] = useState<Company[]>(props.data);
  const toast = useToast();
  const [searchValue, setSearchValue] = useState(props.searchValue);
  const [isSearching, setIsSearching] = useState(false);
  const [reportFound, setReportFound] = useState<Report>();
  const [companyReport, setCompanyReport] = useState("");

  const wait = "รอรับเรื่อง";
  const process = "กำลังดำเนินการ";
  const done = "เสร็จสิ้น";

  const searchReport = async () => {
    setIsSearching(true);
    const reportCol = collection(db, "Report");
    const qReport = query(
      reportCol,
      where("ref", "==", searchRef.toUpperCase())
    );
    await getDocs(qReport).then(async (found) => {
      if (found.size !== 0) {
        const reportDetail: ReportDetail = found.docs[0].data() as ReportDetail;
        setReportFound({ id: found.docs[0].id, docs: reportDetail });
        const projectDoc = doc(db, "Project", reportDetail.projectID);
        await getDoc(projectDoc).then((d) => {
          const projectData: ProjectDetail = d.data() as ProjectDetail;
          setCompanyReport(projectData.companyID);
        });
      } else {
        setReportFound(undefined);
        toast({
          title: "ไม่พบรายงานปัญหาจากรหัสอ้างอิงดังกล่าว",
          status: "error",
          description: "กรุณาตรวจสอบรหัสอ้างอิงอีกครั้ง",
          position: "top",
          isClosable: true,
          duration: 3000,
        });
      }
    });
    setIsSearching(false);
  };

  const searchRef = watch("searchRef") || props.searchValue || "";

  const onSearch = () => {
    if (searchRef !== "") {
      const searchField = [
        "detail.companyName",
        "detail.projects[projectName]",
      ];
      const result = search(props.data, searchField, searchRef) as Company[];
      setDetail(result);
    } else {
      setDetail([]);
    }
  };

  useEffect(() => {
    setSearchValue(searchRef);
    onSearch();
  }, [searchRef]);

  return (
    <Box>
      <Button bg="#4c7bf4" color="white" _hover={{}} onClick={onOpen}>
        <SearchIcon />
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          setReportFound(undefined);
          reset();
          onClose();
        }}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <ModalHeader>
            <Text textAlign={"center"}>ผลการค้นหา</Text>
          </ModalHeader>
          <ModalBody>
            <Box mb="1rem">
              <InputGroup>
                <InputLeftElement>
                  <SearchIcon />
                </InputLeftElement>
                <Input
                  type="text"
                  defaultValue={props.searchValue}
                  {...register("searchRef")}
                />
              </InputGroup>
            </Box>

            <Box mb="1rem">
              <Heading fontFamily={"inherit"} fontSize={"1.25rem"}>
                บริษัท (Company)
              </Heading>
              {searchRef !== "" ? (
                detail.map((c, index) => {
                  if (
                    c.detail.companyName
                      .toLowerCase()
                      .includes(searchValue.toLowerCase())
                  ) {
                    return (
                      <Text
                        key={index}
                        _hover={{ pl: "0.5rem" }}
                        transition={"all 0.1s"}
                        cursor={"pointer"}
                        onClick={() => {
                          navigate(`/company/${c.companyId}`);
                          onClose();
                        }}
                      >
                        <Highlight
                          query={searchRef}
                          styles={{ fontWeight: "bold" }}
                        >
                          {c.detail.companyName}
                        </Highlight>
                      </Text>
                    );
                  }
                })
              ) : (
                <Text>กรุณากรอกคำค้นหา</Text>
              )}
            </Box>

            <Divider my="0.5rem" />

            <Box mb="1rem">
              <Heading fontFamily={"inherit"} fontSize={"1.25rem"}>
                โปรเจกต์ (Project)
              </Heading>
              {searchRef !== "" ? (
                detail.map((c) => {
                  return c.detail.projects?.map((p, index) => {
                    if (
                      p.projectName
                        .toLowerCase()
                        .includes(searchValue.toLowerCase())
                    ) {
                      return (
                        <Text
                          key={index}
                          _hover={{ pl: "0.5rem" }}
                          transition={"all 0.1s"}
                          cursor={"pointer"}
                          onClick={() => {
                            navigate(
                              `/company/${c.companyId}/${p.id}/${p.projectName}/detail`
                            );
                            onClose();
                          }}
                        >
                          <Highlight
                            query={searchRef}
                            styles={{ fontWeight: "bold" }}
                          >
                            {`${c.detail.companyName} > ${p.projectName}`}
                          </Highlight>
                        </Text>
                      );
                    }
                  });
                })
              ) : (
                <Text>กรุณากรอกคำค้นหา</Text>
              )}
            </Box>
            <Divider my="0.5rem" />
            <Box>
              <Heading fontFamily={"inherit"} fontSize={"1.25rem"}>
                รายงานปัญหา (Report)
              </Heading>
              <HStack
                justifyContent={"space-between"}
                w="100%"
                alignItems={"center"}
              >
                <Box display="flex" alignItems={"center"}>
                  <Text>
                    ค้นหาปัญหาจากรหัส : <Text as="span">{searchRef}</Text>
                  </Text>
                  <Button
                    onClick={searchReport}
                    isLoading={isSearching}
                    bg="#4c7bf4"
                    color="white"
                    _hover={{}}
                    ml="0.25rem"
                  >
                    <SearchIcon />
                  </Button>
                </Box>
                <Button
                  onClick={() => {
                    setReportFound(undefined);
                  }}
                  colorScheme="red"
                >
                  <DeleteIcon />
                </Button>
              </HStack>
              {reportFound && (
                <Box
                  border="1px solid black"
                  borderRadius={"16px"}
                  p="1rem"
                  mt="1rem"
                >
                  <HStack>
                    <Text w="8rem" fontWeight={"bold"}>
                      บริษัท
                    </Text>
                    <Text>: {reportFound.docs.companyName}</Text>
                  </HStack>
                  <HStack>
                    <Text w="8rem" fontWeight={"bold"}>
                      โปรเจกต์
                    </Text>
                    <Text>: {reportFound.docs.projectName}</Text>
                  </HStack>
                  <HStack>
                    <Text w="8rem" fontWeight={"bold"}>
                      รหัสอ้างอิง
                    </Text>
                    <Text>: {reportFound.docs.ref}</Text>
                  </HStack>
                  <HStack>
                    <Text w="8rem" fontWeight={"bold"}>
                      ปัญหาที่พบ
                    </Text>
                    <Text>: {reportFound.docs.title}</Text>
                  </HStack>
                  <HStack>
                    <Text w="8rem" fontWeight={"bold"}>
                      ผู้แจ้งปัญหา
                    </Text>
                    <Text>: {reportFound.docs.name}</Text>
                  </HStack>
                  <HStack>
                    <Text w="8rem" fontWeight={"bold"}>
                      วันที่
                    </Text>
                    <Text>
                      :{" "}
                      {moment(reportFound.docs.createAt).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )}
                    </Text>
                  </HStack>
                  <HStack>
                    <Text w="8rem" fontWeight={"bold"}>
                      สภานะ
                    </Text>
                    <Text display="flex" alignItems={"center"}>
                      :
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
                      isLoading={isSearching}
                      onClick={() => {
                        navigate(
                          `/company/${companyReport}/${reportFound.docs.projectID}/${reportFound.docs.projectName}/${reportFound.id}`
                        );
                      }}
                      bg=""
                    >
                      กดเพื่อเข้าดูปัญหา{" "}
                      <Text as="span" color="blue">
                        <ChevronRightIcon />
                      </Text>
                    </Button>
                  </Box>
                </Box>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default QuickSearchModal;
