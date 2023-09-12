/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { useState, createContext, useEffect } from "react";

export const CompanyContext = createContext({
  companyId: "",
  companyName: "",
  projectId: "",
  projectName: "",
  firebaseId: "",
  reportId: "",
  setCompany: (_id: string, _name: string): void => {},
  setProject: (_id: string, _name: string): void => {},
  setReport: (_id: string): void => {},
  setFirebaseId: (_id: string): void => {},
});

interface Props {
  children: React.ReactNode;
}

const CompanyContextProvider: React.FC<Props> = (props) => {
  const [companyId, setCompanyId] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [projectId, setProjectId] = useState<string>("");
  const [projectName, setProjectName] = useState<string>("");
  const [reportId, setReportId] = useState<string>("");
  const [firebaseId, setFirebaseId] = useState<string>("");

  const setCompany = (id: string, name: string) => {
    setCompanyId(id);
    setCompanyName(name);
  };
  const setProject = (id: string, name: string) => {
    setProjectId(id);
    setProjectName(name);
  };

  const setReport = (id: string) => {
    setReportId(id);
  };

  const setNewFirebaseId = (id: string) => {
    setFirebaseId(id);
  };

  const context = {
    companyId: companyId,
    companyName: companyName,
    projectId: projectId,
    projectName: projectName,
    reportId: reportId,
    firebaseId: firebaseId,
    setCompany: setCompany,
    setProject: setProject,
    setReport: setReport,
    setFirebaseId: setNewFirebaseId,
  };

  useEffect(() => {
    console.clear();
    console.log(context);
  }, [context]);

  return (
    <CompanyContext.Provider value={context}>
      {props.children}
    </CompanyContext.Provider>
  );
};

export default CompanyContextProvider;
