import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import FormAddCompany from "../../components/FormCompany/FormCompany";
import { useNavigate, useParams } from "react-router-dom";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../services/config-db";
import EditCompany from "./EditCompany";
import DeleteCompany from "./DeleteCompany";
import ViewCompany from "./ViewCompany";
import Fuse from "fuse.js";

function PreCompany(props: any) {
  const [comForm, setComForm] = useState<any[]>([]);
  const [search, setSearch] = useState<any[]>([]);
  const params = useParams();
  const navigate = useNavigate();

  const fetchData = async () => {
    const CompanyDoc = collection(db, "Company");
    const q = query(CompanyDoc, orderBy("createdAt", "asc"));
    // onSnapshot(CompanyDoc, (snapshot) => {
    onSnapshot(q, (snapshot) => {
      return setComForm(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    const search = collection(db, "Company");
    onSnapshot(search, (snapshot) => {
      return setSearch(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const handleNext = () => {
    navigate(`/companypage/${props.type}`);
  };

  return (
    <div className="container">
      <form>
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
                  borderRadius="16px"
                  placeholder="ค้นหาบริษัท"
                  focusBorderColor="none"
                  onChange={(event) => {
                    let keyword = event.currentTarget.value;
                    const fuse = new Fuse(search, {
                      keys: ["companyName", "userPhone", "userName"],
                      findAllMatches: true,
                      shouldSort: true,
                    });
                    const results = fuse.search(keyword);

                    const searchResults =
                      keyword === ""
                        ? search
                        : results.map((value: any) => value.item);
                    setComForm(searchResults);
                  }}
                />
              </InputGroup>
              <Button
                bg="#4C7BF4"
                color="gray.100"
                borderRadius="16px"
                // onClick={onSearch}
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
              h="70%"
              overflowY={"auto"}
              boxShadow={"1px 1px 1px rgb(0,0,0,0.1)"}
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
                <Tbody>
                  {comForm.map((com: any, index: any) => {
                    return (
                      <Tr
                        key={index}
                        cursor="pointer"
                        _hover={{ bg: "gray.100" }}
                      >
                        <Td textAlign="center" onClick={handleNext}>
                          {com.no}
                        </Td>
                        <Td textAlign="left" onClick={handleNext}>
                          {com.companyName}
                        </Td>
                        <Td textAlign="left" onClick={handleNext}>
                          {com.userName}
                        </Td>
                        <Td textAlign="left" onClick={handleNext}>
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
              </Table>
            </Box>
          </Box>
        </Container>
      </form>
    </div>
  );
}

export default PreCompany;
