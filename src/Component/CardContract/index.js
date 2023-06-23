import React, { useState } from 'react'
import {
  HStack,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Stack,
  Center,
  Text,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import { addDoc, collection } from 'firebase/firestore'
import { db } from '../../Config'
import { IoDocumentTextOutline } from 'react-icons/io5'
import moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { BsCalendar3 } from 'react-icons/bs'
import { useAppContext } from '../../Context/appcontext'

function CardContract({ data }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({})
  const [startDate, setStartDate] = useState(
    moment(data?.startDate).add(1, 'year')
  )
  const { user } = useAppContext()
  const [EndDate, setEndDate] = useState(moment(data?.EndDate).add(1, 'year'))
  const selecteStartDate = new Date(startDate)
  const selecteEndDate = new Date(EndDate)
  const toast = useToast()
  const [isSubmit, setIsSubmit] = useState(false)
  const onSubmitContract = async value => {
    setIsSubmit(true)
    const ProjectRef = await collection(db, 'MAProjects')
    await addDoc(ProjectRef, {
      ...data,
      startDate: selecteStartDate.getTime(),
      EndDate: selecteEndDate.getTime(),
      createdAt: new Date(),
      createdBy: user?.uid,
    })
      .then(() => {
        onClose()
        reset()
        toast({
          title: 'ต่อสัญญาสำเร็จ',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        })
        setIsSubmit(false)
      })
      .catch(e => {
        console.error(e)
        toast({
          title: `ต่อสัญญาไม่สำเร็จ`,
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        })
      })
  }
  return (
    <>
      <Button
        w={'100%'}
        justifyContent={'flex-start'}
        colorScheme={'white'}
        color={'#1DA1F2'}
        onClick={onOpen}
        mr={5}
        fontFamily={'Prompt'}
        fontSize={'16px'}
        leftIcon={<IoDocumentTextOutline />}
        fontWeight={'bold'}
      >
        การต่อสัญญา
      </Button>
      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        size={'auto'}
      >
        <form onSubmit={handleSubmit(onSubmitContract)}>
          <ModalOverlay />
          <ModalContent w={{ base: '20rem', sm: '20rem', md: '35rem' }}>
            <ModalCloseButton />
            <ModalBody py={'2rem'} w={'100%'}>
              <Stack px={{ base: '1rem', sm: '1rem', md: '2rem' }}>
                <HStack w={'100%'} pb={'1rem'}>
                  <Text
                    fontWeight={'600'}
                    mb={'-0.5rem'}
                    w={'100%'}
                    textAlign={'center'}
                    color={'#000000'}
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                  >
                    {' '}
                    การต่อสัญญา MA{' '}
                  </Text>
                </HStack>
                <HStack
                  flexDirection={{ base: 'column', sm: 'column', md: 'row' }}
                >
                  <FormControl isInvalid={errors.Content} isRequired>
                    <FormErrorMessage justifyContent={'center'}>
                      {' '}
                      {errors?.Content && errors.Content.message}{' '}
                    </FormErrorMessage>
                    <Stack justifyContent={'center'} spacing={'0'}>
                      <FormLabel
                        fontWeight={'400'}
                        fontFamily={'Prompt'}
                        fontSize={'16px'}
                        w={'100%'}
                        color={'#767262'}
                      >
                        {' '}
                        สัญญา MA
                      </FormLabel>
                      <HStack
                        px={'0.25rem'}
                        py={'1rem'}
                        border={'1px'}
                        h={'40px'}
                        borderRadius={'5px'}
                        w={'100%'}
                        borderColor={'gray.200'}
                      >
                        <DatePicker
                          dateFormat={'dd/MM/yyyy'}
                          selected={selecteStartDate}
                          onChange={startDate => {
                            setStartDate(startDate)
                          }}
                        />
                        <BsCalendar3 />
                      </HStack>
                    </Stack>
                  </FormControl>
                  <FormControl
                    isInvalid={errors.Content}
                    isRequired
                    mt={'1rem'}
                  >
                    <FormErrorMessage justifyContent={'center'}>
                      {' '}
                      {errors?.Content && errors.Content.message}{' '}
                    </FormErrorMessage>
                    <Stack justifyContent={'center'} spacing={'0'}>
                      <FormLabel
                        fontWeight={'400'}
                        fontFamily={'Prompt'}
                        fontSize={'16px'}
                        w={'100%'}
                        color={'#767262'}
                      >
                        {' '}
                        สิ้นสุดสัญญา MA
                      </FormLabel>
                      <HStack
                        px={'0.25rem'}
                        py={'1rem'}
                        border={'1px'}
                        h={'40px'}
                        borderRadius={'5px'}
                        w={'100%'}
                        borderColor={'gray.200'}
                      >
                        <DatePicker
                          dateFormat={'dd/MM/yyyy'}
                          selected={selecteEndDate}
                          onChange={EndDate => {
                            setEndDate(EndDate)
                          }}
                        />
                        <BsCalendar3 />
                      </HStack>
                    </Stack>
                  </FormControl>
                </HStack>
              </Stack>
            </ModalBody>
            <ModalFooter>
              <Center w={'100%'}>
                <Button
                  isLoading={isSubmit}
                  type='submit'
                  color={'#FFFFFF'}
                  fontSize={'16px'}
                  fontWeight={'400'}
                  backgroundColor={'#1DA1F2'}
                  fontFamily={'Prompt'}
                  variant='green'
                >
                  บันทึกข้อมูล
                </Button>
              </Center>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  )
}

export default CardContract
