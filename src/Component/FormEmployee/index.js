import { doc, updateDoc } from 'firebase/firestore'
import { httpsCallable } from 'firebase/functions'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { db, functions, storage } from '../../Config'
import Resizer from 'react-image-file-resizer'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import {
  Avatar,
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  Spinner,
  Stack,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react'

const createUser = httpsCallable(functions, 'createUser')

const resizeFile = file =>
  new Promise(resolve => {
    Resizer.imageFileResizer(
      file,
      500,
      500,
      'JPEG',
      100,
      0,
      uri => {
        resolve(uri)
      },
      'base64'
    )
  })

function FormEmployee({ data }) {
  const [img, setImg] = useState()
  const { id } = useParams()
  const [avatar, setAvatar] = useState([])
  const Navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  })
  useEffect(() => {
    if (data) {
      setAvatar(data?.img)
      setValue('name', data?.name)
      // setValue('lname', data?.lname)
      setValue('img', data?.img || '')
      setValue('position', data?.position)
    }
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
    //eslint-disable-next-line
  }, [data])
  const [isLoading, setIsLoading] = useState(true)

  const hiddenFileInput = useRef(null)
  function handleUploadClick() {
    hiddenFileInput.current?.click()
  }
  async function handleUpload(event) {
    const target = event.target
    const file = target.files[0]
    const image = await resizeFile(file)
    if (file) {
      setImg(image)
    }
  }

  const toast = useToast()

  const onSubmit = async value => {
    if (id) {
      const UsersDoc = doc(db, 'Users', id)
      try {
        updateDoc(UsersDoc, value)
          .then(() => {
            if (img) {
              const ImageRef = ref(
                storage,
                `Users/${id}/${new Date().getTime()}`
              )
              return uploadString(ImageRef, img, 'data_url').then(async () => {
                const downloadURL = await getDownloadURL(ImageRef)
                return updateDoc(UsersDoc, { img: downloadURL })
              })
            }
          })
          .then(() => {
            toast({
              title: 'แก้ไขผู้ใช้ระบบสำเร็จ',
              status: 'success',
              duration: 1000,
              isClosable: true,
              position: 'top',
            })
          })
          .catch(e => {
            toast({
              title: `แก้ไขผู้ใช้ไม่สำเร็จ`,
              status: 'error',
              duration: 1000,
              isClosable: true,
              position: 'top',
            })
          })
      } catch (error) {
        console.log(error.message)
      }
    } else {
      const allValue = { ...value, img: img }
      createUser(allValue)
        .then(res => {
          const { id } = res.data
          if (img) {
            const ImageRef = ref(storage, `Users/${id}/${new Date().getTime()}`)
            return uploadString(ImageRef, img, 'data_url').then(async () => {
              return getDownloadURL(ImageRef).then(URLs => {
                return updateDoc(doc(db, 'Users', id), { img: URLs })
              })
            })
          }
        })
        .then(() => {
          toast({
            title: 'เพิ่มผู้ใช้ระบบสำเร็จ',
            status: 'success',
            duration: 1000,
            isClosable: true,
            position: 'top',
          })
        })
        .catch(e => {
          toast({
            title: `เพิ่มผู้ใช้ไม่สำเร็จเนื่องจาก Email ซ้ำ `,
            status: 'error',
            duration: 1000,
            isClosable: true,
            position: 'top',
          })
        })
    }

    await Navigate('/employee')
  }

  return (
    <Box minH={'100vh'} h={'full'} backgroundColor={'white'}>
      {!isLoading ? (
        <>
          <VStack justifyContent={'center'} w={'100%'}>
            <HStack w={'90%'} mb={'-0.5rem'}>
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
              {id ? (
                <Text
                  fontWeight={'bold'}
                  textAlign={'start'}
                  color={'#6C6C6C'}
                  fontSize={'16px'}
                  fontFamily={'Prompt'}
                >
                  {' '}
                  /แก้ไขข้อมูลผู้ใช้งานระบบ{' '}
                </Text>
              ) : (
                <Text
                  fontWeight={'bold'}
                  textAlign={'start'}
                  color={'#6C6C6C'}
                  fontSize={'16px'}
                  fontFamily={'Prompt'}
                >
                  {' '}
                  /เพิ่มข้อมูลผู้ใช้งานระบบ{' '}
                </Text>
              )}
            </HStack>

            <VStack
              w={'90%'}
              border={'1px'}
              borderColor={'gray.200'}
              borderRadius={'15px'}
              p={'2rem'}
              justifyContent={'center'}
            >
              <Stack w={'100%'} justifyContent={'center'} alignItems={'center'}>
                <Avatar
                  bg={'#E2E8F0'}
                  src={img ? img : avatar}
                  w={'128px'}
                  h={'128px'}
                  onClick={handleUploadClick}
                ></Avatar>
                <Input
                  display={'none'}
                  type={'file'}
                  ref={hiddenFileInput}
                  onChange={handleUpload}
                ></Input>
              </Stack>

              <form onSubmit={handleSubmit(onSubmit)}>
                <VStack>
                  <FormControl isInvalid={errors.name} isRequired mt={'1rem'}>
                    <FormErrorMessage justifyContent={'center'}>
                      {' '}
                      {errors?.name && errors.name.message}{' '}
                    </FormErrorMessage>
                    <Flex
                      justifyContent={{
                        base: 'start',
                        sm: 'start',
                        md: 'center',
                      }}
                      flexWrap={'wrap'}
                    >
                      <FormLabel
                        fontFamily={'Prompt'}
                        fontWeight={'400'}
                        textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                        fontSize={'18px'}
                        w={'100px'}
                        color={'#767262'}
                      >
                        ชื่อ - นาสกุล
                      </FormLabel>
                      <Input
                        width={{
                          base: '100%',
                          sm: '100%',
                          md: '300px',
                          lg: '350px',
                          xl: '350px',
                        }}
                        fontFamily={'Prompt'}
                        fontSize={'18px'}
                        h={'48px'}
                        type={'text'}
                        {...register('name')}
                      />
                    </Flex>
                  </FormControl>
                  {/* <FormControl isInvalid={errors.lname} isRequired>
                    <FormErrorMessage justifyContent={'center'}>
                      {' '}
                      {errors?.lname && errors.lname.message}{' '}
                    </FormErrorMessage>
                    <Flex
                      justifyContent={{
                        base: 'start',
                        sm: 'start',
                        md: 'center',
                      }}
                      flexWrap={'wrap'}
                    >
                      <FormLabel
                        textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                        fontFamily={'Prompt'}
                        fontWeight={'400'}
                        fontSize={'18px'}
                        w={'100px'}
                        color={'#767262'}
                      >
                        นามสกุล
                      </FormLabel>
                      <Input
                        width={{
                          base: '100%',
                          sm: '100%',
                          md: '300px',
                          lg: '350px',
                          xl: '350px',
                        }}
                        fontFamily={'Prompt'}
                        fontSize={'18px'}
                        h={'48px'}
                        type={'text'}
                        {...register('lname')}
                      />
                    </Flex>
                  </FormControl> */}
                  <FormControl isInvalid={errors.position} isRequired>
                    <FormErrorMessage justifyContent={'center'}>
                      {' '}
                      {errors?.position && errors.position.message}{' '}
                    </FormErrorMessage>
                    <Flex
                      justifyContent={{
                        base: 'start',
                        sm: 'start',
                        md: 'center',
                      }}
                      flexWrap={'wrap'}
                    >
                      <FormLabel
                        textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                        fontFamily={'Prompt'}
                        fontWeight={'400'}
                        fontSize={'18px'}
                        w={'100px'}
                        color={'#767262'}
                      >
                        ตำแหน่ง
                      </FormLabel>
                      <Input
                        width={{
                          base: '100%',
                          sm: '100%',
                          md: '300px',
                          lg: '350px',
                          xl: '350px',
                        }}
                        fontFamily={'Prompt'}
                        fontSize={'18px'}
                        h={'48px'}
                        type={'text'}
                        {...register('position')}
                      />
                    </Flex>
                  </FormControl>
                  {id ? (
                    <></>
                  ) : (
                    <>
                      <FormControl isInvalid={errors.username} isRequired>
                        <FormErrorMessage>
                          {errors?.username && errors.username.message}
                        </FormErrorMessage>
                        <Flex
                          justifyContent={{
                            base: 'start',
                            sm: 'start',
                            md: 'center',
                          }}
                          flexWrap={'wrap'}
                        >
                          <FormLabel
                            textAlign={{
                              base: 'start',
                              sm: 'start',
                              md: 'start',
                            }}
                            fontFamily={'Prompt'}
                            fontWeight={'400'}
                            fontSize={'18px'}
                            w={'100px'}
                            color={'#767262'}
                          >
                            อีเมล
                          </FormLabel>
                          <Input
                            type={'username'}
                            fontFamily={'Prompt'}
                            {...register('username')}
                            width={{
                              base: '100%',
                              sm: '100%',
                              md: '300px',
                              lg: '350px',
                              xl: '350px',
                            }}
                            mt={'10px'}
                            bg={'white'}
                          />
                        </Flex>
                      </FormControl>

                      <FormControl isInvalid={errors.password} isRequired>
                        <FormErrorMessage>
                          {errors?.password && errors.password.message}
                        </FormErrorMessage>
                        <Flex
                          justifyContent={{
                            base: 'start',
                            sm: 'start',
                            md: 'center',
                          }}
                          flexWrap={'wrap'}
                        >
                          <FormLabel
                            textAlign={{
                              base: 'start',
                              sm: 'start',
                              md: 'start',
                            }}
                            fontFamily={'Prompt'}
                            fontWeight={'400'}
                            fontSize={'18px'}
                            w={'100px'}
                            color={'#767262'}
                          >
                            รหัสผ่าน
                          </FormLabel>
                          <Input
                            type={'password'}
                            fontFamily={'Prompt'}
                            {...register('password')}
                            width={{
                              base: '100%',
                              sm: '100%',
                              md: '300px',
                              lg: '350px',
                              xl: '350px',
                            }}
                            mt={'10px'}
                            bg={'white'}
                          />
                        </Flex>
                      </FormControl>
                    </>
                  )}
                </VStack>
                <Center mt={'2rem'}>
                  <Button
                    type='submit'
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
                </Center>
              </form>
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

export default FormEmployee
