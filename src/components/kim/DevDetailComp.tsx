/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, useEffect } from "react";
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
import UploadFileComp from "./UploadFileComp";
import ImageComp from "./ImageComp";

import { db } from "../../services/config-db";
import { collection, doc, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";

import { ReportDetail } from "../../@types/Type";

function DevDetailComp() {
  const params = useParams();
  const navigate = useNavigate();
  const backPath = `/company/${params["company"]}/${params["projectID"]}/${params["projectName"]}/problemReport`;
  const { handleSubmit, control, watch, setValue } = useForm();

  const [imageUpload, setImageUpload] = useState<string[]>([]);
  const [filesUpload, setFilesUpload] = useState<File[]>([]);
  const [detailHistory, setDetailHistory] = useState<ReportDetail>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);

  const [allAdminUserName, setAllAdminUserName] = useState<string[]>([])

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
      ...detailHistory,
      solution: newSolution,
      RepStatus: currentStatus,
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

      setValue("RepStatus", reportHistory.RepStatus)
      setValue("issueType", reportHistory.solution?.issueType)
      setValue("issueOther", reportHistory.solution?.issueOther)
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

  const fetchUser = async () => {
    const docRef = collection(db, "Profiles")
    const q = query(docRef, where("role", "==", "admin"))
    const accounts = await getDocs(q)
    const accountsName: string[] = [];
    accounts.forEach(a => accountsName.push(a.data().username as string))
    setAllAdminUserName(accountsName);
  }

  useEffect(() => {
    fetchUser();
  }, [])

  if (isLoading) {
    <Box>
      {/* <Spinner /> */}
    </Box>;
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

              {(watch("RepStatus") === "เสร็จสิ้น" ||
                watch("RepStatus") === "ยกเลิก") && (
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
              {/* {RepState !== "รอดำเนินการ" && RepState !== "เสร็จสิ้น" && (
                <Controller
                  name="dateProcess"
                  control={control}
                  defaultValue={moment().format("yyyy-MM-DD[T]HH:mm") || ""}
                  render={({ field }) => (
                    <FormControl>
                      <FormLabel color="#2b3674" fontWeight={"bold"}>
                        วันที่ดำเนินการ
                      </FormLabel>
                      <Input type={"datetime-local"} {...field} readOnly />
                    </FormControl>
                  )}
                />
              )} */}

              <Controller
                name="issueType"
                control={control}
                defaultValue={detailHistory?.solution?.issueType || ""}
                render={({ field }) => (
                  <FormControl mb="1rem">
                    <FormLabel color="#2b3674" fontWeight={"bold"}>
                      ปัญหาที่พบ
                    </FormLabel>
                    <Select {...field} placeholder="ระบุลักษณะปัญหา">
                      <option value="Bug">Bug</option>
                      <option value="เพิ่มระบบ">เพิ่มระบบ</option>
                      <option value="other">อื่นๆ</option>
                    </Select>
                  </FormControl>
                )}
              />
              {watch("issueType") === "other" && (
                <Controller
                  name="issueOther"
                  control={control}
                  defaultValue={detailHistory?.solution?.issueOther || ""}
                  render={({ field }) => (
                    <FormControl>
                      <Input type="string" placeholder="ระบุปัญหา" {...field} />
                    </FormControl>
                  )}
                />
              )}

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

              {/* <Controller
                name="accepter"
                control={control}
                defaultValue={detailHistory?.solution?.accepter || ""}
                render={({ field }) => (
                  <FormControl mb="1rem">
                    <FormLabel color="#2b3674" fontWeight={"bold"}>
                      ชื่อผู้รับเรื่อง
                    </FormLabel>
                    <Input type="text" {...field} />
                  </FormControl>
                )}
              /> */}

              <Controller
                name="accepter"
                control={control}
                defaultValue={detailHistory?.solution?.accepter || ""}
                render={({ field }) => (
                  <FormControl mb="1rem" isRequired>
                    <FormLabel color="#2b3674" fontWeight={"bold"}>
                      ชื่อผู้รับเรื่อง
                    </FormLabel>
                    <Select {...field} placeholder={"กรุณาเลือกผู้รับเรื่อง"}>
                      {allAdminUserName.map((i, index) => {
                        return (
                          <option key={index} value={i}>
                            {i}
                          </option>
                        );
                      })}
                    </Select>
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

              <Flex w="100%" justifyContent={"center"} gap={"3rem"} mt="2rem">
                <Button
                  w="100px"
                  borderRadius="16px"
                  onClick={() => {
                    navigate(backPath);
                  }}
                  isLoading={isLoadingBtn}
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

export default DevDetailComp;
