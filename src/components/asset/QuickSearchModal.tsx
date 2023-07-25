/* eslint-disable react-hooks/exhaustive-deps */
import { ChevronRightIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
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
  Project,
  ProjectDetail,
  Report,
  ReportDetail,
} from "../../@types/Type";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { search } from "ss-search";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { CompanyContext } from "../../context/CompanyContext";
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

  const CompanyCtx = useContext(CompanyContext)
  const [detail, setDetail] = useState<Company[]>(props.data);
  const toast = useToast();
  const [searchValue, setSearchValue] = useState(props.searchValue);
  const [isSearching, setIsSearching] = useState(false);
  const [companyFound, setCompanyFound] = useState<JSX.Element[]>([])
  const [projectFound, setProjectFound] = useState<JSX.Element[]>([])
  const [reportFound, setReportFound] = useState<Report>();

  const wait = "รอรับเรื่อง";
  const process = "กำลังดำเนินการ";
  const done = "เสร็จสิ้น";

  const reportRef: string = watch("reportRef") || ""
  const searchReport = async () => {
    setIsSearching(true);
    const reportCol = collection(db, "Report");
    const qReport = query(
      reportCol,
      where("ref", "==", reportRef.toUpperCase().trim())
    );
    await getDocs(qReport).then(async (found) => {
      if (found.size !== 0) {
        const reportDetail: ReportDetail = found.docs[0].data() as ReportDetail;
        setReportFound({ id: found.docs[0].id, docs: reportDetail });
        const projectCol = collection(db, "Project")
        const qProject = query(projectCol, where("firebaseId", "==", reportDetail.firebaseId))
        const projectFound = (await getDocs(qProject)).docs[0]
        const projectDetail: Project = { projectId: projectFound.id, detail: projectFound.data() as ProjectDetail }

        CompanyCtx.setFirebaseId(projectDetail.detail.firebaseId)
        CompanyCtx.setCompany(projectDetail.detail.companyID, projectDetail.detail.companyName)
        CompanyCtx.setProject(projectDetail.projectId, projectDetail.detail.projectName)
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

  const searchRef: string = watch("searchRef") || props.searchValue || "";

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

  const findCompany = () => {
    if (searchRef === "") { setCompanyFound([]) }
    else {
      const found = detail.map((c, index) => {
        if (
          c.detail.companyName
            .toLowerCase()
            .includes(searchRef.toLowerCase())
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
                styles={{ fontWeight: "bold", color: "blue" }}
              >
                {c.detail.companyName}
              </Highlight>
            </Text>
          );
        }
      })
      setCompanyFound(found.filter(i => i != undefined) as JSX.Element[])
    }
  }

  const findProject = () => {
    if (searchRef === "") { setProjectFound([]) }
    else {
      const found = detail.map((c) => {
        return c.detail.projects?.map((p, index) => {
          if (
            p.projectName
              .toLowerCase()
              .includes(searchRef.toLowerCase())
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
                  styles={{ fontWeight: "bold", color: "blue" }}
                >
                  {`${c.detail.companyName} > ${p.projectName}`}
                </Highlight>
              </Text>
            );
          }
        });
      })
      setProjectFound(found.flat().filter(Boolean) as JSX.Element[])
    }
  }


  useEffect(() => {
    setSearchValue(searchRef);
    onSearch();
    findCompany();
    findProject();
  }, [searchRef]);

  // useEffect(() => {
  //   console.clear()
  //   console.log(`companyFound length : ${companyFound.length}`)
  //   if (companyFound.length > 0) {
  //     companyFound.forEach(i => console.log(i))
  //   }
  //   console.log(`projectFound length : ${projectFound.length}`)
  //   if (projectFound.length > 0) {
  //     projectFound.forEach(i => console.log(i))
  //   }
  // }, [companyFound, projectFound])

  return (
    <Box>
      <Button
        bg="#4c7bf4"
        color="white"
        _hover={{ opacity: "0.8" }}
        borderRadius="16px"
        onClick={onOpen}
      >
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
                  placeholder="กรอกคำค้นหา"
                  {...register("searchRef")}
                />
              </InputGroup>
            </Box>

            <Card mb="1rem" boxShadow={"lg"}>
              <CardHeader pb="0.25rem">
                <Heading fontFamily={"inherit"} fontSize={"1.25rem"}>
                  บริษัท (Company)
                </Heading>
              </CardHeader>
              <CardBody>
                {
                  companyFound.length > 0
                    ?
                    companyFound : searchValue === ""
                      ? <Text>กรุณากรอกคำค้นหา</Text>
                      : <Text>ไม่พบบริษัท <Text as="span" fontWeight={"bold"}>"{searchValue}"</Text></Text>
                }
              </CardBody>

            </Card>

            <Divider my="0.5rem" />

            <Card mb="1rem" boxShadow={"lg"}>
              <CardHeader pb="0.25rem">
                <Heading fontFamily={"inherit"} fontSize={"1.25rem"}>
                  โปรเจกต์ (Project)
                </Heading>
              </CardHeader>
              <CardBody>
                {
                  projectFound.length > 0
                    ?
                    projectFound : searchValue === ""
                      ? <Text>กรุณากรอกคำค้นหา</Text>
                      : <Text>ไม่พบโปรเจกต์ <Text as="span" fontWeight={"bold"}>"{searchValue}"</Text></Text>
                }
              </CardBody>
            </Card>
            <Divider my="0.5rem" />
            <Card>
              <CardHeader pb="0.25rem">
                <HStack justify={"space-between"}>
                  <Heading fontFamily={"inherit"} fontSize={"1.25rem"}>
                    รายงานปัญหา (Report)
                  </Heading>

                </HStack>
              </CardHeader>
              <CardBody>

                <HStack
                  justifyContent={"space-between"}
                  w="100%"
                  alignItems={"center"}
                >
                  <Box display="flex" alignItems={"left"} flexDir={"column"}>
                    <Text>
                      ค้นหาปัญหาจากรหัส
                    </Text>
                    <InputGroup display={"flex"} justifyContent={"space-between"}>
                      <Input {...register("reportRef")} />
                      <Button
                        onClick={searchReport}
                        isLoading={isSearching}
                        bg="#4c7bf4"
                        color="white"
                        _hover={{}}
                        ml="0.25rem"
                        borderRadius={"16px"}
                      >
                        <SearchIcon />
                      </Button>
                    </InputGroup>
                  </Box>
                  {/* <Button
                  onClick={() => {
                    setReportFound(undefined);
                  }}
                  colorScheme="red"
                >
                  <DeleteIcon />
                </Button> */}
                </HStack>
                {reportFound && (
                  <Card
                    border="1px solid rgb(0,0,0,0.2)"
                    boxShadow={"lg"}
                    mt="1rem"
                  >
                    <CardBody>

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
                          สถานะ
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
                              `/company/${CompanyCtx.companyId}/${CompanyCtx.projectId}/${reportFound.docs.projectName}/${reportFound.id}`
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
                    </CardBody>
                  </Card>
                )}
              </CardBody>
            </Card>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default QuickSearchModal;
