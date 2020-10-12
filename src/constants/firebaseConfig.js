const firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_SERVICE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_SERVICE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_SERVICE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_SERVICE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_SERVICE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_SERVICE_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_FIREBASE_SERVICE_APP_ID,
  };

  export default firebaseConfig;