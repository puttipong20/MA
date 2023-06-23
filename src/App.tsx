import { Container } from "@chakra-ui/react"
import { FC } from "react"
import { Route, Routes } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"


const App: FC = () => {
  return (
    <Container maxW={'100%'}>
      <Routes>
        <Route path="/login" element={<Login />}/>
        <Route path="/register" element={<Register />}/>
      </Routes>
    </Container>
  )
}

export default App