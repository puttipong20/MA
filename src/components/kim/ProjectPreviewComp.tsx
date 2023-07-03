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
import DeleteProject from "./DeleteProject";

import classes from "./ProjectPreview.module.css";
// import EditProject from './EditProject';

import moment from "moment";
// import Renewal from './Renewal';

import { CompanyContext } from "../../context/CompanyContext";
import { BiArrowBack, BiDotsHorizontalRounded } from "react-icons/bi";
import AddProject from "./AddProject";

export default function ProjectPreviewComp() {
  const [isFetching, setIsFetching] = useState(false);
  const [projects, setProjects] = useState<{ project: Project; ma: MA[] }[]>([]);
  const [filterProject, setFilterProjects] = useState<{ project: Project; ma: MA[] }[]>([]);
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
        const project: Project = {
          projectId: projectID,
          detail: p.data() as ProjectDetail,
        };
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
    onSnapshot(q, () => {
      fetchingData();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params["project"], params["company"]]);

  return (
    <div className="container">
      <Container maxW="100%" pb="10">
        <Box>
          <Center w="100%" mb="1rem">
            <HStack
              w="100%"
              justifyContent="space-between"
              alignItems="flex-end"
            >
              <VStack
                pt="1rem"
                justifyContent="flex-start"
                alignItems="flex-star"
                spacing="2px"
              >
                <Button
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
                <Text
                  fontWeight="600"
                  lineHeight="25.2px"
                  fontSize="18px"
                  fontFamily="Prompt"
                >
                  ข้อมูล Projects
                </Text>
                <Text fontSize="16px" fontFamily="Prompt" color="#000000">
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
              >
                <AiOutlineReload />
              </Button>
              <AddProject companyName={companyName} companyId={params["company"] as string} />
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
          maxH="67vh"
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
                      <Box as="div" w="15%" m="auto">
                        <AddProject companyName={companyName} companyId={params["company"] as string} />
                      </Box>
                    </Td>
                  </Tr>
                </>
              ) : (
                filterProject.map((i, index) => {
                  const lastestMA = i.ma.filter(
                    (j) => j.status === "active")[0];
                  let display = "";
                  let color = "";
                  if (lastestMA) {
                    const state = lastestMA.status;
                    state === "active"
                      ? (display = "กำลังใช้งาน")
                      : state === "advance"
                        ? (display = "ล่วงหน้า")
                        : (display = "หมดอายุ");
                    state === "active"
                      ? (color = "green")
                      : state === "advance"
                        ? (color = "blue")
                        : (color = "red");
                  }
                  return (
                    <Tr key={index} _hover={{ bg: "gray.100" }}>
                      <Td textAlign={"center"}>
                        {i.project.detail.projectName}
                      </Td>

                      {!lastestMA ? (
                        <Td colSpan={4} textAlign={"center"}>
                          ไม่มีสัญญาที่กำลังใช้งาน
                        </Td>
                      ) : (
                        <>
                          <Td textAlign={"center"}>
                            {lastestMA &&
                              moment(lastestMA.startMA).format("DD/MM/YYYY")}
                          </Td>
                          <Td textAlign={"center"}>
                            {lastestMA &&
                              moment(lastestMA.endMA).format("DD/MM/YYYY")}
                          </Td>
                          <Td textAlign={"right"}>
                            {lastestMA &&
                              Number(lastestMA.cost).toLocaleString("th-TH", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                          </Td>
                          <Td textAlign={"center"} fontSize={"1rem"}>
                            <Badge colorScheme={color}>{display}</Badge>
                          </Td>
                        </>
                      )}
                      <Td textAlign={"center"}>
                        {moment(i.project.detail.createdAt).format(
                          "DD/MM/YYYY HH:mm:ss"
                        )}
                      </Td>
                      <Td textAlign={"center"}>
                        <Button
                          bg="#FFA500"
                          color="#eee"
                          _hover={{ opacity: "0.8" }}
                          fontWeight={"normal"}
                          onClick={() => {
                            // Company.setProject(
                            //   i.project.projectId,
                            //   i.project.detail.projectName
                            // );
                            navigate(
                              `/company/${params["company"]}/${i.project.projectId}/${i.project.detail.projectName}/problemReport`
                            );
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
                              ดูข้อมูล Project
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
      </Container>
    </div>
  );
}
