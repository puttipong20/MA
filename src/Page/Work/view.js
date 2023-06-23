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
import accounting from 'accounting'
import { doc, onSnapshot } from 'firebase/firestore'
import moment from 'moment'
import React, { useCallback, useEffect, useState } from 'react'
import { AiOutlineProject } from 'react-icons/ai'
import { db } from '../../Config'

function ViweProject({ id }) {
  const [Project, setProject] = useState([])
  const fetchData = useCallback(async () => {
    const ProjectDoc = doc(db, 'MAProjects', id)
    onSnapshot(ProjectDoc, snapshot => {
      return setProject({
        id: snapshot.id,
        ...snapshot.data(),
      })
    })
  }, [id])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const { isOpen, onOpen, onClose } = useDisclosure()

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
        leftIcon={<AiOutlineProject />}
        fontFamily={'Prompt'}
        mr={'1rem'}
      >
        ดูข้อมูล Project
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
              Project{' '}
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
                p={'2rem'}
                borderColor={'gray.200'}
              >
                <HStack alignItems={'flex-start'} w={'100%'}>
                  <Text
                    w={'100%'}
                    fontWeight={'light'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    color={'#1DA1F2'}
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                  >
                    ชื่อโปรเจค :
                  </Text>
                  <Text
                    w={'100%'}
                    fontWeight={'light'}
                    textAlign={'start'}
                    color={'#767262'}
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                  >
                    {' '}
                    {Project?.project}
                  </Text>
                </HStack>
                <HStack alignItems={'flex-start'} w={'100%'}>
                  <Text
                    w={'100%'}
                    fontWeight={'light'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    color={'#1DA1F2'}
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                  >
                    เริ่มต้นสัญญาMA :
                  </Text>
                  <Text
                    w={'100%'}
                    fontWeight={'light'}
                    textAlign={'start'}
                    color={'#767262'}
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                  >
                    {' '}
                    {moment(Project?.startDate?.toDate()).format('DD-MM-YYYY')}
                  </Text>
                </HStack>
                <HStack alignItems={'flex-start'} w={'100%'}>
                  <Text
                    w={'100%'}
                    fontWeight={'light'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    color={'#1DA1F2'}
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                  >
                    สิ้นสุดสัญญา MA :
                  </Text>
                  <Text
                    w={'100%'}
                    fontWeight={'light'}
                    textAlign={'start'}
                    color={'#767262'}
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                  >
                    {' '}
                    {moment(Project?.endDate?.toDate()).format(
                      'DD-MM-YYYY'
                    )}{' '}
                  </Text>
                </HStack>
                <HStack alignItems={'flex-start'} w={'100%'}>
                  <Text
                    w={'100%'}
                    fontWeight={'light'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    color={'#1DA1F2'}
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                  >
                    ราคา :
                  </Text>
                  <Text
                    w={'100%'}
                    fontWeight={'light'}
                    textAlign={'start'}
                    color={'#767262'}
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                  >
                    {' '}
                    {accounting.formatNumber(Project.price, 2)}{' '}
                  </Text>
                </HStack>
                <HStack alignItems={'flex-start'} w={'100%'}>
                  <Text
                    w={'100%'}
                    fontWeight={'light'}
                    fontFamily={'Prompt'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    fontSize={'16px'}
                    color={'#1DA1F2'}
                  >
                    สร้างเมื่อ :
                  </Text>
                  {/* <Text w={'100%'} fontWeight={'light'} fontFamily={'Prompt'} textAlign={'start'} fontSize={'16px'} color={'#767262'}>   {Project?.dateCreate}</Text> */}
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
                      {Project?.createdBy?.name}
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
                      {moment(Project?.createdAt?.toDate()).format(
                        'DD-MM-YYYY HH:mm:ss '
                      )}
                    </Text>
                  </VStack>
                </HStack>
                {Project?.updatedAt && (
                  <HStack alignItems={'flex-start'} w={'100%'}>
                    <Text
                      w={'100%'}
                      fontWeight={'light'}
                      fontFamily={'Prompt'}
                      textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                      fontSize={'16px'}
                      color={'#1DA1F2'}
                    >
                      อัพเดทโดย :
                    </Text>
                    <VStack alignItems={'flex-start'} w={'100%'}>
                      <Text
                        fontWeight={'400'}
                        fontFamily={'Prompt'}
                        textAlign={'start'}
                        fontSize={'16px'}
                        w={'100%'}
                        color={'#767262'}
                      >
                        {' '}
                        {Project?.updatedBy?.name}
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
                        {moment(Project?.updatedAt?.toDate()).format(
                          'DD-MM-YYYY HH:mm:ss '
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
  )
}

export default ViweProject
