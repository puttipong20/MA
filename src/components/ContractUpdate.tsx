/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, doc, getDocs, updateDoc } from "firebase/firestore"
import { db } from "../services/config-db"
import { MA } from "../@types/Type";

import moment from "moment";

const convertTime = (date: string) => {
    return moment(date).format("YYYY-MM-DD")
}

const ContactUpdate = async () => {
    const currentDate = moment().format("YYYY-MM-DD");
    const lastestUpdate = localStorage.getItem("lastestUpdate")
    if (lastestUpdate !== currentDate) {
        // alert("updating")
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
                if (status === "active" || status === "advance") {
                    if (currentDate < start) {
                        updateDoc(MAdoc, { status: "advance" })
                        console.log(maID, ": advance")
                    } else if (currentDate > end) {
                        updateDoc(MAdoc, { status: "expire" })
                        console.log(maID, ": expire")
                    } else {
                        updateDoc(MAdoc, { status: "active" })
                        console.log(maID, ": expire")
                    }
                }
            })
        })
        localStorage.setItem("lastestUpdate", currentDate)
    }
}


export default ContactUpdate;