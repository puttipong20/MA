/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Flex,
  useDisclosure,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalHeader,
  ModalBody,
  Stack,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Button,
  Select,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { Controller, useForm } from "react-hook-form";
import { RiEditLine } from "react-icons/ri";
import moment from "moment";
import { collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "../../services/config-db";
import { MA } from "../../@types/Type";
import { AuthContext } from "../../context/AuthContext";

const EditContract = ({ data, maId, projectId, callBack }: any) => {
  const {
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<MA>();

  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cache, setCache] = useState<{ id: string, ma: MA }[] | null>(null)
  const [duration, setDuration] = useState<number>(0)
  const toast = useToast();
  const Auth = useContext(AuthContext);

  useEffect(() => {
    if (data) {
      setValue("startMA", data?.startMA);
      setValue("endMA", data?.endMA);
      setValue("cost", data?.cost);
      setValue("status", data?.status)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startMA = watch("startMA") || moment().format("YYYY-MM-DD");
  const endMA = watch("endMA") || moment().add(1, "year").format("YYYY-MM-DD");

  const durationData = (startDate: string, endDate: string) => {
    const a = new Date(startDate) as any;
    const b = new Date(endDate) as any;
    const d = Math.floor(b - a) / (1000 * 60 * 60 * 24);
    setDuration(d);
  };

  useEffect(() => {
    durationData(startMA, endMA);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startMA, endMA]);

  const checkTimeOverlap = (s1: string, e1: string, s2: string, e2: string) => {
    const start1 = new Date(s1);
    const start2 = new Date(s2);
    const end1 = new Date(e1);
    const end2 = new Date(e2);

    if (start1 <= end2 && end1 >= start2) {
      // console.log(true)
      return true;
    } else {
      // console.log(false)
      return false;
    }
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // console.clear();
    // console.log(data);
    let skip = false;
    const projectRef = doc(db, "Project", projectId);
    const MAref = collection(projectRef, "MAlogs");
    const MADetail = (await getDoc(doc(MAref, maId))).data() as MA;
    if (data.startMA !== MADetail.startMA || data.endMA !== MADetail.endMA || data.status !== MADetail.status) {
      // console.log("date updated")
      let filtered: { id: string, ma: MA }[] = [];
      if (cache === null) {
        const MAlogs: { id: string, ma: MA }[] = [];
        (await getDocs(MAref)).forEach(ma => MAlogs.push({ id: ma.id, ma: ma.data() as MA }))
        setCache(MAlogs);
        filtered = MAlogs.filter((ma) => ma.id !== maId && (ma.ma.status === "active" || ma.ma.status === "advance"))
      } else {
        filtered = cache.filter((ma) => ma.id !== maId && (ma.ma.status === "active" || ma.ma.status === "advance"))
      }
      // console.log(filtered);
      const overlapResult: boolean[] = [];
      filtered.forEach((ma) => {
        const ol = checkTimeOverlap(data.startMA, data.endMA, ma.ma.startMA, ma.ma.endMA);
        // if (ol) {
        //   console.log("input = ", data.startMA, data.endMA, "| compare = ", ma.ma.startMA, ma.ma.endMA, "overlap")
        // } else {
        //   console.log("input = ", data.startMA, data.endMA, "| compare = ", ma.ma.startMA, ma.ma.endMA, "not overlap")
        // }
        overlapResult.push(ol);
      })
      const overlap = !overlapResult.every((x) => x === false)
      // overlap ? console.log("has some overlap") : console.log("don't have any overlap");
      if (overlap) {
        skip = true
        toast({
          title: "ช่วงเวลาไม่ถูกต้อง",
          description: "กรุณาเลือกช่วงเวลาที่ไม่ทับกับสัญญาอื่น",
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        setIsLoading(false);
      }
      // const AllMA = await(getDocs(MAref));
    }

    if (!skip) {
      const oldUpdateLog = MADetail.updateLogs;
      const newUpdateLog = {
        note: data.note,
        timeStamp: moment().format("YYYY-MM-DD HH:mm:ss"),
        updatedBy: { username: Auth.username, uid: Auth.uid },
      };
      const merge = [...oldUpdateLog, newUpdateLog];
      // console.log(data, merge)
      // console.log(Auth)
      await updateDoc(doc(MAref, maId), {
        startMA: data.startMA,
        endMA: data.endMA,
        cost: data.cost,
        status: data.status,
        updateLogs: merge,
      })
        .then(() => {
          toast({
            title: "อัพเดทสัญญาสำเร็จ",
            status: "success",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
          callBack();
          setIsLoading(false);
        })
        .catch((e) => {
          console.error(e);
          toast({
            title: "อัพเดทสัญญาไม่สำเร็จ",
            description: e,
            status: "error",
            duration: 2000,
            isClosable: true,
            position: "top",
          });
        });
      reset()
      onClose();
      setIsLoading(false);
    }
  };


  const [activeError, setActiveError] = useState(false)
  const [advanceError, setAdvanceError] = useState(false)
  const [expireError, setExpireError] = useState(false)

  const status = watch("status") || "";
  const start = watch("startMA") || "";
  const end = watch("endMA") || "";
  
  useEffect(() => {
    // console.log("change")
    const currentDate = moment().format("YYYY-MM-DD")
    if (status === "active") {
      // console.log("สัญญา : กำลังใช้งาน", !((start <= currentDate) && (currentDate <= end)))
      setActiveError(!((start <= currentDate) && (currentDate <= end)))
      setAdvanceError(false);
      setExpireError(false);
    }
    if (status === "advance") {
      // console.log("สัญญา : ล่วงหน้า", (start > currentDate))
      setAdvanceError(!(start > currentDate))
      setActiveError(false)
      setExpireError(false)
    }
    if (status === "expire") {
      // console.log("สัญญา : หมดอายุ", (currentDate > end))
      setExpireError(!(currentDate > end))
      setActiveError(false)
      setAdvanceError(false)
    }
  }, [status, start, end])

  const clear = () => {
    reset();
    setActiveError(false)
    setAdvanceError(false)
    setExpireError(false)
  }

  return (
    <Box w="100%" p={"0.5rem"} userSelect={"none"}>
      <Text
        color={"green"}
        w="100%"
        display="flex"
        alignItems={"center"}
        onClick={onOpen}
      >
        <Text as="span" w="20%" display={"flex"} justifyContent={"center"}>
          <RiEditLine />
        </Text>
        แก้ไขสัญญา
      </Text>

      <Modal isOpen={isOpen} onClose={onClose} isCentered={true} >
        <ModalOverlay />
        <ModalContent w={{ base: "90%", sm: "90%", md: "30rem" }} p="1rem">
          <ModalCloseButton />
          <ModalHeader textAlign="center">แก้ไขข้อมูลสัญญา</ModalHeader>
          <ModalBody>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                <Controller
                  name="startMA"
                  control={control}
                  defaultValue=""
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel>วันเริ่มต้นสัญญาใหม่</FormLabel>
                      <Input
                        type="date"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="endMA"
                  control={control}
                  defaultValue=""
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel>วันสิ้นสุดสัญญาใหม่</FormLabel>
                      <Input
                        type="date"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormControl>
                  )}
                />
                <Text>ระยะเวลา = <Text as="span" fontWeight={"bold"}>{duration}</Text> วัน</Text>
                {
                  duration < 1 && <Text color="red">ระยะเวลาอย่างน้อย 1 วัน</Text>
                }
                <Controller
                  name="cost"
                  control={control}
                  defaultValue={0}
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])}>
                      <FormLabel>ค่าบริการ</FormLabel>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0.00"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name="status"
                  control={control}
                  defaultValue="expire"
                  render={({ field }) => (
                    <FormControl>
                      <Text>สถานะสัญญาปัจจุบัน</Text>
                      <Select placeholder={"กรุณาเลือกสถานะของสัญญา"} {...field}>
                        <option value="advance">ล่วงหน้า</option>
                        <option value="active">กำลังใช้งาน</option>
                        <option value="expire">หมดอายุ</option>
                      </Select>
                    </FormControl>
                  )}
                />
                <Controller
                  name="note"
                  control={control}
                  defaultValue=""
                  render={({ field: { name, value, onChange, onBlur } }) => (
                    <FormControl isInvalid={Boolean(errors[name])} isRequired>
                      <FormLabel>หมายเหตุ</FormLabel>
                      <Input
                        type="text"
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        placeholder="กรุณากรอกหมายเหตุ"
                      />
                    </FormControl>
                  )}
                />
              </Stack>
              <Box color="red">
                {activeError && <Text>วันที่ไม่ถูกต้อง : วันที่ปัจจุบันต้องอยู่ในช่วงของสัญญา</Text>}
                {advanceError && <Text>วันที่ไม่ถูกต้อง : วันที่เริ่มต้นสัญญาต้องมากกว่าวันที่ปัจจุบัน</Text>}
                {expireError && <Text>วันที่ไม่ถูกต้อง : วันที่สิ้นสุดสัญญาต้องน้อยกว่าวันที่ปัจจุบัน</Text>}
              </Box>
              <Flex justify="center" mt="5">
                <Button mr="68px" onClick={() => clear()}>
                  เคลียร์
                </Button>
                <Button
                  type="submit"
                  color="gray.100"
                  bg="#4C7BF4"
                  _hover={{ color: "white", bg: "#4C7BF4" }}
                  isLoading={isLoading}
                  isDisabled={activeError || advanceError || expireError}
                >
                  บันทึก
                </Button>
              </Flex>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default EditContract;
