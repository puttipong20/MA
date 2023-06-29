export type Solution = {
  accepter: string;
  solution: string;
  solutionImg: string[];
  issueType: string;
  issueOther: string; //(if issueType == other)
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
  ref: string;
  uid: string;

  solution: Solution | undefined;
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
  createdBy: string;
  createdAt: string;
  note?: string | "";
  updateLogs: { updatedBy: string; timeStamp: string; note: string | "" }[];
};

export type ProjectDetail = {
  MAlogs: MA[];

  projectName: string;
  companyID: string;
  companyName: string;
  createdAt: string;
  createdBy: string;
};

export type Project = {
  projectId: string;
  detail: ProjectDetail;
};

export type CompanyDetail = {
  companyName: string;
  createdAt: string;
  createdBy: string;
  compAddress: string;
  contactName: string;
  contactPhone: string;
  taxNumber: string;
  type: "normal" | "corp";
  projects?: { projectName: string; id: string }[] | [];
};

export type Company = {
  companyId: string;
  detail: CompanyDetail;
};

// ======================================================================================

export type UserDetail = {
  role: string;
  company: string;
};
