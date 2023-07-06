import {
    Box,
    Text,
    Button,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    useToast,
} from '@chakra-ui/react'
import { RiDeleteBin7Line } from 'react-icons/ri'
import { useState } from "react";
import { deleteDoc, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/config-db';
import { CompanyDetail } from '../../@types/Type';

interface Props {
    companyId: string,
    projectId: string
}

const DeleteProject: React.FC<Props> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [deleting, isDeleting] = useState(false);
    const toast = useToast();

    const deleteProcess = async () => {
        // console.clear();
        isDeleting(true);
        const companyRef = doc(db, "Company", props.companyId)
        const projectRef = doc(db, "Project", props.projectId)

        const company = await getDoc(companyRef)
        const companyDetail = company.data() as CompanyDetail;
        const filterProject = companyDetail.projects?.filter(i => i.id !== props.projectId)
        const updateCompany: CompanyDetail = {
            ...companyDetail,
            projects: filterProject
        }
        // console.log(updateCompany)
        await updateDoc(companyRef, updateCompany)
        await deleteDoc(projectRef)
        isDeleting(false);
        toast({
            title: 'ลบโปรเจคต์เสร็จสิ้น',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: "top",
        })
        onClose();
        // console.log(props)
    }

    return (
        <Box w="100%">
            <Text onClick={onOpen} display={"flex"}>
                <Text as="span" w="20%" textAlign={"center"} display="flex" justifyContent={"center"}><RiDeleteBin7Line /></Text>ลบ Project
            </Text>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>ยืนยันการลบ Project ?</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Text>
                            การกระทำต่อไปนี้ไม่สามารถย้อนกลับได้ หากลบ Project แล้วข้อมูลจะหายไปอย่างถาวร
                            ไม่สามารถกู้คืนใหม่ได้ ต้องเพิ่มข้อมูล Project ใหม่เมื่อต้องการใช้งาน ยืนยันการลบหรือไม่?
                        </Text>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr="5" colorScheme='gray' onClick={onClose}>ยกเลิก</Button>
                        <Button colorScheme='red' onClick={deleteProcess} isLoading={deleting}>ยืนยัน</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </Box>
    )
}

export default DeleteProject;
