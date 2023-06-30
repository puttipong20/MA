/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react'
import {
    Box,
    FormControl,
    Input,
    Button,
    Flex,
    Spinner,
    Text,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/config-db';
import { ProjectDetail } from '../../@types/Type';

interface Props {
    projectId: string,
    onClose: () => void
}

const EditForm: React.FC<Props> = (props) => {
    const { handleSubmit, control } = useForm();
    const [isFetching, setIsFetching] = useState(false);
    const [pDetail, setPDetail] = useState<ProjectDetail>()

    const onSubmit = (data: any) => {
        console.log(data);
        props.onClose()
    }

    const fetchProjectDetail = async () => {
        // console.clear();
        setIsFetching(true)
        const docRef = doc(db, "Project", props.projectId)
        const docDetail = await getDoc(docRef)
        const detail = docDetail.data() as ProjectDetail
        console.log(detail)
        setPDetail(detail)
        setIsFetching(false)
    }

    useEffect(() => {
        fetchProjectDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Box>
            {
                isFetching ?
                    <Box>
                        <Spinner />
                    </Box> :
                    <Box>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="projectName"
                                control={control}
                                defaultValue={pDetail?.projectName}
                                render={({ field }) => (
                                    <FormControl isRequired>
                                        <Text>Project Name</Text>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                )}
                            />
                            <Flex justify={"flex-end"} gap={"20px"} mt="20px">
                                <Button onClick={props.onClose}>ปิด</Button>
                                <Button type="submit" colorScheme='green'>บันทึก</Button>
                            </Flex>
                        </form>
                    </Box>

            }
        </Box>
    )
}

export default EditForm;
