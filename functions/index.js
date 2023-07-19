const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const request = require("request-promise");

admin.initializeApp();

const db = admin.firestore();

exports.addReport_v2 = functions.https.onRequest((req, res) => {
  cors()(req, res, async () => {
    const token = process.env.VITE_LINE_TOKEN;
    const { projectName, projectID, companyName, title, detail } = req.body;
    let shortName = "";
    await db
      .collection("Project")
      .doc(projectID)
      // .doc("nodAJO19k0Cucjens7oS")
      .get()
      .then((snapshot) => {
        shortName = snapshot.data().shortName;
      });

    const incrementRef = db.collection("autoIncrement").doc(shortName);
    try {
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
            RepStatus: "รอรับเรื่อง",
          })
          .then((response) => {
            res.send(`Add report with id : ${response.id}`);
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
      res.send(`API need : ( companyName, title, detail ) ${e}`);
    }
  });
});
exports.updateReport = functions.https.onRequest((req, res) => {
  cors()(req, res, async () => {
    const { reportID } = req.body;
    try {
      await db
        .collection("Report")
        .doc(reportID)
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
      await db
        .collection("Project")
        .where("firebaseId", "==", firebaseID)
        .get()
        .then((data) => {
          const docs = data.docs;
          let docsId = "";
          docs.map((data) => {
            docsId = data.id;
          });
          console.log(docsId)
          const allReport = [];
          db.collection("Report")
            .where("projectID","==",docsId)
            .get()
            .then((data) => {
              const docs = data.docs;
              docs.map((doc) => {
                console.log(doc.data());
                const query = {
                  ...doc.data(),
                };
                allReport.push(query);
              });
              res.send(allReport);
            });
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
