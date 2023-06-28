import { Box, Flex, useDisclosure, Text, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalHeader, ModalBody, Stack } from '@chakra-ui/react';
import React from 'react'
import { Controller } from 'react-hook-form';
import { RiEditLine } from 'react-icons/ri';

const EditContract = () => {

    const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <div>
      <Box onClick={onOpen} w="100%" h="100%" display="flex">
        <Flex
          color="green"
          fontSize="16px"
          fontFamily="Prompt"
          fontWeight="400"
          align="center"
          ml="8"
        >
          <RiEditLine color="green" />
          <Text ml="2">แก้ไข</Text>
        </Flex>
          </Box>

          <Modal isOpen={isOpen} onClose={onClose} isCentered={true}>
              <ModalOverlay />
              <ModalContent>
                  <ModalCloseButton />
                  <ModalHeader>แก้ไขข้อมูลสัญญา</ModalHeader>
                  <ModalBody>
                      <form>
                          <Stack>
                              {/* <Controller
                              name=""
                              /> */}
                              
                          </Stack>
                      </form>
                  </ModalBody>
              </ModalContent>
          </Modal>
    </div>
  );
}

export default EditContract