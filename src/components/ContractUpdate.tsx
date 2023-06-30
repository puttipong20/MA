/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getDocs } from "firebase/firestore"
import { db } from "../services/config-db"

import moment from "moment";

const ContactUpdate = async () => {
    const currentDate = new Date(moment().format("YYYY-MM-DD")) as any
    localStorage.setItem("lastestUpdate", `${currentDate}`)
    const projectRef = collection(db, "Project");
    const projects = await getDocs(projectRef);
    // projects.forEach((project) => {

    // })

}

export default ContactUpdate;