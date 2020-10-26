const Firebase = require("firebase-admin");

const firebaseConfig = {
    credential: Firebase.credential.cert(require("./firebase-account.json")),
    databaseURL: process.env.FIREBASE_DB_URL
}

const app = Firebase.initializeApp(firebaseConfig)
const db = app.database()

module.exports = {
    firebaseApp: app,
    database: db,
    databaseRef: db.ref()
}
