const admin = require('firebase-admin');
const serviceAccount = require('./firebase-key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://appinsurance-9d79d.appspot.com',
});

const storage = admin.storage();
const bucket = storage.bucket();

module.exports = bucket;
// https://console.firebase.google.com/u/0/project/appinsurance-9d79d/storage/appinsurance-9d79d.appspot.com/files