import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAdQrdcar2zE9EZ5ZXfZywQHklA93azWoo",
  authDomain: "food-app-reactjs-c80ff.firebaseapp.com",
  databaseURL: "https://food-app-reactjs-c80ff-default-rtdb.firebaseio.com",
  projectId: "food-app-reactjs-c80ff",
  storageBucket: "food-app-reactjs-c80ff.appspot.com",
  messagingSenderId: "298419021268",
  appId: "1:298419021268:web:fa6699cfecf980a310e241"
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, firestore, storage };
