const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('../config/badmintonposecounter-8a231abc9956');

initializeApp({
  credential: cert(serviceAccount)
});

global.db = getFirestore();