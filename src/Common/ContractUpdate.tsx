/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "../services/config-db"
import { MA } from "../@types/Type";

import moment from "moment";

const convertTime = (date: string) => {
    return moment(date).format("YYYY-MM-DD")
}

const updateDetail = (status: string) => {
    return { note: `update to ${status}`, time: moment().format("YYYY-MM-DD 00:00:00"), updatedBy: { uid: "-", username: "system" } }
}

const ContactUpdate = async () => {
    // console.log("run script")
    const currentDate = moment().format("YYYY-MM-DD");
    // const lastestUpdate = localStorage.getItem("lastestUpdate")
    // if (lastestUpdate !== currentDate || lastestUpdate === undefined) {
    const projectCollection = collection(db, "Project");
    const projects = await getDocs(projectCollection);
    projects.forEach(async (project) => {
        const projectDoc = doc(db, "Project", project.id);
        const MAref = collection(projectDoc, "MAlogs")
        const MAlogs = await getDocs(MAref)
        MAlogs.forEach((c) => {
            const maID = c.id;
            const MAdoc = doc(MAref, maID)
            const ma: MA = c.data() as MA
            const start = convertTime(ma.startMA)
            const end = convertTime(ma.endMA)
            const status = ma.status
            const updateLogs = ma.updateLogs
            // const systemUpdate = { note: "system update", time: moment().format("YYYY-MM-DD"), updatedBy: { uid: "-", username: "system" } }
            // console.log({ updateLogs: [...updateLogs, systemUpdate] })
            if (status === "active" || status === "advance") {
                if (currentDate < start) {
                    updateDoc(MAdoc, { status: "advance", updateLogs: [updateDetail("advance"), ...updateLogs] })
                    // console.log(maID, ": advance")
                } else if (currentDate > end) {
                    updateDoc(MAdoc, { status: "expire", updateLogs: [updateDetail("expire"), ...updateLogs] })
                    // console.log(maID, ": expire")
                } else if ((currentDate >= start || currentDate <= end) && status !== "active") {
                    updateDoc(MAdoc, { status: "active", updateLogs: [updateDetail("active"), ...updateLogs] })
                    // console.log(maID, ": active")
                }
            }
        })
    })
    // alert("Update done!")
    localStorage.setItem("lastestUpdate", currentDate)
    // }
}


export default ContactUpdate;