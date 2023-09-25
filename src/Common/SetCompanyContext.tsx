/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import { collection, getDocs } from "firebase/firestore"
import { db } from "../services/config-db"
import { CompanyDetail } from "../@types/Type"

type Company = {
    companyName: string,
    companyId: string,
    projects: { projectName: string, projectId: string }[]
}

const FetchCompany = async (DataCtx: any) => {
    const CompanyRef = collection(db, "Company")
    const CompanyFetch = await getDocs(CompanyRef)
    const Companies: Company[] = [];
    CompanyFetch.forEach((c) => {
        const companyDetail = c.data() as CompanyDetail
        const projects: { projectName: string, projectId: string }[] = []

        if (companyDetail.projects) {
            companyDetail.projects?.map((p) => {
                projects.push({ projectName: p.projectName, projectId: p.id })
            })
        }
        const company: Company = {
            companyName: companyDetail.companyName,
            companyId: c.id,
            projects: projects
        }
        Companies.push(company);
    })
    DataCtx.setData(Companies)
}

export default FetchCompany;