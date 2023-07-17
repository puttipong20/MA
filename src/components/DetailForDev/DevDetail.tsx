/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
  useToast,
  Container,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import moment from "moment";

import { useForm, Controller } from "react-hook-form";
import UploadFileComp from "../asset/UploadFileComp";
import ImageComp from "../asset/ImageComp";

import { db } from "../../services/config-db";
import { doc, getDoc, updateDoc, } from "firebase/firestore";

import { ReportDetail } from "../../@types/Type";
import { AuthContext } from "../../context/AuthContext";

function DevDetail() {
  const params = useParams();
  const navigate = useNavigate();
  const backPath = `/company/${params["company"]}/${params["projectID"]}/${params["projectName"]}/problemReport`;
  const { handleSubmit, control, watch, setValue } = useForm();

  const [imageUpload, setImageUpload] = useState<string[]>([]);
  const [filesUpload, setFilesUpload] = useState<File[]>([]);
  const [detailHistory, setDetailHistory] = useState<ReportDetail>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  const AuthCtx = useContext(AuthContext);

  const repState = watch("RepStatus") || "รอรับเรื่อง"

  const toast = useToast();

  /*================================================================================================================*/
  const onSubmit = async (data: any) => {
    // console.clear()
    setIsLoadingBtn(true);
    const currentStatus = data.RepStatus
      ? data.RepStatus
      : detailHistory?.RepStatus;
    for (const key in data) {
      if (data[key] === "" || data[key] === undefined || data[key] === null) {
        delete data[key];
      }
    }

    delete data["RepStatus"];

    const solutionUpdate = {
      ...data,
      solutionImg: imageUpload,
    };

    const newSolution = { ...detailHistory?.solution, ...solutionUpdate };

    if (!newSolution["dateProcess"]) {
      newSolution["dateProcess"] = moment().format("yyyy-MM-DD[T]HH:mm:ss")
    }

    if (currentStatus !== "เสร็จสิ้น" && currentStatus !== "ยกเลิก") {
      newSolution["dateDone"] = "";
    }
    const newDetail = {
      solution: newSolution,
      RepStatus: currentStatus,
      latestUpdate: { uid: AuthCtx.uid, username: AuthCtx.username }
    };

    await updateDoc(doc(db, "Report", params["problemID"] as string), newDetail);
    toast({
      title: "บันทึกข้อมูลสำเร็จ",
      status: "success",
      position: "top",
      duration: 5000,
      isClosable: true,
    });
    navigate(backPath);
    setIsLoadingBtn(false);
  };

  const uploadFile = (event: any) => {
    const uploadFiles: File[] = Array.from(event.target.files || []);
    setFilesUpload((prevFiles) => [...prevFiles, ...uploadFiles]);
    const files = event.target.files;
    const promises: Promise<any>[] = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();

      const promise = new Promise((resolve) => {
        reader.onload = (e: any) => {
          resolve(e.target.result);
        };
      });

      reader.readAsDataURL(files[i]);
      promises.push(promise);
    }

    Promise.all(promises).then((results) => {
      setImageUpload([...imageUpload, ...results]);
    });
  };

  const removeFile = (index: number) => {
    setFilesUpload(filesUpload.filter((i) => i !== filesUpload[index]));
    setImageUpload(imageUpload.filter((i) => i !== imageUpload[index]));
  };

  const fetchDetailHistory = async () => {
    setIsLoading(true);
    const docRef = doc(db, "Report", params["problemID"] as string);
    const history = await getDoc(docRef);
    if (history.exists()) {
      const reportHistory: ReportDetail = {
        ...(history.data() as ReportDetail),
      };
      setDetailHistory(reportHistory);
      // console.log(reportHistory)
      setValue("RepStatus", reportHistory.RepStatus)
      setValue("issue", reportHistory.solution?.issue)
      setValue("solution", reportHistory.solution?.solution)
      setValue("accepter", reportHistory.solution?.accepter)
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchDetailHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // console.log(detailHistory)
    const img = detailHistory?.solution?.solutionImg;

    if (img) {
      setImageUpload(img);
    }
    // console.log(detailHistory?.solution?.accepter)
  }, [detailHistory]);

  useEffect(() => {
    // console.log(AuthCtx)
    if ((repState === "เสร็จสิ้น" || repState === "ยกเลิก") && watch("issue") === "กำลังตรวจสอบ") {
      setValue("issue", "");
    }
    if (repState === "กำลังดำเนินการ") {
      setValue("issue", "กำลังตรวจสอบ")
    }
  }, [repState])

  if (isLoading) {
    return (

      <Box>
        {/* <Spinner /> */}
      </Box>
    )
  } else {
    return (
      <Container>
        <Box>
          <Box>
            <Heading
              size="lg"
              fontFamily={"inherit"}
              color="#2B3674"
              fontWeight={"bold"}
            >
              ส่วนของเจ้าหน้าที่รับเรื่อง
            </Heading>
            <Text color="GrayText">กรุณาระบุปัญหา และ รายละเอียดเพิ่มเติม</Text>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="RepStatus"
                control={control}
                defaultValue={""}
                render={({ field }) => (
                  <FormControl mb="1rem" isRequired>
                    <FormLabel color="#2b3674" fontWeight={"bold"}>
                      สถานะ
                    </FormLabel>
                    <Select {...field}>
                      <option value="รอรับเรื่อง">รอรับเรื่อง</option>
                      <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                      <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                      <option value="ยกเลิก">ยกเลิก</option>
                    </Select>
                  </FormControl>
                )}
              />

              {(repState === "เสร็จสิ้น" ||
                repState === "ยกเลิก") && (
                  <Controller
                    name="dateDone"
                    control={control}
                    defaultValue={moment().format("yyyy-MM-DD[T]HH:mm:ss") || ""}
                    render={({ field }) => (
                      <FormControl>
                        <FormLabel color="#2b3674" fontWeight={"bold"}>
                          วันที่เสร็จสิ้น
                        </FormLabel>
                        <Input type={"datetime-local"} {...field} readOnly />
                      </FormControl>
                    )}
                  />
                )}
              {
                repState !== "รอรับเรื่อง" &&
                <Box>
                  {
                    repState === "กำลังดำเนินการ" ?
                      <Controller
                        name="issue"
                        control={control}
                        defaultValue={"กำลังตรวจสอบ"}
                        render={({ field }) => (
                          <FormControl mb="1rem" isReadOnly>
                            <FormLabel color="#2b3674" fontWeight={"bold"}>
                              ปัญหาที่พบ
                            </FormLabel>
                            <Input {...field} type="text" />
                          </FormControl>
                        )}
                      />
                      :
                      <Controller
                        name="issue"
                        control={control}
                        defaultValue={detailHistory?.solution?.issue === "กำลังตรวจสอบ" ? "" : detailHistory?.solution?.issue}
                        render={({ field }) => (
                          <FormControl mb="1rem" isRequired>
                            <FormLabel color="#2b3674" fontWeight={"bold"}>
                              ปัญหาที่พบ
                            </FormLabel>
                            <Input {...field} type="text" placeholder="กรุณาระบุปัญหาที่พบ" />
                          </FormControl>
                        )}
                      />
                  }

                  <Controller
                    name="solution"
                    control={control}
                    defaultValue={detailHistory?.solution?.solution || ""}
                    render={({ field }) => (
                      <FormControl mb="1rem">
                        <FormLabel color="#2b3674" fontWeight={"bold"}>
                          รายละเอียดการแก้ไข
                        </FormLabel>
                        <Textarea
                          {...field}
                          resize={"none"}
                          rows={10}
                          placeholder={"ระบุรายละเอียดเพิ่มเติม"}
                        />
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="accepter"
                    control={control}
                    defaultValue={AuthCtx.username}
                    render={({ field }) => (
                      <FormControl mb="1rem" isRequired isReadOnly>
                        <FormLabel color="#2b3674" fontWeight={"bold"}>
                          ชื่อผู้รับเรื่อง
                        </FormLabel>
                        <Input type="email" {...field} />
                        {/* <Select {...field} placeholder={"กรุณาเลือกผู้รับเรื่อง"}>
                          {allAdminUserName.map((i, index) => {
                            return (
                              <option key={index} value={i}>
                                {i}
                              </option>
                            );
                          })}
                        </Select> */}
                      </FormControl>
                    )}
                  />

                  <Text color="#2b3674" fontWeight={"bold"}>
                    อัพโหลดรูปภาพเพิ่มเติม
                  </Text>
                  <Box p="20px">
                    <Grid
                      templateColumns={"repeat(3,1fr)"}
                      w={imageUpload.length >= 3 ? "fit-content" : "100%"}
                      gap={"1.5rem"}
                      mx="auto"
                    >
                      {imageUpload.map((i, index) => {
                        return (
                          <ImageComp
                            key={index}
                            src={i}
                            index={index}
                            removeHandle={removeFile}
                          />
                        );
                      })}
                      <Box>
                        <label htmlFor="imageInput">
                          <UploadFileComp count={imageUpload.length} />
                        </label>
                        <Input
                          type="file"
                          display="none"
                          id="imageInput"
                          accept="image/png, image/jpeg"
                          onChange={uploadFile}
                          multiple
                        />
                      </Box>
                    </Grid>
                  </Box>
                </Box>
              }
              <Box>
                <Text textAlign="right" color="gray.400" fontSize="14px">
                  Latest Update : {detailHistory?.latestUpdate ? detailHistory.latestUpdate.username : " - "}
                </Text>
              </Box>
              <Flex w="100%" justifyContent="center" mt="2rem">
                <Button
                  mr="68px"
                  w="100px"
                  borderRadius="16px"
                  onClick={() => {
                    navigate(backPath);
                  }}
                >
                  ปิด
                </Button>
                <Button
                  w="100px"
                  bg="#4C7BF4"
                  color="#eee"
                  _hover={{ opacity: "0.8" }}
                  borderRadius="16px"
                  type="submit"
                  isLoading={isLoadingBtn}
                >
                  บันทึก
                </Button>
              </Flex>
            </form>
          </Box>
        </Box>

      </Container>
    );
  }
}

export default DevDetail;
