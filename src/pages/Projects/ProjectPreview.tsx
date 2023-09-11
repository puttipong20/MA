import {
  Box,
  Text,
  InputGroup,
  Input,
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
  Badge,
  Container,
  Center,
  HStack,
  VStack,
  InputLeftAddon,
  IconButton,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { BsSearch } from "react-icons/bs";

import { CgDetailsMore } from "react-icons/cg";
import { AiOutlineReload } from "react-icons/ai";

import { useParams, useNavigate } from "react-router-dom";

import {
  doc,
  collection,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../services/config-db";
import { MA, Project, ProjectDetail } from "../../@types/Type";

import { search } from "ss-search";
import DeleteProject from "../../components/Projects/DeleteProject";
import AddProject from "../../components/Projects/AddProject";

import classes from "./ProjectPreview.module.css";
// import EditProject from './EditProject';

import moment from "moment";
// import Renewal from './Renewal';

import { CompanyContext } from "../../context/CompanyContext";
import { BiArrowBack, BiDotsHorizontalRounded } from "react-icons/bi";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

export default function ProjectPreviewComp() {
  const [isFetching, setIsFetching] = useState(false);
  const [projects, setProjects] = useState<{ project: Project; ma: MA[] }[]>(
    []
  );
  const [filterProject, setFilterProjects] = useState<
    { project: Project; ma: MA[] }[]
  >([]);
  const [companyName, setCompanyName] = useState("");
  const params = useParams();
  const navigate = useNavigate();
  const Company = useContext(CompanyContext);
  const backPath = `/`;

  const fetchingData = async () => {
    setIsFetching(true);
    setCompanyName(Company.companyName);
    const projectRef = collection(db, "Project");
    const qProject = query(
      projectRef,
      where("companyID", "==", params["company"]),
      orderBy("createdAt", "desc")
    );
    const projects = await getDocs(qProject);
    const allProjects: { project: Project; ma: MA[] }[] = [];

    await Promise.all(
      projects.docs.map(async (p) => {
        const projectID = p.id;
        if ((p.data() as ProjectDetail).status === "enable") {
          const project: Project = {
            projectId: projectID,
            detail: p.data() as ProjectDetail,
          };
          Company.setFirebaseId((p.data() as ProjectDetail).firebaseId);
          // setCompanyName(project.detail.companyName);
          const MAref = collection(doc(db, "Project", projectID), "MAlogs");
          const MAlogs = await getDocs(MAref);
          const logs: MA[] = [];
          MAlogs.forEach((m) => logs.push(m.data() as MA));
          const merge: { project: Project; ma: MA[] } = {
            project: project,
            ma: logs,
          };
          // console.log(merge);
          allProjects.push(merge);
        }
      })
    );

    setProjects(allProjects);
    setFilterProjects(allProjects);
    // console.log(allProjects);
    setIsFetching(false);
  };

  const onSearch = () => {
    const inputRef = document.getElementById(
      "projectSearch"
    ) as HTMLInputElement;
    const value = inputRef.value;

    const searchField = ["project.detail.projectName"];
    const result = search(projects, searchField, value) as {
      project: Project;
      ma: MA[];
    }[];
    setFilterProjects(result);
  };

  useEffect(() => {
    const projectCollection = collection(db, "Project");
    const q = query(projectCollection);
    setCompanyName(Company.companyName);
    onSnapshot(q, () => {
      fetchingData();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params["project"], params["company"], Company.companyId]);

  // สร้าง State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า
  const totalPages = Math.ceil(filterProject.length / itemsPerPage);

  // อัพเดตข้อมูลในหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filterProject.slice(startIndex, endIndex);

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
    <div className="container">
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
                  ข้อมูล Projects
                </Text>
                <Text fontSize="16px" fontFamily="Prompt">
                  บริการหลังการขายของลูกค้าทั้งหมดของบริษัท
                  <Text ml="2" as="span" fontWeight={"bold"}>
                    {companyName}
                  </Text>
                </Text>
              </VStack>
            </HStack>
          </Center>
          <Flex justify={"space-between"}>
            <Flex justifyContent="flex-start" gap="20px">
              <InputGroup w="auto" borderRadius="16px">
                <InputLeftAddon
                  background="#F4F7FE"
                  border="none"
                  borderRadius="16px 0 0 16px"
                >
                  <BsSearch />
                </InputLeftAddon>
                <Input
                  type="text"
                  background="#F4F7FE"
                  border="none"
                  focusBorderColor={"none"}
                  borderRadius={"16px"}
                  placeholder="ค้นหา project"
                  id="projectSearch"
                  onChange={onSearch}
                />
              </InputGroup>
            </Flex>
            <Flex>
              <Button
                _hover={{ opacity: 0.8 }}
                bg="#4C7BF4"
                color="#eee"
                isLoading={isFetching}
                onClick={fetchingData}
                mr="1rem"
                borderRadius="16px"
              >
                <AiOutlineReload />
              </Button>
              {!isFetching && (
                <AddProject
                  companyName={companyName}
                  companyId={params["company"] as string}
                />
              )}
            </Flex>
          </Flex>
        </Box>
        <Box
          mt="1rem"
          borderRadius="20px"
          border="1px"
          borderColor="#f4f4f4"
          w="100%"
          h="100%"
          // maxH="67vh"
          overflowY={"auto"}
          boxShadow={"1px 1px 1px rgb(0,0,0,0.1)"}
          className={classes.table}
        >
          <Table textAlign={"center"} w="100%">
            <Thead position="sticky" top={0} zIndex="1">
              <Tr bg={"#4c7bf4"}>
                <Th
                  minW="10rem"
                  fontSize="16px"
                  color="#fff"
                  textAlign={"center"}
                  fontWeight={"normal"}
                  fontFamily={"inherit"}
                >
                  Project
                </Th>
                <Th
                  minW="14rem"
                  fontSize="16px"
                  color="#fff"
                  textAlign={"center"}
                  fontWeight={"normal"}
                  fontFamily={"inherit"}
                >
                  วันที่เริ่มต้นสัญญา MA
                </Th>
                <Th
                  minW="15rem"
                  fontSize="16px"
                  color="#fff"
                  textAlign={"center"}
                  fontWeight={"normal"}
                  fontFamily={"inherit"}
                >
                  วันที่สิ้นสุดสัญญา MA
                </Th>
                <Th
                  minW="10rem"
                  fontSize="16px"
                  color="#fff"
                  textAlign={"center"}
                  fontWeight={"normal"}
                  fontFamily={"inherit"}
                >
                  ค่าบริการ
                </Th>
                <Th
                  minW="10rem"
                  fontSize="16px"
                  color="#fff"
                  textAlign={"center"}
                  fontWeight={"normal"}
                  fontFamily={"inherit"}
                >
                  สถานะสัญญา
                </Th>
                <Th
                  minW="10rem"
                  fontSize="16px"
                  color="#fff"
                  textAlign={"center"}
                  fontWeight={"normal"}
                  fontFamily={"inherit"}
                >
                  สร้างเมื่อ
                </Th>
                <Th
                  minW="10rem"
                  fontSize="16px"
                  color="#fff"
                  textAlign={"center"}
                  fontWeight={"normal"}
                  fontFamily={"inherit"}
                >
                  รายการปัญหา
                </Th>
                <Th
                  minW="10rem"
                  fontSize="16px"
                  color="#fff"
                  textAlign={"center"}
                  fontWeight={"normal"}
                  fontFamily={"inherit"}
                >
                  จัดการ
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {isFetching ? (
                <Tr>
                  <Td colSpan={8} textAlign={"center"}>
                    Loading . . .
                    <Spinner />
                  </Td>
                </Tr>
              ) : filterProject.length === 0 ? (
                <>
                  <Tr w="100%">
                    <Td colSpan={8} textAlign={"center"}>
                      ไม่มีข้อมูลโปรเจค
                    </Td>
                  </Tr>
                  <Tr w="100%">
                    <Td colSpan={8}>
                      <Box as="div" w="fit-content" m="auto">
                        <AddProject
                          companyName={companyName}
                          companyId={params["company"] as string}
                        />
                      </Box>
                    </Td>
                  </Tr>
                </>
              ) : (
                currentItems.map((i, index) => {
                  const lastestMA = i.ma.filter(
                    (j) => j.status === "active"
                  )[0];
                  let display = "";
                  let color = "";
                  let bg = "";
                  if (lastestMA) {
                    const state = lastestMA.status;
                    state === "active"
                      ? (display = "กำลังใช้งาน")
                      : state === "advance"
                      ? (display = "ล่วงหน้า")
                      : (display = "หมดอายุ");
                    state === "active"
                      ? (color = "white")
                      : state === "advance"
                      ? (color = "white")
                      : (color = "white");
                    state === "active"
                      ? (bg = "green.500")
                      : state === "advance"
                      ? (bg = "blue.500")
                      : (bg = "red.500");
                  }
                  const navigateLink = `/company/${params["company"]}/${i.project.projectId}/${i.project.detail.projectName}/problemReport`;
                  return (
                    <Tr
                      key={index}
                      _hover={{ bg: "gray.100" }}
                      cursor={"pointer"}
                    >
                      <Td
                        textAlign={"center"}
                        onClick={() => {
                          navigate(navigateLink);
                        }}
                      >
                        {i.project.detail.projectName}
                      </Td>

                      {!lastestMA ? (
                        <Td
                          colSpan={4}
                          textAlign={"center"}
                          onClick={() => {
                            navigate(navigateLink);
                          }}
                        >
                          ไม่มีสัญญาที่กำลังใช้งาน
                        </Td>
                      ) : (
                        <>
                          <Td
                            textAlign={"center"}
                            onClick={() => {
                              navigate(navigateLink);
                            }}
                          >
                            {lastestMA &&
                              moment(lastestMA.startMA).format("DD/MM/YYYY")}
                          </Td>
                          <Td
                            textAlign={"center"}
                            onClick={() => {
                              navigate(navigateLink);
                            }}
                          >
                            {lastestMA &&
                              moment(lastestMA.endMA).format("DD/MM/YYYY")}
                          </Td>
                          <Td
                            textAlign={"center"}
                            onClick={() => {
                              navigate(navigateLink);
                            }}
                          >
                            {lastestMA &&
                              Number(lastestMA.cost).toLocaleString("th-TH", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                          </Td>
                          <Td
                            textAlign={"center"}
                            onClick={() => {
                              navigate(navigateLink);
                            }}
                          >
                            <Badge
                              borderRadius="16px"
                              p="1.5"
                              w="6rem"
                              color={color}
                              bg={bg}
                            >
                              {display}
                            </Badge>
                          </Td>
                        </>
                      )}
                      <Td
                        textAlign={"center"}
                        onClick={() => {
                          navigate(navigateLink);
                        }}
                      >
                        {moment(i.project.detail.createdAt).format(
                          "DD/MM/YYYY HH:mm:ss"
                        )}
                      </Td>
                      <Td textAlign={"center"}>
                        <Button
                          bg="#4C7BF5"
                          opacity="0.9"
                          color="#eee"
                          _hover={{ opacity: "0.8" }}
                          fontWeight={"normal"}
                          w="150px"
                          borderRadius="16px"
                          onClick={() => {
                            navigate(navigateLink);
                          }}
                        >
                          ดูรายการปัญหา
                        </Button>
                      </Td>
                      <Td textAlign={"center"}>
                        <Menu>
                          <MenuButton
                            as={IconButton}
                            colorScheme="white"
                            bg="none"
                            _hover={{ bg: "white" }}
                            icon={
                              <BiDotsHorizontalRounded
                                size="25px"
                                color="#4C7BF4"
                              />
                            }
                          />
                          <MenuList
                            backgroundColor="white"
                            pos="sticky"
                            top="0"
                            bg="white"
                            boxShadow="0 2px 4px rgba(0, 0, 0, 0.1)"
                            zIndex="sticky"
                          >
                            <MenuItem
                              color="gray"
                              h="50px"
                              p={0}
                              backgroundColor="whiter"
                              onClick={() => {
                                // Company.setProject(
                                //   i.project.projectId,
                                //   i.project.detail.projectName
                                // );
                                navigate(
                                  `/company/${params["company"]}/${i.project.projectId}/${i.project.detail.projectName}/detail`
                                );
                              }}
                            >
                              <Text
                                w="20%"
                                display="flex"
                                justifyContent={"center"}
                              >
                                <CgDetailsMore />
                              </Text>
                              ดูข้อมูล Project {<br />}และ สัญญา MA
                            </MenuItem>
                            <MenuItem
                              h="50px"
                              p={0}
                              backgroundColor="whiter"
                              color={"red"}
                            >
                              <DeleteProject
                                companyId={i.project.detail.companyID}
                                projectId={i.project.projectId}
                              />
                            </MenuItem>
                          </MenuList>
                        </Menu>
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
    </div>
  );
}
