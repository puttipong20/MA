import {
  Box,
  Container,
  Flex,
  Grid,
  HStack,
  Heading,
  Spinner,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../services/config-db";
import { useParams } from "react-router-dom";
import ImgModal from "../asset/ImgModal";
import EditProblem from "../Report/EditReport";
import moment from "moment";

type Fvalue = {
  problem: string;
  details: string;
  phone: string;
  lineID: string;
  email: string;
  date: string;
  name: string;
  no: string;
  companyName: string;
  RepImg: [];
  ref: string;
  latestReportUpdate: { timestamp: string; uid: string; username: string };
  createBy: { uid: string; username: string };
};

function ReportDetail() {
  const [fValue, setFValue] = useState<Fvalue>();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(false);

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
  };

  async function fetchData() {
    setIsLoading(true);
    onSnapshot(doc(db, "Report", params["problemID"] as string), (doc) => {
      const data: Fvalue = {
        problem: doc.data()?.title,
        details: doc.data()?.detail,
        phone: doc.data()?.phone,
        lineID: doc.data()?.line,
        email: doc.data()?.email,
        date: convertTime(doc.data()?.createAt),
        name: doc.data()?.name,
        no: doc.data()?.no,
        companyName: doc.data()?.companyName,
        RepImg: doc.data()?.RepImg,
        ref: doc.data()?.ref,
        latestReportUpdate: doc.data()?.latestReportUpdate,
        createBy:doc.data()?.createBy,
      };
      setFValue(data);
      setIsLoading(false);
      // console.log(data);
    });
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <Box
        pt={10}
        pb={5}
        w="100%"
        h="100%"
        display="flex"
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Spinner
          thickness="4px"
          speed="0.65s"
          emptyColor="gray.200"
          color="blue.500"
          size="xl"
        />
      </Box>
    );
  } else {
    return (
      <div className="container">
        <form>
          <Container mt="1rem" mb="10">
            <Heading
              size="lg"
              fontFamily={"inherit"}
              color="#2B3674"
              fontWeight={"bold"}
            >
              ปัญหาการใช้งานระบบ
            </Heading>
            <Box mt="1rem">
              <Stack mb="5" spacing={4}>
                <Flex justify="flex-end">
                  <EditProblem data={fValue} id={params["problemID"]} />
                </Flex>
                <Box border="1px solid #E2E8F0" p="4" borderRadius={"10px"}>
                  <VStack align="left">
                    <HStack alignItems="flex-start">
                      <Text w="30%" fontWeight="bold">
                        Project :
                      </Text>
                      <Text w="70%">{fValue?.companyName}</Text>
                    </HStack>
                    <HStack alignItems="flex-start">
                      <Text w="30%" fontWeight="bold">
                        No :
                      </Text>
                      <Text w="70%">{fValue?.ref}</Text>
                    </HStack>
                    <HStack alignItems="flex-start">
                      <Text w="30%" fontWeight="bold">
                        วันที่แจ้ง :
                      </Text>
                      <Text w="70%">{fValue?.date}</Text>
                    </HStack>
                    <HStack alignItems="flex-start">
                      <Text w="30%" fontWeight="bold">
                        ชื่อผู้แจ้ง :
                      </Text>
                      <Text w="70%">{fValue?.name}</Text>
                    </HStack>
                    <HStack alignItems="flex-start">
                      <Text w="30%" fontWeight="bold">
                        เบอร์ติดต่อ :
                      </Text>
                      <Text w="70%">
                        {fValue?.phone === "" ? "-" : fValue?.phone}
                      </Text>
                    </HStack>
                    <HStack alignItems="flex-start">
                      <Text w="30%" fontWeight="bold">
                        E-mail :
                      </Text>
                      <Text w="70%">
                        {fValue?.email === "" ? "-" : fValue?.email}
                      </Text>
                    </HStack>
                    <HStack alignItems="flex-start">
                      <Text w="30%" fontWeight="bold">
                        Line :
                      </Text>
                      <Text w="70%">
                        {fValue?.lineID === "" ? "-" : fValue?.lineID}
                      </Text>
                    </HStack>
                    <br />
                    <HStack alignItems="flex-start">
                      <Text w="30%" fontWeight="bold">
                        ปัญหาที่พบ :
                      </Text>
                      <Text w="70%">{fValue?.problem}</Text>
                    </HStack>
                    <HStack alignItems="flex-start">
                      <Text w="30%" fontWeight="bold">
                        รายละเอียด :
                      </Text>
                      <Text w="70%">{fValue?.details}</Text>
                    </HStack>
                    {/* <HStack alignItems="flex-start" color="#8F9BBA">
                      <Text w="30%">ผู้แก้ไข :</Text>
                      {!fValue?.latestReportUpdate ? (
                        <Text>-</Text>
                      ) : (
                        <Text w="70%">
                          {fValue?.latestReportUpdate.username}
                        </Text>
                      )}
                    </HStack>
                    <HStack alignItems="flex-start" color="#8F9BBA">
                      <Text w="30%">แก้ไขเมื่อ :</Text>
                      {!fValue?.latestReportUpdate ? (
                        <Text>-</Text>
                      ) : (
                        <Text w="70%">
                          {moment(fValue?.latestReportUpdate.timestamp).format(
                            "DD/MM/YYYY HH:mm:ss"
                          )}
                        </Text>
                      )}
                    </HStack> */}
                  </VStack>
                </Box>
                <Box>
                  <Text fontWeight="bold">รูปเพิ่มเติม</Text>
                  <Grid templateColumns={"repeat(3,1fr)"} gap="10px">
                    {fValue?.RepImg.map((i, index) => {
                      return <ImgModal src={i} key={index} />;
                    })}
                  </Grid>
                </Box>
                <Flex justify="flex-end">
                  <HStack fontSize="14px" color="gray.400">
                    <Text>CreateBy :</Text>
                    <Text>{fValue?.createBy.username}</Text>
                  </HStack>
                </Flex>
                <Flex justify="flex-end">
                  <HStack fontSize="14px" color="gray.400" mt="-0.75rem">
                    <Text>UpdateBy :</Text>
                    {!fValue?.latestReportUpdate ? (
                      <Text>-</Text>
                    ) : (
                      <Text>{fValue?.latestReportUpdate.username},</Text>
                    )}
                    {!fValue?.latestReportUpdate ? (
                      <Text></Text>
                    ) : (
                      <Text>
                        {moment(fValue?.latestReportUpdate.timestamp).format(
                          "DD/MM/YYYY, HH:mm:ss"
                        )}
                      </Text>
                    )}
                  </HStack>
                </Flex>
              </Stack>
            </Box>
          </Container>
        </form>
      </div>
    );
  }
}

export default ReportDetail;
