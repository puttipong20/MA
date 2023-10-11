import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Container,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Button,
  Badge,
  Spinner,
} from "@chakra-ui/react";
import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../../services/config-db";
import { useContext, useEffect, useState } from "react";
import "./index.css";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { CgDetailsMore } from "react-icons/cg";
import DeleteProject from "../../components/Projects/DeleteProject";
import moment from "moment";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { search } from "ss-search";
import { CompanyContext } from "../../context/CompanyContext";
import { useNavigate } from "react-router-dom";

function AllProject() {
  const [allProject, setAllProject] = useState<any[]>([]);
  const [filterAllProject, setFilterAllProject] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [status, setStatus] = useState<string>("");
  const [keyWord, setKeyWord] = useState<string>("");
  const navigate = useNavigate();
  const Company = useContext(CompanyContext);

  // สร้าง State สำหรับ Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // จำนวนรายการต่อหน้า
  const totalPages = Math.ceil(filterAllProject.length / itemsPerPage);

  // อัพเดตข้อมูลในหน้าปัจจุบัน
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filterAllProject.slice(startIndex, endIndex);
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

  //===== functions =======
  const onSearch = () => {
    const key = `${keyWord} ${status}`;
    const searchField = ["projectName", "statusMa"];
    const result = search(allProject, searchField, key);
    setFilterAllProject(result);
  };
  const getProjects = () => {
    setIsFetching(true);
    onSnapshot(
      query(collection(db, "Project"), orderBy("createdAt", "desc")),
      (res) => {
        const docs = res.docs;
        const projects: any[] = [];
        docs.map((item) => {
          
          getDocs(
            query(
              collection(db, "Project", item.id, "MAlogs"),
              orderBy("createdAt", "desc")
            )
          )
            .then((onSnap) => {
              const ma = onSnap.docs;
              ma.forEach((doc) => {
                if (item.data().status === "enable") {
                  projects.push({
                    projectId: item.id,
                    ...item.data(),
                    ...doc.data(),
                    statusMa: doc.data().status,
                    statusProject: item.data().status,
                  });
                  console.log(projects)
                }
              });
              setAllProject([...projects]);
              setFilterAllProject([...projects]);
              setIsFetching(false);
            })
            .catch((e) => {
              console.log(e);
            });
        });
      }
    );
  };
  //====== useEffect ======
  useEffect(() => {
    getProjects();
  }, []);
  useEffect(() => {
    onSearch();
  }, [keyWord, status]);
  return (
    <Container maxW={"100%"}>
      <Text
        my={4}
        fontWeight="600"
        lineHeight="25.2px"
        fontSize="18px"
        fontFamily="Prompt"
      >
        โปรเจคทั้งหมด
      </Text>
      <Flex maxW={"50%"}>
        <Box>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color={"gray.400"} />
            </InputLeftElement>
            <Input
              borderRadius={"16px"}
              type="tel"
              onChange={(e) => setKeyWord(e.target.value)}
              placeholder="ชื่อโปรเจค"
            />
          </InputGroup>
        </Box>
        <Box mx={2}>
          <Select
            placeholder="สถานะ"
            onChange={(e) => setStatus(e.target.value)}
            borderRadius={"16px"}
          >
            <option value={"active"}>กำลังใช้งาน</option>
            <option value={"expire"}>หมดอายุ</option>
            <option value={"advance"}>ล่วงหน้า</option>
          </Select>
        </Box>
      </Flex>
      <Box mt={4} overflowX={"auto"} borderRadius={"16px"}>
        <Table>
          <Thead top={0} zIndex="1">
            <Tr bg={"#4c7bf4"}>
              <Th
                minW="10rem"
                fontSize="16px"
                color="#fff"
                textAlign={"center"}
                fontWeight={"normal"}
                fontFamily={"inherit"}
              >
                ชื่อบริษัท
              </Th>
              <Th
                minW="10rem"
                fontSize="16px"
                color="#fff"
                textAlign={"center"}
                fontWeight={"normal"}
                fontFamily={"inherit"}
              >
                ชื่อโปรเจค
              </Th>
              <Th
                minW="10rem"
                fontSize="16px"
                color="#fff"
                textAlign={"center"}
                fontWeight={"normal"}
                fontFamily={"inherit"}
              >
                วันที่
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
                  <Spinner size={"md"} />
                </Td>
              </Tr>
            ) : filterAllProject.length === 0 ? (
              <Tr w={"100%"}>
                <Td colSpan={8} textAlign={"center"}>
                  ไม่มีข้อมูลโปรเจค
                </Td>
              </Tr>
            ) : (
              currentItems.map((item, index) =>
                item.statusProject === "enable" ? (
                  <Tr key={index} onClick={() => console.log(item)}>
                    <Td textAlign={"center"}>{item.companyName}</Td>
                    <Td textAlign={"center"}>{item.projectName}</Td>
                    <Td textAlign={"center"}>
                      {moment(item.createdAt).format("DD/MM/YYYY")}
                    </Td>
                    <Td textAlign={"center"}>
                      {moment(item.startMA).format("DD/MM/YYYY")}
                    </Td>
                    <Td textAlign={"center"}>
                      {moment(item.endMA).format("DD/MM/YYYY")}
                    </Td>
                    <Td textAlign={"center"}>
                      {Number(item.cost).toLocaleString("th-TH", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </Td>
                    <Td textAlign={"center"}>
                      <Badge
                        borderRadius={"16px"}
                        p={"1.5"}
                        w={"6rem"}
                        color={"#fff"}
                        bg={
                          item.status == "active"
                            ? "green.500"
                            : item.status == "advance"
                            ? "blue.500"
                            : item.status == "cancel"
                            ? "yellow.500"
                            : "red.500"
                        }
                      >
                        {item.status == "active"
                          ? "กำลังใช้งาน"
                          : item.status == "advance"
                          ? "ล่วงหน้า"
                          
                          : item.status == "cancel"
                          ? "ยกเลิก"
                          : "หมดอายุ"}
                      </Badge>
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
                          console.log(item);
                          navigate(
                            `/company/${item.companyID}/${item.projectId}/${item.projectName}/problemReport`
                          );
                          Company.setFirebaseId(item.firebaseId);
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
                              navigate(
                                `/company/${item.companyID}/${item.projectId}/${item.projectName}/detail`
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
                              companyId={item.companyID}
                              projectId={item.projectId}
                            />
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ) : (
                  ""
                )
              )
            )}
          </Tbody>
        </Table>
      </Box>
      <Flex pb={'50px'}>
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

export default AllProject;
