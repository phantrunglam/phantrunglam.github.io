// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBlJsuGaCkLC5Iw71v-6iXU6V2QpNzbztw",
  authDomain: "giapha-7a0e2.firebaseapp.com",
  projectId: "giapha-7a0e2",
  storageBucket: "giapha-7a0e2.firebasestorage.app",
  messagingSenderId: "474710419634",
  appId: "1:474710419634:web:44453134cf112fbc31c1ab",
};
AIzaSyDQXY_yLzfAhLGvYbXIDHTEXwASYmZhtvw;
AIzaSyBB - mkDCq5GDv5nOXb1IL - bPR0FIbsGm_o;

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Export để dùng trong file khác
export { db };
