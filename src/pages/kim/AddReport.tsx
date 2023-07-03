/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Box,
    Button,
    Container,
    Flex,
    FormControl,
    FormLabel,
    Grid,
    Heading,
    Input,
    Select,
    Stack,
    Text,
    Textarea,
    useToast,
    Image,
    VStack,
} from "@chakra-ui/react";
import { useEffect, useState, useContext } from "react";
import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { MdUpload } from "react-icons/md";

import { AuthContext } from "../../context/AuthContext";
import { CompanyContext } from "../../context/CompanyContext";

type FormValues = {
    ticketsProblems: string;
    ticketsDetails: string;
    ticketsPhone: string;
    ticketsLine: string;
    ticketsEmail: string;
    ticketsDate: string;
    ticketsName: string;
    otherProblem: string;
    image: [];
};

const AddReport = () => {
    const {
        handleSubmit,
        reset,
        watch,
        control,
        formState: { errors },
    } = useForm<FormValues>();

    const Auth = useContext(AuthContext);
    const Company = useContext(CompanyContext);

    const [allImgUpload, setAllImgUpload] = useState<any[]>([])

    const [isLoading, setIsLoading] = useState(false);
    const params = useParams();
    const navigate = useNavigate();
    const toast = useToast();

    const formattedDate = moment().format("YYYY-MM-DD HH:mm:ss");
    const problem = watch("ticketsProblems");

    const goBackPath = `/company/${params["company"]}/${params["projectID"]}/${params["projectName"]}/problemReport`;

    useEffect(() => {
        // console.clear();
        console.log(Company)
        if (Company.companyId === "") {
            navigate(goBackPath);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSubmit = async (data: any) => {
        setIsLoading(true);
        // console.clear();
        // const docRef = doc(db, "Company", params["company"] as string)
        // const fetchDoc = await getDoc(docRef)
        // const companyDetail = fetchDoc.data() as CompanyDetail

        const dataToAdd = {
            title:
                data.ticketsProblems === "other"
                    ? data.otherProblem
                    : data.ticketsProblems,
            detail: data.ticketsDetails,
            phone: data.ticketsPhone,
            line: data.ticketsLine,
            email: data.ticketsEmail,
            createAt: data.ticketsDate,
            name: data.ticketsName,
            RepImg: allImgUpload,
            company: Company.companyName,
            // company: params["projectName"]?.replace(/[^a-zA-Z0-9]/g, ''),
            companyId: Company.companyId,
            projectName: Company.projectName.replace(/[^ก-๙เแโใไa-zA-Z0-9]/g, ''),
            projectID: Company.projectId,
            uid: Auth.uid
        }
        // console.log(dataToAdd);
        try {
            await axios
                .post(
                    "https://asia-southeast1-crafting-ticket-dev.cloudfunctions.net/addReport_v2", dataToAdd)
                .then(
                    () => {
                        // console.log(props)
                        navigate(goBackPath);
                        toast({
                            title: "Submit Successfully",
                            description: "report a problem has been submitted.",
                            status: "success",
                            position: "top",
                            duration: 3000,
                            isClosable: true,
                        });
                    }
                )
                .catch((e) => console.log(e));
        } catch (e) {
            console.log(e)
            toast({
                title: "Error",
                description: "There's something wrong, please try again later",
                status: "error",
                position: "top",
                duration: 3000,
                isClosable: true,
            });
        }

        reset();
        setIsLoading(false);
    };

    const handleClose = () => {
        navigate(goBackPath);
    };

    const uploadFile = (event: any) => {
        const files = event.target.files;
        const temp = allImgUpload;

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
            setAllImgUpload([...temp, ...results]);
        });
    };

    const removeFile = (index: number) => {
        setAllImgUpload(allImgUpload.filter((i) => i !== allImgUpload[index]));
    };

    useEffect(() => {
        // console.log(problem);
    }, [problem]);

    return (
        <div className="container">
            <Flex
                justify="center"
                textAlign="center"
                p="10"
                bg="#4c7bf4"
                color="white"
            >
                <Heading fontFamily={"inherit"}>แจ้งปัญหาการใช้งานระบบ</Heading>
            </Flex>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Container mt="1rem" pb="10">
                    <Grid>
                        <Text fontWeight="bold" color="#2B3674" fontSize="2xl">
                            แจ้งปัญหาการใช้งานระบบ
                        </Text>
                        <Text color="#A3AED0">กรุณาระบุปัญหา และรายละเอียดเพิ่มเติม</Text>
                    </Grid>
                    <Box>
                        <Stack mb="5">
                            <Box>
                                <Controller
                                    name="ticketsDate"
                                    control={control}
                                    defaultValue={formattedDate}
                                    rules={{ required: true }}
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <FormControl isReadOnly>
                                            <FormLabel color="#1B2559">วันที่</FormLabel>
                                            <Input
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                borderRadius="12px"
                                                type="datetime-local"
                                            />
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box>
                                <Controller
                                    name="ticketsProblems"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field: { name, value, onChange, onBlur } }) => (
                                        <FormControl isInvalid={Boolean(errors[name])}>
                                            <FormLabel color="#1B2559">ปัญหาที่พบ</FormLabel>
                                            <Select
                                                placeholder="เลือกปัญหาที่พบ..."
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                borderRadius="12px"
                                            >
                                                <option value="ปัญหาระบบ">ปัญหาระบบ</option>
                                                <option value="ระบบที่ใช้อยู่ไม่รองรับ">
                                                    ระบบที่ใช้อยู่ไม่รองรับ
                                                </option>
                                                <option value="other">อื่นๆ</option>
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            {problem === "other" && (
                                <Controller
                                    name="otherProblem"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field: { name, value, onChange, onBlur } }) => (
                                        <FormControl isInvalid={Boolean(errors[name])}>
                                            <Input
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                type="text"
                                                placeholder="อื่นๆ โปรดระบุ"
                                                borderRadius="12px"
                                            />
                                        </FormControl>
                                    )}
                                />
                            )}
                            <Box>
                                <Controller
                                    name="ticketsDetails"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field: { name, value, onChange, onBlur } }) => (
                                        <FormControl isInvalid={Boolean(errors[name])}>
                                            <FormLabel color="#1B2559">รายละเอียด</FormLabel>
                                            <Textarea
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                placeholder="ใส่รายละเอียดเพิ่มเติม..."
                                                borderRadius="12px"
                                            />
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box>
                                <Controller
                                    name="ticketsName"
                                    control={control}
                                    defaultValue=""
                                    rules={{ required: true }}
                                    render={({ field: { name, value, onChange, onBlur } }) => (
                                        <FormControl isInvalid={Boolean(errors[name])}>
                                            <FormLabel color="#1B2559">ชื่อผู้แจ้งปัญหา</FormLabel>
                                            <Input
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                placeholder="ระบุชื่อของคุณ"
                                                borderRadius="12px"
                                            />
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box>
                                <Controller
                                    name="ticketsPhone"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <FormControl>
                                            <FormLabel color="#1B2559">เบอร์โทร</FormLabel>
                                            <Input
                                                type="tel"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                placeholder="ระบุเบอร์โทรที่ใช้ในการติดต่อ"
                                                borderRadius="12px"
                                            />
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box>
                                <Controller
                                    name="ticketsLine"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <FormControl>
                                            <FormLabel color="#1B2559">ไลน์</FormLabel>
                                            <Input
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                placeholder="ระบุไลน์ ID ที่ใช้ในการติดต่อ"
                                                borderRadius="12px"
                                            />
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box>
                                <Controller
                                    name="ticketsEmail"
                                    control={control}
                                    defaultValue=""
                                    render={({ field: { value, onChange, onBlur } }) => (
                                        <FormControl>
                                            <FormLabel color="#1B2559">อีเมล</FormLabel>
                                            <Input
                                                type="email"
                                                value={value}
                                                onChange={onChange}
                                                onBlur={onBlur}
                                                placeholder="ระบุอีเมลที่ใช้ในการติดต่อ"
                                                borderRadius="12px"
                                            />
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box>
                                <Text pb="3" color="#1B2559">
                                    อัพโหลดไฟล์รูปเพิ่มเติม
                                </Text>
                                <Grid w="100%" templateColumns={"repeat(3,1fr)"} gap="10px">
                                    {allImgUpload.map((i, index) => {
                                        return (
                                            <Flex
                                                alignItems={"center"}
                                                justifyContent={"center"}
                                                position="relative"
                                                h="165px"
                                                w="100%"
                                                border="1px solid black"
                                                key={index}
                                            >
                                                <Button
                                                    position="absolute"
                                                    borderRadius={"50%"}
                                                    right="-10px"
                                                    top="-10px"
                                                    size={"xs"}
                                                    colorScheme="red"
                                                    onClick={() => {
                                                        removeFile(index);
                                                    }}
                                                >
                                                    X
                                                </Button>
                                                <Image src={i} maxH="100%" />
                                            </Flex>
                                        );
                                    })}
                                    <Box>
                                        <label htmlFor="imageInput">
                                            <VStack
                                                textAlign={"center"}
                                                border="1px dashed gray"
                                                justifyContent={"center"}
                                                p={4}
                                                h="165PX"
                                                w="100%"
                                                borderRadius="10px"
                                                cursor={"pointer"}
                                                userSelect={"none"}
                                                bg="#FAFCFE"
                                            >
                                                <Flex color="#4c7bf4" fontSize={"3rem"}>
                                                    <MdUpload />
                                                </Flex>
                                                <Text color="#4c7bf4" fontWeight="bold">
                                                    คลิกเพื่ออัพโหลดไฟล์
                                                </Text>
                                                <Text color="#8F9BBA" fontSize={"0.7rem"}>
                                                    PNG,JPG are allowed
                                                </Text>
                                            </VStack>
                                        </label>

                                        <Input
                                            id="imageInput"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            // onChange={handleFileChange}
                                            onChange={uploadFile}
                                            display={"none"}
                                            bg="white"
                                            color="gray.600"
                                        />
                                    </Box>
                                </Grid>
                            </Box>
                        </Stack>
                        <Flex justify="center">
                            <Button mr="68px" borderRadius="16px" onClick={handleClose}>
                                ปิด
                            </Button>
                            <Button
                                borderRadius="16px"
                                type="submit"
                                bg="#4c7bf4"
                                color="white"
                                isLoading={isLoading}
                                _hover={{ bg: "#4c7bf4" }}
                            >
                                บันทึก
                            </Button>
                        </Flex>
                    </Box>
                </Container>
            </form>
        </div>
    );
};

export default AddReport;
