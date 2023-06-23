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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Td,
  useDisclosure,
  Box,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Center,
  Text,
  VStack,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Spinner,
  TableContainer,
  Stack,
  Flex,
  InputGroup,
  InputLeftElement,
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
import { Link, useParams } from 'react-router-dom'
import CardContract from '../../Component/CardContract'
import moment from 'moment'
import { BsCalendar3 } from 'react-icons/bs'
import { MdDelete } from 'react-icons/md'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import { RiEditLine } from 'react-icons/ri'
import ViweProject from './view'
import { IoIosArrowBack, IoMdAdd } from 'react-icons/io'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Fuse from 'fuse.js'
import { SearchIcon } from '@chakra-ui/icons'

const accounting = require('accounting')

function EditCardWork({ data, id, user, onClose }) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })
  const [startDate, setStartDate] = useState(
    new Date(moment(data?.startDate?.toDate()).startOf('D'))
  )
  const [endDate, setEndDate] = useState(
    new Date(moment(new Date(data?.endDate?.toDate())).startOf('D'))
  )

  const toast = useToast()
  const create = new Date()
  const UpdateCreate = create?.getTime()
  useEffect(() => {
    if (data) {
      setValue('companyID', data?.companyID)
      setValue('project', data?.project)
      setValue('price', data?.price)
      setValue('startDate', data?.startDate)
      setValue('endDate', data?.endDate)
    }
    //eslint-disable-next-line
  }, [UpdateCreate, user, data])
  const [isSubmit, setIsSubmit] = useState(false)

  const onSubmitEdit = async value => {
    setIsSubmit(true)
    const DocRef = doc(db, 'MAProjects', id)
    await updateDoc(DocRef, {
      ...value,
      startDate: startDate,
      endDate: endDate,
      updatedAt: new Date(),
      updatedBy: user?.uid,
    })
      .then(() => {
        toast({
          title: 'อัพเดทโปรเจคสำเร็จ',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        })
        onClose()
        setIsSubmit(false)
      })
      .catch(e => {
        toast({
          title: `อัพเดทโปรเจคไม่สำเร็จ`,
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        })
        onClose()
        setIsSubmit(false)
      })
  }
  return (
    <>
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
          Project{' '}
        </Text>
      </HStack>
      <form onSubmit={handleSubmit(onSubmitEdit)}>
        <VStack w={'100%'} justifyContent={'center'}>
          <VStack
            w={'100%'}
            py={'2rem'}
            px={{ base: '1rem', sm: '1rem', md: '2rem' }}
          >
            <Box w={'100%'}>
              <FormControl isInvalid={errors.Content} isRequired>
                <FormErrorMessage justifyContent={'center'}>
                  {' '}
                  {errors?.Content && errors.Content.message}{' '}
                </FormErrorMessage>
                <Stack>
                  <FormLabel
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    fontSize={'16px'}
                    w={'100%'}
                    color={'#767262'}
                  >
                    ชื่อโปรเจค
                  </FormLabel>
                  <Input
                    fontFamily={'Prompt'}
                    fontSize={'16px'}
                    type={'text'}
                    {...register('project')}
                    w={'100%'}
                  />
                </Stack>
              </FormControl>
              <HStack
                flexDirection={{ base: 'column', sm: 'column', md: 'row' }}
              >
                <FormControl pt={'1rem'}>
                  <Flex flexWrap={'wrap'} columnGap={[1, 2]}>
                    {/* <Box> */}

                    <FormLabel
                      fontWeight={'400'}
                      fontFamily={'Prompt'}
                      textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                      w={'100%'}
                      fontSize={'16px'}
                      color={'#767262'}
                    >
                      {' '}
                      เริ่มต้นสัญญา MA{' '}
                    </FormLabel>
                    <HStack
                      w='100%'
                      px={'0.25rem'}
                      py={'1rem'}
                      border={'1px'}
                      h={'40px'}
                      borderRadius={'5px'}
                      justifyContent='center'
                      borderColor={'gray.200'}
                    >
                      <DatePicker
                        style={{ width: '6rem' }}
                        dateFormat={'dd/MM/yyyy'}
                        selected={startDate}
                        onChange={date => {
                          setStartDate(date)
                        }}
                      />
                      <BsCalendar3 />
                    </HStack>
                    {/* </Box> */}
                  </Flex>
                </FormControl>

                <FormControl pt={'1rem'}>
                  <Flex flexWrap={'wrap'} columnGap={[1, 2]}>
                    <FormLabel
                      fontWeight={'400'}
                      fontFamily={'Prompt'}
                      w={'100%'}
                      fontSize={'16px'}
                      textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                      color={'#767262'}
                    >
                      {' '}
                      สิ้นสุดสัญญา MA{' '}
                    </FormLabel>
                    <HStack
                      px={'0.25rem'}
                      py={'0.5rem'}
                      border={'1px'}
                      h={'40px'}
                      borderRadius={'5px'}
                      w={'100%'}
                      borderColor={'gray.200'}
                    >
                      <DatePicker
                        style={{ width: '6rem' }}
                        dateFormat={'dd/MM/yyyy'}
                        selected={endDate}
                        onChange={endDate => {
                          setEndDate(endDate)
                          // setValue('endDate', endDate.getTime())
                        }}
                      />
                      <BsCalendar3 />
                    </HStack>
                    {/* <Input fontFamily={'Prompt'} fontSize={'16px'} type={'date'} placeholder='DD-MM-YYYY'   {...register('endDate')} w={'350px'} /> */}
                  </Flex>
                </FormControl>
              </HStack>

              <FormControl pt={'1rem'}>
                <Stack>
                  <FormLabel
                    fontWeight={'400'}
                    fontFamily={'Prompt'}
                    w={'100%'}
                    fontSize={'16px'}
                    textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                    color={'#767262'}
                  >
                    {' '}
                    ค่าบริการ{' '}
                  </FormLabel>
                  <Input
                    fontFamily={'Prompt'}
                    fontSize={'16px'}
                    type={'number'}
                    {...register('price')}
                    w={'100%'}
                  />
                </Stack>
              </FormControl>

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
                  colorScheme={'#1DA1F2'}
                  width={'115px'}
                  height={'40px'}
                >
                  {' '}
                  บันทึก{' '}
                </Button>
              </HStack>
            </Box>
          </VStack>
        </VStack>
      </form>
    </>
  )
}

