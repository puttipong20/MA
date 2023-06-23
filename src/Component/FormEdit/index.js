import React, { useState, useEffect, useCallback } from 'react'
import {
  HStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Td,
  useDisclosure,
  Text,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  VStack,
  Center,
  Spinner,
  TableContainer,
  useToast,
  IconButton,
  Stack,
  Flex,
  InputGroup,
  InputLeftElement,
  Box,
  Select,
} from '@chakra-ui/react'
import { useForm } from 'react-hook-form'
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
} from 'firebase/firestore'
import { db } from '../../Config'
import { ChevronDownIcon, SearchIcon } from '@chakra-ui/icons'
import { RiEditLine } from 'react-icons/ri'
import Fuse from 'fuse.js'
import { Link } from 'react-router-dom'
import Layout from '../Layout'
import moment from 'moment'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { IoIosArrowBack } from 'react-icons/io'
import { MdDelete } from 'react-icons/md'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { BsCalendar3 } from 'react-icons/bs'
import { AiOutlineProject } from 'react-icons/ai'
import { useAppContext } from '../../Context/appcontext'

function ViweCorrect({ data }) {
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
        ดูข้อมูล การแจ้งปัญหา
      </Button>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          py={'5rem'}
          w={{ base: '20rem', sm: '20rem', md: '35rem' }}
        >
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
              การแจ้งปัญหา{' '}
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
                    วันที่รับแจ้ง :
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
                    {/* {moment(data?.startDate?.toDate())} */}
                    {moment(data?.startDate?.toDate()).format('DD-MM-YYYY')}
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
                    ชื่อแก้ไข :
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
                    {data?.content}{' '}
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
                    ผู้รับผิดชอบ:
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
                    {data?.responsiblePerson}{' '}
                  </Text>
                </HStack>
                <HStack alignItems={'flex-start'} w={'100%'}>
                  <Text
                    w={'50%'}
                    fontWeight={'light'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    color={'#1DA1F2'}
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                  >
                    รายละเอียด:
                  </Text>
                  <Text
                    w={'50%'}
                    fontWeight={'light'}
                    textAlign={'start'}
                    color={'#767262'}
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                  >
                    {' '}
                    {data?.note}{' '}
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
                    วันที่เสร็จสิ้น:
                  </Text>
                  {data.status === 'อยู่ระหว่างดำเนินการ' ? (
                    <></>
                  ) : (
                    <Text
                      w={'100%'}
                      fontWeight={'light'}
                      textAlign={'start'}
                      color={'#767262'}
                      fontSize={'16px'}
                      fontFamily={'Prompt'}
                    >
                      {' '}
                      {/* {data?.startDate?.toDate()} */}
                      {moment(new Date(data?.startDate?.toDate())).format(
                        'DD-MM-YYYY'
                      )}{' '}
                    </Text>
                  )}
                </HStack>
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

function CardEditWork({ data, id }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [text, setText] = useState('')
  const [endDate, setEndDate] = useState(new Date(moment().startOf('d')))
  const toast = useToast()

  const onSubmit = async () => {
    if (data) {
      const ProjectRef = doc(db, 'MAProjects', id)
      const CorrectRef = await doc(ProjectRef, 'Correct', data?.id)

      if (text === 'เสร็จสิ้น') {
        updateDoc(CorrectRef, {
          status: 'เสร็จสิ้น',
          endDate: endDate,
        })
          .then(() => {
            toast({
              title: 'บันทึกการแก้ไขปัญหาสำเร็จ',
              status: 'success',
              duration: 2000,
              isClosable: true,
              position: 'top',
            })
          })
          .catch(e => {
            toast({
              title: `บันทึกการแก้ไขปัญหาไม่สำเร็จ`,
              status: 'error',
              duration: 2000,
              isClosable: true,
              position: 'top',
            })
          })
      }
    }
    await onClose()
  }

  const onSubmitEdit = async value => {
    const ProjectRef = doc(db, 'MAProjects', id)
    const CorrectRef = await doc(ProjectRef, 'Correct', data?.id)
    updateDoc(CorrectRef, { status: 'อยู่ระหว่างดำเนินการ', ...value })
      .then(res => {})
      .then(() => {
        toast({
          title: 'บันทึกการแก้ไขปัญหาสำเร็จ',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        })
      })
      .catch(e => {
        toast({
          title: `บันทึกการแก้ไขปัญหาไม่สำเร็จ`,
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        })
      })
  }

  return (
    <>
      {data?.status === 'อยู่ระหว่างดำเนินการ' ? (
        <>
          <Menu w={'100%'}>
            {}
            <MenuButton
              w={'200px'}
              alignItems={'center'}
              justifyContent={'center'}
              as={Button}
              border={'1px'}
              borderColor={'gray.200'}
              fontSize={'14px'}
              fontWeight={'600'}
              fontFamily={'Prompt'}
              backgroundColor={'#FFFFFF'}
              color={'black'}
              rightIcon={<ChevronDownIcon />}
            >
              Inprogress
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  onOpen()
                  setText('เสร็จสิ้น')
                }}
                fontWeight={'800'}
                alignItems={'center'}
                justifyContent={'center'}
                textAlign={'center'}
                width={'200px'}
                fontFamily={'Prompt'}
                backgroundColor={'#FFFFFF'}
                color={'#1DA1F2'}
              >
                {' '}
                Done{' '}
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      ) : (
        <>
          <Menu w={'100%'}>
            <MenuButton
              w={'200px'}
              colorScheme={'#D8F2FF'}
              p={'1rem'}
              alignItems={'center'}
              justifyContent={'center'}
              as={Button}
              border={'1px'}
              borderColor={'#D8F2FF'}
              fontSize={'14px'}
              fontWeight={'600'}
              fontFamily={'Prompt'}
              backgroundColor={'#D8F2FF'}
              color={'#1DA1F2'}
              rightIcon={<ChevronDownIcon />}
            >
              Done
            </MenuButton>
            <MenuList>
              <MenuItem
                onClick={() => {
                  onSubmitEdit()
                  setText('อยู่ระหว่างดำเนินการ')
                }}
                fontWeight={'800'}
                width={'200px'}
                alignItems={'center'}
                justifyContent={'center'}
                fontFamily={'Prompt'}
                backgroundColor={'#FFFFFF'}
                color={'black'}
              >
                {' '}
                Reset{' '}
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      )}

      <Modal
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
        size={'xl'}
      >
        {/* <form onSubmit={handleSubmit(onSubmit)}> */}
        <ModalOverlay />
        <ModalContent py={'4rem'} px={'2rem'}>
          <ModalHeader fontFamily={'Prompt'} textAlign={'center'}>
            การยืนยันการแก้ไขงาน
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Center>
              <Text
                fontWeight={'400'}
                mr={5}
                fontFamily={'Prompt'}
                fontSize={'18px'}
                color={'#767262'}
              >
                {' '}
                วันที่เสร็จเรียบร้อย{' '}
              </Text>
              <HStack
                px={'0.25rem'}
                py={'1rem'}
                border={'1px'}
                h={'40px'}
                borderRadius={'5px'}
                w={'fit-content'}
                borderColor={'gray.200'}
              >
                <DatePicker
                  selected={endDate}
                  dateFormat={'dd/MM/yyyy'}
                  onChange={endDate => {
                    setEndDate(endDate)
                  }}
                />
                <BsCalendar3 />
              </HStack>
            </Center>
          </ModalBody>
          <ModalFooter>
            <HStack justifyContent={'center'}>
              <Button
                onClick={onSubmit}
                fontFamily={'Prompt'}
                fontWeight={'400'}
                fontStyle={'normal'}
                fontSize={'16px'}
                color={'#FFFFFF'}
                backgroundColor={'#1DA1F2'}
                width={'115px'}
                height={'40px'}
              >
                {' '}
                บันทึก{' '}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
        {/* </form> */}
      </Modal>
    </>
  )
}

