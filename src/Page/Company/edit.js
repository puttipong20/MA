import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../Config'
import FormCompany from '../../Component/FormCompany'

function EditCompany({ user }) {
  const { id } = useParams()
  const [company, setCompany] = useState()

  const fetchData = useCallback(async () => {
    const DocRef = doc(db, 'MACompany', id)
    const res = await (await getDoc(DocRef)).data()
    setCompany(res)
    //eslint-disable-next-line
  }, [])
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Box>
      <FormCompany data={company} id={id} user={user} />
    </Box>
  )
}

export default EditCompany
