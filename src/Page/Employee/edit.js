import React, { useCallback, useEffect, useState } from 'react'
import { Box } from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../Config'
import FormEmployee from '../../Component/FormEmployee'

function EditEmployee() {
  const { id } = useParams()
  const [todo, settodo] = useState()

  const fetchData = useCallback(async () => {
    const DocRef = doc(db, 'Users', id)
    const res = await (await getDoc(DocRef)).data()
    settodo(res)
    //eslint-disable-next-line
  }, [])
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <Box>
      <FormEmployee data={todo} id={id} />
    </Box>
  )
}

export default EditEmployee
