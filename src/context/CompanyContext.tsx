/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { useState, createContext } from "react";

export const CompanyContext = createContext({
    companyId: "",
    companyName: "",
    projectId: "",
    projectName: "",
    reportId: "",
    setCompany: (_id: string, _name: string): void => { },
    setProject: (_id: string, _name: string): void => { },
    setReport: (_id: string): void => { }
})

interface Props {
    children: React.ReactNode
}

const CompanyContextProvider: React.FC<Props> = (props) => {
    const [companyId, setCompanyId] = useState<string>("")
    const [companyName, setCompanyName] = useState<string>("")
    const [projectId, setProjectId] = useState<string>("")
    const [projectName, setProjectName] = useState<string>("")
    const [reportId, setReportId] = useState<string>("")

    const setCompany = (id: string, name: string) => {
        setCompanyId(id)
        setCompanyName(name)
    }
    const setProject = (id: string, name: string) => {
        setProjectId(id)
        setProjectName(name)
    }

    const setReport = (id: string) => { setReportId(id) }



    const context = {
        companyId: companyId,
        companyName: companyName,
        projectId: projectId,
        projectName: projectName,
        reportId: reportId,
        setCompany: setCompany,
        setProject: setProject,
        setReport: setReport
    }

    return (
        <CompanyContext.Provider value={context}>
            {props.children}
        </CompanyContext.Provider>
    )
}

export default CompanyContextProvider