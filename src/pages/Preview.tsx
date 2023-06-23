import { useEffect, useState, useContext } from "react";
import {
  Box,
  Flex,
  HStack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import Sidebar from "../Components/Sidebar";

import "./Preview.css";
import PreviewComp from "../Components/PreviewComp";

import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import { Report } from "../@types/Type";

import { LayoutContext } from "../Context/LayoutContext";
import { AuthContext } from "../Context/AuthContext";

function Preview() {
  const Layout = useContext(LayoutContext);
  const Auth = useContext(AuthContext);

  const navigate = useNavigate();
  const [isFetching, setIsFetching] = useState(true);
  const [accountRole, setAccountRole] = useState("");
  const [clientType, setClientType] = useState("");
  const { id } = useParams();

  const [allReports, setAllReports] = useState<Report[]>([]);

  const [currentUid, setUid] = useState("")

  useEffect(() => {
    if (Auth.uid) {
      const uid = Auth.uid;
      setUid(uid)

      const userDetail = Auth.detail as { role: string, company: string }
      const role = userDetail.role;

      let client = "";
      if (role === "client") client = userDetail.company

      if (id !== client && role === "client") {
        navigate(`/preview/${client}`)
      }

      setClientType(client)
      setAccountRole(role);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchReport = async () => {
    setIsFetching(true);
    await axios
      .get(
        "https://asia-southeast1-crafting-ticket-dev.cloudfunctions.net/getReport_v2"
      )
      .then((res) => {
        // console.log(res.data)
        setAllReports(res.data as Report[]);
      });
    setIsFetching(false);
  };

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <Box h="100vh" overflow={"hidden"}>
      <HStack alignItems={"flex-start"} maxW={"100%"} h="100%">
        {Layout.toggle && (
          <Box
            boxShadow={"5px 5px 30px rgb(0,0,0,0.1)"}
            px="1rem"
            h="100vh"
          >
            <Sidebar id={id || "gogreen"} client={clientType} />
          </Box>
        )}
        <Box w="100%" p="1rem" h="100%" overflow="auto">
          {isFetching ? (
            <Flex
              w="100vw"
              h="100vh"
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Text>Loading . . .</Text>
              <Spinner />
            </Flex>
          ) : (
            <PreviewComp
              role={accountRole}
              type={id || "gogreen"}
              data={allReports}
              uid={currentUid}
              toAddpath={`/Add/${id||"gogreen"}`}
            />
          )}
        </Box>
      </HStack>
    </Box>
  );

}

export default Preview;
