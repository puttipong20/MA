/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Text, Button, Spinner, Divider, Table, Thead, Tr, Th, Tbody, Td, Flex, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react"
import { BiArrowBack } from 'react-icons/bi';
import { collection, doc, getDoc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/config-db';
import { ProjectDetail, MA } from "../../@types/Type";
import { BiDotsHorizontalRounded } from "react-icons/bi"
import { AiOutlineHistory, AiOutlineDelete, AiOutlineEdit } from "react-icons/ai"

import moment from "moment";
import Renewal from "../../components/kim/Renewal";
import MAstatusTag from "../../components/kim/MAstatusTag";
import CancelContract from "../../components/kim/CancelContract";

export default function DetailPage() {
  const params = useParams()
  const navigate = useNavigate();
  const backPath = `/company/${params["company"]}`

  const [isFetching, setIsfetching] = useState(true);
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();
  const [logs, setLogs] = useState<{ id: string, ma: MA }[]>([]);
  const [activeMA, setActiveMA] = useState<MA>();

  const projectID = params["projectID"] as string;
  const projectRef = doc(db, "Project", projectID)
  const MAref = collection(projectRef, "MAlogs")

  const fetchingProjectDetail = async () => {
    setIsfetching(true)
    console.clear();
    const project = await getDoc(projectRef)

    const MAFetch = await getDocs(MAref)
    const MAlogs: { id: string, ma: MA }[] = [];
    MAFetch.forEach((ma) => {
      MAlogs.push({ id: ma.id, ma: ma.data() as MA })
    })
    setLogs(MAlogs)

    const active = MAlogs.filter(i => i.ma.status === "active")[0]
    const lastest = MAlogs[0];
    // console.log(lastest)
    if (active) {
      setActiveMA(active.ma)
    } else {
      setActiveMA(lastest.ma)
    }
    setProjectDetail(project.data() as ProjectDetail);
    setIsfetching(false)
  }

  const convertNumber = (num: number) => {
    return Number(num).toLocaleString("th-TH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }

  const dateFormat = (date: string) => {
    return moment(date).format("DD/MM/YYYY");
  }

  useEffect(() => {
    onSnapshot(projectRef, () => {
      fetchingProjectDetail();
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isFetching) {
    return (
      <Box w="100%" h="100%" display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Spinner />
      </Box>
    )
  } else {

    return (
      <Box>
        <Box>
          <Button onClick={() => { navigate(backPath) }}><BiArrowBack /></Button>
        </Box>
        <Box>
          <Text fontWeight={"bold"} w="fit-content">
            บริษัท :
            <Text as="span" fontWeight={"normal"}>{projectDetail?.companyName}</Text>
          </Text>
          <Text fontWeight={"bold"} w="fit-content" display={"flex"} align={"center"}>
            ชื่อโปรเจค :
            <Text as="span" fontWeight={"normal"}>{projectDetail?.projectName}</Text>
            {/* <Text as="span" h="fit-content" my="auto" color={"gray"} cursor={"pointer"} _hover={{ color: "black" }}>
              <AiOutlineEdit />
            </Text> */}
          </Text>
          <Text fontWeight={"bold"} w="fit-content">
            ถูกสร้างเมื่อ : <Text as="span" fontWeight={"normal"}>{projectDetail && moment(projectDetail.createdAt).format("DD/MM/YYYY HH:mm:ss")}</Text>
          </Text>
          <Text fontWeight={"bold"} w="fit-content">
            เริ่มต้นสัญญาMA : <Text as="span" fontWeight={"normal"}>{activeMA && dateFormat(activeMA.startMA)}</Text>
          </Text>
          <Text fontWeight={"bold"} w="fit-content">
            สิ้นสุดสัญญาMA : <Text as="span" fontWeight={"normal"}>{activeMA && dateFormat(activeMA.endMA)}</Text>
          </Text>
          <Text fontWeight={"bold"} w="fit-content">
            สถานะ : <Text as="span" fontWeight={"normal"}>{activeMA && <MAstatusTag status={activeMA.status} />}</Text>
          </Text>
          <Text fontWeight={"bold"} w="fit-content">
            ค่าบริการ : <Text as="span" fontWeight={"normal"}>{activeMA && convertNumber(activeMA.cost)}</Text>
          </Text>
        </Box>
        <Divider my="1rem" />
        <Box>
          <Flex justify={"space-between"} align={"center"}>
            <Text fontWeight={"bold"} w="fit-content">
              ประวัติการทำสัญญา
            </Text>
            <Box>
              <Renewal MAlog={logs} projectId={projectID} />
            </Box>
          </Flex>
          <Table>
            <Thead>
              <Tr>
                <Th textAlign={"center"}>ลำดับที่</Th>
                <Th textAlign={"center"}>วันที่เริ่มต้นสัญญาMA</Th>
                <Th textAlign={"center"}>วันที่สิ้นสุดสัญญาMA</Th>
                <Th textAlign={"center"}>สถานะ</Th>
                <Th textAlign={"center"}>วันที่สร้าง</Th>
                <Th textAlign={"right"}>ค่าบริการ</Th>
                <Th textAlign={"center"}>การจัดการ</Th>
              </Tr>
            </Thead>
            <Tbody>
              {
                logs
                  .sort((a, b) => {
                    const endA = new Date(a.ma.endMA) as any
                    const endB = new Date(b.ma.endMA) as any
                    return endB - endA
                  })
                  .map((MA, index) => {
                    return (
                      <Tr key={index}>
                        <Td textAlign={"center"}>{index + 1}</Td>
                        <Td textAlign={"center"}>{dateFormat(MA.ma.startMA)}</Td>
                        <Td textAlign={"center"}>{dateFormat(MA.ma.endMA)}</Td>
                        <Td textAlign={"center"}><MAstatusTag status={MA.ma.status} /></Td>
                        <Td textAlign={"center"}>{moment(MA.ma.createdAt).format("DD/MM/YYYY HH:mm:ss")}</Td>
                        <Td textAlign={"right"}>{convertNumber(MA.ma.cost)}</Td>
                        <Td textAlign={"center"}>
                          <Menu>
                            <MenuButton as={Button} colorScheme="blue">
                              <BiDotsHorizontalRounded />
                            </MenuButton>
                            <MenuList p="0" borderRadius={"0"}>

                              <MenuItem>
                                <Box w="100%" p={"0.5rem"}>
                                  <Text fontWeight={"bold"} color="green" w="100%" display="flex" alignItems={"center"}>
                                    <Text as="span" w="20%" display={"flex"} justifyContent={"center"}>
                                      <AiOutlineHistory />
                                    </Text>
                                    ดูประวัติการแก้ไข
                                  </Text>
                                </Box>
                              </MenuItem>
                              
                              {
                                MA.ma.status != "cancel" &&
                                <MenuItem>
                                  <CancelContract maID={MA.id} projectID={projectID} reload={fetchingProjectDetail} />
                                </MenuItem>
                              }

                              <MenuItem>
                                <Box w="100%" p={"0.5rem"}>
                                  <Text fontWeight={"bold"} color="#FFA500" w="100%" display="flex" alignItems={"center"}>
                                    <Text as="span" w="20%" display={"flex"} justifyContent={"center"}>
                                      <AiOutlineDelete />
                                    </Text>
                                    ลบ
                                  </Text>
                                </Box>
                              </MenuItem>

                              <MenuItem>
                                <Box w="100%" p={"0.5rem"}>
                                  <Text fontWeight={"bold"} color="blue" w="100%" display="flex" alignItems={"center"}>
                                    <Text as="span" w="20%" display={"flex"} justifyContent={"center"}>
                                      <AiOutlineEdit />
                                    </Text>
                                    แก้ไข
                                  </Text>
                                </Box>
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    )
                  })
              }
            </Tbody>
          </Table>
        </Box>
      </Box>
    )
  }
}