function DelEditWork({ item, id, Pid }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef()
  const handleRemove = async () => {
    const ProjectRef = doc(db, 'MAProjects', Pid)
    await deleteDoc(ProjectRef)
  }
  return (
    <>
      <Button
        colorScheme='#FFFFFF'
        w={'100%'}
        justifyContent={'flex-start'}
        color={'#FF3E3E'}
        fontFamily={'Prompt'}
        fontSize={'16px'}
        fontWeight={'light'}
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
              <Button
                fontFamily={'Prompt'}
                fontSize={'14px'}
                fontWeight={'600'}
                ref={cancelRef}
                onClick={onClose}
              >
                ยกเลิก
              </Button>
              <Button
                colorScheme='red'
                fontFamily={'Prompt'}
                fontSize={'14px'}
                fontWeight={'600'}
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

function AddWork({ user }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [startDate, setStartDate] = useState(new Date(moment().startOf('D')))
  const [endDate, setEndDate] = useState(
    new Date(moment().startOf('D').add(1, 'y'))
  )
  const selecteEndDate = new Date(endDate)
  const create = new Date()
  const createAt = create?.getTime()
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })
  const { id } = useParams()
  const toast = useToast()
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
  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    setValue('companyID', id)
    setValue('nameCompany', Company?.nameCompany)
    //eslint-disable-next-line
  }, [Company, createAt])
  const [isSubmit, setIsSubmit] = useState(false)

  const onSubmit = async value => {
    setIsSubmit(true)
    const DocCollect = collection(db, 'MAProjects')
    await addDoc(DocCollect, {
      ...value,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      createdAt: new Date(),
      createdBy: user?.uid,
    })
      .then(() => {
        setIsSubmit(false)
      })
      .then(() => {
        toast({
          title: 'เพิ่มโปรเจคสำเร็จ',
          status: 'success',
          duration: 2000,
          isClosable: true,
          position: 'top',
        })
      })
      .catch(e => {
        toast({
          title: `เพิ่มโปรเจคไม่สำเร็จ`,
          status: 'error',
          duration: 2000,
          isClosable: true,
          position: 'top',
        })
      })
    await reset()
    onClose()
  }

  // const [Date, setDate] = useState(new Date());

  return (
    <>
      <Button
        display={{
          base: 'none',
          sm: 'none',
          md: 'flex',
          lg: 'flex',
          xl: 'flex',
        }}
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
        Add Project
      </Button>
      <Button
        display={{
          base: 'flex',
          sm: 'flex',
          md: 'none',
          lg: 'none',
          xl: 'none',
        }}
        onClick={onOpen}
        fontFamily={'Prompt'}
        fontWeight={'400'}
        h={'60px'}
        w={'60px'}
        backgroundColor={'#1DA1F2'}
        color={'#FFFFFF'}
        fontSize={'16px'}
        p={'1rem'}
        bottom={'1rem'}
        right={'1rem'}
        position={'fixed'}
        borderRadius={'full'}
      >
        <IoMdAdd size={'60px'} />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size={'auto'}>
        <ModalOverlay />
        <ModalContent w={{ base: '20rem', sm: '20rem', md: '35rem' }}>
          <ModalCloseButton />
          <ModalBody py={'3rem'}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack w={'100%'} justifyContent={'center'}>
                <VStack
                  w={'100%'}
                  py={'2rem'}
                  px={{ base: '1rem', sm: '1rem', md: '2rem' }}
                >
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
                      Project{' '}
                    </Text>
                  </HStack>
                  <Box w={'100%'}>
                    <FormControl isInvalid={errors.Content} isRequired>
                      <FormErrorMessage justifyContent={'center'}>
                        {' '}
                        {errors?.Content && errors.Content.message}{' '}
                      </FormErrorMessage>
                      <Stack>
                        <FormLabel
                          fontWeight={'400'}
                          fontFamily={'Prompt'}
                          textAlign={{
                            base: 'start',
                            sm: 'start',
                            md: 'start',
                          }}
                          fontSize={'16px'}
                          w={'100%'}
                          color={'#767262'}
                        >
                          ชื่อโปรเจค
                        </FormLabel>
                        <Input
                          fontFamily={'Prompt'}
                          fontSize={'16px'}
                          type={'text'}
                          {...register('project')}
                          w={'100%'}
                        />
                      </Stack>
                    </FormControl>
                    <HStack
                      flexDirection={{
                        base: 'column',
                        sm: 'column',
                        md: 'row',
                      }}
                    >
                      <FormControl pt={'1rem'}>
                        <Flex flexWrap={'wrap'} columnGap={[1, 2]}>
                          <FormLabel
                            fontWeight={'400'}
                            fontFamily={'Prompt'}
                            textAlign={{
                              base: 'start',
                              sm: 'start',
                              md: 'start',
                            }}
                            w={'100%'}
                            fontSize={'16px'}
                            color={'#767262'}
                          >
                            {' '}
                            เริ่มต้นสัญญา MA{' '}
                          </FormLabel>
                          <HStack
                            w='100%'
                            px={'0.25rem'}
                            py={'1rem'}
                            border={'1px'}
                            h={'40px'}
                            borderRadius={'5px'}
                            justifyContent='center'
                            borderColor={'gray.200'}
                          >
                            <DatePicker
                              style={{ width: '6rem' }}
                              dateFormat={'dd/MM/yyyy'}
                              selected={startDate}
                              onChange={date => {
                                setStartDate(date)
                              }}
                            />
                            <BsCalendar3 />
                          </HStack>
                        </Flex>
                      </FormControl>

                      <FormControl pt={'1rem'}>
                        <Flex flexWrap={'wrap'} columnGap={[1, 2]}>
                          <FormLabel
                            fontWeight={'400'}
                            fontFamily={'Prompt'}
                            w={'100%'}
                            fontSize={'16px'}
                            textAlign={{
                              base: 'start',
                              sm: 'start',
                              md: 'start',
                            }}
                            color={'#767262'}
                          >
                            {' '}
                            สิ้นสุดสัญญา MA{' '}
                          </FormLabel>
                          <HStack
                            px={'0.25rem'}
                            py={'0.5rem'}
                            border={'1px'}
                            h={'40px'}
                            borderRadius={'5px'}
                            w={'100%'}
                            borderColor={'gray.200'}
                          >
                            <DatePicker
                              dateFormat={'dd/MM/yyyy'}
                              selected={selecteEndDate}
                              onChange={endDate => {
                                setEndDate(endDate)
                              }}
                            />
                            <BsCalendar3 />
                          </HStack>
                        </Flex>
                      </FormControl>
                    </HStack>

                    <FormControl pt={'1rem'}>
                      <Stack>
                        <FormLabel
                          fontWeight={'400'}
                          fontFamily={'Prompt'}
                          w={'100%'}
                          fontSize={'16px'}
                          textAlign={{
                            base: 'start',
                            sm: 'start',
                            md: 'start',
                          }}
                          color={'#767262'}
                        >
                          {' '}
                          ค่าบริการ{' '}
                        </FormLabel>
                        <Input
                          fontFamily={'Prompt'}
                          fontSize={'16px'}
                          type={'number'}
                          {...register('price')}
                          w={'100%'}
                        />
                      </Stack>
                    </FormControl>

                    <HStack justifyContent={'center'} mt={'2rem'}>
                      <Button
                        onClick={() => reset()}
                        fontFamily={'Prompt'}
                        fontStyle={'normal'}
                        fontSize={'16px'}
                        fontWeight={'400'}
                        color={'#FFFFFF'}
                        colorScheme={'gray.400'}
                        backgroundColor={'gray.400'}
                        width={'104px'}
                        height={'40px'}
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
                        colorScheme={'#1DA1F2'}
                        width={'115px'}
                        height={'40px'}
                      >
                        {' '}
                        เพิ่ม{' '}
                      </Button>
                    </HStack>
                  </Box>
                </VStack>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

function Work({ user }) {
  const [Project, setProject] = useState([])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id } = useParams()
  const [Company, setCompany] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [content, setContent] = useState({})
  const [search, setSearch] = useState([])

  const fetchData = useCallback(async () => {
    const ProjectDoc = query(
      collection(db, 'MAProjects'),
      orderBy('createdAt', 'desc')
    )
    onSnapshot(ProjectDoc, snapshot => {
      return setProject(
        snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      )
    })
    const CompanyDoc = doc(db, 'MACompany', id)
    onSnapshot(CompanyDoc, snapshot => {
      return setCompany({
        id: snapshot.id,
        ...snapshot.data(),
      })
    })
    const search = collection(db, 'MAProjects')
    onSnapshot(search, snapshot => {
      return setSearch(
        snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      )
    })
    //eslint-disable-next-line
  }, [])
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    fetchData()
    //eslint-disable-next-line
  }, [])
  return (
    <Box
      minH={'100vh'}
      h={'full'}
      mb={'3rem'}
      backgroundColor={'#FFFFFF'}
      pt={'2rem'}
    >
      <Button
        as={Link}
        to={'/'}
        position={'absolute'}
        top={{ base: '2rem', sm: '2rem', md: '1rem' }}
        leftIcon={<IoIosArrowBack color='#1DA1F2' size={'20px'} />}
        left={{ base: '0rem', sm: '0rem', md: '1rem', lg: '2rem', xl: '3rem' }}
        colorScheme='white'
      />

      {!isLoading && Company ? (
        <>
          <Center w={'100%'}>
            <HStack
              w={'90%'}
              alignItems={'flex-end'}
              justifyContent={'space-between'}
              mb={'1rem'}
            >
              <VStack
                pt={'1rem'}
                justifyContent={'flex-start'}
                alignItems={'flex-star'}
                spacing={'2px'}
              >
                <Text
                  fontWeight={'600'}
                  lineHeight={'25.2px'}
                  fontSize={'18px'}
                  fontFamily={'Prompt'}
                >
                  {' '}
                  ข้อมูล Project{' '}
                </Text>
                <Text fontSize={'16px'} fontFamily={'Prompt'} color={'#000000'}>
                  {' '}
                  ข้อมูล Project ทั้งหมดของบริษัท {Company?.NameCompany}{' '}
                </Text>
              </VStack>
              <Stack pb={'0.5rem'}>
                <AddWork user={user} />
              </Stack>
            </HStack>
          </Center>
          <Center w={'100%'}>
            <Flex w={'90%'} flexWrap={'wrap'} justifyContent={'space-between'}>
              <Box
                mt={'1rem'}
                mb={{ base: '0.5', sm: '0.5', md: '0.5', lg: '0.5', xl: '0.5' }}
              >
                <InputGroup borderRadius={'20px'} backgroundColor={'#FFFFFF'}>
                  <InputLeftElement
                    pointerEvents='none'
                    children={<SearchIcon color='black' />}
                  />
                  <Input
                    type='text'
                    borderRadius={'5px'}
                    color={'#94A5B7'}
                    fontSize={'14px'}
                    placeholder='ค้นหา Project'
                    fontFamily={'Kanit'}
                    onChange={event => {
                      let keyword = event.currentTarget.value
                      const fuse = new Fuse(search, {
                        keys: ['project', 'price'],
                        findAllMatches: true,
                        shouldSort: true,
                      })
                      const results = fuse.search(keyword)

                      const searchResults =
                        keyword === ''
                          ? search
                          : results.map(value => value.item)
                      setProject(searchResults)
                    }}
                  />
                </InputGroup>
              </Box>
            </Flex>
          </Center>
          <Center overflow mt={'1rem'}>
            <TableContainer
              borderRadius={'15px'}
              border={'1px'}
              borderColor={'#f4f4f4'}
              w={'90%'}
              mt={'-1rem'}
            >
              <Table variant='simple' width={'100%'}>
                <Thead>
                  <Tr backgroundColor={'#f4f4f4'} color={'#666666'}>
                    <Th
                      fontFamily={'Prompt'}
                      fontSize={'14px'}
                      textAlign={'center'}
                      fontWeight={'600'}
                    >
                      ลำดับที่
                    </Th>
                    <Th
                      fontFamily={'Prompt'}
                      fontSize={'14px'}
                      fontWeight={'600'}
                    >
                      ชื่อโปรเจค
                    </Th>
                    <Th
                      fontFamily={'Prompt'}
                      fontSize={'14px'}
                      fontWeight={'600'}
                    >
                      เริ่มต้นสัญญา MA
                    </Th>
                    <Th
                      fontFamily={'Prompt'}
                      fontSize={'14px'}
                      fontWeight={'600'}
                    >
                      สิ้นสุดสัญญา MA
                    </Th>
                    <Th
                      fontFamily={'Prompt'}
                      fontSize={'14px'}
                      fontWeight={'600'}
                    >
                      ค่าบริการ
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
                <Tbody>
                  {Project.filter(Project => Project?.companyID === id)?.map(
                    (rs, index) => {
                      const isDate = new Date(rs?.endDate).getTime()
                      const now = new Date().getTime()
                      return (
                        <Tr bg={now > isDate ? 'red.100' : '#fff'} key={index}>
                          <Td
                            fontFamily={'Prompt'}
                            fontSize={'12px'}
                            textAlign={'center'}
                            fontWeight={'600'}
                          >
                            <Link to={`/formWork/${id}/${rs.id}`}>
                              <Center w={'100%'} h={'100%'}>
                                {index + 1}
                              </Center>
                            </Link>
                          </Td>
                          <Td
                            fontFamily={'Prompt'}
                            fontSize={'12px'}
                            fontWeight={'600'}
                          >
                            <Link to={`/formWork/${id}/${rs.id}`}>
                              <Box w={'100%'} h={'100%'}>
                                {rs?.project}
                              </Box>
                            </Link>
                          </Td>
                          <Td
                            fontFamily={'Prompt'}
                            fontSize={'12px'}
                            fontWeight={'600'}
                          >
                            {rs?.startDate ? (
                              <Link to={`/formWork/${id}/${rs.id}`}>
                                <Box w={'100%'} h={'100%'}>
                                  {moment(rs?.startDate?.toDate()).format(
                                    'DD-MM-YYYY'
                                  )}
                                </Box>
                              </Link>
                            ) : (
                              <Link to={`/formWork/${id}/${rs.id}`}>
                                <Box w={'100%'} h={'100%'}></Box>
                              </Link>
                            )}
                          </Td>
                          <Td
                            fontFamily={'Prompt'}
                            fontSize={'12px'}
                            fontWeight={'600'}
                          >
                            {rs?.endDate ? (
                              <Link to={`/formWork/${id}/${rs.id}`}>
                                <Box w={'100%'} h={'100%'}>
                                  {moment(rs?.endDate?.toDate()).format(
                                    'DD-MM-YYYY'
                                  )}
                                </Box>
                              </Link>
                            ) : (
                              <Link to={`/formWork/${id}/${rs.id}`}>
                                <Box w={'100%'} h={'100%'}></Box>
                              </Link>
                            )}
                          </Td>
                          <Td
                            fontFamily={'Prompt'}
                            fontSize={'12px'}
                            fontWeight={'600'}
                          >
                            <Link to={`/formWork/${id}/${rs.id}`}>
                              <Box w={'100%'} h={'100%'}>
                                {accounting.formatNumber(rs.price, 2)}
                              </Box>
                            </Link>{' '}
                          </Td>
                          <Td
                            fontFamily={'Prompt'}
                            fontSize={'12px'}
                            fontWeight={'600'}
                          >
                            <Menu>
                              <MenuButton
                                as={IconButton}
                                colorScheme={now > isDate ? 'red.100' : '#fff'}
                                backgroundColor={
                                  now > isDate ? 'red.100' : '#fff'
                                }
                                icon={
                                  <BiDotsHorizontalRounded
                                    size={'25px'}
                                    color={'#1DA1F2'}
                                  />
                                }
                              />

                              <MenuList>
                                <MenuItem backgroundColor={'white'}>
                                  <ViweProject id={rs?.id} />
                                </MenuItem>
                                <MenuItem backgroundColor={'white'}>
                                  <Button
                                    onClick={() => {
                                      onOpen()
                                      user = { user }
                                      setContent(rs)
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
                                </MenuItem>
                                <MenuItem backgroundColor={'white'}>
                                  <CardContract data={rs} id={id} />
                                </MenuItem>
                                <MenuItem>
                                  <DelEditWork item={rs} Pid={rs?.id} />
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </Td>
                        </Tr>
                      )
                    }
                  )}
                </Tbody>
              </Table>
            </TableContainer>
          </Center>
        </>
      ) : (
        <Center h={'80vh'} w={'100%'}>
          <Spinner size='xl' class='loader'></Spinner>
        </Center>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={'auto'}>
        <ModalOverlay />
        <ModalContent w={{ base: '20rem', sm: '20rem', md: '35rem' }}>
          <ModalCloseButton />
          <ModalBody py={'3rem'}>
            <EditCardWork
              data={content}
              id={content.id}
              user={user}
              onClose={onClose}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
export default Work
