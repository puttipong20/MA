/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useContext, useRef } from "react";
import {
  Box,
  Center,
  Container,
  HStack,
  Stack,
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
  Button,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Spinner,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import FormAddCompany from "../../components/FormCompany/FormCompany";
import { useNavigate } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../services/config-db";
import EditCompany from "./EditCompany";
import DeleteCompany from "./DeleteCompany";
import ViewCompany from "./ViewCompany";
import { search } from "ss-search";
import classes from "../../pages/kim/ProblemPreview.module.css";

import { CompanyContext } from "../../context/CompanyContext";

function PreCompany() {
  const [comForm, setComForm] = useState<any[]>([]);
  const [filComForm, setFilComForm] = useState<any[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const navigate = useNavigate();
  const Company = useContext(CompanyContext);
  const searchRef = useRef<HTMLInputElement>(null);

  const fetchData = async () => {
    setIsFetching(true);
    const CompanyDoc = collection(db, "Company");
    const q = query(CompanyDoc, orderBy("createdAt", "asc"));
    onSnapshot(q, (snapshot) => {
      const allCompany = snapshot.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      });
      setComForm(allCompany);
      setFilComForm(allCompany);
      setIsFetching(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onSearch = () => {
    const value = searchRef.current?.value;
    const searchText = value + " " || "";
    const searchField = ["companyName"];
    const result = search(comForm, searchField, searchText) as any[];
    setFilComForm(result);
  };

  useEffect(() => {
    onSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNext = (id: string, name: string) => {
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
                <Text fontSize="16px" fontFamily="Prompt" color="#000000">
                  บริการหลังการขายของลูกค้าทั้งหมด
                </Text>
              </VStack>
              <Stack pb="0.5rem">
                <FormAddCompany />
              </Stack>
            </HStack>
          </Center>
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
              bg="#4C7BF4"
              color="gray.100"
              borderRadius="16px"
              onClick={onSearch}
              _hover={{
                color: "white",
                bg: "#4C7BF4",
              }}
            >
              ค้นหา
            </Button>
          </Flex>
        </Box>

        <Box>
          <Box
            mt="10"
            borderRadius="20px"
            border="1px"
            borderColor="#f4f4f4"
            w="100%"
            h="100%"
            maxH="68vh"
            overflowY={"auto"}
            boxShadow={"1px 1px 1px rgb(0,0,0,0.1)"}
            className={classes.table}
          >
            <Table w="100%">
              <Thead>
                <Tr bg="#4C7BF4">
                  <Th
                    minW="10rem"
                    fontSize="16px"
                    fontWeight={"normal"}
                    color="white"
                    w="15%"
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
                    textAlign="center"
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
              {isFetching ? (
                <Flex w="100%" h="10vh" align={"center"} justify="center" border={"1px"}>
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="md"
                  />
                </Flex>
              ) : (
                <Tbody>
                  {filComForm.map((com: any, index: any) => {
                    return (
                      <Tr
                        key={index}
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                      >
                        <Td
                          onClick={() => {
                            handleNext(com.id, com.companyName);
                          }}
                          textAlign="center"
                        >
                          {index + 1}
                        </Td>
                        <Td
                          onClick={() => {
                            handleNext(com.id, com.companyName);
                          }}
                          textAlign="left"
                        >
                          {com.companyName}
                        </Td>
                        <Td
                          onClick={() => {
                            handleNext(com.id, com.companyName);
                          }}
                          textAlign="left"
                        >
                          {com.userName}
                        </Td>
                        <Td
                          onClick={() => {
                            handleNext(com.id, com.companyName);
                          }}
                          textAlign="left"
                        >
                          {com.userPhone}
                        </Td>
                        <Td textAlign="center">
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              colorScheme="white"
                              bg="white"
                              _hover={{ bg: "gray.100" }}
                              icon={
                                <BiDotsHorizontalRounded
                                  size="25px"
                                  color="#4C7BF4"
                                />
                              }
                            />
                            <MenuList backgroundColor="white">
                              <MenuItem h="50px" p={0} backgroundColor="whiter">
                                <ViewCompany id={com?.id} data={com} />
                              </MenuItem>
                              <MenuItem h="50px" p={0} backgroundColor="whiter">
                                <EditCompany id={com.id} data={com} />
                              </MenuItem>
                              <MenuItem h="50px" p={0} backgroundColor="whiter">
                                <DeleteCompany
                                  fetchData={fetchData}
                                  item={com}
                                  id={com?.id}
                                />
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              )}
            </Table>
          </Box>
        </Box>
      </Container>
    </div>
  );
}

export default PreCompany;
