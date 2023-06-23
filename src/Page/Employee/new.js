import { Box } from '@chakra-ui/react'
import React from 'react'
import FormEmployee from '../../Component/FormEmployee'

function NewEmployee() {
  return (
    <Box bg={'#FFFFFF'}>
      <FormEmployee data={null} id={null} />
    </Box>
  )
}

export default NewEmployee
