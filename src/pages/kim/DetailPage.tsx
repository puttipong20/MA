/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Text,
  Button,
  Spinner,
  Divider,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Container,
  Card,
  HStack,
  Tooltip,
  FormControl,
  Input,
  useToast,
} from "@chakra-ui/react";
import { BiArrowBack } from "react-icons/bi";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../services/config-db";
import { ProjectDetail, MA } from "../../@types/Type";
import { BiDotsHorizontalRounded } from "react-icons/bi";
import { AiOutlineHistory, AiOutlineReload, AiOutlineEdit, AiOutlineClose, AiOutlineCheck } from "react-icons/ai";

import moment from "moment";
import Renewal from "../../components/kim/Renewal";
import MAstatusTag from "../../components/kim/MAstatusTag";
import EditContract from "../../components/Contracts/EditContract";
import UpdateContract from "../../components/kim/UpdateContract";
import { MAcontext } from "../../context/MAContext";
import { CompanyContext } from "../../context/CompanyContext";
import classes from "../../pages/kim/ProblemPreview.module.css";
import { Controller, useForm } from "react-hook-form";
import { AuthContext } from "../../context/AuthContext";

export default function DetailPage() {
  const params = useParams();
  const navigate = useNavigate();
  const backPath = `/company/${params["company"]}`;

  const [isFetching, setIsfetching] = useState(true);
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();
  const [logs, setLogs] = useState<{ id: string; ma: MA }[]>([]);
  const [activeMA, setActiveMA] = useState<MA>();
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const projectID = params["projectID"] as string;
  const projectRef = doc(db, "Project", projectID);
  const MAref = collection(projectRef, "MAlogs");
  const [isUpdating, setIsUpdating] = useState(false);
  const toast = useToast();

  const { control, handleSubmit, reset } = useForm()

  const AuthCtx = useContext(AuthContext)
  const CompanyCtx = useContext(CompanyContext);
  const MACtx = useContext(MAcontext);

  const convertTime = (date: string): string => {
    return moment(date).format("DD/MM/YYYY HH:mm:ss")
  }

  const fetchingProjectDetail = async () => {
    setIsfetching(true);
    // console.clear();
    const project = await getDoc(projectRef);

    const MAFetch = await getDocs(MAref);
    const MAlogs: { id: string; ma: MA }[] = [];
    MAFetch.forEach((ma) => {
      MAlogs.push({ id: ma.id, ma: ma.data() as MA });
    });
    const sorted_MAlogs = MAlogs.sort((a, b) => {
      const dateA = new Date(a.ma.endMA) as any
      const dateB = new Date(b.ma.endMA) as any
      return dateA - dateB
    })
    setLogs(sorted_MAlogs);

    const active = sorted_MAlogs.filter((i) => i.ma.status === "active")[0];
    const lastest = sorted_MAlogs.filter((i) => i.ma.status === "active" || i.ma.status === "advance" || i.ma.status === "expire").at(-1);
    // console.log(lastest)
    if (active) {
      // console.log("active")
      setActiveMA(active.ma);
    } else {
      if (lastest) {
        // console.log("lastest")
        setActiveMA(lastest.ma);
      }
      else {
        setActiveMA(undefined)
      }
    }
    setProjectDetail(project.data() as ProjectDetail);
    setIsfetching(false);
  };

  const convertNumber = (num: number) => {
    return Number(num).toLocaleString("th-TH", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const dateFormat = (date: string) => {
    return moment(date).format("DD/MM/YYYY");
  };

  useEffect(() => {
    onSnapshot(projectRef, () => {
      fetchingProjectDetail();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submitUpdate = async (data: any) => {
    setIsUpdating(true);
    await updateDoc(projectRef, {
      latestUpdate: {
        username: AuthCtx.username,
        uid: AuthCtx.uid,
        timestamp: moment().format("YYYY-MM-DD HH:mm:ss")
      },
      projectName: data.projectName
    }).then(() => {
      toast({
        title: "อัพเดทสำเร็จ",
        status: "success",
        duration: 3000,
        position: "top",
      })
    }).catch(() => {
      toast({
        title: "อัพเดทผิดพลาด",
        status: "error",
        duration: 3000,
        position: "top",
      })
    })
    setIsOpenEdit(false)
    setIsUpdating(false);
  }

  if (isFetching) {
    return (
      <Box
        w="100%"
        h="100%"
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Spinner />
      </Box>
    );
  } else {
    return (
      <div className="container">
        <form onSubmit={handleSubmit(submitUpdate)}>
          <Container maxW="100%" pb="10">
            <Box mt="3" pb="1rem">
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
            </Box>
            <Card p={"1rem"} w="max-content" maxW="100%" position="relative" border={"1px solid rgb(0,0,0,0.05)"}>
              {!isOpenEdit ?
                <Button
                  position="absolute"
                  fontSize={"xl"}
                  bg="none"
                  right="-1.25rem" top="-0.5rem"
                  color="GrayText"
                  _hover={{ color: "black" }}
                  _active={{}}
                  onClick={() => { setIsOpenEdit(true) }}
                >
                  <Tooltip label={"click to edit"} placement="top">
                    <span>
                      <AiOutlineEdit />
                    </span>
                  </Tooltip>
                </Button>
                :
                <Box position="absolute" top="-1.25rem" right="0rem">
                  <Button
                    colorScheme="red"
                    mr="0.25rem"
                    onClick={() => { reset(); setIsOpenEdit(false) }}
                  >
                    <AiOutlineClose />
                  </Button>
                  <Button
                    colorScheme="green"
                    isLoading={isUpdating}
                    type="submit"
                  >
                    <AiOutlineCheck />
                  </Button>
                </Box>
              }
              <Box>


                <HStack>
                  <Text w="7.5rem" fontWeight={"bold"}>
                    บริษัท
                  </Text>
                  <Text as="span" fontWeight={"normal"}>
                    : {CompanyCtx.companyName}
                  </Text>
                </HStack>
                <HStack>
                  <Text
                    fontWeight={"bold"}
                    w="7.5rem"
                    display={"flex"}
                    align={"center"}
                  >
                    ชื่อโปรเจค
                  </Text>
                  {!isOpenEdit ?
                    <Text as="span" fontWeight={"normal"}>
                      : {projectDetail?.projectName}
                    </Text>
                    :
                    <Controller
                      name="projectName"
                      control={control}
                      defaultValue={projectDetail?.projectName}
                      render={({ field }) => (
                        <FormControl isRequired as="span" w="fit-content" display="flex" alignItems={"center"}>
                          : <Input type="text" {...field} />
                        </FormControl>
                      )}
                    />
                  }
                </HStack>
                <HStack>
                  <Text fontWeight={"bold"} w="7.5rem">
                    ถูกสร้างเมื่อ
                  </Text>
                  <Text as="span" fontWeight={"normal"}>
                    : {projectDetail &&
                      moment(projectDetail.createdAt).format(
                        "DD/MM/YYYY HH:mm:ss"
                      )}
                  </Text>
                </HStack>
                {!activeMA ? (
                  <HStack>
                    <Text fontWeight={"bold"} w="7.5rem">
                      สัญญา
                    </Text>
                    <Text as="span" fontWeight={"normal"}>
                      : ไม่มีสัญญา
                    </Text>
                  </HStack>
                ) : (
                  <>
                    <HStack>
                      <Text fontWeight={"bold"} w="7.5rem">
                        เริ่มต้นสัญญาMA
                      </Text>
                      <Text as="span" fontWeight={"normal"}>
                        : {activeMA && dateFormat(activeMA.startMA)}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight={"bold"} w="7.5rem">
                        สิ้นสุดสัญญาMA
                      </Text>
                      <Text as="span" fontWeight={"normal"}>
                        : {activeMA && dateFormat(activeMA.endMA)}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight={"bold"} w="7.5rem">
                        สถานะ
                      </Text>
                      <Text as="span" fontWeight={"normal"}>
                        : {activeMA && <MAstatusTag status={activeMA.status} />}
                      </Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight={"bold"} w="7.5rem">
                        ค่าบริการ
                      </Text>
                      <Text as="span" fontWeight={"normal"}>
                        : {activeMA && convertNumber(activeMA.cost)}
                      </Text>
                    </HStack>
                  </>
                )}
                <Box w="100%" textAlign={"right"} color="GrayText" fontSize={"0.75rem"}>
                  <Text>
                    Latest update : {projectDetail?.latestUpdate ? projectDetail?.latestUpdate.username : projectDetail?.createdBy.username}
                  </Text>
                  <Text>
                    {projectDetail?.latestUpdate ? convertTime(projectDetail?.latestUpdate.timestamp) : convertTime(projectDetail?.createdAt)}
                  </Text>
                </Box>
              </Box>
            </Card>
            <Divider my="1rem" />
            <Box>
              <Flex justify={"space-between"} align={"center"}>
                <Text fontWeight={"bold"} w="fit-content">
                  ประวัติการทำสัญญา{" "}
                  <Button
                    size="sm"
                    bg="#4C7BF4"
                    color="#eee"
                    _hover={{ opacity: 0.8 }}
                    _active={{ opacity: 0.9 }}
                    onClick={fetchingProjectDetail}
                  >
                    <AiOutlineReload />
                  </Button>
                </Text>
                <Box>
                  <Renewal
                    MAlog={logs}
                    projectId={projectID}
                    callBack={fetchingProjectDetail}
                  />
                </Box>
              </Flex>
              <Box>
                <Box
                  mt="5"
                  borderRadius="20px"
                  border="1px"
                  borderColor="#f4f4f4"
                  w="100%"
                  h="100%"
                  maxH={"36vh"}
                  overflowY={"auto"}
                  boxShadow={"1px 1px 1px rgb(0,0,0,0.1)"}
                  className={classes.table}
                >
                  <Table w="100%">
                    <Thead position="sticky" top={0} zIndex="sticky">
                      <Tr bg={"#4C7BF4"}>
                        <Th
                          fontFamily={"inherit"}
                          color="#fff"
                          textAlign={"center"}
                        >
                          ลำดับที่
                        </Th>
                        <Th
                          fontFamily={"inherit"}
                          color="#fff"
                          textAlign={"center"}
                        >
                          วันที่สร้าง
                        </Th>
                        <Th
                          fontFamily={"inherit"}
                          color="#fff"
                          textAlign={"center"}
                        >
                          วันที่เริ่มต้นสัญญาMA
                        </Th>
                        <Th
                          fontFamily={"inherit"}
                          color="#fff"
                          textAlign={"center"}
                        >
                          วันที่สิ้นสุดสัญญาMA
                        </Th>
                        <Th
                          fontFamily={"inherit"}
                          color="#fff"
                          textAlign={"center"}
                        >
                          สถานะ
                        </Th>
                        <Th
                          fontFamily={"inherit"}
                          color="#fff"
                          textAlign={"right"}
                        >
                          ค่าบริการ
                        </Th>
                        <Th
                          fontFamily={"inherit"}
                          color="#fff"
                          textAlign={"center"}
                        >
                          การจัดการ
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {logs
                        .sort((a, b) => {
                          const endA = new Date(a.ma.endMA) as any;
                          const endB = new Date(b.ma.endMA) as any;
                          return endB - endA;
                        })
                        .filter((ma) => ma.ma.status !== "deleted")
                        .map((MA, index) => {
                          return (
                            <Tr key={index} _hover={{ bg: "gray.100" }}>
                              <Td textAlign={"center"}>{index + 1}</Td>
                              <Td textAlign={"center"}>
                                {moment(MA.ma.createdAt).format(
                                  "DD/MM/YYYY HH:mm:ss"
                                )}
                              </Td>
                              <Td textAlign={"center"}>
                                {dateFormat(MA.ma.startMA)}
                              </Td>
                              <Td textAlign={"center"}>
                                {dateFormat(MA.ma.endMA)}
                              </Td>
                              <Td textAlign={"center"}>
                                <MAstatusTag status={MA.ma.status} />
                              </Td>

                              <Td textAlign={"right"}>
                                {convertNumber(MA.ma.cost)}
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
                                    <MenuItem backgroundColor="whiter">
                                      <Box
                                        w="100%"
                                        p={"0.5rem"}
                                        onClick={() => {
                                          MACtx.setMA(MA.ma);
                                          navigate(
                                            `/company/${params["company"]}/${params["projectID"]}/${params["projectName"]}/detail/ContractRecord`
                                          );
                                        }}
                                      >
                                        <Text
                                          color="blue"
                                          w="100%"
                                          display="flex"
                                          alignItems={"center"}
                                        >
                                          <Text
                                            as="span"
                                            w="20%"
                                            display={"flex"}
                                            justifyContent={"center"}
                                          >
                                            <AiOutlineHistory />
                                          </Text>
                                          ดูประวัติการแก้ไข
                                        </Text>
                                      </Box>
                                    </MenuItem>

                                    {MA.ma.status != "cancel" && (
                                      <MenuItem backgroundColor="whiter">
                                        <UpdateContract
                                          maID={MA.id}
                                          projectID={projectID}
                                          reload={fetchingProjectDetail}
                                          status="cancel"
                                        />
                                      </MenuItem>
                                    )}

                                    <MenuItem backgroundColor="whiter">
                                      <UpdateContract
                                        maID={MA.id}
                                        projectID={projectID}
                                        reload={fetchingProjectDetail}
                                        status="deleted"
                                      />
                                    </MenuItem>

                                    <MenuItem backgroundColor="whiter">
                                      <EditContract
                                        data={MA.ma}
                                        maId={MA.id}
                                        projectId={projectID}
                                        callBack={fetchingProjectDetail}
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
            </Box>
          </Container>
        </form>
      </div>
    );
  }
}
