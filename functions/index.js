const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const request = require("request-promise");

admin.initializeApp();

const db = admin.firestore();

exports.addReport_v2 = functions.https.onRequest((req, res) => {
  cors()(req, res, async () => {
    const token = process.env.VITE_LINE_NOTIFY;
    const { firebaseId, projectId, title, detail } = req.body;
    let shortName = "";
    let projectName = "";
    let companyName = "";
    try {
      if (!!firebaseId) {
        await db
          .collection("Project")
          .where("firebaseId", "==", firebaseId)
          .get()
          .then((snapshot) => {
            const docs = snapshot.docs;
            docs.map((item) => {
              console.log(item.data());
              shortName = item.data().shortName;
              projectName = item.data().projectName;
              companyName = item.data().companyName;
            });
          });
      } else {
        await db
          .collection("Project")
          .doc(projectId)
          .get()
          .then((snapshot) => {
            const docs = snapshot.data();
            shortName = docs.shortName;
            projectName = docs.projectName;
            companyName = docs.companyName;
          });
      }
            const incrementRef = db.collection("autoIncrement").doc(shortName);
            db.runTransaction(async (transaction) => {
              const doc = await transaction.get(incrementRef);
              if (!doc.exists) {
                transaction.set(incrementRef, {
                  number: 1,
                });
                return {
                  number: 1,
                };
              } else {
                const prevNumber = parseInt(doc.data().number);
                const number = prevNumber + 1;

                transaction.set(incrementRef, {
                  number: number,
                });
                return {
                  number: number,
                };
              }
            }).then(async (resp) => {
              const { number } = resp;
              const padNumber = String(number).padStart(5, "0");
              const ref = shortName + "-" + padNumber;
              await db
                .collection("Report")
                .add({
                  ...req.body,
                  ref: ref,
                  projectName: projectName,
                  companyName: companyName,
                  RepStatus: "รอรับเรื่อง",
                })
                .then(() => {
                  res.send(true);
                });
              request({
                method: "POST",
                uri: "https://notify-api.line.me/api/notify",
                headers: {
                  "Content-Type": "application/x-www-form-urlencoded",
                  Authorization: `Bearer ${token}`,
                },
                form: {
                  message: `
บริษัท : ${companyName}
โปรเจค : ${projectName}
เลขอ้างอิง : ${ref}
ชื่อเรื่อง : ${title}
รายละเอียด : ${detail}
                        `,
                },
              });
            });
    } catch (e) {
      res.send(`API need : ( companyName, title, detail ) OR. ${e}`);
    }
  });
});
exports.updateReport = functions.https.onRequest((req, res) => {
  cors()(req, res, async () => {
    const { reportId } = req.body;
    try {
      await db
        .collection("Report")
        .doc(reportId)
        .update({
          ...req.body,
        });
      res.send(true);
    } catch (e) {
      res.send(e);
    }
  });
});
exports.getReport_v2 = functions.https.onRequest((req, res) => {
  cors()(req, res, async () => {
    const { firebaseID } = req.body;
    try {
      const allReport = [];
      db.collection("Report")
        .where("firebaseId", "==", firebaseID)
        .get()
        .then((data) => {
          const docs = data.docs;
          docs.map((doc) => {
            const query = {
              ...doc.data(),
              docId: doc.id,
            };
            allReport.push(query);
          });
          res.send(allReport);
        });
    } catch (e) {
      res.send(`api require {firebaseID: "(firebaseId)"}${e}`);
    }
  });
});

exports.getReportByid_v2 = functions.https.onRequest((req, res) => {
  cors()(req, res, async () => {
    const { projectID } = req.body;
    try {
      const allDoc = [];
      await db
        .collection("Report")
        .where("projectID", "==", projectID)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const data = { ...doc.data(), docID: doc.id };
            allDoc.push(data);
          });
          res.send(allDoc);
        });
    } catch (e) {
      res.send(e, "need : ( projectID )");
    }
  });
});
exports.getProjectByCompanyID = functions.https.onRequest((req, res) => {
  cors()(req, res, async () => {
    const { companyID } = req.body;
    const allProject = [];
    try {
      await db
        .collection("Project")
        .where("companyID", "==", companyID)
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            const data = { ...doc.data(), ProjectID: doc.id };
            allProject.push(data);
          });
          res.send(allProject);
        });
    } catch (e) {
      res.send(e);
    }
  });
});

exports.addUser = functions.https.onCall((data, context) => {
  if ((context.auth.uid !== null) | undefined) {
    let email = "";
    const createUser = admin
      .auth()
      .createUser({
        email: data.email,
        password: data.password,
        displayName: data.userName,
      })
      .then((res) => {
        email = res.email;
        return email;
      })
      .catch((e) => {
        return e;
      });
    return createUser;
  }
});
