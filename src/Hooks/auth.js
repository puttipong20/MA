import { useEffect, useState } from 'react'
import { useAppContext } from '../Context/appcontext'
import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth'
import { auth } from '../Config'
// import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

export function useAuth() {
  const { user, setUser } = useAppContext()
  const { setError, setMessage } = useAppContext()
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    onAuthStateChanged(auth, async authUser => {
      if (authUser?.uid) {
        // const userDoc = doc(db, 'Users', authUser?.uid)

        // onSnapshot(userDoc, Snapshot => {
        setUser({
          ...authUser,
          // ...Snapshot.data(),
        })
        // })
        setLoading(false)
      } else {
        setUser(null)
        setLoading(false)
      }
    })
    // eslint-disable-next-line
  }, [])

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password)
      .then(async ({ user: User }) => {
        if (User) {
          setMessage({ type: 'success', message: 'Login Successfully' })
          return user
        }
      })
      .catch(error => {
        setError({ code: 'Login Error', message: error?.message })
      })
  }

  async function logout() {
    try {
      await signOut(auth).then(() => {
        setUser(null)
        setMessage({ type: 'success', message: 'Logout Successfully' })
      })
    } catch (errors) {
      setError({ code: 'Logout Error', message: errors })
    }
  }

  return { login, logout, isLoading, setLoading }
}
