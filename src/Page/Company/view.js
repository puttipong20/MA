import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { doc, onSnapshot } from 'firebase/firestore'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { MdOutlineHomeWork } from 'react-icons/md'

import { db } from '../../Config'

function ViweCompany({ id }) {
  const [Company, setCompany] = useState([])
  const fetchData = useCallback(async () => {
    const CompanyDoc = doc(db, 'MACompany', id)
    onSnapshot(CompanyDoc, snapshot => {
      return setCompany({
        id: snapshot.id,
        ...snapshot.data(),
      })
    })
  }, [id])
  const { isOpen, onOpen, onClose } = useDisclosure()

  useEffect(() => {
    fetchData()
  }, [fetchData])
  return (
    <>
      <Button
        colorScheme='#FFFFFF'
        onClick={onOpen}
        color={'#666666'}
        w={'100%'}
        justifyContent={'flex-start'}
        fontSize={'16px'}
        fontWeight={'400'}
        px={'1rem'}
        leftIcon={<MdOutlineHomeWork />}
        fontFamily={'Prompt'}
        mr={'1rem'}
      >
        ดูข้อมูลลูกค้า
      </Button>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent py={'2rem'}>
          <ModalHeader>
            <Text
              fontWeight={'600'}
              w={'100%'}
              textAlign={'center'}
              color={'#000000'}
              fontSize={'16px'}
              fontFamily={'Prompt'}
            >
              {' '}
              ข้อมูลลูกค้า{' '}
            </Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack
              w={'100%'}
              justifyContent={'center'}
              backgroundColor={'white'}
            >
              <VStack
                w={'100%'}
                alignItems={'flex-start'}
                borderColor={'gray.200'}
              >
                <HStack alignItems={'flex-start'} w={'100%'}>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#1DA1F2'}
                  >
                    ชื่อบริษัท :
                  </Text>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={'start'}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#767262'}
                  >
                    {' '}
                    {Company?.nameCompany}
                  </Text>
                </HStack>
                <HStack alignItems={'flex-start'} w={'100%'}>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#1DA1F2'}
                  >
                    ที่อยู่บริษัท :
                  </Text>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={'start'}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#767262'}
                  >
                    {' '}
                    {Company?.addCompany}
                  </Text>
                </HStack>
                <HStack alignItems={'flex-start'} w={'100%'}>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#1DA1F2'}
                  >
                    ชื่อผู้ติดต่อ :
                  </Text>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={'start'}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#767262'}
                  >
                    {' '}
                    {Company?.name}
                  </Text>
                </HStack>
                <HStack alignItems={'flex-start'} w={'100%'}>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#1DA1F2'}
                  >
                    เบอร์โทรติดต่อ :
                  </Text>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={'start'}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#767262'}
                  >
                    {' '}
                    {Company?.phone}
                  </Text>
                </HStack>
                <HStack alignItems={'flex-start'} w={'100%'}>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#1DA1F2'}
                  >
                    เลขประจำตัวผู้เสียภาษี :
                  </Text>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={'start'}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#767262'}
                  >
                    {' '}
                    {Company?.taxNumber}
                  </Text>
                </HStack>
                <HStack alignItems={'flex-start'} w={'100%'}>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#1DA1F2'}
                  >
                    ประเภทบุคคล :
                  </Text>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={'start'}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#767262'}
                  >
                    {' '}
                    {Company?.group}
                  </Text>
                </HStack>
                <HStack
                  alignItems={'flex-start'}
                  h={'full'}
                  pt={'2rem'}
                  w={'100%'}
                >
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    fontSize={'16px'}
                    w={'450px'}
                    color={'#1DA1F2'}
                  >
                    สร้างเมื่อ :
                  </Text>
                  <VStack alignItems={'flex-start'} w={'100%'}>
                    {/* <Text
                      fontWeight={'400'}
                      fontFamily={'Prompt'}
                      textAlign={'start'}
                      fontSize={'16px'}
                      w={'100%'}
                      color={'#767262'}
                    >
                      {' '}
                      {Company?.createdBy?.name}
                    </Text> */}
                    <Text
                      fontWeight={'400'}
                      fontFamily={'Prompt'}
                      textAlign={'start'}
                      fontSize={'16px'}
                      w={'100%'}
                      color={'#767262'}
                    >
                      {' '}
                      {moment(Company?.createdAt?.toDate()).format(
                        'DD-MM-YYYY HH:mm:ss'
                      )}
                    </Text>
                  </VStack>
                </HStack>
                {Company?.updatedBy && (
                  <HStack w={'100%'} alignItems={'flex-start'}>
                    <Text
                      fontWeight={'400'}
                      fontFamily={'Prompt'}
                      textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                      fontSize={'16px'}
                      w={'450px'}
                      color={'#1DA1F2'}
                    >
                      อัพเดทเมื่อ :
                    </Text>
                    <VStack alignItems={'flex-start'} w={'100%'}>
                      {/* <Text
                        fontWeight={'400'}
                        fontFamily={'Prompt'}
                        textAlign={'start'}
                        fontSize={'16px'}
                        w={'100%'}
                        color={'#767262'}
                      >
                        {' '}
                        {Company?.updatedBy?.name}
                      </Text> */}
                      <Text
                        fontWeight={'400'}
                        fontFamily={'Prompt'}
                        textAlign={'start'}
                        fontSize={'16px'}
                        w={'100%'}
                        color={'#767262'}
                      >
                        {moment(Company?.updatedAt?.toDate()).format(
                          'DD-MM-YYYY HH:mm:ss'
                        )}
                      </Text>
                    </VStack>
                  </HStack>
                )}
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
    // <Box minH={'100vh'} h={'full'} backgroundColor={'#FFFFFF'}>
    //     {!isLoading && Company ? (
    //         <>
    // <VStack w={'100%'} justifyContent={'center'} backgroundColor={'white'}>

    //     <HStack w={'80%'} justifyContent={'flex-start'} mb={'-0.5rem'} alignItems={'start'}>

    // <Text fontWeight={'600'} w={'100%'} textAlign={'start'} color={'#1DA1F2'} fontSize={'16px'} fontFamily={'Prompt'}> ข้อมูลลูกค้า </Text>

    //     </HStack>
    //     <VStack w={'80%'} alignItems={'flex-start'} p={'2rem'} spacing={'1rem'} border={'1px'} borderRadius={'16px'} borderColor={'gray.200'}>
    //         <SimpleGrid columns={[1, 2]} alignItems={'flex-start'} w={'100%'}>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={{ base: 'start', sm: 'start', md: 'end' }} fontSize={'16px'} w={'100%'} color={'#1DA1F2'}>ชื่อบริษัท :</Text>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={'start'} fontSize={'16px'} w={'100%'} color={'#767262'}> {Company?.NameCompany}</Text>
    //         </SimpleGrid>
    //         <SimpleGrid columns={[1, 2]} alignItems={'flex-start'} w={'100%'}>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={{ base: 'start', sm: 'start', md: 'end' }} fontSize={'16px'} w={'100%'} color={'#1DA1F2'}>ที่อยู่บริษัท :</Text>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={'start'} fontSize={'16px'} w={'100%'} color={'#767262'}> {Company?.AddCompany}</Text>
    //         </SimpleGrid>
    //         <SimpleGrid columns={[1, 2]} alignItems={'flex-start'} w={'100%'}>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={{ base: 'start', sm: 'start', md: 'end' }} fontSize={'16px'} w={'100%'} color={'#1DA1F2'}>ชื่อผู้ติดต่อ :</Text>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={'start'} fontSize={'16px'} w={'100%'} color={'#767262'}> {Company?.Name}</Text>
    //         </SimpleGrid>
    //         <SimpleGrid columns={[1, 2]} alignItems={'flex-start'} w={'100%'}>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={{ base: 'start', sm: 'start', md: 'end' }} fontSize={'16px'} w={'100%'} color={'#1DA1F2'}>เบอร์โทรติดต่อ :</Text>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={'start'} fontSize={'16px'} w={'100%'} color={'#767262'}> {Company?.Phone}</Text>
    //         </SimpleGrid>
    //         <SimpleGrid columns={[1, 2]} alignItems={'flex-start'} w={'100%'}>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={{ base: 'start', sm: 'start', md: 'end' }} fontSize={'16px'} w={'100%'} color={'#1DA1F2'}>เลขประจำตัวผู้เสียภาษี :</Text>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={'start'} fontSize={'16px'} w={'100%'} color={'#767262'}> {Company?.TaxNumber}</Text>
    //         </SimpleGrid>
    //         <SimpleGrid columns={[1, 2]} alignItems={'flex-start'} w={'100%'}>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={{ base: 'start', sm: 'start', md: 'end' }} fontSize={'16px'} w={'100%'} color={'#1DA1F2'}>ประเภทบุคคล :</Text>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={'start'} fontSize={'16px'} w={'100%'} color={'#767262'}> {Company?.Group}</Text>
    //         </SimpleGrid>
    //         <SimpleGrid columns={[1, 2]} alignItems={'flex-start'} w={'100%'}>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={{ base: 'start', sm: 'start', md: 'end' }} fontSize={'16px'} w={'100%'} color={'#1DA1F2'}>สร้างโดย :</Text>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={'start'} fontSize={'16px'} w={'100%'} color={'#767262'}> {Company?.UserCreate}   {Company?.LnameCreate}  {Company?.dateCreate}</Text>
    //         </SimpleGrid>
    //         <SimpleGrid columns={[1, 2]} alignItems={'flex-start'} w={'100%'}>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={{ base: 'start', sm: 'start', md: 'end' }} fontSize={'16px'} w={'100%'} color={'#1DA1F2'}>อัพเดทโดย :</Text>
    //             <Text fontWeight={'400'} fontFamily={'Prompt'} textAlign={'start'} fontSize={'16px'} w={'100%'} color={'#767262'}> {Company?.UserUpdate}   {Company?.LnameUpdate}  {Company?.dateUpdate}</Text>
    //         </SimpleGrid>
    //     </VStack>

    // </VStack>
    //         </>
    //     ) : (
    //         <Center h={'80vh'} w={'100%'}>
    //             <Spinner size='xl' class="loader"></Spinner>
    //         </Center>

    //     )}
    // </Box>
  )
}

export default ViweCompany
