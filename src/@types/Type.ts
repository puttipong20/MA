export type Solution = {
  accepter: string;
  solution: string;
  solutionImg: string[];
  issue: string;
  dateProcess: string;
  dateDone: string;
};

export type ReportDetail = {
  RepImg: string[];
  RepStatus: string;
  projectId: string;
  createAt: string;
  detail: string;
  email: string;
  line: string;
  name: string;
  phone: string;
  title: string;
  ref?: string;
  uid: string;
  firebaseId: string;
  createBy: { uid: string; username: string };
  latestReportUpdate?: { uid: string; username: string; timestamp: string };
  latestUpdate?: { uid: string; username: string; timestamp: string };
  solution?: Solution | undefined;
};

export type Report = {
  id: string;
  docs: ReportDetail;
};

// ======================================================================================

export type MA = {
  startMA: string;
  endMA: string;
  cost: number;
  // หมดอายุ กำลังใช้งาน ล่วงหน้า ลบ ยกเลิก
  status: "expire" | "active" | "advance" | "deleted" | "cancel";
  cancelNote?: string | "";
  createdBy: { username: string; uid: string };
  createdAt: string;
  note?: string | "";
  updateLogs: {
    updatedBy: { username: string; uid: string };
    timeStamp: string;
    note: string | "";
  }[];
};

// export type MA = {
//   MAid: string;
//   MAdetail: MA;
// };

export type ProjectDetail = {
  // MAlogs: MA[];
  status: "enable" | "disable";
  projectName: string;
  companyID: string;
  companyName: string;
  createdAt: string;
  shortName: string;
  firebaseId: string;
  createdBy: { username: string; uid: string };
  latestUpdate?: { username: string; uid: string; timestamp: string };
};

export type Project = {
  projectId: string;
  detail: ProjectDetail;
};

export type CompanyDetail = {
  companyAddress: string;
  companyName: string;
  createdBy: { username: string; uid: string };
  createdAt: string;
  projects?:
    | { projectName: string; id: string; status: "enable" | "disable" }[]
    | [];
  userName: string;
  userPhone: string;
  userTax: string;
  userPerson: "normal" | "corp";
  modifyBy?: { username: string; uid: string; timestamp: string };
};

export type Company = {
  companyId: string;
  detail: CompanyDetail;
};

// ======================================================================================

export type UserDetail = {
  username: string;
};
