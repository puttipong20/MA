import React from 'react'
import { Box } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import FormEditWork from '../FormEdit'

function FormWork() {
  const { id, Pid } = useParams()

  return (
    <Box minH={'100vh'} h={'full'}>
      <FormEditWork id={id ? id : null} Pid={Pid ? Pid : null} />
    </Box>
  )
}

export default FormWork
