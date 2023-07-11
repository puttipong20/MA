const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors");
const request = require("request-promise");

admin.initializeApp();

const db = admin.firestore();

exports.addReport_v2 = functions
  .https.onRequest((req, res) => {
    cors()(req, res, async () => {
      const token = process.env.VITE_LINE_NOTIFY
      const { company, title, detail, projectName} = req.body;

      const incrementRef = db.collection("autoIncrement").doc(projectName);
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
          await db
            .collection("Report")
            .add({
              ...req.body,
              ref: `000${number}`,
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
              Authorization:
                `Bearer ${token}`,
            },
            form: {
              message: `
บริษัท : ${company}
โปรเจค : ${projectName}
เลขอ้างอิง : 000${number}
ปัญหา : ${title}
รายละเอียด : ${detail}
                `,
            },
          });
        });
      } catch (e) {
        res.send(
          `${e} and value need : ( company,title,detail )`
        );
      }
    });
  });

exports.getReport_v2 = functions
  .https.onRequest((req, res) => {
    cors()(req, res, async () => {
      const allReport = [];
      try {
        await db
          .collection("Report")
          .get()
          .then((data) => {
            const docs = data.docs;
            docs.map((doc) => {
              const query = {
                id: doc.id,
                docs: doc.data(),
              };
              allReport.push(query);
            });
            return allReport;
          });
        res.send(allReport);
      } catch (e) {
        res.send(e);
      }
    });
  });
exports.getReportByid_v2 = functions
  .https.onRequest((req, res) => {
    cors()(req, res, async () => {
      const { RepId } = req.body;
      try {
        await db
          .collection("Report")
          .doc(RepId)
          .get()
          .then((data) => {
            res.send(data.data());
          });
      } catch (e) {
        res.send(e, "need : ( RepId )");
      }
    });
  });

exports.deleteReport_v2 = functions
  .region("asia-southeast1")
  .https.onRequest((req, res) => {
    cors()(req, res, async () => {
      const { RepId } = req.body;
      try {
        await db.collection("Report").doc(RepId).delete();
        res.send(`Deleted ID : ${RepId}`);
      } catch (e) {
        res.send(`${e} and value need : ( RepId )`);
      }
    });
  });

