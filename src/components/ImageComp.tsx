import React from "react";
import { Flex, Image, Button } from "@chakra-ui/react";

interface Props {
    src: string
    index: number
    removeHandle: (index: number) => void
}

const ImageComp: React.FC<Props> = (props) => {
    return (
        <Flex
            flexDir={"column"}
            border="1px dashed gray"
            w="100%" h="165px"
            justifyContent={"space-around"}
            alignItems={"center"}
            borderRadius={"13px"}
            background={"#FAFCFE"}
            userSelect={"none"}
            draggable={false}
            position="relative"
        >
            <Image src={props.src} maxH={"100%"} maxW={"100%"} />
            <Button
                colorScheme="red"
                onClick={() => { props.removeHandle(props.index) }}
                size={"sm"}
                position="absolute"
                borderRadius={"50%"}
                top="-15px"
                right="-15px"
            // fontSize={"0.7rem"}
            >
                x
            </Button>
        </Flex>
    )
}


export default ImageComp;