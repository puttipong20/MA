import { doc, onSnapshot } from "firebase/firestore";
import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../../services/config-db";
import {
  Button,
  Modal,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Text,
  ModalCloseButton,
  ModalBody,
  VStack,
  HStack,
  ModalContent,
} from "@chakra-ui/react";
import { MdOutlineHomeWork } from "react-icons/md";

type Cvalue = {
  companyName: string;
  companyAddress: string;
  username: string;
  userPhone: string;
  userTax: string;
  userPerson: string;
  createAt: string;
  id: string;
};

const ViewCompany:React.FC = () => {
  const [Company, setCompany] = useState<Cvalue[]>([]);
  const { id } = useParams<any>();
  const { isOpen, onOpen, onClose } = useDisclosure();
  
  const fetchData = useCallback(async () => {
    const CompanyDoc = doc(db, "MACompany", id as string);
    onSnapshot(CompanyDoc, (snapshot) => {
      return setCompany({
        id: snapshot.id,
        ...snapshot.data(),
      });
    });
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div>
      <Button onClick={onOpen} leftIcon={<MdOutlineHomeWork/>}>
        ดูข้อมูลบริษัท
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>
              ข้อมูลบริษัท
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <HStack>
                <Text>test 1</Text>
                <Text>t 1</Text>
              </HStack>
              <HStack>
                <Text>test 2</Text>
                <Text>t 2</Text>
              </HStack>
              <HStack>
                <Text>test 3</Text>
                <Text>t 3</Text>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>

    </div>
  )
  // const [cValue, setCValue] = useState<Cvalue>();
  // const { id } = useParams();
  // const { isOpen, onOpen, onClose } = useDisclosure();

  // async function fetchData() {
  //   onSnapshot(doc(db, "CompanyAdd", id as string), (doc) => {
  //     const data: Cvalue = {
  //       companyName: doc.data()?.companyName,
  //       companyAddress: doc.data()?.companyAddress,
  //       username: doc.data()?.username,
  //       userPhone: doc.data()?.userPhone,
  //       userTax: doc.data()?.userTax,
  //       userPerson: doc.data()?.userPerson,
  //       createAt: doc.data()?.createAt,
  //     };
  //     setCValue(data);
  //   });
  // }
  // useEffect(() => {
  //   fetchData();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  // return (
  //   <div>
  //     <Button
  //       colorScheme="#FFFFFF"
  //       onClick={onOpen}
  //       color={"#666666"}
  //       w={"100%"}
  //       justifyContent={"flex-start"}
  //       fontSize={"16px"}
  //       fontWeight={"400"}
  //       px={"1rem"}
  //       leftIcon={<MdOutlineHomeWork />}
  //       fontFamily={"Prompt"}
  //       mr={"1rem"}
  //     >
  //       ดูข้อมูลบริษัท
  //     </Button>

  //     <Modal isOpen={isOpen} onClose={onClose}>
  //       <ModalOverlay />
  //       <ModalHeader>
  //         <Text textAlign="center">ข้อมูลบริษัท</Text>
  //       </ModalHeader>
  //       <ModalCloseButton />
  //       <ModalBody>
  //         <VStack>
  //           <HStack>
  //             <Text>ชื่อบริษัท :</Text>
  //             <Text>{cValue?.companyName}</Text>
  //           </HStack>
  //           <HStack>
  //             <Text>ที่อยู่บริษัท :</Text>
  //             <Text>{cValue?.companyAddress}</Text>
  //           </HStack>
  //           <HStack>
  //             <Text>ชื่อผู้ติดต่อ :</Text>
  //             <Text>{cValue?.username}</Text>
  //           </HStack>
  //           <HStack>
  //             <Text>เบอร์โทรติดต่อ :</Text>
  //             <Text>{cValue?.userPhone}</Text>
  //           </HStack>
  //           <HStack>
  //             <Text>เลขประจำตัวผู้เสียภาษี :</Text>
  //             <Text>{cValue?.userTax}</Text>
  //           </HStack>
  //           <HStack>
  //             <Text>ประเภทบุคคล :</Text>
  //             <Text>{cValue?.userPerson}</Text>
  //           </HStack>
  //           <br />
  //           <HStack>
  //             <Text>สร้างเมื่อ :</Text>
  //             <Text>{cValue?.createAt}</Text>
  //           </HStack>
  //           <HStack>
  //             <Text>อัพเดทเมื่อ :</Text>
  //             <Text></Text>
  //           </HStack>
  //         </VStack>
  //       </ModalBody>
  //     </Modal>
  //   </div>
  // );
}

export default ViewCompany;
