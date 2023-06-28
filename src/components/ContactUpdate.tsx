/* eslint-disable @typescript-eslint/no-explicit-any */
import { collection, getDocs } from "firebase/firestore"
import { db } from "../services/config-db"
import { ProjectDetail } from "../@types/Type";

import moment from "moment";

const currentDate = new Date(moment().format("YYYY-MM-DD")) as any

const ContactUpdate = async () => {
    const projectRef = collection(db, "Project");
    const projects = await getDocs(projectRef);
    // projects.forEach((project) => {

    // })

}

export default ContactUpdate;