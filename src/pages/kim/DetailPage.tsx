import { useState, useEffect } from "react";
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Text, Button, Spinner, Divider, Table, Thead, Tr } from "@chakra-ui/react"
import { BiArrowBack } from 'react-icons/bi';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/config-db';
import { ProjectDetail } from "../../@types/Type";
import { AiOutlineEdit } from "react-icons/ai"

export default function DetailPage() {
  const params = useParams()
  const navigate = useNavigate();
  const backPath = `/company/${params["company"]}`
  const [isFetching, setIsfetching] = useState(false);
  const [projectDetail, setProjectDetail] = useState<ProjectDetail>();

  const fetchingProjectDetail = async () => {
    setIsfetching(true)
    console.clear();
    const projectID = params["projectID"] as string;
    const project = await getDoc(doc(db, "Project", projectID))
    setProjectDetail(project.data() as ProjectDetail);
    setIsfetching(false)
  }

  useEffect(() => {
    fetchingProjectDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isFetching) {
    return (
      <Box>
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
            <Text as="span" h="fit-content" my="auto" color={"gray"} cursor={"pointer"} _hover={{ color: "black" }}>
              <AiOutlineEdit />
            </Text>
          </Text>
          <Text fontWeight={"bold"} w="fit-content">
            ถูกสร้างเมื่อ : <Text as="span" fontWeight={"normal"}>{projectDetail?.createdAt}</Text>
          </Text>
          <Text fontWeight={"bold"} w="fit-content">
            เริ่มต้นสัญญาMA : <Text as="span" fontWeight={"normal"}>{projectDetail?.LastestMA.startMA}</Text>
          </Text>
          <Text fontWeight={"bold"} w="fit-content">
            สิ้นสุดสัญญาMA : <Text as="span" fontWeight={"normal"}>{projectDetail?.LastestMA.endMA}</Text>
          </Text>
          <Text fontWeight={"bold"} w="fit-content">
            ค่าบริการ : <Text as="span" fontWeight={"normal"}>{projectDetail?.LastestMA.cost}</Text>
          </Text>
        </Box>
        <Divider />
        <Box>
          <Text fontWeight={"bold"} w="fit-content">
            ประวัติการทำสัญญา
          </Text>
          <Table>
            <Thead>
              <Tr></Tr>
            </Thead>
          </Table>
        </Box>
      </Box>
    )
  }
}
