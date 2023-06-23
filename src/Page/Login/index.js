import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '../../Hooks'
import {
  Button,
  Flex,
  FormControl,
  Input,
  HStack,
  Image,
  FormErrorMessage,
  Stack,
  VStack,
  Center,
  Text,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../Config'

export default function Login() {
  const navigate = useNavigate()
  const { login, setLoading } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const [isSubmit, setIsSubmit] = useState(false)

  const onSubmit = async formValues => {
    const { email, password } = formValues
    setIsSubmit(true)
    login(email, password).then(() => {
      setIsSubmit(false)
    })
  }

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user?.uid) {
        navigate('/home')
        setLoading(false)
      } else {
        setLoading(false)
      }
    })
    //eslint-disable-next-line
  }, [])

  return (
    <>
      <Stack
        minH={'100vh'}
        direction={{ base: 'column' }}
        w={'100%'}
        justifyContent={{
          base: 'center',
          sm: 'center',
          md: 'start',
          lg: 'start',
          xl: 'start',
        }}
        alignItems={'center'}
        objectFit='cover'
        backgroundSize={'100% 100vh'}
        backgroundImage={'/img/background.jpg'}
      >
        <Image
          src={'/img/Photo1.png'}
          w={{ base: '100%', sm: '100%', md: '100%', lg: '80%' }}
          position={'absolute'}
          zIndex={'999'}
        />
        <Center display={{ base: 'flex', sm: 'flex', md: 'none', lg: 'none' }}>
          <Image src={'/img/login.png'} w={'60%'} />
        </Center>
        <Center pt={{ base: '0rem', md: '7rem' }} zIndex={'1'}>
          <VStack spacing={'0'}>
            <HStack mb={'-1rem'}>
              <HStack spacing={'0'}>
                <Text
                  color={'#FFFFFF'}
                  fontFamily={'Couture'}
                  fontSize={{
                    base: '60px',
                    sm: '75px',
                    md: '80px',
                    xl: '100px',
                  }}
                >
                  {' '}
                  C
                </Text>
                <Text
                  color={'#FFFFFF'}
                  fontFamily={'Couture'}
                  fontSize={{
                    base: '60px',
                    sm: '75px',
                    md: '80px',
                    xl: '100px',
                  }}
                >
                  {' '}
                  RAFT
                </Text>
              </HStack>
              <VStack spacing={'0'}>
                <Text
                  pl={'2rem'}
                  textAlign={'end'}
                  w='100%'
                  color={'#FFFFFF'}
                  fontFamily={'Couture'}
                  fontSize={{
                    base: '60px',
                    sm: '75px',
                    md: '80px',
                    xl: '100px',
                  }}
                >
                  MA
                </Text>
              </VStack>
            </HStack>
            <Text
              textAlign={'center'}
              w='100%'
              color={'#FFFFFF'}
              fontStyle={'normal'}
              fontSize={{ base: '30px', sm: '30px', md: '30px', xl: '30px' }}
            >
              Maintenance
            </Text>
          </VStack>

          {/* <Image src={'/img/Photo2.png'} w={'1000px'} /> */}
        </Center>
        <Flex
          justify={'center'}
          zIndex={'9999'}
          borderRadius={'15px'}
          pt={{ base: '0rem', sm: '0rem', md: '3rem' }}
          backgroundColor={'white'}
          align={'center'}
          mb={{ base: '5rem' }}
          border={'1px'}
          borderColor={'white'}
          p={{ base: '2rem', md: '5rem' }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* <VStack alignItems={'center'} spacing={'-4rem'} w={'full'}>

              <HStack>
                <Text color={'balck'} fontFamily={'Couture'} fontSize={'100px'}>
                  C
                </Text>
                <Text fontFamily={'Couture'} fontSize={'100px'}>
                  raft
                </Text>
                <Text w={'100%'} textAlign={'end'} fontFamily={'Couture'} fontSize={'100px'}>
                  MA
                </Text>
              </HStack>
            </VStack> */}
            <HStack>
              <Stack
                spacing={4}
                w={'100%'}
                justifyContent={'center'}
                alignItems={'center'}
              >
                <FormControl isInvalid={errors.email}>
                  <VStack alignItems={'center'} w={'100%'}>
                    <Input
                      w={{
                        base: '250px',
                        sm: '250px',
                        md: '250px',
                        lg: '400px',
                      }}
                      h={'50px'}
                      fontSize={'14px'}
                      fontFamily={'Prompt'}
                      type={'email'}
                      placeholder='Username'
                      {...register('email', { required: 'email is required' })}
                      bg={'#FFFFFF'}
                    />
                    <FormErrorMessage>
                      {errors?.email && errors.email.message}
                    </FormErrorMessage>
                  </VStack>
                </FormControl>
                <Center w={'100%'}>
                  <FormControl isInvalid={errors.password}>
                    <VStack alignItems={'center'} w={'100%'}>
                      <Input
                        w={{
                          base: '250px',
                          sm: '250px',
                          md: '250px',
                          lg: '400px',
                        }}
                        h={'50px'}
                        fontSize={'14px'}
                        fontFamily={'Prompt'}
                        type={'password'}
                        placeholder='Password'
                        {...register('password', {
                          required: 'password is required',
                        })}
                        bg={'#FFFFFF'}
                      />
                      <FormErrorMessage>
                        {errors?.password && errors.password.message}
                      </FormErrorMessage>
                    </VStack>
                  </FormControl>
                </Center>
                <Stack
                  spacing={6}
                  justifyContent={'center'}
                  alignItems={'center'}
                >
                  <Button
                    isLoading={isSubmit}
                    w={{ base: '250px', sm: '250px', md: '250px', lg: '400px' }}
                    h={'50px'}
                    colorScheme={'#1b4790'}
                    type='submit'
                    bg={'#1b4790'}
                    fontFamily={'Prompt'}
                    fontWeight={'light'}
                    color={'#FFFFFF'}
                    fontSize={'16px'}
                  >
                    LOGIN
                  </Button>
                </Stack>
              </Stack>
              {/* <Box >

                  <Image src={'/img/login.png'} />
                </Box> */}
            </HStack>
          </form>
        </Flex>
        <Image
          src={
            'https://media.discordapp.net/attachments/984758854258667561/1028955836770439228/settings.png'
          }
          display={{ base: 'none', sm: 'none', md: 'block', lg: 'block' }}
          w={{ md: '150px', lg: '200px', xl: '250' }}
          zIndex={'1'}
          position={'fixed'}
          top={{ md: '2rem', lg: '2rem', xl: '3rem' }}
          right={{ md: '2rem', lg: '2rem', xl: 'rem' }}
        />
        {/* <Image src={'/img/Photo4.png'} display={{ base: 'none', sm: 'none', md: 'block', lg: 'block' }} w={{ md: '250px', lg: '350px', xl: 'auto' }} position={'fixed'} zIndex={'1'} top={'0rem'} left={'1rem'} /> */}
        {/* <Image src={'/img/Photo3.png'} display={{ base: 'none', sm: 'none', md: 'block', lg: 'block' }} w={{ md: '250px', lg: '350px', xl: 'auto' }} position={'fixed'} zIndex={'1'} bottom={'1rem'} right={'1rem'} /> */}
        <Stack
          display={{ base: 'none', sm: 'none', md: 'block', lg: 'block' }}
          spacing={{
            base: '0rem',
            sm: '0rem',
            md: '0rem',
            lg: '0rem',
            xl: '-2rem',
          }}
        >
          <Image
            w={{ md: '80px', lg: '90px', xl: '100px' }}
            ml={'5rem'}
            position={'absolute'}
            src={'/img/Photo6.png'}
            bottom={{ md: '1rem', lg: '1rem', xl: '7rem' }}
            left={{ md: '1rem', lg: '1rem', xl: '8rem' }}
          />
          {/* <Image src={'/img/login.png'} w={{ md: '40%', lg: '60%', xl: '90%' }} /> */}
        </Stack>
      </Stack>
    </>
  )
}
