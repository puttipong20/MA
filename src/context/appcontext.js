import { useState, createContext, useContext } from 'react'

const AppContext = createContext({
  user: null,
})

const ContextProvider = ({ children }) => {
  const [error, setError] = useState({})
  const [message, setMessage] = useState({})
  const [user, setUser] = useState(null)

  const { Provider } = AppContext
  const value = {
    error,
    setError,
    message,
    setMessage,
    user,
    setUser,
  }

  return <Provider value={value}>{children}</Provider>
}

const useAppContext = () => useContext(AppContext)

export { ContextProvider, AppContext, useAppContext }
