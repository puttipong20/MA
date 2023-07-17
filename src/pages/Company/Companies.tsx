/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useContext, useRef } from "react";
import {
  Box,
  Center,
  Container,
  HStack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
  Flex,
  InputLeftAddon,
  InputGroup,
  Input,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Spinner,
  Button,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import FormAddCompany from "./AddCompany";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../services/config-db";
import EditCompany from "./EditCompany";
import DeleteCompany from "./DeleteCompany";
import ViewCompany from "./ViewDetail";
import { search } from "ss-search";
import classes from "../Report/ReportPreview.module.css";
import { CompanyContext } from "../../context/CompanyContext";
import { useQuery } from "react-query";
import { Company, CompanyDetail } from "../../@types/Type";
import { AiOutlineReload } from "react-icons/ai";

function PreCompany() {
  const [comForm, setComForm] = useState<Company[]>([]);
  const [filComForm, setFilComForm] = useState<Company[]>([]);
  const navigate = useNavigate();
  const Company = useContext(CompanyContext);
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchCompany = async () => {
    const CompanyRef = collection(db, "Company");
    const q = query(CompanyRef, orderBy("createdAt", "desc"));
    const Companies = await getDocs(q);
    return Companies;
  };

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["company"],
    queryFn: fetchCompany,
    refetchOnWindowFocus: false,
  });

  const clickToRefetch = () => {
    refetch();
  };

  useEffect(() => {
    const companies: Company[] = [];
    data?.forEach((d) =>
      companies.push({
        companyId: d.id,
        detail: { ...(d.data() as CompanyDetail) },
      })
    );
    // console.log(companies);
    setComForm(companies);
    setFilComForm(companies);
  }, [data]);

  const onSearch = () => {
    const value = searchRef.current?.value;
    const searchText = value + " " || "";
    const searchField = ["detail.companyName"];
    const result = search(comForm, searchField, searchText) as any[];
    setFilComForm(result);
  };

  useEffect(() => {
    onSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = (id: string, name: string) => {
    // localStorage.setItem("companyName", name)
    Company.setCompany(id, name);
    navigate(`/company/${id}`);
  };

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
                <Text
                  fontWeight="600"
                  lineHeight="25.2px"
                  fontSize="18px"
                  fontFamily="Prompt"
                >
                  ข้อมูลลูกค้า
                </Text>
                <Text fontSize="16px" fontFamily="Prompt">
                  บริการหลังการขายของลูกค้าทั้งหมด
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
                  placeholder="ค้นหาบริษัท"
                  borderRadius={"16px"}
                  focusBorderColor={"none"}
                  ref={searchRef}
                  onChange={onSearch}
                />
              </InputGroup>
              <Button
                onClick={clickToRefetch}
                bg="#4C7BF4"
                color="#fff"
                _hover={{ opacity: 0.8 }}
                _active={{ opacity: 0.9 }}
              >
                <AiOutlineReload />
              </Button>
            </Flex>
            <FormAddCompany refetch={refetch} />
          </Flex>
        </Box>

        <Box>
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
            <Table w="100%">
              <Thead position="sticky" top={0} zIndex="1">
                <Tr bg="#4C7BF4">
                  <Th
                    minW="10rem"
                    fontSize="16px"
                    fontWeight={"normal"}
                    color="white"
                    w="5%"
                    textAlign="center"
                    fontFamily={"inherit"}
                  >
                    ลำดับที่
                  </Th>
                  <Th
                    minW="10rem"
                    fontSize="16px"
                    fontWeight={"normal"}
                    color="white"
                    w="30%"
                    textAlign="left"
                    fontFamily={"inherit"}
                  >
                    ชื่อบริษัท
                  </Th>
                  <Th
                    minW="10rem"
                    fontSize="16px"
                    fontWeight={"normal"}
                    color="white"
                    w="30%"
                    textAlign="left"
                    fontFamily={"inherit"}
                  >
                    ชื่อผู้ติดต่อ
                  </Th>
                  <Th
                    minW="12rem"
                    fontSize="16px"
                    fontWeight={"normal"}
                    color="white"
                    w="15%"
                    textAlign="left"
                    fontFamily={"inherit"}
                  >
                    เบอร์โทรติดต่อ
                  </Th>
                  <Th
                    minW="10rem"
                    fontSize="16px"
                    fontWeight={"normal"}
                    color="white"
                    w="10%"
                    textAlign="center"
                    fontFamily={"inherit"}
                  >
                    การจัดการ
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {isLoading || isFetching ? (
                  <Tr>
                    <Td colSpan={7} textAlign={"center"}>
                      Loading . . .
                      <Spinner />
                    </Td>
                  </Tr>
                ) : filComForm.length === 0 ? (
                  <Tr>
                    <Td colSpan={7} textAlign={"center"}>
                      ยังไม่มีข้อมูลบริษัท
                    </Td>
                  </Tr>
                ) : (
                  filComForm.map((com, index) => {
                    return (
                      <Tr
                        key={index}
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                      >
                        <Td
                          onClick={() => {
                            handleNext(com.companyId, com.detail.companyName);
                          }}
                          textAlign="center"
                        >
                          {index + 1}
                        </Td>
                        <Td
                          onClick={() => {
                            handleNext(com.companyId, com.detail.companyName);
                          }}
                          textAlign="left"
                        >
                          {com.detail.companyName}
                        </Td>
                        <Td
                          onClick={() => {
                            handleNext(com.companyId, com.detail.companyName);
                          }}
                          textAlign="left"
                        >
                          {com.detail.userName}
                        </Td>
                        <Td
                          onClick={() => {
                            handleNext(com.companyId, com.detail.companyName);
                          }}
                          textAlign="left"
                        >
                          {com.detail.userPhone}
                        </Td>
                        <Td textAlign="center">
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
                              <MenuItem h="50px" p={0} backgroundColor="whiter">
                                <ViewCompany data={com.detail} />
                              </MenuItem>
                              <MenuItem h="50px" p={0} backgroundColor="whiter">
                                <EditCompany
                                  id={com.companyId}
                                  data={com.detail}
                                  callBack={refetch}
                                />
                              </MenuItem>
                              <MenuItem h="50px" p={0} backgroundColor="whiter">
                                <DeleteCompany
                                  fetchData={refetch}
                                  item={com}
                                  id={com.companyId}
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
        </Box>
      </Container>
    </div>
  );
}

export default PreCompany;
