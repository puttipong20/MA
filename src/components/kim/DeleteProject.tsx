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
import { useState, useContext } from "react";
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../services/config-db';
import { CompanyDetail } from '../../@types/Type';
import moment from 'moment';
import { AuthContext } from '../../context/AuthContext';

interface Props {
    companyId: string,
    projectId: string
}

const DeleteProject: React.FC<Props> = (props) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [deleting, isDeleting] = useState(false);
    const toast = useToast();
    const AuthCtx = useContext(AuthContext)

    const deleteProcess = async () => {
        // console.clear();
        isDeleting(true);
        const companyRef = doc(db, "Company", props.companyId)
        const projectRef = doc(db, "Project", props.projectId)

        const company = await getDoc(companyRef)
        const companyDetail = company.data() as CompanyDetail;
        // const filterProject = companyDetail.projects?.filter(i => i.id !== props.projectId)
        const filterProject: { projectName: string; id: string; status: "enable" | "disable" }[] | undefined = companyDetail.projects?.map(i => {
            if (i.id === props.projectId) {
                return { ...i, status: "disable" }
            } else {
                return i
            }
        })
        // console.log(filterProject);
        const updateCompany: CompanyDetail = {
            ...companyDetail,
            projects: filterProject
        }
        // console.log(updateCompany)
        await updateDoc(companyRef, updateCompany)
        await updateDoc(projectRef, { status: "disable", latestUpdate: { timestamp: moment().format("YYYY-MM-DD HH:mm:ss"), uid: AuthCtx.uid, username: AuthCtx.username } });
        toast({
            title: 'ลบโปรเจคต์เสร็จสิ้น',
            status: 'error',
            duration: 3000,
            isClosable: true,
            position: "top",
        })
        onClose();
        // console.log(props)
        isDeleting(false);
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
                        <Text>ยืนยันการลบหรือไม่?</Text>
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