function DelEditWork({ item, id, Cid }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const handleRemove = async () => {
    const ProjectRef = doc(db, 'MAProjects', id)
    const CorrectRef = doc(ProjectRef, 'Correct', Cid)
    await deleteDoc(CorrectRef)
  }

  return (
    <>
      <Button
        colorScheme='#FFFFFF'
        w={'100%'}
        justifyContent={'flex-start'}
        color={'#FF3E3E'}
        onClick={onOpen}
        leftIcon={<MdDelete size={'20px'} />}
      >
        {' '}
        ลบข้อมูล{' '}
      </Button>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='lg' fontWeight='bold'>
              ลบข้อมูล
            </AlertDialogHeader>

            <AlertDialogBody>คุณต้องการลบข้อมูล ใช่หรือไม่</AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                ยกเลิก
              </Button>
              <Button
                colorScheme='red'
                onClick={() => {
                  handleRemove(item.id)
                  onClose()
                }}
                ml={3}
              >
                ลบข้อมูล
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

function CardAddWork({ Pid, fetchData }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({})
  const [startDate, setStartDate] = useState(new Date(moment().startOf('d')))

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const toast = useToast()
  const [isSubmit, setIsSubmit] = useState(false)

  const onSubmitEdit = async value => {
    setIsSubmit(true)
    const ProjectRef = doc(db, 'MAProjects', Pid)
    const CorrectRef = await collection(ProjectRef, 'Correct')
    await addDoc(CorrectRef, {
      ...value,
      status: 'อยู่ระหว่างดำเนินการ',
      createdAt: new Date(),
      startDate: startDate,
    })
      .then(() => {
        setIsSubmit(false)
      })
      .then(() => {
        toast({
          title: 'แจ้งปัญหาสำเร็จ',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        })
      })
      .catch(e => {
        toast({
          title: `แจ้งปัญหาไม่สำเร็จ`,
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        })
      })
    reset()
    await onClose()
  }

  return (
    <>
      <Button
        onClick={onOpen}
        fontFamily={'Prompt'}
        fontWeight={'400'}
        h={'45px'}
        w={'170px'}
        backgroundColor={'#1DA1F2'}
        color={'#FFFFFF'}
        fontSize={'16px'}
        p={'1rem'}
      >
        แจ้งปัญหา
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={'auto'}>
        <ModalOverlay />
        <ModalContent w={{ base: '20rem', sm: '20rem', md: '35rem' }}>
          <ModalCloseButton />
          <ModalBody py={'3rem'}>
            <Stack py={'2rem'} px={{ base: '1rem', sm: '1rem', md: '2rem' }}>
              <VStack w={'100%'}>
                <Text
                  textAlign={'center'}
                  w={'100%'}
                  fontSize={'16px'}
                  fontWeight={'bold'}
                  fontFamily={'Prompt'}
                  color={'#000000'}
                  pt={'1rem'}
                >
                  {' '}
                  แจ้งปัญหา{' '}
                </Text>
              </VStack>
              <form onSubmit={handleSubmit(onSubmitEdit)}>
                <FormControl
                  isInvalid={errors.taxNumber}
                  isRequired
                  pt={'1rem'}
                >
                  <FormErrorMessage justifyContent={'center'}>
                    {' '}
                    {errors?.taxNumber && errors.taxNumber.message}{' '}
                  </FormErrorMessage>
                  <Stack>
                    <FormLabel
                      fontWeight={'400'}
                      fontFamily={'Prompt'}
                      w={'100%'}
                      textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                      fontSize={'16px'}
                      color={'#767262'}
                    >
                      วันที่รับแจ้ง
                    </FormLabel>
                    <HStack
                      px={'0.25rem'}
                      py={'1rem'}
                      border={'1px'}
                      h={'40px'}
                      borderRadius={'5px'}
                      w={'fit-content'}
                      borderColor={'gray.200'}
                    >
                      <DatePicker
                        dateFormat={'dd/MM/yyyy'}
                        selected={startDate}
                        onChange={startDate => {
                          setStartDate(startDate)
                        }}
                      />
                      <BsCalendar3 />
                    </HStack>
                  </Stack>
                </FormControl>
                <FormControl isInvalid={errors.content} isRequired>
                  <FormErrorMessage justifyContent={'center'}>
                    {' '}
                    {errors?.content && errors.content.message}{' '}
                  </FormErrorMessage>
                  <Stack pt={'1rem'}>
                    <FormLabel
                      fontWeight={'400'}
                      fontFamily={'Prompt'}
                      textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                      fontSize={'16px'}
                      w={'100%'}
                      color={'#767262'}
                    >
                      ชื่อแก้ไข
                    </FormLabel>
                    <Input
                      fontFamily={'Prompt'}
                      fontSize={'16px'}
                      type={'text'}
                      {...register('content')}
                      w={'100%'}
                      h={'fit-content'}
                      p={'0.5rem'}
                    />
                  </Stack>
                </FormControl>

                <Stack pt={'1rem'}>
                  <Text
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#767262'}
                  >
                    {' '}
                    ผู้รับผิดชอบ{' '}
                  </Text>
                  <Input
                    fontFamily={'Prompt'}
                    w={'100%'}
                    fontSize={'18px'}
                    type={'text'}
                    {...register('responsiblePerson')}
                  />
                </Stack>
                <Text
                  fontWeight={'400'}
                  fontFamily={'Prompt'}
                  fontSize={'16px'}
                  color={'#767262'}
                >
                  {' '}
                  รายละเอียด{' '}
                </Text>
                <Textarea
                  fontFamily={'Prompt'}
                  fontSize={'16px'}
                  type={'text'}
                  {...register('note')}
                  h={'225px'}
                />
                <HStack justifyContent={'center'} mt={'2rem'}>
                  <Button
                    fontFamily={'Prompt'}
                    fontStyle={'normal'}
                    fontSize={'16px'}
                    fontWeight={'400'}
                    color={'#FFFFFF'}
                    backgroundColor={'gray.400'}
                    width={'104px'}
                    height={'40px'}
                    onClick={() => reset()}
                  >
                    {' '}
                    เคลียร์{' '}
                  </Button>
                  <Button
                    isLoading={isSubmit}
                    type='submit'
                    fontFamily={'Prompt'}
                    fontStyle={'normal'}
                    fontSize={'16px'}
                    fontWeight={'400'}
                    color={'#FFFFFF'}
                    backgroundColor={'#1DA1F2'}
                    width={'115px'}
                    height={'40px'}
                  >
                    {' '}
                    เพิ่ม{' '}
                  </Button>
                </HStack>
              </form>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

function EditWork({ data, Pid, id }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })

  const [startDate, setStartDate] = useState()
  const [endDate, setEndDate] = useState()
  const toast = useToast()

  useEffect(() => {
    if (data) {
      setValue('content', data?.content)
      setValue('startDate', data?.startDate)
      setValue('responsiblePerson', data?.responsiblePerson || '')
      setValue('note', data?.note || '')
      // setValue('endDate', data?.endDate || '')
      // setStartDate(data?.startDate)
    }
    //eslint-disable-next-line
  }, [data])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isSubmit, setIsSubmit] = useState(false)

  const onSubmitEdit = async value => {
    setIsSubmit(true)
    const DocRef = doc(db, 'MAProjects', Pid)
    const Correct = await doc(DocRef, 'Correct', id)
    await updateDoc(Correct, value)
      .then(() => {
        setIsSubmit(false)
      })
      .then(() => {
        toast({
          title: 'อัพเดทแจ้งปัญหาสำเร็จ',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        })
        onClose()
      })
      .catch(e => {
        toast({
          title: `อัพเดทแจ้งปัญหาไม่สำเร็จ`,
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        })
        onClose()
      })
  }
  return (
    <>
      <Button
        onClick={() => {
          onOpen()
        }}
        w={'100%'}
        justifyContent={'flex-start'}
        color={'green'}
        fontSize={'16px'}
        colorScheme={'white'}
        fontFamily={'Prompt'}
        fontWeight={'400'}
        leftIcon={<RiEditLine color='green' />}
      >
        แก้ไข
      </Button>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal isOpen={isOpen} onClose={onClose} size={'auto'}>
        <ModalOverlay />
        <ModalContent w={{ base: '20rem', sm: '20rem', md: '35rem' }}>
          <ModalCloseButton />
          <ModalBody py={'3rem'}>
            <Stack py={'2rem'} px={{ base: '1rem', sm: '1rem', md: '2rem' }}>
              <VStack w={'100%'}>
                <Text
                  textAlign={'center'}
                  w={'100%'}
                  fontSize={'16px'}
                  fontWeight={'bold'}
                  fontFamily={'Prompt'}
                  color={'#000000'}
                  pt={'1rem'}
                >
                  {' '}
                  แจ้งปัญหา{' '}
                </Text>
              </VStack>
              <form onSubmit={handleSubmit(onSubmitEdit)}>
                <FormControl
                  isInvalid={errors.taxNumber}
                  isRequired
                  pt={'1rem'}
                >
                  <FormErrorMessage justifyContent={'center'}>
                    {' '}
                    {errors?.taxNumber && errors.taxNumber.message}{' '}
                  </FormErrorMessage>
                  <Stack>
                    <FormLabel
                      fontWeight={'400'}
                      fontFamily={'Prompt'}
                      w={'100%'}
                      textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                      fontSize={'16px'}
                      color={'#767262'}
                    >
                      วันที่รับแจ้ง
                    </FormLabel>
                    <HStack
                      px={'0.25rem'}
                      py={'1rem'}
                      border={'1px'}
                      h={'40px'}
                      borderRadius={'5px'}
                      w={'fit-content'}
                      borderColor={'gray.200'}
                    >
                      <DatePicker
                        dateFormat={'dd/MM/yyyy'}
                        selected={startDate}
                        value={startDate}
                        onChange={startDate => {
                          setStartDate(startDate)
                        }}
                      />
                      <BsCalendar3 />
                    </HStack>
                  </Stack>
                </FormControl>
                <FormControl isInvalid={errors.content} isRequired>
                  <FormErrorMessage justifyContent={'center'}>
                    {' '}
                    {errors?.content && errors.content.message}{' '}
                  </FormErrorMessage>
                  <Stack pt={'1rem'}>
                    <FormLabel
                      fontWeight={'400'}
                      fontFamily={'Prompt'}
                      textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                      fontSize={'16px'}
                      w={'100%'}
                      color={'#767262'}
                    >
                      ชื่อแก้ไข
                    </FormLabel>
                    <Input
                      fontFamily={'Prompt'}
                      fontSize={'16px'}
                      type={'text'}
                      {...register('content')}
                      w={'100%'}
                      h={'fit-content'}
                      p={'0.5rem'}
                    />
                  </Stack>
                </FormControl>
                <Stack pt={'1rem'}>
                  <Text
                    fontWeight={'400'}
                    mr={5}
                    fontFamily={'Prompt'}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#767262'}
                  >
                    {' '}
                    ผู้รับผิดชอบ{' '}
                  </Text>
                  <Input
                    fontFamily={'Prompt'}
                    w={'100%'}
                    fontSize={'18px'}
                    type={'text'}
                    {...register('responsiblePerson')}
                  />
                </Stack>
                <Text
                  fontWeight={'400'}
                  mr={5}
                  fontFamily={'Prompt'}
                  fontSize={'16px'}
                  color={'#767262'}
                >
                  {' '}
                  รายละเอียด{' '}
                </Text>
                <Textarea
                  fontFamily={'Prompt'}
                  fontSize={'16px'}
                  type={'text'}
                  {...register('note')}
                  h={'225px'}
                />
                {data?.endDate ? (
                  <FormControl
                    isInvalid={errors.taxNumber}
                    isRequired
                    pt={'1rem'}
                  >
                    <FormErrorMessage justifyContent={'center'}>
                      {' '}
                      {errors?.taxNumber && errors.taxNumber.message}{' '}
                    </FormErrorMessage>
                    <Stack>
                      <FormLabel
                        fontWeight={'400'}
                        fontFamily={'Prompt'}
                        w={'100%'}
                        textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                        fontSize={'16px'}
                        color={'#767262'}
                      >
                        วันที่เสร็จสิ้น
                      </FormLabel>
                      <HStack
                        px={'0.25rem'}
                        py={'1rem'}
                        border={'1px'}
                        h={'40px'}
                        borderRadius={'5px'}
                        w={'fit-content'}
                        borderColor={'gray.200'}
                      >
                        <DatePicker
                          selected={endDate}
                          onChange={endDate => {
                            setEndDate(endDate)
                          }}
                        />
                        <BsCalendar3 />
                      </HStack>
                    </Stack>
                  </FormControl>
                ) : (
                  <></>
                )}
                <HStack justifyContent={'center'} mt={'2rem'}>
                  <Button
                    isLoading={isSubmit}
                    type='submit'
                    fontFamily={'Prompt'}
                    fontStyle={'normal'}
                    fontSize={'16px'}
                    fontWeight={'400'}
                    color={'#FFFFFF'}
                    backgroundColor={'#1DA1F2'}
                    width={'115px'}
                    height={'40px'}
                  >
                    {' '}
                    บันทึก{' '}
                  </Button>
                </HStack>
              </form>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

function FormEditWork({ Pid, id }) {
  const { user } = useAppContext()
  const [Correct, setCorrect] = useState([])
  const [Project, setProject] = useState([])
  const [search, setSearch] = useState([])
  const [rummage, setrummage] = useState([])

  const [isLoading, setIsLoading] = useState(true)
  const fetchData = useCallback(async () => {
    const ProjectRef = doc(db, 'MAProjects', Pid)
    const Correct = query(
      collection(ProjectRef, 'Correct'),
      orderBy('createdAt', 'desc')
    )
    onSnapshot(Correct, snapshot => {
      return setCorrect(
        snapshot.docs?.map(doc => ({ ...doc.data(), id: doc.id }))
      )
    })
    const ProjectDoc = doc(db, 'MAProjects', Pid)
    onSnapshot(ProjectDoc, snapshot => {
      return setProject({
        id: snapshot.id,
        ...snapshot.data(),
      })
    })
    const search = doc(db, 'MAProjects', Pid)
    const CorrectRef = await collection(search, 'Correct')
    onSnapshot(CorrectRef, snapshot => {
      return setSearch(
        snapshot.docs?.map(doc => ({ ...doc.data(), id: doc.id }))
      )
    })
    const rummage = doc(db, 'MAProjects', Pid)
    const rummageRef = await collection(rummage, 'Correct')
    onSnapshot(rummageRef, snapshot => {
      return setrummage(
        snapshot.docs?.map(doc => ({ ...doc.data(), id: doc.id }))
      )
    })
  }, [Pid])
  useEffect(() => {
    fetchData()
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [fetchData])

  return (
    <>
      <Layout user={user}>
        <Button
          as={Link}
          to={`/work/${id}`}
          position={'absolute'}
          top={{ base: '2rem', sm: '2rem', md: '1rem' }}
          left={{
            base: '0rem',
            sm: '0rem',
            md: '1rem',
            lg: '2rem',
            xl: '3rem',
          }}
          leftIcon={<IoIosArrowBack color='#1DA1F2' size={'20px'} />}
          colorScheme='white'
        />

        <VStack
          alignItems={'center'}
          w={'100%'}
          minH={'100vh'}
          h={'full'}
          backgroundColor={'white'}
        >
          {!isLoading ? (
            <>
              <Stack w={'100%'} alignItems={'center'} mb={'2rem'}>
                <HStack w={'90%'} justifyContent={'space-between'}>
                  <VStack pt={'1rem'} spacing={'2px'} alignItems={'flex-start'}>
                    <Text
                      fontWeight={'600'}
                      textAlign={'start'}
                      fontSize={'18px'}
                      fontFamily={'Prompt'}
                    >
                      {' '}
                      แจ้งปัญหา{' '}
                    </Text>
                    <Text
                      fontSize={'16px'}
                      fontFamily={'Prompt'}
                      color={'#000000'}
                    >
                      {' '}
                      แจ้งปัญหาของ Project {Project?.project}{' '}
                    </Text>
                  </VStack>
                  <CardAddWork Pid={Pid} fetchData={fetchData} />
                </HStack>
              </Stack>
              <Center w={'100%'} mt={'1rem'}>
                <Flex
                  alignItems={'end'}
                  flexWrap={'wrap'}
                  w={'90%'}
                  justifyContent={'space-between'}
                >
                  <Flex flexWrap={'wrap'}>
                    <Box w={'300px'}>
                      <InputGroup
                        borderRadius={'20px'}
                        backgroundColor={'#FFFFFF'}
                      >
                        <InputLeftElement
                          pointerEvents='none'
                          children={<SearchIcon color='black' />}
                        />
                        <Input
                          type='text'
                          borderRadius={'5px'}
                          placeholder='ค้นหา การแก้ปัญหา'
                          fontFamily={'Kanit'}
                          fontSize={'14px'}
                          color={'#94A5B7'}
                          onChange={event => {
                            let keyword = event.currentTarget.value
                            const fuse = new Fuse(search, {
                              keys: [
                                'content',
                                'startDate',
                                'responsiblePerson',
                                'note',
                              ],
                              findAllMatches: true,
                              shouldSort: true,
                            })
                            const results = fuse.search(keyword)

                            const searchResults =
                              keyword === ''
                                ? search
                                : results.map(value => value.item)
                            setCorrect(searchResults)
                          }}
                        />
                      </InputGroup>
                    </Box>
                    <HStack ml={'1rem'} w={'300px'}>
                      <Text fontFamily={'Kanit'} fontSize={'14px'}>
                        {' '}
                        สถานะ{' '}
                      </Text>
                      <Select
                        type='text'
                        borderRadius={'5px'}
                        placeholder='ทั้งหมด'
                        fontFamily={'Kanit'}
                        fontSize={'14px'}
                        color={'#94A5B7'}
                        iconColor={'black'}
                        onChange={event => {
                          let keyword = event.currentTarget.value
                          const fuse = new Fuse(rummage, {
                            keys: ['status'],
                            findAllMatches: true,
                            shouldSort: true,
                          })
                          const results = fuse.search(keyword)

                          const searchResults =
                            keyword === ''
                              ? rummage
                              : results.map(value => value.item)
                          setCorrect(searchResults)
                        }}
                      >
                        <option value='เสร็จสิ้น'> เสร็จสิ้น </option>
                        <option value='อยู่ระหว่างดำเนินการ'>
                          {' '}
                          อยู่ระหว่างดำเนินการ{' '}
                        </option>
                      </Select>
                    </HStack>
                  </Flex>
                </Flex>
              </Center>
              <Center overflow w={'full'}>
                <TableContainer
                  w={'90%'}
                  borderRadius={'15px'}
                  border={'1px'}
                  borderColor={'#f4f4f4'}
                >
                  <Table w={'100%'}>
                    <Thead>
                      <Tr backgroundColor={'#f4f4f4'} color={'#666666'}>
                        <Th
                          fontFamily={'Prompt'}
                          fontSize={'14px'}
                          textAlign={'center'}
                          fontWeight={'600'}
                        >
                          วันที่รับแจ้ง
                        </Th>
                        <Th
                          fontFamily={'Prompt'}
                          fontSize={'14px'}
                          fontWeight={'600'}
                        >
                          ชื่อแก้ไข
                        </Th>
                        <Th
                          fontFamily={'Prompt'}
                          fontSize={'14px'}
                          fontWeight={'600'}
                        >
                          วันที่เสร็จเรียบร้อย
                        </Th>
                        <Th
                          fontFamily={'Prompt'}
                          fontSize={'14px'}
                          fontWeight={'600'}
                        >
                          รายละเอียด
                        </Th>
                        <Th
                          fontFamily={'Prompt'}
                          fontSize={'14px'}
                          fontWeight={'600'}
                        >
                          ผู้รับผิดชอบ
                        </Th>
                        <Th
                          fontFamily={'Prompt'}
                          fontSize={'14px'}
                          fontWeight={'600'}
                        >
                          สถานะ
                        </Th>
                        <Th
                          fontFamily={'Prompt'}
                          fontSize={'14px'}
                          fontWeight={'600'}
                        >
                          การจัดการ
                        </Th>
                      </Tr>
                    </Thead>

                    {Correct?.map((rs, index) => {
                      return (
                        <Tbody key={index}>
                          <Td
                            fontFamily={'Prompt'}
                            fontSize={'12px'}
                            textAlign={'center'}
                            fontWeight={'600'}
                          >
                            {' '}
                            {/* {rs?.startDate} */}
                            {moment(rs?.startDate?.toDate()).format(
                              'DD-MM-YYYY'
                            )}
                          </Td>
                          <Td
                            fontFamily={'Prompt'}
                            fontSize={'12px'}
                            fontWeight={'600'}
                          >
                            <Text noOfLines={'1'} w={'100px'}>
                              {rs?.content}
                            </Text>
                          </Td>
                          {rs?.status === 'อยู่ระหว่างดำเนินการ' ? (
                            <Td></Td>
                          ) : (
                            <Td
                              fontFamily={'Prompt'}
                              fontSize={'12px'}
                              fontWeight={'600'}
                            >
                              {rs.endDate ? (
                                moment(rs?.endDate?.toDate()).format(
                                  'DD-MM-YYYY'
                                )
                              ) : (
                                <></>
                              )}
                            </Td>
                          )}
                          <Td
                            fontFamily={'Prompt'}
                            fontSize={'12px'}
                            fontWeight={'600'}
                          >
                            <Text noOfLines={'1'} w={'200px'}>
                              {rs?.note}
                            </Text>
                          </Td>
                          <Td
                            fontFamily={'Prompt'}
                            fontSize={'12px'}
                            fontWeight={'600'}
                          >
                            <Text noOfLines={'1'} w={'100px'}>
                              {rs?.responsiblePerson}
                            </Text>
                          </Td>
                          <Td
                            fontFamily={'Prompt'}
                            fontSize={'12px'}
                            color={'green'}
                            fontWeight={'600'}
                          >
                            <CardEditWork
                              data={rs}
                              id={Pid}
                              fetchData={fetchData}
                            />
                          </Td>
                          <Td
                            fontFamily={'Prompt'}
                            fontSize={'12px'}
                            fontWeight={'600'}
                          >
                            <Menu>
                              <MenuButton
                                colorScheme={'wihte'}
                                as={IconButton}
                                icon={
                                  <BiDotsHorizontalRounded
                                    size={'25px'}
                                    color='#1DA1F2'
                                  />
                                }
                              ></MenuButton>
                              <MenuList>
                                <MenuItem>
                                  <ViweCorrect data={rs} />
                                </MenuItem>

                                {rs?.status === 'เสร็จสิ้น' ? (
                                  <></>
                                ) : (
                                  <MenuItem>
                                    <EditWork data={rs} Pid={Pid} id={rs?.id} />
                                  </MenuItem>
                                )}
                                <MenuItem>
                                  {' '}
                                  <DelEditWork
                                    item={rs}
                                    id={Pid}
                                    Cid={rs?.id}
                                  />
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tbody>
                      )
                    })}
                  </Table>
                </TableContainer>
              </Center>
            </>
          ) : (
            <Center h={'80vh'} w={'100%'}>
              <Spinner size='xl' class='loader'></Spinner>
            </Center>
          )}
        </VStack>
      </Layout>
    </>
  )
}
export default FormEditWork
