import firebase from 'firebase';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB6MVg5Hp_U3GjMaoYfNJIlUhJFbTz59hA",
    authDomain: "notebook-fbf05.firebaseapp.com",
    projectId: "notebook-fbf05",
    storageBucket: "notebook-fbf05.appspot.com",
    messagingSenderId: "959419454986",
    appId: "1:959419454986:web:884ff5be346638a63731f3",
    measurementId: "G-4SXPHREWM8"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();

export { db };
