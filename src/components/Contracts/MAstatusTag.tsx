import React from 'react'
import { Badge } from "@chakra-ui/react"

interface Props {
    status: "active" | "expire" | "advance" | "cancel" | "deleted"
}

const MAstatusTag: React.FC<Props> = (props) => {
    const status = props.status
    let display = "";
    let color = "";
    let bg = "";

    switch (status) {
        case "active":
            color = "white";
            bg = "green.500";
            display = "กำลังใช้งาน";
            break;
        case "expire":
            color = "white";
            bg = "red.500"
            display = "หมดอายุ";
            break;
        case "advance":
            color = "white";
            bg = "blue.500"
            display = "ล่วงหน้า";
            break;
        case "cancel":
            color = "white";
            bg = "red"
            display = "ยกเลิก";
            break;
        case "deleted":
            color = "white";
            bg = "orange"
            display = "ลบ";
            break;
        default:
            break;
    }
    return (
        <Badge borderRadius="16px" py="0.25rem" color={color} bg={bg} w="100px" textAlign={"center"}>{display}</Badge>
    )
}

export default MAstatusTag