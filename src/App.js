import React, { useEffect } from 'react'
import { useRoutes } from 'react-router-dom'
import './App.css'
import useStoreRoute from './Router'
import { Box, Spinner, useColorMode, useToast, VStack } from '@chakra-ui/react'
import { useAppContext } from './Context/appcontext'
import { useAuth } from './Hooks/auth'

function App() {
  const { routes } = useStoreRoute()
  const { colorMode } = useColorMode()
  const element = useRoutes(routes)

  const toast = useToast()
  const { error, setError, message, setMessage } = useAppContext()
  const { isLoading } = useAuth()
  useEffect(() => {
    if (error?.message) {
      toast({
        position: 'top',
        description: error.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      })
      setError({ code: '', message: '' })
    }
    //eslint-disable-next-line
  }, [error])

  useEffect(() => {
    if (message?.message) {
      toast({
        position: 'top',
        description: message.message,
        status: message.type,
        duration: 3000,
        isClosable: true,
      })
      setMessage({ message: '' })
    }
    //eslint-disable-next-line
  }, [message])
  return (
    <>
      {!isLoading ? (
        <Box minH={'100vh'}>{element}</Box>
      ) : (
        <Box
          h={'100vh'}
          bg={colorMode === 'dark' ? '#282c34' : '#EAEAEA'}
          color={'white'}
        >
          <VStack h={'full'} justifyContent={'center'}>
            <Spinner size={'lg'} />
          </VStack>
        </Box>
      )}
    </>
  )
}

export default App
