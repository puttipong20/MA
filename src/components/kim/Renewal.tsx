/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Box,
    Button,
    Flex,
    Text,
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
import { useState } from "react";
import moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
// import { useState } from "react";
// import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
// import { db } from '../../services/config-db';
// import { CompanyDetail } from '../../@types/Type';

import { TiDocumentText } from 'react-icons/ti';
import { MA } from '../../@types/Type';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/config-db';

interface Props {
    companyId?: string,
    projectId: string,
    activeMA?: MA,
    MAlog: MA[] | undefined,
}

const Renewal: React.FC<Props> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { handleSubmit, control, reset } = useForm();
    const [isUpdate, setIsUpdate] = useState(false)
    const toast = useToast();
    const logs = props.MAlog

    const onSubmit = async (data: any) => {
        setIsUpdate(true);
        const renewStart = data.renewStart;
        const renewEnd = data.renewEnd;
        const newContract: MA = {
            startMA: renewStart,
            endMA: renewEnd,
            cost: data.renewCost,
            status: "advance",
        }
        logs?.push(newContract)
        console.log(newContract);
        console.log(props.MAlog)

        await updateDoc(doc(db, "Project", props.projectId), { MAlogs: logs })

        toast({
            title: 'เพิ่มโปรเจคสำเร็จ.',
            status: 'success',
            duration: 3000,
            isClosable: true,
            position: "top",
        })
        reset();
        setIsUpdate(false);
    }

    return (
        <Box w="100%">
            {/* <Text display={"flex"}>
                <Text as="span" w="20%" textAlign={"center"} display="flex" justifyContent={"center"}><TiDocumentText /></Text>
                <Text as="span">การต่อสัญญา</Text>
            </Text> */}
            <Button onClick={onOpen} leftIcon={<TiDocumentText />} colorScheme='blue'>การต่อสัญญา</Button>
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
                                        <FormControl isRequired>
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
                                        <FormControl isRequired>
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
                                        <FormControl isRequired>
                                            <Text>ค่าบริการ</Text>
                                            <Input type="number" min="0" placeholder='0.00' {...field} />
                                        </FormControl>
                                    )}
                                />
                                <Flex justify={"flex-end"} gap="20px" mt="10px">
                                    <Button colorScheme='gray' onClick={onClose}>ยกเลิก</Button>
                                    <Button colorScheme='green' type="submit" isLoading={isUpdate}>ยืนยัน</Button>
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