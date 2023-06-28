import React from 'react'
import { Badge } from "@chakra-ui/react"

interface Props {
    status: "active" | "expire" | "advance" | "cancel" | "deleted"
}

const MAstatusTag: React.FC<Props> = (props) => {
    const status = props.status
    let display = "";
    let color = "";
    status === "active" ? display = "กำลังใช้งาน" : status === "advance" ? display = "ล่วงหน้า" : display = "หมดอายุ"
    status === "active" ? color = "green" : status === "advance" ? color = "blue" : color = "red"
    return (
        <Badge colorScheme={color} w="100px" textAlign={"center"}>{display}</Badge>
    )
}

export default MAstatusTag