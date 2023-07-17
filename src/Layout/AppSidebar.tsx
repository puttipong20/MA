import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  // AccordionIcon,
  Box,
  Button,
  Divider,
  Heading,
  Text,
  Input,
  Spinner,
  VStack,
  Flex,
  InputLeftElement,
  InputGroup,
  HStack,
  // IconButton,
  // useColorMode,
} from "@chakra-ui/react";
// import { AiOutlinePlusCircle } from "react-icons/ai";
// import { CgDetailsMore } from "react-icons/cg";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import {
  collection,
  getDocs,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { auth, db } from "../services/config-db";

import { search } from "ss-search";
import { Company, CompanyDetail } from "../@types/Type";
import AddProject from "../components/Projects/AddProject";

import { CompanyContext } from "../context/CompanyContext";
import { SearchIcon } from "@chakra-ui/icons";
import { LuLogOut } from "react-icons/lu";
import { signOut } from "firebase/auth";
import { AuthContext } from "../context/AuthContext";
import { HiOutlineOfficeBuilding } from "react-icons/hi";
import { BsDot } from "react-icons/bs";
import { ImOffice } from "react-icons/im";
// import { FaLightbulb } from "react-icons/fa";

interface Props {
  setTriggle: () => void;
}

const Sidebar: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const params = useParams();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filterCompany, setFilterCompany] = useState<Company[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const Company = useContext(CompanyContext);
  const Auth = useContext(AuthContext);
  // const { colorMode, toggleColorMode } = useColorMode();

  const onSearch = () => {
    const inputRef = document.getElementById("searchInput") as HTMLInputElement;
    const value = inputRef.value;

    const searchField = ["detail.companyName"];
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
        // console.log("open index on", count);
        setOpenIndex(count);
      }
      allCompany.push(company);
      count += 1;
    });
    // console.log(allCompany);
    setCompanies(allCompany);
    setFilterCompany(allCompany);
    setIsFetching(false);
  };

  const logout = () => {
    signOut(auth);
    Auth.clearUser();
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
    // console.log(Company)
  });

  const code = 0;
  const color = `rgba(${code},${code},${code},0.1)`;

  return (
    <Box position="relative" h="fit-content" maxH="100%">
      <Button
        position="absolute"
        top="-1rem"
        right="-1rem"
        display={["block", "none"]}
        onClick={props.setTriggle}
        bg="none"
        color="red"
      >
        X
      </Button>
      {/* <Flex
        justify="center"
      >
        <IconButton
          aria-label={`Switch to ${
            colorMode === "light" ? "dark" : "light"
          } mode`}
          icon={<FaLightbulb />}
          onClick={toggleColorMode}
          variant="ghost"
          color={colorMode === "light" ? "gray.900" : "gray.500"}
          _hover={{opacity:"0.8"}}
        />
      </Flex> */}

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
      <Divider my="5px" opacity={"1"} />
      <Box my="10px">
        <InputGroup>
          <InputLeftElement>
            <SearchIcon />
          </InputLeftElement>
          <Input
            fontSize={"0.8rem"}
            placeholder={"Search Company"}
            w="100%"
            id="searchInput"
            onChange={onSearch}
          />
        </InputGroup>
      </Box>
      {/* <Divider my="5px" opacity={"1"} /> */}
      {isFetching ? (
        <Flex w="100%" justify={"center"} align={"center"}>
          <Spinner />
        </Flex>
      ) : (
        <Box>
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
                    <HStack justify={"flex-start"} alignItems={"flex-start"} color={focusCompany ? "#4c7bf4" : "black"}>
                      <Text mt="0.25rem">
                        <HiOutlineOfficeBuilding />
                        {/* <ImOffice /> */}
                      </Text>
                      <Text
                        fontWeight={"normal"}
                        textAlign={"left"}
                      >
                        {i.detail.companyName}
                      </Text>
                      {/* <AccordionIcon /> */}
                    </HStack>
                  </AccordionButton>
                  {
                    i.detail.projects?.length != 0 &&
                    <AccordionPanel pt="0px">
                      <VStack mt="-0.5rem" fontSize={"0.9rem"} align={"left"} pl="5%">
                        {i.detail.projects !== undefined &&
                          i.detail.projects.filter((i) => i.status === "enable")
                            .length !== 0 ? (
                          i.detail.projects?.map((j, index) => {
                            // if (params["projectID"] === j.id) { Company.setProject(j.id, j.projectName) }
                            const focusProject = params["projectID"] === j.id;
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
                                  color={focusProject ? "rgb(76, 123, 244)" : "black"}
                                  // _hover={{ fontWeight: "bold", bg: color }}
                                  position="relative"
                                  onClick={() => {
                                    // console.log(i.detail.companyName)
                                    // console.log(j.projectName)
                                    navigate(
                                      `/company/${i.companyId}/${j.id}/${j.projectName}/problemReport`
                                    );
                                  }}
                                >
                                  <HStack
                                    // as="span"
                                    // position="absolute"
                                    // left="0.5rem"
                                    spacing={0}
                                  >
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
                          // <Text fontWeight={"normal"} textAlign={"center"}>
                          //   ยังไม่มีข้อมูล Project ของบริษัทนี้
                          // </Text>
                        )}
                        {/* <AddProject
                        companyId={i.companyId}
                        companyName={i.detail.companyName}
                      /> */}
                        {/* <Text pl="0rem" color="#4c7bf4" cursor={"pointer"}>+ เพิ่ม Project</Text> */}
                      </VStack>
                    </AccordionPanel>
                  }
                </AccordionItem>
              );
            })}
          </Accordion>
        </Box>
      )}
      {/* <Divider my="5px" opacity={"1"} /> */}
      <Box
        w="100%"
        p="0.5rem"
        userSelect={"none"}
        cursor={"pointer"}
        transition={"all 0.3s"}
        borderRadius={"10px"}
        _hover={{ bg: color }}
        onClick={logout}
      >
        <Text display="flex" alignItems={"center"} gap={"1rem"}>
          <LuLogOut />
          Logout
        </Text>
      </Box>
    </Box>
  );
};

export default Sidebar;
