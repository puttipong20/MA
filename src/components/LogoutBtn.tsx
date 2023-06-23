import { Button } from "@chakra-ui/react";

import { signOut } from "firebase/auth";
import { auth } from "../services/config-db";
import { useNavigate } from "react-router-dom";

export default function LogoutBtn() {
    const navigate = useNavigate()

    const logout = () => {
        navigate("/login")
        signOut(auth)
    }

    return (
        <Button onClick={logout} colorScheme="red" w="100px">Logout</Button>
    )
}
