import { Box } from '@chakra-ui/react'
import React from 'react'
import FormCompany from '../../Component/FormCompany'

function NewCompany({ user }) {
  return (
    <Box bg={'#FFFFFF'}>
      <FormCompany data={null} id={null} user={user} />
    </Box>
  )
}

export default NewCompany
