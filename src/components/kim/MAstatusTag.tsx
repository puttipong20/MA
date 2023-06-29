import React from 'react'
import { Badge } from "@chakra-ui/react"

interface Props {
    status: "active" | "expire" | "advance" | "cancel" | "deleted"
}

const MAstatusTag: React.FC<Props> = (props) => {
    const status = props.status
    let display = "";
    let color = "";

    switch (status) {
        case "active":
            color = "green";
            display = "กำลังใช้งาน";
            break;
        case "expire":
            color = "red";
            display = "หมดอายุ";
            break;
        case "advance":
            color = "blue";
            display = "ล่วงหน้า";
            break;
        case "cancel":
            color = "red";
            display = "ยกเลิก";
            break;
        case "deleted":
            color = "orange";
            display = "ลบ";
            break;
        default:
            break;
    }
    return (
        <Badge colorScheme={color} w="100px" textAlign={"center"}>{display}</Badge>
    )
}

export default MAstatusTag