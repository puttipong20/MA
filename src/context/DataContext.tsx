/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { createContext, useState } from "react"

type Company = {
    companyName: string,
    companyId: string,
    projects: { projectName: string, projectId: string }[]
}

interface Props {
    children: React.ReactNode
}

export const DataContext = createContext({
    data: [
        {
            companyName: "",
            companyId: "",
            projects: [
                {
                    projectName: "",
                    projectId: ""
                }
            ]
        }
    ] as Company[],
    setData: (_newData: Company[]) => { }
})


const DataContextProvider: React.FC<Props> = (props) => {
    const [data, setData] = useState<Company[]>([])

    const setNewData = (newData: Company[]) => {
        setData(newData)
    }

    const context = {
        data: data,
        setData: setNewData
    }

    return (
        <DataContext.Provider value={context}>
            {props.children}
        </DataContext.Provider>
    )
}

export default DataContextProvider;