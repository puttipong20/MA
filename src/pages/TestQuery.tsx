import {
    useQuery,
} from 'react-query'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../services/config-db'
import { Box, Button, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'

function TestQuery() {
    const navigate = useNavigate();

    const fetchCompany = async () => {
        const CompanyRef = collection(db, "Company")
        const Companies = await getDocs(CompanyRef);
        // console.log("loading!")
        return Companies
    }

    const { data, isLoading, isFetching, refetch } = useQuery({ queryKey: ["company`"], queryFn: fetchCompany, refetchOnWindowFocus: false })

    const clickToRefetch = () => {
        refetch();
    }

    return (
        <Box>
            <Text>Test React</Text>

            {isLoading ?
                <Box>Loading </Box>
                :
                <Box>
                    {
                        data?.docs.map((d, index) => {
                            return (
                                <Box key={index} fontSize={"0.75rem"} display="flex" my="1rem" alignItems={"center"} border="1px solid black" w="fit-content">
                                    <Text w="12rem">{index + 1}) {d.id} : {d.data().companyName}</Text>
                                    <Button onClick={() => { navigate(`/projectq/${d.id}`) }} colorScheme={index % 3 === 1 ? "blue" : index % 3 == 2 ? "green" : "red"}>to project</Button>
                                </Box>
                            )
                        })
                    }
                    <Button onClick={clickToRefetch}>Reload</Button>
                </Box>
            }
            {
                (!isLoading && isFetching) && <Box>New loading</Box>
            }

        </Box>
    )
}

export default TestQuery;

