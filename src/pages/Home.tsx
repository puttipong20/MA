import { Box, Button, Text } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
// import { useContext } from 'react';
// import { AuthContext } from '../Context/AuthContext';

export default function Home() {
    const navigate = useNavigate();

    // const Auth = useContext(AuthContext);
    // console.log(Auth);

    return (
        <Box>
            {/* <Box>
                <Text>Go to . . .</Text>
                <Button onClick={() => { navigate("/preview/gogreen") }}>Go Green</Button>
                <Button onClick={() => { navigate("/preview/saimai") }}>Saimai</Button>
                <Button onClick={() => { navigate("/preview/diwalai") }}>Diwalai</Button>
                <Button onClick={() => { navigate("/login") }}>Login</Button>
            </Box> */}
            <Box>
                <Text>MA nav temp</Text>
                <Button onClick={() => { navigate("/") }}>Company - Project</Button>
            </Box>
        </Box>
    )
}
