const functions = require('firebase-functions')
const admin = require('firebase-admin')
const _ = require('underscore')
const isEmulator = process.env.EMULATOR || false
const axios = require('axios')
const token = process.env.LINETOKEN
const lineNotifyUrl = 'https://notify-api.line.me/api/notify'
const moment = require('moment')

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})

const db = admin.firestore()
const storage = admin.storage()
const authen = admin.auth()

async function initEmulator() {
  try {
    let { users } = await admin.auth().getUsers([{ email: 'Admin@Admin.com' }]) // find Admin account
    if (!users[0]) {
      admin
        .auth()
        .createUser({ email: 'Admin@Admin.com', password: '123456789' })
        .then(res => {
          admin.auth().setCustomUserClaims(res.uid, { role: 'Admin' }) // Claim to admin
          db.collection('Users')
            .doc(res.uid)
            .set({
              email: res.email,
              name: 'Admin Account',
              role: 'Admin',
              createdAt: new Date(),
            })
            .then(() => {
              console.log('Generate demo account')
            }) // set Profile
        })
        .catch(e => {
          console.log(e.message)
        })
    }
  } catch (e) {
    console.log(e.message)
  }
}

if (isEmulator) {
  initEmulator()
}

// exports.createUser = functions.https.onCall(async (data, context) => {
//   console.log(data)
//   const auth = context.auth
//   const role = auth.token.role
//   // console.log(auth)

//   if (role === 'Admin') {
//     return await admin
//       .auth()
//       .createUser({
//         email: data.username,
//         password: data.password,
//       })
//       .then(async user => {
//         admin.auth().setCustomUserClaims(user.uid, { role: data.role })
//         delete data.password

//         db.collection('Users')
//           .doc(user.uid)
//           .set({
//             ...data,
//             createdBy: auth.uid,
//             createdAt: new Date(),
//           })
//         const id = user?.uid
//         return { id }
//         // return await db.collection('Users').doc(user.uid).set({ ...data, createdBy: auth.uid, createdAt: new Date(), updatedAt: new Date() })
//       })
//       .catch(error => {
//         console.log(error)
//         throw new functions.https.HttpsError('unknown', error.message, error)
//       })
//   } else {
//     // Throwing an HttpsError so that the client gets the error details.
//     throw new functions.https.HttpsError(
//       'failed-precondition',
//       'The function must be called ' + 'while admin authenticated.'
//     )
//   }
// })

exports.lineNotifyToDevGroup = functions.https.onRequest(async (req, res) => {
  try {
    const data = req.body.message

    const config = {
      method: 'post',
      url: lineNotifyUrl,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      data: `message=${data}`,
    }

    await axios(config)
    console.log('Notify Success')

    res.status(204).send()
  } catch (err) {
    console.log('Notify Error!')
    console.log(err)
    res.status(500).send(err)
  }
})

exports.getPassport = functions.pubsub
  .schedule('every day 00:00')
  .timeZone('Asia/Bangkok')
  .onRun(async () => {
    return await db
      .collection('MAProjects')
      .get()
      .then(snapShot => {
        let data = []
        let productItems = []
        snapShot.docs.filter(doc => {
          data.push({
            id: doc.id,
            ...doc.data(),
          })
          if (doc.data().items) {
            doc.data().items.forEach(e => {
              productItems.push({ ...e })
            })
          }
        })

        var itemsCompanyname = []
        data.forEach(e => {
          itemsCompanyname.push({
            Company: e.Companyname,
            Project: e.Project,
            EndDate: e.EndDate,
          })
        })
        const branchChunk = _.chunk(_.shuffle(itemsCompanyname), 5)
        branchChunk.forEach(async e => {
          var dataSend = []
          e.forEach(v => {
            const isDate = moment().format('L')
            if (
              moment(isDate).format('DD/MM/YYYY') ===
              moment(v.EndDate).subtract(8, 'day').format('DD/MM/YYYY')
            ) {
              dataSend.push(
                `บริษัท ${v.Company} \nโปรเจค ${v.Project} \nหมดอายุ ${moment(
                  v.EndDate
                ).format('DD-MM-YYYY')} \n`
              )
            }
          })
          if (dataSend.length > 0) {
            const config = {
              method: 'post',
              url: lineNotifyUrl,
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              data: `message= \n${dataSend.join('\n')} `,
            }
            await axios(config)
          }
        })
      })
  })
