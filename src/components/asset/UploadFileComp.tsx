import React from "react";
import { Box, Flex, Text } from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
import { AiOutlinePlus } from "react-icons/ai";

interface Props {
    count?: number
}

const UploadFileComp: React.FC<Props> = (props) => {
    return (
        <Flex
            flexDir={"column"}
            border="1px dashed gray"
            w="100%" h="165px"
            justifyContent={"center"}
            alignItems={"center"}
            borderRadius={"13px"}
            background={"#FAFCFE"}
            userSelect={"none"}
            cursor={"pointer"}
            color={"blue.400"}
            transition={"all 0.1s"}
            _hover={{ color: "blue" }}
            textAlign="center"
        >
            <Text fontWeight={"bold"}>คลิกเพื่ออัพโหลดไฟล์</Text>
            <Box w="fit-content" h="fit-content" fontSize={"4rem"}>{(props.count !== undefined && props.count > 0) ? <AiOutlinePlus /> : <HiUpload />}</Box>
            <Text color="GrayText" fontSize={"0.8rem"}>PNG, JPG are Allowed</Text>
        </Flex>
    )
}


export default UploadFileComp;