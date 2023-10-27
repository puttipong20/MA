import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Button,
  Heading,
  Text,
  Input,
  Spinner,
  VStack,
  Flex,
  InputLeftElement,
  InputGroup,
  HStack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/react";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../services/config-db";

import { search } from "ss-search";
import { Company, CompanyDetail } from "../@types/Type";

import { CompanyContext } from "../context/CompanyContext";
import { SearchIcon, SettingsIcon } from "@chakra-ui/icons";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { BsDot } from "react-icons/bs";
import { RxHamburgerMenu } from "react-icons/rx";
import classes from "./Layout.module.css";
import LogoutButton from "../pages/Login/Logout";
import SearchReport from "../components/asset/SearchReport";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filterCompany, setFilterCompany] = useState<Company[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const Company = useContext(CompanyContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { colorMode, toggleColorMode } = useColorMode();

  const onSearch = () => {
    // console.clear();
    const inputRef = document.getElementById("searchInput") as HTMLInputElement;
    const value = inputRef.value;
    const searchField = ["detail.companyName", "detail.projects[projectName]"];
    const result = search(companies, searchField, value) as Company[];
    setFilterCompany(result);
  };

  const fetchingCompany = async () => {
    setIsFetching(true);
    let count = 0;
    const collRef = collection(db, "Company");
    const q = query(collRef, orderBy("companyName", "asc"));
    const collData = await getDocs(q);
    const allCompany: Company[] = [];

    collData.forEach((i) => {
      const company: Company = {
        companyId: i.id,
        detail: i.data() as CompanyDetail,
      };
      if (company.companyId === params["company"]) {
        setOpenIndex(count);
      }
      const projects = company.detail.projects?.filter(
        (p) => p.status === "enable"
      );
      company.detail.projects = projects;
      allCompany.push(company);
      count += 1;
    });
    setCompanies(allCompany);
    setFilterCompany(allCompany);
    setIsFetching(false);
  };

  useEffect(() => {
    const collRef = collection(db, "Company");
    const q = query(collRef);
    onSnapshot(q, () => {
      fetchingCompany();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // console.clear();
    companies.forEach((i) => {
      if (i.companyId === params["company"]) {
        Company.setCompany(i.companyId, i.detail.companyName);
      }
      const project = i.detail.projects;
      if (project) {
        project.forEach((j) => {
          if (j.id === params["projectID"]) {
            Company.setProject(j.id, j.projectName);
          }
        });
      }
    });
  });

  return (
    <>
      <Button bg="#4c7bf4" color="#fff" borderRadius={"16px"} onClick={onOpen}>
        <RxHamburgerMenu />
      </Button>
      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">
            <Flex justifyContent={"space-between"} alignItems={"center"}>
              <Heading
                cursor={"pointer"}
                onClick={() => {
                  navigate("/");
                }}
                fontSize={"1.25rem"}
                fontFamily={"inherit"}
                my="1rem"
                w="100%"
                textAlign={"center"}
                transition={"all 0.3s"}
                // _hover={{ textShadow: "0px 0px 30px #fff" }}
                _hover={{ textShadow: "0px 0px 30px #000" }}
                // border="1px solid black"
              >
                CRAFTING LAB
              </Heading>
              <Button
                onClick={onClose}
                _hover={{ opacity: 1 }}
                bg="none"
                color="black"
                borderRadius="16px"
                size="md"
              >
                X
              </Button>
            </Flex>
          </DrawerHeader>
          <DrawerBody>
            <Box h="fit-content" maxH="100%">
              <SearchReport />
              <HStack my="10px">
                <InputGroup>
                  <InputLeftElement>
                    <SearchIcon />
                  </InputLeftElement>
                  <Input
                    borderRadius="16px"
                    fontSize={"0.8rem"}
                    placeholder={"Company, Project, Report"}
                    w="100%"
                    id="searchInput"
                    onChange={onSearch}
                  />
                </InputGroup>
              </HStack>
              <HStack
                mx={4}
                my={4}
                justify={"flex-start"}
                alignItems={"center"}
                color={"black"}
                maxW={'50%'}
                cursor={'pointer'}
                onClick={() => {navigate('/allMa'),onClose()}}
              >
                <Text>
                  <SettingsIcon />
                </Text>
                <Text fontWeight={"normal"} textAlign={"left"}>
                  All Ma
                </Text>
              </HStack>
              {isFetching ? (
                <Flex
                  w="100%"
                  justify={"center"}
                  align={"center"}
                  border=""
                  h={["70vh", "78vh"]}
                  overflowY={"auto"}
                  className={classes.sidebar}
                >
                  <Spinner />
                </Flex>
              ) : (
                <Box
                  border=""
                  // h={["70vh", "78vh"]}
                  flex="auto"
                  overflowY={"auto"}
                  className={classes.sidebar}
                >
                  <Accordion allowToggle defaultIndex={[openIndex]}>
                    {filterCompany.map((i, index) => {
                      // if (params["company"] === i.companyId) { Company.setCompany(i.companyId, i.detail.companyName) }
                      const focusCompany = params["company"] === i.companyId;
                      return (
                        <AccordionItem
                          key={index}
                          userSelect={"none"}
                          borderTop="0px solid rgb(0,0,0,0.1)"
                          borderBottom="1px solid rgb(0,0,0,0.1)"
                          transition="all 0.3s"
                          _hover={{ bg: "#fff" }}
                          // borderRadius={"10px"}
                          // bg={focusCompany ? color : ""}
                          my="5px"
                          // borderLeft={focusCompany ? "3px solid white" : "none"}
                        >
                          <AccordionButton
                            onClick={() => {
                              navigate(`/company/${i.companyId}`);
                            }}
                            _hover={{ bg: "#fff" }}
                          >
                            <HStack justify={"space-between"} w="100%">
                              <HStack
                                justify={"flex-start"}
                                alignItems={"flex-start"}
                                color={focusCompany ? "#4c7bf4" : "black"}
                              >
                                <Text mt="0.25rem">
                                  <HiOutlineOfficeBuilding />
                                  {/* <ImOffice /> */}
                                </Text>
                                <Text fontWeight={"normal"} textAlign={"left"}>
                                  {i.detail.companyName}
                                </Text>
                              </HStack>
                              <AccordionIcon />
                            </HStack>
                          </AccordionButton>
                          {i.detail.projects?.length !== undefined &&
                            i.detail.projects?.length > 0 && (
                              <AccordionPanel pt="0px">
                                <VStack
                                  mt="-0.5rem"
                                  fontSize={"0.9rem"}
                                  align={"left"}
                                  pl="5%"
                                >
                                  {i.detail.projects !== undefined &&
                                  i.detail.projects.filter(
                                    (i) => i.status === "enable"
                                  ).length !== 0 ? (
                                    i.detail.projects?.map((j, index) => {
                                      // if (params["projectID"] === j.id) { Company.setProject(j.id, j.projectName) }
                                      const focusProject =
                                        params["projectID"] === j.id;
                                      if (j.status === "enable") {
                                        return (
                                          <Box
                                            h="20px"
                                            key={index}
                                            // fontWeight={focusProject ? "bold" : "normal"}
                                            cursor={"pointer"}
                                            transition={"all 0.1s"}
                                            borderRadius={"5px"}
                                            // pl="1rem"
                                            color={
                                              focusProject
                                                ? "rgb(76, 123, 244)"
                                                : "black"
                                            }
                                            // _hover={{ fontWeight: "bold", bg: color }}
                                            onClick={() => {
                                              navigate(
                                                `/company/${i.companyId}/${j.id}/${j.projectName}/problemReport`
                                              );
                                            }}
                                          >
                                            <HStack spacing={0}>
                                              <Text fontSize={"40px"}>
                                                <BsDot />
                                              </Text>
                                              <Text ml="-0.5rem">
                                                {j.projectName}
                                              </Text>
                                            </HStack>
                                          </Box>
                                        );
                                      }
                                    })
                                  ) : (
                                    <></>
                                  )}
                                </VStack>
                              </AccordionPanel>
                            )}
                        </AccordionItem>
                      );
                    })}
                  </Accordion>
                </Box>
              )}
              <LogoutButton />
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
