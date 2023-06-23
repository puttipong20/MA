import {
  Box,
  Center,
  HStack,
  Image,
  Spinner,
  Text,
  VStack,
} from '@chakra-ui/react'
import { doc, onSnapshot } from 'firebase/firestore'
import React, { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { db } from '../../Config'

function ViweEmployee() {
  const [Users, setUsers] = useState([])
  const { id } = useParams()
  const fetchData = useCallback(async () => {
    const UsersDoc = doc(db, 'Users', id)
    onSnapshot(UsersDoc, snapshot => {
      return setUsers({
        id: snapshot.id,
        ...snapshot.data(),
      })
    })
  }, [id])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    fetchData()
  }, [fetchData])

  return (
    <Box minH={'100vh'} h={'full'} backgroundColor={'white'}>
      {!isLoading && Users ? (
        <>
          <VStack w={'100%'} justifyContent={'center'}>
            <HStack w={'80%'} mb={'-0.5rem'}>
              <Link to={'/employee'}>
                {' '}
                <Text
                  fontWeight={'bold'}
                  textAlign={'start'}
                  color={'#1DA1F2'}
                  fontSize={'16px'}
                  fontFamily={'Prompt'}
                >
                  {' '}
                  ข้อมูลผู้ใช้งานระบบ{' '}
                </Text>{' '}
              </Link>
              <Text
                fontWeight={'bold'}
                textAlign={'start'}
                color={'#6C6C6C'}
                fontSize={'16px'}
                fontFamily={'Prompt'}
              >
                {' '}
                /ดูข้อมูลผู้ใช้งานระบบ
              </Text>
            </HStack>
            <VStack
              justifyContent={'center'}
              w={'80%'}
              border={'1px'}
              borderColor={'gray.200'}
              borderRadius={'15px'}
              p={'2rem'}
            >
              <Image
                h={'200px'}
                w={'200px'}
                borderRadius={'15px'}
                objectFit={'cover'}
                src={Users?.img}
              />
              <HStack>
                <Text
                  fontWeight={'bold'}
                  textAlign={'start'}
                  color={'#1DA1F2'}
                  fontSize={'16px'}
                  fontFamily={'Prompt'}
                >
                  {' '}
                  {Users?.name}
                </Text>
                <Text
                  fontWeight={'bold'}
                  textAlign={'start'}
                  color={'#1DA1F2'}
                  fontSize={'16px'}
                  fontFamily={'Prompt'}
                >
                  {' '}
                  {Users?.lname}
                </Text>
              </HStack>
              <Text
                fontWeight={'bold'}
                textAlign={'start'}
                color={'#1DA1F2'}
                fontSize={'16px'}
                fontFamily={'Prompt'}
              >
                {' '}
                {Users?.position}
              </Text>
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

export default ViweEmployee
