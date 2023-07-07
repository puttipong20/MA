import {
    useQuery,
} from 'react-query'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from '../services/config-db'
import { Box, Button, Card, CardBody, CardHeader, Heading, Text } from '@chakra-ui/react'
import { useNavigate, useParams } from 'react-router-dom'
import { Project, ProjectDetail } from '../@types/Type'
import { useEffect, useState } from 'react'

function QueryProject() {
    const params = useParams();
    const navigate = useNavigate()
    const [projects, setProjects] = useState<Project[]>([]);

    const fetchCompany = async () => {
        const projectRef = collection(db, "Project")
        const q = query(projectRef, where("companyID", "==", params["compId"] as string))
        const allProjects = await getDocs(q);
        return allProjects
    }

    const { data, isLoading, isFetching, refetch } = useQuery({ queryKey: ["project-company"], queryFn: fetchCompany, refetchOnWindowFocus: false })

    const clickToRefetch = () => {
        refetch();
    }

    useEffect(() => {
        const allProjects: Project[] = []
        data?.forEach(d => allProjects.push({ projectId: d.id, detail: d.data() as ProjectDetail }))
        setProjects(allProjects)
    }, [data])

    return (
        <Box>
            <Text>Test React</Text>

            {isLoading || isLoading ?
                <Box>Loading </Box>
                :
                <Box>
                    {
                        projects.map((p, index) => {
                            return (
                                <Card key={index} border="1px solid black">
                                    <CardHeader>
                                        <Heading>{p.detail.projectName}</Heading>
                                    </CardHeader>
                                    <CardBody>
                                        <Text>{p.projectId}</Text>
                                        <Text>{p.detail.companyID}</Text>
                                        <Text>{p.detail.companyName}</Text>
                                        <Text>{p.detail.createdAt}</Text>
                                        <Text>{p.detail.createdBy?.username}</Text>
                                        <Text>{p.detail.createdBy?.uid}</Text>
                                    </CardBody>
                                </Card>
                            )
                        })
                    }
                    <Button onClick={() => { navigate(-1) }}>Go Back</Button>
                    <Button onClick={clickToRefetch}>Reload</Button>
                </Box>
            }
            {
                (!isLoading && isFetching) && <Box>New loading</Box>
            }
        </Box>
    )
}

export default QueryProject;

