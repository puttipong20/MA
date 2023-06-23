import React, { useEffect, useState } from 'react'
import {
  Box,
  VStack,
  Text,
  HStack,
  Stack,
  Input,
  Textarea,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Flex,
} from '@chakra-ui/react'
import { Controller, useForm } from 'react-hook-form'
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../Config'
import { RiEditLine } from 'react-icons/ri'
import { IoMdAdd } from 'react-icons/io'

function FormCompany({ data, id, user }) {
  const toast = useToast()
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    control,
    reset,
  } = useForm({
    defaultValues: {},
  })
  const dateCreate = new Date()
  const iSdateCreate = dateCreate.getTime()
  const UpdateCreate = new Date()
  const isUpdateCreate = UpdateCreate.getTime()

  useEffect(() => {
    if (data) {
      setValue('name', data?.name)
      setValue('nameCompany', data?.nameCompany)
      setValue('addCompany', data?.addCompany)
      setValue('phone', data?.phone)
      setValue('taxNumber', data?.taxNumber)
      setValue('group', data?.group)
    }
    //eslint-disable-next-line
  }, [user, iSdateCreate, data, isUpdateCreate])
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isSubmit, setIsSubmit] = useState(false)

  const onSubmit = async value => {
    setIsSubmit(true)
    if (id) {
      const DocRef = doc(db, 'MACompany', id)
      await updateDoc(DocRef, {
        ...value,
        updatedBy: user?.uid,
        updatedAt: new Date(),
      })
        .then(() => {
          onClose()
          reset()
          toast({
            title: 'อัพเดทบริษัทสำเร็จ',
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
            title: 'อัพเดทบริษัทไม่สำเร็จ',
            status: 'error',
            duration: 2000,
            isClosable: true,
            position: 'top',
          })
        })
    } else {
      setIsSubmit(true)
      const DocCollect = collection(db, 'MACompany')
      await addDoc(DocCollect, {
        ...value,
        createdBy: user?.uid,
        createdAt: new Date(),
      })
        .then(() => {
          toast({
            title: 'เพิ่มบริษัทสำเร็จ',
            status: 'success',
            duration: 2000,
            isClosable: true,
            position: 'top',
          })
          setIsSubmit(false)
          onClose()
          reset()
        })
        .catch(e => {
          console.error(e)
          toast({
            title: `เพิ่มบริษัทไม่สำเร็จ`,
            status: 'error',
            duration: 2000,
            isClosable: true,
            position: 'top',
          })
        })
    }
  }
  return (
    <>
      {data ? (
        <Button
          w={'100%'}
          color={'green'}
          fontSize={'16px'}
          onClick={onOpen}
          justifyContent={'flex-start'}
          colorScheme={'white'}
          fontFamily={'Prompt'}
          fontWeight={'400'}
          leftIcon={<RiEditLine color='green' />}
        >
          แก้ไข
        </Button>
      ) : (
        <Box>
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
            เพิ่มข้อมูลลูกค้า
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
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={onClose} size={'auto'}>
        <ModalOverlay />
        <ModalContent w={{ base: '90%', sm: '90%', md: '30rem' }}>
          {/* <ModalHeader>เพิ่มข้อมูลลูกค้า</ModalHeader> */}
          <ModalCloseButton />
          <ModalBody py={'3rem'}>
            <form onSubmit={handleSubmit(onSubmit)}>
              <VStack w={'100%'} backgroundColor={'white'}>
                {/* <VStack w={{ base: '90%', md: '80%' }}> */}

                <HStack
                  w={'100%'}
                  justifyContent={'flex-start'}
                  mb={'-0.5rem'}
                  alignItems={'end'}
                >
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
                </HStack>
                <VStack
                  w={'100%'}
                  py={'2rem'}
                  px={{ base: '1rem', sm: '1rem', md: '2rem' }}
                  spacing={'1rem'}
                >
                  <FormControl>
                    {/* <SimpleGrid columns={[1, 2]} justifyContent={'center'} > */}
                    <Stack spacing={'0rem'}>
                      <FormLabel
                        fontWeight={'400'}
                        fontFamily={'Prompt'}
                        textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                        fontSize={'16px'}
                        w={'100%'}
                        color={'#767262'}
                      >
                        ชื่อบริษัท
                      </FormLabel>
                      <Input
                        fontFamily={'Prompt'}
                        fontSize={'16px'}
                        type={'text'}
                        {...register('nameCompany')}
                        w={'100%'}
                        h={'fit-content'}
                        p={'0.5rem'}
                      />
                    </Stack>
                    {/* </SimpleGrid> */}
                  </FormControl>

                  <FormControl>
                    <Stack spacing={'0rem'}>
                      <FormLabel
                        fontWeight={'400'}
                        fontFamily={'Prompt'}
                        textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                        fontSize={'16px'}
                        w={'100%'}
                        color={'#767262'}
                      >
                        ที่อยู่บริษัท
                      </FormLabel>
                      <Textarea
                        fontFamily={'Prompt'}
                        fontSize={'16px'}
                        type={'text'}
                        {...register('addCompany')}
                        w={'100%'}
                        h={'100px'}
                      />
                    </Stack>
                  </FormControl>

                  <FormControl isInvalid={errors['name']}>
                    <FormErrorMessage justifyContent={'center'}>
                      {' '}
                      {errors?.name && errors.name.message}{' '}
                    </FormErrorMessage>
                    <Stack spacing={'0rem'}>
                      <FormLabel
                        fontWeight={'400'}
                        fontFamily={'Prompt'}
                        textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                        w={'100%'}
                        fontSize={'16px'}
                        color={'#767262'}
                      >
                        ชื่อผู้ติดต่อ
                      </FormLabel>
                      <Input
                        fontFamily={'Prompt'}
                        fontSize={'16px'}
                        type={'text'}
                        {...register('name', {
                          required: {
                            value: true,
                            message: 'กรุณากรอกชื่อผู้ติดต่อ',
                          },
                        })}
                        w={'100%'}
                        h={'fit-content'}
                        p={'0.5rem'}
                      />
                    </Stack>
                  </FormControl>

                  <FormControl isInvalid={errors['phone']}>
                    <FormErrorMessage justifyContent={'center'}>
                      {' '}
                      {errors?.phone && errors.phone.message}{' '}
                    </FormErrorMessage>
                    <Stack spacing={'0rem'}>
                      <FormLabel
                        fontWeight={'400'}
                        fontFamily={'Prompt'}
                        textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                        w={'100%'}
                        fontSize={'16px'}
                        color={'#767262'}
                      >
                        เบอร์โทรติดต่อ
                      </FormLabel>
                      <Input
                        fontFamily={'Prompt'}
                        fontSize={'16px'}
                        type={'text'}
                        {...register('phone', {
                          required: {
                            value: true,
                            message: 'กรุณากรอกเบอร์โทรติดต่อ',
                          },
                        })}
                        w={'100%'}
                        h={'fit-content'}
                        p={'0.5rem'}
                      />
                    </Stack>
                  </FormControl>

                  <FormControl isInvalid={errors['taxNumber']}>
                    <FormErrorMessage justifyContent={'center'}>
                      {' '}
                      {errors?.taxNumber && errors.taxNumber.message}{' '}
                    </FormErrorMessage>
                    <Stack spacing={'0rem'}>
                      <FormLabel
                        fontWeight={'400'}
                        fontFamily={'Prompt'}
                        textAlign={{ base: 'start', sm: 'start', md: 'start' }}
                        w={'100%'}
                        fontSize={'16px'}
                        color={'#767262'}
                      >
                        เลขประจำตัวผู้เสียภาษี
                      </FormLabel>
                      <Input
                        fontFamily={'Prompt'}
                        fontSize={'16px'}
                        type={'text'}
                        {...register('taxNumber', {
                          required: {
                            value: true,
                            message: 'กรุณากรอกเลขประจำตัวผู้เสียภาษี',
                          },
                        })}
                        w={'100%'}
                        h={'fit-content'}
                        p={'0.5rem'}
                      />
                    </Stack>
                  </FormControl>

                  <Controller
                    render={({ field: { onChange, value, onBlur } }) => (
                      <Flex w={'full'} justifyContent={'start'}>
                        <FormControl isInvalid={errors['group']}>
                          <RadioGroup
                            onChange={onChange}
                            value={value}
                            onBlur={onBlur}
                          >
                            <Stack
                              fontFamily={'Prompt'}
                              direction='row'
                              color={'#767262'}
                            >
                              <Radio value='บุคคลธรรมดา'>บุคคลธรรมดา</Radio>
                              <Radio value='นิติบุคคล'>นิติบุคคล</Radio>
                            </Stack>
                          </RadioGroup>
                          <FormErrorMessage>
                            {errors['group'] && errors['group']?.message}
                          </FormErrorMessage>
                        </FormControl>
                      </Flex>
                    )}
                    name='group'
                    rules={{
                      required: {
                        value: true,
                        message: 'กรุณาเลือกบุคคล',
                      },
                    }}
                    control={control}
                  />

                  <HStack
                    spacing={'1rem'}
                    justifyContent={'center'}
                    pt={'1rem'}
                  >
                    <Button
                      onClick={() => reset()}
                      fontFamily={'Prompt'}
                      fontWeight={'400'}
                      fontStyle={'normal'}
                      fontSize={'16px'}
                      color={'#FFFFFF'}
                      backgroundColor={'gray.400'}
                      width={'115px'}
                      height={'40px'}
                    >
                      {' '}
                      เคลียร์{' '}
                    </Button>
                    <Button
                      isLoading={isSubmit}
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
                  </HStack>
                </VStack>
                {/* </VStack> */}
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default FormCompany
