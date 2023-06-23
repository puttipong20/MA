/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useContext } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Table,
  Tag,
  TagLabel,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

import { BsSearch } from "react-icons/bs";
import { search } from "ss-search";

import classes from "./PreviewComp.module.css";

import { Report } from "../@types/Type";

import { LayoutContext } from "../Context/LayoutContext";
import {
  HamburgerIcon,
} from "@chakra-ui/icons";
import { Controller, useForm } from "react-hook-form";
import { AuthContext } from "../Context/AuthContext";
import ProfileMenuBar from "./ProfileMenuBar";
interface Props {
  role: string;
  type: string;
  data: Report[];
  uid: string;
}

const PreviewComp: React.FC<Props> = (props) => {
  // console.log(props)
  const { control, watch } = useForm();
  const statusFilter = watch("statusFilter") || "";
  const Layout = useContext(LayoutContext);
  const Auth = useContext(AuthContext)
  const userDetail = Auth.detail as { role: string, company: string }
  const reports: Report[] = props.data
    .filter(
      (i) =>
        i.docs.company === props.type
    )
    .sort((a, b) => {
      const dateA = new Date(a.docs.createAt).getTime();
      const dateB = new Date(b.docs.createAt).getTime();
      return dateB - dateA;
    });

  // console.log(reports);
  const [filterReports, setFilterReports] = useState<Report[]>([]);

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

  useEffect(() => {
    setFilterReports(reports);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data, props.type]);

  // console.log(filterReports)

  const wait = "รอรับเรื่อง";
  const process = "กำลังดำเนินการ";
  const done = "เสร็จสิ้น";
  // const cancel = "ยกเลิก"

  let projectName = "";
  switch (props.type) {
    case "gogreen":
      projectName = "Go Green";
      break;
    case "saimai":
      projectName = "Saimai";
      break;
    case "diwalai":
      projectName = "Diwalai";
      break;
    default:
      projectName = "";
      break;
  }

  const onSearch = () => {
    const searchInput = document.getElementById(
      "searchInput"
    ) as HTMLInputElement;
    const searchText = searchInput.value + " " + statusFilter || "";
    const searchField = ["docs.title", "docs.ref", "docs.RepStatus"];
    // console.clear();
    // console.log(searchText)
    const result = search(reports, searchField, searchText) as Report[];
    // console.log(result)
    setFilterReports(result);
  };

  useEffect(() => {
    onSearch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter])

  const keyHandle = (event: any) => {
    const key = event.key;
    if (key === "Enter") {
      onSearch();
    }
  };

  const navigate = useNavigate();
  return (
    <Box w="100%" h="100%">
      <Box h="fit-content" position="relative">
        <Flex>
          <Box mr="10px">
            <Button
              onClick={() => {
                Layout.setToggle();
              }}
              size="sm"
            >
              <HamburgerIcon color="gray" />
              {Layout.toggle}
            </Button>
          </Box>
          <Box h="fit-content">
            <Text>Project / {projectName}</Text>
            <Heading>{projectName}</Heading>
            {/* <Text>Current UID : {props.uid}</Text> */}
          </Box>
        </Flex>
        <Box
          position="absolute"
          top="0"
          right="0"
          w="350px"
          border="1px solid white"
          textAlign={"center"}
          borderRadius="20"
          p="1"
          boxShadow="base"
        >
          <ProfileMenuBar role={userDetail.role} company={userDetail.company} />
        </Box>
      </Box>

      <Box my="20px" h="fit-content">
        <Flex justifyContent={"flex-start"} gap="20px">
          <InputGroup w="auto" borderRadius={"16px"}>
            <InputLeftAddon
              background="#F4F7FE"
              border="none"
              borderRadius={"16px 0 0 16px"}
            >
              <BsSearch />
            </InputLeftAddon>
            <Input
              type="text"
              background="#F4F7FE"
              border="none"
              placeholder="Search by refID, problem"
              borderRadius={"16px"}
              id="searchInput"
              focusBorderColor={"none"}
              onKeyDown={keyHandle}
              onChange={onSearch}
            />
          </InputGroup>
          <Button
            background={"#1B2559"}
            color="white"
            borderRadius="16px"
            onClick={onSearch}
            _active={{ opacity: "1" }}
            _hover={{ opacity: "1" }}
          >
            ค้นหา
          </Button>
          <Box>
            <Controller
              name="statusFilter"
              defaultValue={""}
              control={control}
              render={({ field }) => (
                <FormControl>
                  <HStack>
                    <Text>สถานะ</Text>
                    <Select {...field}>
                      <option value="">ทั้งหมด</option>
                      <option value="รอรับเรื่อง">รอรับเรื่อง</option>
                      <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                      <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                      <option value="ยกเลิก">ยกเลิก</option>
                    </Select>
                  </HStack>
                </FormControl>
              )}
            />
          </Box>
        </Flex>

        <Flex justifyContent={"flex-end"}>
          <Button
            bg={"#4c7bf4"}
            color="#fff"
            fontWeight={"normal"}
            onClick={() => {
              // console.log(props)
              navigate(`/Add/${props.type}`);
            }}
            _hover={{ opacity: "1" }}
            _active={{ opacity: "1" }}
            borderRadius={"16px"}
          >
            แจ้งปัญหาการใช้งานระบบ
          </Button>
        </Flex>
      </Box>

      <Box
        h="70%"
        overflowY={"auto"}
        className={classes.previewTable}
        boxShadow={"1px 1px 1px rgb(0,0,0,0.1)"}
      >
        <Table>
          <Thead>
            <Tr background={"#4c7bf4"}>
              <Th
                fontWeight={"normal"}
                fontSize="16px"
                minW="10rem"
                color="#fff"
                textAlign="center"
                fontFamily={"inherit"}
              >
                No.
              </Th>
              <Th
                fontWeight={"normal"}
                fontSize="16px"
                minW="10rem"
                color="#fff"
                textAlign="center"
                fontFamily={"inherit"}
              >
                วันที่
              </Th>
              <Th
                fontWeight={"normal"}
                fontSize="16px"
                minW="10rem"
                color="#fff"
                textAlign="center"
                fontFamily={"inherit"}
              >
                ปัญหาที่พบ
              </Th>
              <Th
                fontWeight={"normal"}
                fontSize="16px"
                minW="10rem"
                color="#fff"
                textAlign="center"
                fontFamily={"inherit"}
              >
                ชื่อผู้แจ้งปัญหา
              </Th>
              <Th
                fontWeight={"normal"}
                fontSize="16px"
                minW="12.5rem"
                color="#fff"
                textAlign="center"
                fontFamily={"inherit"}
              >
                ข้อมูลการติดต่อ
              </Th>
              <Th
                fontWeight={"normal"}
                fontSize="16px"
                minW="10rem"
                color="#fff"
                textAlign="center"
                fontFamily={"inherit"}
              >
                ชื่อผู้รับเรื่อง
              </Th>
              <Th
                fontWeight={"normal"}
                fontSize="16px"
                minW="10rem"
                color="#fff"
                textAlign="center"
                fontFamily={"inherit"}
              >
                การดำเนินการ
              </Th>
              {props.role === "client" && (
                <Th
                  fontWeight={"normal"}
                  fontSize="16px"
                  minW="10rem"
                  color="#fff"
                  textAlign="center"
                  fontFamily={"inherit"}
                >
                  รายละเอียด
                </Th>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {filterReports.map((r, index) => {
              return (
                <Tr
                  key={index}
                  cursor={Auth.detail.role === "admin" ? "pointer" : "auto"}
                  // eslint-disable-next-line @typescript-eslint/no-empty-function
                  onClick={
                    Auth.detail.role === "admin"
                      ? () => {
                        navigate(`/dev/${props.type}/${r.id}`);
                      }
                      : // eslint-disable-next-line @typescript-eslint/no-empty-function
                      () => { }
                  }
                  _hover={{ background: "rgb(0,0,0,0.1)" }}
                  color={"#2B3674"}
                  fontSize={"0.75rem"}
                >
                  <Td textAlign="center">{r.docs.ref}</Td>
                  <Td textAlign="center">
                    {convertTime(r.docs.createAt)}
                  </Td>
                  <Td textAlign="center">{r.docs.title}</Td>
                  <Td textAlign="center">{r.docs.name}</Td>
                  <Td>
                    {/*<Text as="span">เบอร์โทร:</Text>*/} {r.docs.phone || "-"}
                    <br />
                    {/*<Text as="span">Line:</Text>*/} {r.docs.line || "-"}
                    <br />
                    {/*<Text as="span">Email:</Text>*/} {r.docs.email || "-"}
                  </Td>
                  <Td textAlign="center">
                    {r.docs.solution?.accepter
                      ? r.docs.solution.accepter
                      : "ยังไม่มีผู้รับเรื่อง"}
                  </Td>
                  <Td>
                    <Tag
                      w="100%"
                      h="40px"
                      colorScheme={
                        wait.includes(r.docs.RepStatus)
                          ? "yellow"
                          : r.docs.RepStatus === done
                            ? "green"
                            : r.docs.RepStatus === process
                              ? "orange"
                              : "red"
                      }
                    >
                      <TagLabel w="100%" textAlign={"center"}>
                        {r.docs.RepStatus}
                      </TagLabel>
                    </Tag>
                  </Td>
                  {Auth.detail.role === "client" && (
                    <Td textAlign="center">
                      <Tag
                        color="#1D5AF8"
                        h="40px"
                        borderRadius={"16px"}
                        cursor={"pointer"}
                        onClick={() => {
                          navigate(`/detail/${r.id}`);
                        }}
                      >
                        <TagLabel w="100%">รายละเอียดการแก้ไข</TagLabel>
                      </Tag>
                    </Td>
                  )}
                </Tr>
              );
            })}
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
};

export default PreviewComp;
