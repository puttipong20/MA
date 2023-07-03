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
} from "@chakra-ui/react";
// import { AiOutlinePlusCircle } from "react-icons/ai";
// import { CgDetailsMore } from "react-icons/cg";
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { auth, db } from "../../services/config-db";

import { search } from "ss-search";
import { Company, CompanyDetail } from "../../@types/Type";
import AddProject from "./AddProject";

import { CompanyContext } from "../../context/CompanyContext";
import { SearchIcon } from "@chakra-ui/icons";
import { LuLogOut } from "react-icons/lu";
import { signOut } from "firebase/auth";
import { AuthContext } from "../../context/AuthContext";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [filterCompany, setFilterCompany] = useState<Company[]>([]);
  const [isFetching, setIsFetching] = useState(false);
  const [openIndex, setOpenIndex] = useState<number>(-1);
  const Company = useContext(CompanyContext);
  const Auth = useContext(AuthContext);

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
    const collData = await getDocs(collRef);
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
    console.clear();
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
    console.log(Company)
  });

  const code = 0;
  const color = `rgba(${code},${code},${code},0.1)`;

  return (
    <Box position="relative" h="fit-content" maxH="100%">
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
      <Divider my="5px" opacity={"1"} />
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
                  border="none"
                  transition="all 0.3s"
                  _hover={{ bg: color }}
                  borderRadius={"10px"}
                  bg={focusCompany ? color : ""}
                  my="5px"
                // borderLeft={focusCompany ? "3px solid white" : "none"}
                >
                  <AccordionButton>
                    <Flex justify={"space-between"}>
                      <Text
                        fontWeight={focusCompany ? "bold" : "normal"}
                        textAlign={"left"}
                      >
                        {i.detail.companyName}
                      </Text>
                      {/* <AccordionIcon /> */}
                    </Flex>
                  </AccordionButton>
                  <AccordionPanel>
                    <VStack fontSize={"0.8rem"} align={"left"} pl="5%">
                      {i.detail.projects !== undefined &&
                        i.detail.projects.length !== 0 ? (
                        i.detail.projects?.map((j, index) => {
                          // if (params["projectID"] === j.id) { Company.setProject(j.id, j.projectName) }
                          const focusProject = params["projectID"] === j.id;
                          return (
                            <Text
                              key={index}
                              fontWeight={focusProject ? "bold" : "normal"}
                              cursor={"pointer"}
                              transition={"all 0.1s"}
                              borderRadius={"5px"}
                              pl="1rem"
                              bg={focusProject ? color : "none"}
                              _hover={{ fontWeight: "bold", bg: color }}
                              onClick={() => {
                                // console.log(i.detail.companyName)
                                // console.log(j.projectName)
                                navigate(
                                  `/company/${i.companyId}/${j.id}/${j.projectName}/problemReport`
                                );
                              }}
                            >
                              {j.projectName}
                            </Text>
                          );
                        })
                      ) : (
                        <Text fontWeight={"normal"} textAlign={"center"}>
                          ยังไม่มีข้อมูล Project ของบริษัทนี้
                        </Text>
                      )}
                      <AddProject
                        companyId={i.companyId}
                        companyName={i.detail.companyName}
                      />
                      <Button
                        colorScheme="linkedin"
                        fontWeight={"normal"}
                        fontSize={"0.9rem"}
                        onClick={() => {
                          navigate(`/company/${i.companyId}`);
                        }}
                      >
                        ข้อมูลลูกค้า/บริษัท
                      </Button>
                    </VStack>
                  </AccordionPanel>
                </AccordionItem>
              );
            })}
          </Accordion>
        </Box>
      )}
      <Divider my="5px" opacity={"1"} />
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
