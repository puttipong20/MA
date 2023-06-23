import {
    Box,
    Text,
    Table,
    Thead,
    Tbody,
    Tr,
    Td,
    Th,
    Spinner,
} from "@chakra-ui/react";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../services/config-db";

import { useEffect, useState } from "react";

import { Company, CompanyDetail } from "../../@types/Type";

import { useNavigate } from "react-router-dom";

export default function TempCompPreview() {
    const [companies, setCompanies] = useState<Company[]>([])
    const [isFetching, setIsFetching] = useState(false)
    const navigate = useNavigate()

    const fetchData = async () => {
        setIsFetching(false);
        const companyRef = collection(db, "Company");
        const allCompany = await getDocs(companyRef)
        const all: Company[] = [];
        allCompany.forEach((c) => {
            const comp: Company = {
                companyId: c.id,
                detail: c.data() as CompanyDetail
            }
            all.push(comp);
        })
        setCompanies(all);
        setIsFetching(false);
    }

    useEffect(() => {
        fetchData();
    }, [])

    if (isFetching) {
        <Box>
            <Spinner />
        </Box>
    } else {
        return (
            <Box>
                <Text>Temp Comp Preview</Text>
                <Table w="100%">
                    <Thead>
                        <Tr>
                            <Th textAlign={"center"}>ชื่อบริษัท</Th>
                            <Th textAlign={"center"}>ชื่อผู้ติดต่อ</Th>
                            <Th textAlign={"center"}>เบอร์โทรติดต่อ</Th>
                            <Th textAlign={"center"}>การจัดการ</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {
                            companies.map((i, index) => {
                                return (
                                    <Tr key={index} onClick={() => { navigate(`/company/${i.companyId}`)}} _hover={{bg:"#ddd"}}>
                                        <Td textAlign={"center"}>{i.detail.companyName}</Td>
                                        <Td textAlign={"center"}>{i.detail.contactName}</Td>
                                        <Td textAlign={"center"}>{i.detail.contactPhone}</Td>
                                        <Td textAlign={"center"}>- - -</Td>
                                    </Tr>
                                )
                            })
                        }
                    </Tbody>
                </Table>
            </Box>
        )
    }
}
