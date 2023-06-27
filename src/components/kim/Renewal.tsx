/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Box,
    Flex,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useToast,
    FormControl,
    Input,
} from '@chakra-ui/react'
import moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
// import { useState } from "react";
// import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db } from '../../services/config-db';
// import { CompanyDetail } from '../../@types/Type';

import { TiDocumentText } from 'react-icons/ti';

interface Props {
    companyId?: string,
    projectId?: string
}

const Renewal: React.FC<Props> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { handleSubmit, control } = useForm();
    const toast = useToast();
    const onSubmit = (data: any) => {
        console.log(data);
        console.log(props)
        toast({
            title: 'เพิ่มโปรเจคสำเร็จ.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: "top",
        })
    }

    return (
        <Box w="100%">
            <Text onClick={onOpen} display={"flex"}>
                <Text as="span" w="20%" textAlign={"center"} display="flex" justifyContent={"center"}><TiDocumentText /></Text>การต่อสัญญา
            </Text>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>ต่อสัญญา</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                <Controller
                                    name="renewStart"
                                    control={control}
                                    defaultValue={moment().format("YYYY-MM-DD")}
                                    render={({ field }) => (
                                        <FormControl>
                                            <Text>วันเริ่มต้นสัญญาใหม่</Text>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    name="renewEnd"
                                    control={control}
                                    defaultValue={moment().add(1, "year").format("YYYY-MM-DD")}
                                    render={({ field }) => (
                                        <FormControl>
                                            <Text>วันสิ้นสุดสัญญาใหม่</Text>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    name="renewCost"
                                    control={control}
                                    defaultValue={""}
                                    render={({ field }) => (
                                        <FormControl>
                                            <Text>ค่าบริการ</Text>
                                            <Input type="number" min="0" placeholder='0.00' {...field} />
                                        </FormControl>
                                    )}
                                />
                                <Flex justify={"flex-end"} gap="20px" mt="10px">
                                    <Button colorScheme='gray' onClick={onClose}>ยกเลิก</Button>
                                    <Button colorScheme='green' type="submit">ยืนยัน</Button>
                                </Flex>
                            </form>
                        </Box>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default Renewal