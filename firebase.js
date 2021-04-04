
import firebase from "firebase";


const firebaseConfig = {
  apiKey: "AIzaSyAMYd_aqFM_oFSkRx970F2Shv2ZIrJImLE",
  authDomain: "whatsapp-2-55e3f.firebaseapp.com",
  projectId: "whatsapp-2-55e3f",
  storageBucket: "whatsapp-2-55e3f.appspot.com",
  messagingSenderId: "490375846316",
  appId: "1:490375846316:web:25b90fbd38d0159081c209"
};


const app=!firebase.apps.length ? firebase.initializeApp(firebaseConfig): firebase.app();

const db=app.firestore();
const auth=app.auth();
const provider=new firebase.auth.GoogleAuthProvider();

export{db, auth, provider};