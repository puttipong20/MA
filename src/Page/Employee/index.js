import {
  Avatar,
  Box,
  Center,
  HStack,
  SimpleGrid,
  Spinner,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { collection, onSnapshot } from 'firebase/firestore'
import React, { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../../Config'
import '../../Spinner.css'

// function DelEditUsers({ item, id, fetchData }) {
//   const { isOpen, onOpen, onClose } = useDisclosure()

//   const cancelRef = React.useRef()
//   const handleRemove = async id => {
//     const bookDoc = doc(db, 'Users', id)
//     await deleteDoc(bookDoc)
//     await fetchData()
//   }

//   return (
//     <>
//       <IconButton
//         colorScheme='white'
//         color={'#FF3E3E'}
//         onClick={onOpen}
//         rightIcon={<MdDelete size={'20px'} />}
//       />
//       <AlertDialog
//         isOpen={isOpen}
//         leastDestructiveRef={cancelRef}
//         onClose={onClose}
//       >
//         <AlertDialogOverlay>
//           <AlertDialogContent>
//             <AlertDialogHeader fontSize='lg' fontWeight='bold'>
//               ลบข้อมูล
//             </AlertDialogHeader>

//             <AlertDialogBody>คุณต้องการลบข้อมูล ใช่หรือไม่</AlertDialogBody>

//             <AlertDialogFooter>
//               <Button
//                 fontFamily={'Prompt'}
//                 fontSize={'14px'}
//                 fontWeight={'600'}
//                 ref={cancelRef}
//                 onClick={onClose}
//               >
//                 ยกเลิก
//               </Button>
//               <Button
//                 fontFamily={'Prompt'}
//                 fontSize={'14px'}
//                 fontWeight={'600'}
//                 colorScheme='red'
//                 onClick={() => {
//                   handleRemove(item.id)
//                   onClose()
//                 }}
//                 ml={3}
//               >
//                 ลบข้อมูล
//               </Button>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialogOverlay>
//       </AlertDialog>
//     </>
//   )
// }

function Employee({ user }) {
  const [Users, setUsers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const fetchData = useCallback(async () => {
    const UsersDoc = collection(db, 'Users')
    onSnapshot(UsersDoc, snapshot => {
      return setUsers(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })))
    })
  }, [])

  useEffect(() => {
    fetchData()
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [fetchData])
  return (
    <Box minH={'100vh'} h={'full'} backgroundColor={'#FFFFFF'}>
      {!isLoading && Users ? (
        <>
          <VStack w={'100%'} justifyContent={'center'}>
            <SimpleGrid
              columns={[1, 2]}
              w={'90%'}
              justifyContent={'space-between'}
              mb={'-0.5rem'}
              alignItems={'end'}
            >
              <Stack w={'100%'} alignItems={'center'}>
                <VStack
                  w={'90%'}
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
                    ข้อมูลผู้ใช้งาน{' '}
                  </Text>
                  <Text fontSize={'16px'} fontFamily={'Prompt'} color={'black'}>
                    {' '}
                    รวมข้อมูลผู้ใช้งานทั้งหมด{' '}
                  </Text>
                </VStack>
              </Stack>
            </SimpleGrid>
            <VStack
              w={{ base: '100%', sm: '100%', md: '90%', lg: '90%', xl: '90%' }}
              spacing={'2rem'}
              borderRadius={'16px'}
            >
              <SimpleGrid
                w={'100%'}
                spacing={'1rem'}
                columns={[2, 3, 4, 5, 7, 8]}
                pt={'1rem'}
                px={{ base: '1rem', sm: '1rem', md: '0rem' }}
                justifyContent={'start'}
                alignItems={'start'}
              >
                {Users?.map((rs, index) => {
                  return (
                    <Stack
                      alignItems={'start'}
                      key={index}
                      w={'full'}
                      h={'260px'}
                    >
                      <Stack
                        justifyContent={'center'}
                        w={'full'}
                        key={index}
                        p={'1rem'}
                        border={'1px'}
                        h={'full'}
                        borderRadius={'15px'}
                        borderColor={'gray.200'}
                      >
                        <Stack>
                          <Center as={Link} to={`/viweEmployee/${rs?.id}`}>
                            <Avatar
                              borderRadius={'15px'}
                              src={rs?.img}
                              h={'128px'}
                              w={'128px'}
                              objectFit={'cover'}
                            />
                          </Center>
                          <HStack justifyContent={'center'}>
                            <Text
                              fontWeight={'light'}
                              textAlign={'center'}
                              color={'black'}
                              fontSize={'16px'}
                              fontFamily={'Prompt'}
                              noOfLines={'1'}
                            >
                              {' '}
                              {rs?.name} {rs?.lname}{' '}
                            </Text>
                          </HStack>
                          <Text
                            fontWeight={'light'}
                            w={'100%'}
                            textAlign={'center'}
                            color={'black'}
                            fontSize={'16px'}
                            fontFamily={'Prompt'}
                            noOfLines={'1'}
                          >
                            {' '}
                            {rs?.position}{' '}
                          </Text>
                        </Stack>
                      </Stack>
                    </Stack>
                  )
                })}
              </SimpleGrid>
            </VStack>
          </VStack>
        </>
      ) : (
        <Center h={'80vh'} w={'100%'}>
          <Spinner size='xl' class='loader'></Spinner>
        </Center>
      )}
    </Box>
  )
}

export default Employee
