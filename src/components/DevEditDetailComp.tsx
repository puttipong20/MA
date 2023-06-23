import { useState, useEffect } from "react";
import {
  Box,
  Container,
  Grid,
  HStack,
  Heading,
  Tag,
  TagLabel,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import ImgShow from "./ImgShowComp";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/config-db";
// import { Report } from "../@types/Type";

type DevEdit = {
  project: string;
  noRef: string;
  accepter: string;
  dateProcess: string;
  dateDone: string;
  solution: string;
  state: string;
  SolImage: string[];
  issueType: string;
};

export default function DevEditDetailComp() {
  const params = useParams();
  const [isLoading, setIsloading] = useState(false);
  const [fetchData, setFetchData] = useState<DevEdit>();

  const convertTime = (time: string) => {
    const inputDateDone = time;
    const date = new Date(inputDateDone).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    return date;
  }

  const fetchReport2 = async () => {
    setIsloading(true);
    // console.clear()
    const docRef = doc(db, "Report", params["id"] as string);
    const docData = await getDoc(docRef);
    console.log(docData.data())

    const inputDateDone = docData.data()?.solution?.dateDone
    let dateDone = "-";
    if (inputDateDone !== "" && inputDateDone !== undefined) dateDone = convertTime(inputDateDone);

    const inputDateProcess = docData.data()?.solution?.dateProcess
    let dateProcess = "-"
    if (inputDateProcess !== "" && inputDateDone !== undefined) dateProcess = convertTime(inputDateProcess);

    const detail: DevEdit = {
      project: docData.data()?.company || "-",
      noRef: docData.data()?.ref || "-",
      accepter: docData.data()?.solution?.accepter || "-",
      dateProcess: dateProcess,
      dateDone: dateDone,
      solution: docData.data()?.solution?.solution || "-",
      state: docData.data()?.RepStatus || "-",
      SolImage: docData.data()?.solution?.solutionImg,
      issueType: docData.data()?.solution?.issueType === "other" ? docData.data()?.solution?.issueOther : docData.data()?.solution?.issueType
      // SolImage: tempImg,
    };
    setFetchData(detail);
    setIsloading(false);
  };

  useEffect(() => {
    // fetchReport();
    fetchReport2();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return <Box>{/* <Spinner /> */}</Box>;
  } else {
    return (
      <Container>
        <Box>
          <Heading size="lg" fontFamily={"inherit"} color="#2B3674">
            ข้อมูลการแก้ไข
          </Heading>
          <Box border="1px solid #E2E8F0" p={4} borderRadius={"10px"} mt="1rem">
            <VStack align={"left"} w="100%">
              <HStack alignItems={"flex-start"}>
                <Text w="30%" fontWeight={"bold"}>
                  Project
                </Text>
                <Text w="70%">{fetchData?.project}</Text>
              </HStack>
              <HStack alignItems={"flex-start"}>
                <Text w="30%" fontWeight={"bold"}>
                  No.
                </Text>
                <Text w="70%">{fetchData?.noRef}</Text>
              </HStack>
              <HStack alignItems={"flex-start"}>
                <Text w="30%" fontWeight={"bold"}>
                  ผู้รับเรื่อง
                </Text>
                <Text w="70%">{fetchData?.accepter}</Text>
              </HStack>
              <HStack alignItems={"flex-start"}>
                <Text w="30%" fontWeight={"bold"}>
                  วันที่ดำเนินการ
                </Text>
                <Text fontWeight={"bold"} w="70%">
                  {String(fetchData?.dateProcess).replace("T", " ") || "-"}
                </Text>
              </HStack>
              <HStack alignItems={"flex-start"}>
                <Text w="30%" fontWeight={"bold"}>
                  วันที่แก้ไขเสร็จ
                </Text>
                <Text fontWeight={"bold"} w="70%">
                  {String(fetchData?.dateDone).replace("T", " ") || "-"}
                </Text>
              </HStack>
              <HStack alignItems={"flex-start"}>
                <Text w="30%">สาเหตุ</Text>
                <Text w="70%">{fetchData?.issueType}</Text>
              </HStack>
              <HStack alignItems={"flex-start"}>
                <Text w="30%">วิธีแก้</Text>
                <Text w="70%">{fetchData?.solution}</Text>
              </HStack>
              <HStack alignItems={"flex-start"}>
                <Text w="30%">สถานะ</Text>
                <Text fontWeight={"bold"} w="70%">
                  <Tag
                    colorScheme={
                      fetchData?.state === "ยกเลิก"
                        ? "red"
                        : fetchData?.state === "กำลังดำเนินการ"
                          ? "orange"
                          : fetchData?.state === "เสร็จสิ้น"
                            ? "green"
                            : "yellow"
                    }
                  >
                    <TagLabel>{fetchData?.state}</TagLabel>
                  </Tag>
                </Text>
              </HStack>
            </VStack>
          </Box>

          {fetchData?.SolImage && (
            <Box>
              <Text color="#2B3674" fontWeight={"bold"} my="2.5rem">
                รูปภาพ
              </Text>
              <Grid templateColumns={"repeat(3,1fr)"} gap="10px">
                {fetchData?.SolImage.map((i, index) => {
                  return <ImgShow key={index} src={i} />;
                })}
              </Grid>
            </Box>
          )}
        </Box>
      </Container>
    );
  }
}
