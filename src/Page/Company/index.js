import {
  Box,
  Button,
  VStack,
  Text,
  Tbody,
  Thead,
  Center,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  useDisclosure,
  Menu,
  MenuButton,
  IconButton,
  MenuList,
  MenuItem,
  Spinner,
  TableContainer,
  HStack,
  InputGroup,
  InputLeftElement,
  Input,
  Flex,
} from '@chakra-ui/react'
import React, { useCallback, useEffect, useState } from 'react'
import { collection, doc, deleteDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../Config'
import { Table, Stack, Td, Tr, Th } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { MdDelete } from 'react-icons/md'
import { BiDotsHorizontalRounded } from 'react-icons/bi'
import FormCompany from '../../Component/FormCompany'
import ViweCompany from './view'
import Fuse from 'fuse.js'
import { SearchIcon } from '@chakra-ui/icons'

function DelEditCompany({ item, fetchData }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const cancelRef = React.useRef()
  const handleRemove = async id => {
    const bookDoc = doc(db, 'MACompany', id)
    await deleteDoc(bookDoc).then(async () => {
      await fetchData()
    })
  }

  return (
    <>
      <Button
        colorScheme='#FFFFFF'
        w={'100%'}
        justifyContent={'flex-start'}
        color={'#FF3E3E'}
        onClick={onOpen}
        fontSize={'16px'}
        fontFamily={'Prompt'}
        fontWeight={'400'}
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
                fontFamily={'Prompt'}
                fontSize={'14px'}
                fontWeight={'600'}
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

function Company({ user }) {
  const [Company, setCompany] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState([])

  const fetchData = useCallback(async () => {
    const CompanyDoc = collection(db, 'MACompany')
    onSnapshot(CompanyDoc, snapshot => {
      return setCompany(
        snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      )
    })
    const search = collection(db, 'MACompany')
    onSnapshot(search, snapshot => {
      return setSearch(
        snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      )
    })
  }, [])

  useEffect(() => {
    fetchData()
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [fetchData])
  return (
    <>
      <Box minH={'100vh'} h={'full'} backgroundColor={'#FFFFFF'}>
        {!isLoading ? (
          <>
            <Center w={'100%'} mb={'1rem'}>
              <HStack
                w={'90%'}
                justifyContent={'space-between '}
                alignItems={'flex-end'}
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
                    ข้อมูลลูกค้า{' '}
                  </Text>
                  <Text
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                    color={'#000000'}
                  >
                    {' '}
                    บริการหลังการขายของลูกค้าทั้งหมด{' '}
                  </Text>
                </VStack>
                <Stack pb={'0.5rem'}>
                  <FormCompany user={user} />
                </Stack>
              </HStack>
            </Center>

            <Center>
              <Flex
                justifyContent={'space-between'}
                w={'90%'}
                alignItems={'end'}
                flexWrap={'wrap'}
              >
                <Box
                  mt={'1rem'}
                  mb={{
                    base: '0.5rem',
                    sm: '0.5rem',
                    md: '0.5rem',
                    lg: '0.5rem',
                    xl: '0.5rem',
                  }}
                >
                  <InputGroup borderRadius={'20px'} backgroundColor={'#FFFFFF'}>
                    <InputLeftElement
                      pointerEvents='none'
                      children={<SearchIcon color='black' />}
                    />
                    <Input
                      type='text'
                      borderRadius={'5px'}
                      placeholder='ค้นหาลูกค้า'
                      fontFamily={'Kanit'}
                      fontSize={'14px'}
                      color={'#94A5B7'}
                      onChange={event => {
                        let keyword = event.currentTarget.value
                        const fuse = new Fuse(search, {
                          keys: ['nameCompany', 'phone', 'name'],
                          findAllMatches: true,
                          shouldSort: true,
                        })
                        const results = fuse.search(keyword)

                        const searchResults =
                          keyword === ''
                            ? search
                            : results.map(value => value.item)
                        setCompany(searchResults)
                      }}
                    />
                  </InputGroup>
                </Box>
              </Flex>
            </Center>
            <Center overflow w={'full'}>
              <TableContainer
                borderRadius={'15px'}
                border={'1px'}
                borderColor={'#f4f4f4'}
                w={'90%'}
              >
                <Table>
                  <Thead>
                    <Tr backgroundColor={'#f4f4f4'} color={'#666666'}>
                      <Th>
                        <Text
                          fontFamily={'Prompt'}
                          textAlign={'center'}
                          fontSize={'14px'}
                          fontWeight={'600'}
                        >
                          ลำดับที่{' '}
                        </Text>
                      </Th>

                      <Th>
                        <Text
                          fontFamily={'Prompt'}
                          fontSize={'14px'}
                          fontWeight={'600'}
                        >
                          ชื่อบริษัท{' '}
                        </Text>
                      </Th>

                      <Th>
                        <Text
                          fontFamily={'Prompt'}
                          fontSize={'14px'}
                          fontWeight={'600'}
                        >
                          ชื่อผู้ติดต่อ{' '}
                        </Text>
                      </Th>
                      <Th>
                        <Text
                          fontFamily={'Prompt'}
                          fontSize={'14px'}
                          fontWeight={'600'}
                        >
                          เบอร์โทรติดต่อ{' '}
                        </Text>
                      </Th>
                      <Th>
                        <Text
                          fontFamily={'Prompt'}
                          fontSize={'14px'}
                          fontWeight={'600'}
                        >
                          การจัดการ{' '}
                        </Text>
                      </Th>
                    </Tr>
                  </Thead>
                  {Company?.map((rs, title) => {
                    return (
                      <Tbody key={title}>
                        <Td
                          h={'full'}
                          fontFamily={'Prompt'}
                          textAlign={'center'}
                          fontSize={'12px'}
                          fontWeight={'600'}
                        >
                          <Link to={`/work/${rs.id}`}>
                            <Center w={'100%'} h={'100%'}>
                              {title + 1}
                            </Center>
                          </Link>
                        </Td>
                        <Td
                          fontFamily={'Prompt'}
                          fontSize={'12px'}
                          fontWeight={'600'}
                        >
                          <Link to={`/work/${rs.id}`}>
                            <Box w={'100%'} h={'100%'}>
                              {rs.nameCompany}
                            </Box>
                          </Link>
                        </Td>
                        <Td
                          fontFamily={'Prompt'}
                          fontSize={'12px'}
                          fontWeight={'600'}
                        >
                          <Link to={`/work/${rs.id}`}>
                            <Box w={'100%'} h={'100%'}>
                              {rs.name}
                            </Box>
                          </Link>
                        </Td>

                        <Td
                          fontFamily={'Prompt'}
                          fontSize={'12px'}
                          fontWeight={'600'}
                        >
                          <Link to={`/work/${rs.id}`}>
                            <Box w={'100%'} h={'100%'}>
                              {rs.phone}
                            </Box>
                          </Link>
                        </Td>

                        <Td>
                          <Menu>
                            <MenuButton
                              as={IconButton}
                              colorScheme={'white'}
                              backgroundColor={'white'}
                              icon={
                                <BiDotsHorizontalRounded
                                  size={'25px'}
                                  color={'#1DA1F2'}
                                />
                              }
                            />
                            {/* </MenuButton> */}
                            <MenuList
                              _checked={'#FFFFFF'}
                              backgroundColor={'white'}
                            >
                              <MenuItem backgroundColor={'white'}>
                                <ViweCompany id={rs?.id} />
                              </MenuItem>
                              <MenuItem backgroundColor={'whiter'}>
                                <FormCompany user={user} data={rs} id={rs.id} />
                              </MenuItem>
                              <MenuItem backgroundColor={'whiter'}>
                                {' '}
                                <DelEditCompany
                                  fetchData={fetchData}
                                  item={rs}
                                  id={rs?.id}
                                />{' '}
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
      </Box>
    </>
  )
}

export default Company
