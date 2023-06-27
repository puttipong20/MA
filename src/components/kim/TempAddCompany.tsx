/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Box,
    Button,
    FormControl,
    HStack,
    Textarea,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalOverlay,
    Select,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";

import { addDoc, collection } from "firebase/firestore";
import { db } from "../../services/config-db";

import { CompanyDetail } from "../../@types/Type";
import moment from "moment";
import { useContext, useState } from "react"
import { AuthContext } from "../../Context/AuthContext";

export default function TempAddCompany() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { handleSubmit, control, reset } = useForm()
    const [isAdding, setIsAdding] = useState(false)
    const Auth = useContext(AuthContext);


    const onSubmit = async (data: any) => {
        setIsAdding(true);
        // console.clear();
        const compDetail: CompanyDetail = {
            companyName: data.companyName,
            createdAt: moment().format("DD/MM/YYYY HH:MM:ss"),
            createdBy: Auth.uid,
            compAddress: data.companyAddress,
            contactName: data.contactName,
            contactPhone: data.contactPhone,
            taxNumber: data.taxNumber,
            type: data.type
        }
        // const docRef = await addDoc(collection(db, "Company"), compDetail)
        await addDoc(collection(db, "Company"), compDetail)
        // console.log(docRef.id, "has been added!")
        setIsAdding(false);

        // console.log(compDetail);
        onClose();
        reset();
    }

    return (
        <Box>
            <Button colorScheme='green' onClick={onOpen}>เพิ่ม บริษัท/ลูกค้า</Button>
            <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalBody p="2rem">
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="companyName"
                                control={control}
                                defaultValue={""}
                                render={({ field }) => (
                                    <FormControl isRequired mb="1rem">
                                        <Text>ชื่อบริษัท</Text>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="companyAddress"
                                control={control}
                                defaultValue={""}
                                render={({ field }) => (
                                    <FormControl isRequired mb="1rem">
                                        <Text>ที่อยู่บริษัท</Text>
                                        <Textarea {...field} resize={"none"} />
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="contactName"
                                control={control}
                                defaultValue={""}
                                render={({ field }) => (
                                    <FormControl isRequired mb="1rem">
                                        <Text>ชื่อผู้ติดต่อ</Text>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="contactPhone"
                                control={control}
                                defaultValue={""}
                                render={({ field }) => (
                                    <FormControl isRequired mb="1rem">
                                        <Text>เบอร์โทรผู้ติดต่อ</Text>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="taxNumber"
                                control={control}
                                defaultValue={""}
                                render={({ field }) => (
                                    <FormControl isRequired mb="1rem">
                                        <Text>เลขประจำตัวผู้เสียภาษี</Text>
                                        <Input type="text" {...field} />
                                    </FormControl>
                                )}
                            />
                            <Controller
                                name="type"
                                control={control}
                                defaultValue={""}
                                render={({ field }) => (
                                    <FormControl isRequired mb="1rem">
                                        <Text>ประเภท</Text>
                                        <Select {...field} placeholder="เลือกประเภท">
                                            <option value="normal">บุคคลธรรมดา</option>
                                            <option value="corp">นิติบุคคล</option>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                            <HStack justify={"space-around"}>
                                <Button>ปิด</Button>
                                <Button colorScheme="blue" type="submit" isLoading={isAdding}>เพิ่ม</Button>
                            </HStack>
                        </form>
                    </ModalBody>
                </ModalContent>
            </Modal>
        </Box>
    )
}
