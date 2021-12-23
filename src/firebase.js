import { initializeApp } from 'firebase/app';
import { GoogleAuthProvider, getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyDH37IoTCWn3IRZKgrG5HymRml6FCaB9K0",
    authDomain: "grupo-connect-oficial.firebaseapp.com",
    databaseURL: "https://grupo-connect-oficial-default-rtdb.firebaseio.com",
    projectId: "grupo-connect-oficial",
    storageBucket: "grupo-connect-oficial.appspot.com",
    messagingSenderId: "963253080440",
    appId: "1:963253080440:web:9d55d094e9337c9050f88d"
}
const app = initializeApp(firebaseConfig);

export const googleProvider = new GoogleAuthProvider();
export const auth = getAuth();
export const database = getDatabase();
export default app