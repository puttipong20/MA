/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useContext, useState } from "react";
import {
  Project,
  ProjectDetail,
  Report,
  ReportDetail,
} from "../../@types/Type";
import { Box, Spinner, Tag, TagLabel, Td, Tr } from "@chakra-ui/react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { CompanyContext } from "../../context/CompanyContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../services/config-db";

interface Props {
  report: Report;
}

const ReportCard: React.FC<Props> = (props) => {
  const [isNav, setIsNav] = useState(false);
  const navigate = useNavigate();
  const CompanyCtx = useContext(CompanyContext);
  const wait = "รอรับเรื่อง";
  const process = "กำลังดำเนินการ";
  const done = "เสร็จสิ้น";

  const navToReportPage = async () => {
    // console.log(props.report.docs.ref);
    const ref = props.report.docs.ref!;
    setIsNav(true);
    const reportCol = collection(db, "Report");
    const qReport = query(
      reportCol,
      where("ref", "==", ref.toUpperCase().trim())
    );
    let cmpId;
    let cmpName;
    let prjId;
    let prjName;
    await getDocs(qReport).then(async (found) => {
      if (found.size !== 0) {
        const reportDetail: ReportDetail = found.docs[0].data() as ReportDetail;
        const projectCol = collection(db, "Project");
        const qProject = query(
          projectCol,
          where("firebaseId", "==", reportDetail.firebaseId)
        );
        const projectFound = (await getDocs(qProject)).docs[0];
        const projectDetail: Project = {
          projectId: projectFound.id,
          detail: projectFound.data() as ProjectDetail,
        };
        cmpId = projectDetail.detail.companyID;
        cmpName = projectDetail.detail.companyName;
        prjId = projectDetail.projectId;
        prjName = projectDetail.detail.projectName;
        CompanyCtx.setFirebaseId(projectDetail.detail.firebaseId);
        CompanyCtx.setCompany(cmpId, cmpName);
        CompanyCtx.setProject(prjId, prjName);
      }
    });
    // console.log(`/company/${cmpId}/${prjId}/${prjName}/${props.report.id}`);
    navigate(`/company/${cmpId}/${prjId}/${prjName}/${props.report.id}`);

    setIsNav(false);
  };

  return (
    <Tr _hover={{ bg: "#ddd" }} cursor={"pointer"} onClick={navToReportPage}>
      {!isNav ? (
        <>
          <Td>{props.report.docs.companyName}</Td>
          <Td>{props.report.docs.projectName}</Td>
          <Td>{props.report.docs.ref}</Td>
          <Td>{props.report.docs.title}</Td>
          <Td>{props.report.docs.name}</Td>
          <Td>
            {moment(props.report.docs.createAt).format("DD/MM/YYYY HH:mm:ss")}
          </Td>
          <Td>
            <Tag
              w="100%"
              ml="0.25rem"
              bg={
                props.report.docs.RepStatus === wait
                  ? "yellow.300"
                  : props.report.docs.RepStatus === done
                  ? "green.600"
                  : props.report.docs.RepStatus === process
                  ? "gray.400"
                  : "red.300"
              }
              color={props.report.docs.RepStatus === wait ? "black" : "white"}
            >
              <TagLabel w="100%" textAlign={"center"}>
                {props.report.docs.RepStatus}
              </TagLabel>
            </Tag>
          </Td>
        </>
      ) : (
        <Td colSpan={7}>
          <Box w="fit-content" m="auto">
            <Spinner />
          </Box>
        </Td>
      )}
    </Tr>
  );
};

export default ReportCard;
