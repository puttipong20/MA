import {
  Box,
  HStack,
  Text,
  Button,
  VStack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
  Stack,
  Image,
} from '@chakra-ui/react'
import { useAuth } from '../../Hooks'
import { Link } from 'react-router-dom'
import { AiOutlineLogout } from 'react-icons/ai'
import { useAppContext } from '../../Context/appcontext'

function Layout({ children }) {
  const { user } = useAppContext()
  const { logout } = useAuth()

  return (
    <Box h='full' minH={'100vh'} bg={'#FFFFFF'} maxW={'100%'} w={'100%'}>
      <Stack w={'100%'} alignItems={'center'} pt={'1rem'}>
        <Stack
          alignItems={'flex-end'}
          w={{ base: '100%', sm: '100%', md: '90%' }}
        >
          <Menu>
            <HStack
              w={'100%'}
              justifyContent={{
                base: 'center',
                sm: 'center',
                md: 'flex-end',
                lg: 'flex-end',
                xl: 'flex-end',
              }}
            >
              <MenuButton
                h={'fit-content'}
                w={{ base: '90%', sm: '90%', md: 'auto' }}
                px={'2rem'}
                py={'0.5rem'}
                as={Button}
                border={'1px'}
                borderRadius={'20px'}
                borderColor={'#F6F6F8'}
                shadow={'md'}
                colorScheme={'white'}
                backgroundColor={'#FFFFFF'}
              >
                <HStack
                  alignItems={'flex-end'}
                  justifyContent={{
                    base: 'flex-end',
                    sm: 'flex-end',
                    md: 'flex-end',
                  }}
                >
                  <VStack
                    spacing={'-2px'}
                    alignItems={'flex-start'}
                    fontSize={'16px'}
                    fontFamily={'Prompt'}
                    fontWeight={'bold'}
                  >
                    {/* <Text color={'#1DA1F2'}>{user?.name}</Text> */}
                    <Text color={'#666666'} noOfLines={'1'}>
                      {/* {user?.position} */}
                      {user?.email}
                    </Text>
                  </VStack>
                  <Avatar
                    src={user?.img}
                    name={user?.email}
                    objectFit={'cover'}
                    h={'50px'}
                    w={'50px'}
                  />
                </HStack>
              </MenuButton>
              <MenuList>
                {/* <MenuItem>
                  <Button
                    justifyContent={'flex-start'}
                    as={Link}
                    to={'/employee'}
                    colorScheme={'white'}
                    leftIcon={<FaUserFriends />}
                    w={'100%'}
                    fontWeight={'600'}
                    h={'45px'}
                    borderRadius={'10px'}
                    fontFamily={'Prompt'}
                    fontSize={'16px'}
                    color={'#666666'}
                  >
                    ผู้ใช้งานระบบ
                  </Button>
                </MenuItem> */}
                <MenuItem>
                  <Button
                    justifyContent={'flex-start'}
                    colorScheme={'white'}
                    leftIcon={<AiOutlineLogout />}
                    onClick={() => logout()}
                    w={'100%'}
                    fontWeight={'600'}
                    h={'45px'}
                    borderRadius={'10px'}
                    fontFamily={'Prompt'}
                    fontSize={'16px'}
                    color={'#666666'}
                  >
                    ออกจากระบบ
                  </Button>
                </MenuItem>
              </MenuList>
            </HStack>
          </Menu>
        </Stack>
      </Stack>
      <Box>
        <Box backgroundColor={'#FFFFFF'}>
          <HStack
            justifyContent={'center'}
            align={'flex-end'}
            justify={'center'}
            spacing={'-2rem'}
            pt={'1rem'}
            w={'100%'}
            backgroundColor={'#FFFFFF'}
          >
            <Link to={'/'}>
              <HStack spacing={'-1rem'} alignItems={'flex-end'}>
                <VStack spacing={'-2rem'} alignItems={'flex-end'}>
                  {/* <Image src={'/img/Photo2.png'} /> */}
                  <HStack spacing={'-0.5rem'}>
                    <Text
                      color={'#404040'}
                      fontFamily={'Couture'}
                      fontSize={{
                        base: '50px',
                        sm: '50px',
                        md: '80px',
                        xl: '100px',
                      }}
                    >
                      {' '}
                      C
                    </Text>
                    <Text
                      color={'#1DA1F2'}
                      fontFamily={'Couture'}
                      fontSize={{
                        base: '50px',
                        sm: '50px',
                        md: '80px',
                        xl: '100px',
                      }}
                    >
                      {' '}
                      RAFT
                    </Text>
                    <Text
                      textAlign={'end'}
                      w='100%'
                      color={'#404040'}
                      pl={'1rem'}
                      fontFamily={'Couture'}
                      fontSize={{
                        base: '50px',
                        sm: '50px',
                        md: '80px',
                        xl: '100px',
                      }}
                    >
                      MA
                    </Text>
                  </HStack>
                </VStack>
                <Stack
                  justifyContent={'flex-start'}
                  w={{ base: '80px', sm: '80px', md: '120px', xl: '120px' }}
                  h={{ base: '80px', sm: '80px', md: '120px', xl: '120px' }}
                >
                  <Image src={'/img/login.png'} />
                </Stack>
              </HStack>
            </Link>
          </HStack>
        </Box>
      </Box>
      <Box>{children}</Box>
    </Box>
  )
}

export default Layout
