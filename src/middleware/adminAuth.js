const { sendError } = require('./response');

var admin = require('firebase-admin');

var serviceAccount = require('../firebase-admin.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

/**
 * Simple admin authentication via secret header.
 * In production, replace with JWT or proper auth system.
 */
const adminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];

    const decodedToken = await admin.auth().verifyIdToken(token);

    req.user = decodedToken; // user info from Firebase
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = adminAuth;
