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
  projectName: string;
  projectID: string;
  createAt: string;
  detail: string;
  email: string;
  line: string;
  name: string;
  phone: string;
  title: string;
  company: string;
  ref?: string;
  uid: string;
  reportBy: { uid: string; username: string };
  latestUpdate?: { uid: string; username: string };
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

  projectName: string;
  companyID: string;
  companyName: string;
  createdAt: string;
  createdBy: { username: string; uid: string };
  lastestUpdate: string;
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
  projects?: { projectName: string; id: string }[] | [];
  userName: string;
  userPhone: string;
  userTax: string;
  userPerson: "normal" | "corp";
  modifyBy: string;
};

export type Company = {
  companyId: string;
  detail: CompanyDetail;
};

// ======================================================================================

export type UserDetail = {
  username: string;
};
