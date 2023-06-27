import React, { useCallback, useEffect, useState } from "react";
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
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { BsSearch } from "react-icons/bs";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import FormAddCompany from "../../C\omponents/korn/FormModal";
import { useNavigate, useParams } from "react-router-dom";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { db } from "../../services/config-db";
import ViewCompany from "../korn/viewCompany";
import { MdDelete } from "react-icons/md";

type Pcompany = {
  no: string;
  company: string;
  name: string;
  phone: string;
};

// function DelEditCompany({ item, fetchData }) {
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const cancelRef = React.useRef();
//   const handleRemove = async (id: any) => {
//     const bookDoc = doc(db, "CompanyAdd", id);
//     await deleteDoc(bookDoc).then(async () => {
//       await fetchData();
//     });
//   };

//   return (
//     <>
//       <Button
//         colorScheme="#FFFFFF"
//         w="100%"
//         justifyContent="flex-start"
//         color="#FF3E3E"
//         onClick={onOpen}
//         fontSize="16px"
//         fontFamily="Prompt"
//         fontWeight="400"
//         leftIcon={<MdDelete size={"20px"} />}
//       >
//         ลบข้อมูล
//       </Button>
//       <AlertDialog
//         isOpen={isOpen}
//         leastDestructiveRef={cancelRef}
//         onClose={onClose}
//       >
//         <AlertDialogOverlay>
//           <AlertDialogContent>
//             <AlertDialogHeader fontSize="lg" fontWeight="bold">
//               ลบข้อมูล
//             </AlertDialogHeader>

//             <AlertDialogBody>คุณต้องการลบข้อมูล ใช่หรือไม่</AlertDialogBody>

//             <AlertDialogFooter>
//               <Button
//                 fontFamily={"Prompt"}
//                 fontSize={"14px"}
//                 fontWeight={"600"}
//                 ref={cancelRef}
//                 onClick={onClose}
//               >
//                 ยกเลิก
//               </Button>
//               <Button
//                 fontFamily={"Prompt"}
//                 fontSize={"14px"}
//                 fontWeight={"600"}
//                 colorScheme="red"
//                 onClick={() => {
//                   handleRemove(item.id);
//                   onClose();
//                 }}
//                 ml={3}
//               >
//                 ลบข้อมูล
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>
//     </>
//   );
// }

const PreCompany = (props: any) => {
  const [comForm, setComForm] = useState<any[]>([]);
  // const [search, setSearch] = useState([]);
  const params = useParams();
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    const CompanyDoc = collection(db, "CompanyAdd");
    onSnapshot(CompanyDoc, (snapshot) => {
      return setComForm(
        snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    // const search = collection(db, "CompanyAdd");
    // onSnapshot(search, (snapshot) => {
    //   return setSearch(
    //     snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
    //   );
    // });
  }, []);
  // const getData = async () => {
  //   const q = query(collection(db, "CompanyAdd"));
  //   const querySnaphot = await getDocs(q);
  //   const companyForm: {}[] = [];
  //   querySnaphot.forEach((doc) => {
  //     companyForm.push({ id: doc.id, ...doc.data() });
  //   });
  //   setComForm(companyForm);
  // };
  useEffect(() => {
    fetchData();
    // getData();
  }, [params, comForm]);

  const handleNext = () => {
    navigate(`/precompany/${props.type}`);
  };

  return (
    <div className="container">
      <form>
        <Container maxW="90%">
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
                  placeholder="Search"
                  borderRadius="16px"
                  id="searchInput"
                  focusBorderColor="none"
                  //   onKeyDown={keyHandle}
                  //   onChange={onSearch}
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
                            {/* </MenuButton> */}
                            <MenuList backgroundColor="white">
                              <MenuItem backgroundColor="whiter">
                                <ViewCompany id={props.id} />
                                {/* <ViweCompany id={rs?.id} /> */}
                              </MenuItem>
                              <MenuItem backgroundColor="whiter">
                                test2
                                {/* <FormCompany user={user} data={rs} id={rs.id} /> */}
                              </MenuItem>
                              <MenuItem backgroundColor="whiter">
                                test3
                                {/* <DelEditCompany
                                  fetchData={getData}
                                  item={com}
                                  id={com?.id}
                                /> */}
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
};

export default PreCompany;
