// // ---- Import Firebase (CDN) ----
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
// import {
//   getFirestore, collection, addDoc, getDocs, query, where, orderBy, Timestamp
// } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";

// // ---- REPLACE with your config from Firebase Console > Project settings > Web app ----
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_PROJECT_ID.appspot.com",
//   messagingSenderId: "YOUR_SENDER_ID",
//   appId: "YOUR_APP_ID",
// };

// const app = initializeApp(firebaseConfig);
// const db = getFirestore(app);

// // ---- Helpers ----
// const $ = (id) => document.getElementById(id);
// const log = (msg, obj) => { $("out").textContent += `${msg}${obj ? " " + JSON.stringify(obj, null, 2) : ""}\n`; };
// const todayISO = () => new Date().toISOString().slice(0,10);

// // ---- Seed demo data: users, subjects ----
// $("seed").onclick = async () => {
//   try {
//     // users
//     const s1 = await addDoc(collection(db, "users"), { name:"Alisha", email:"alisha@example.com", role:"student", subjects:["MATH101","PHY101"] });
//     const s2 = await addDoc(collection(db, "users"), { name:"Nancy",  email:"nancy@example.com",  role:"student", subjects:["MATH101"] });
//     const t1 = await addDoc(collection(db, "users"), { name:"Dr Mehta", email:"mehta@uni.edu", role:"teacher" });

//     // subjects
//     const math = await addDoc(collection(db, "subjects"), { code:"MATH101", name:"Mathematics", teacherId:t1.id });
//     const phy  = await addDoc(collection(db, "subjects"), { code:"PHY101",  name:"Physics",     teacherId:t1.id });

//     log("Seeded users:", { s1:s1.id, s2:s2.id, teacher:t1.id });
//     log("Seeded subjects:", { math:math.id, phy:phy.id });
//   } catch (e) {
//     console.error(e); log("Seed error:", e.message);
//   }
// };

// // ---- Mark attendance for Alisha in MATH101 (today) ----
// $("mark").onclick = async () => {
//   try {
//     // find student by email
//     const qsUser = await getDocs(query(collection(db, "users"), where("email","==","alisha@example.com")));
//     if (qsUser.empty) return log("Student not found");
//     const student = qsUser.docs[0];

//     // find subject by code
//     const qsSubj = await getDocs(query(collection(db, "subjects"), where("code","==","MATH101")));
//     if (qsSubj.empty) return log("Subject not found");
//     const subject = qsSubj.docs[0];

//     await addDoc(collection(db, "attendance"), {
//       studentId: student.id,
//       subjectId: subject.id,
//       date: todayISO(),        // "YYYY-MM-DD"
//       status: "present",
//       markedAt: Timestamp.now()
//     });

//     log("Marked present:", { student: student.data().name, subject: "MATH101", date: todayISO() });
//   } catch (e) {
//     console.error(e); log("Mark error:", e.message);
//   }
// };

// // ---- View attendance (latest first) ----
// $("view").onclick = async () => {
//   try {
//     const qs = await getDocs(query(collection(db, "attendance"), orderBy("date","desc")));
//     const rows = [];
//     for (const d of qs.docs) {
//       const a = d.data();
//       rows.push({ id:d.id, studentId:a.studentId, subjectId:a.subjectId, date:a.date, status:a.status });
//     }
//     log("Attendance:", rows);
//   } catch (e) {
//     console.error(e); log("View error:", e.message);
//   }
// };

// Import Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyB6rqVf8uwCqoyxCXq-Czvp_kRzRDY32Rw",
  authDomain: "attendance-tracker-f44a7.firebaseapp.com",
  projectId: "attendance-tracker-f44a7",
  storageBucket: "attendance-tracker-f44a7.firebasestorage.app",
  messagingSenderId: "137523138795",
  appId: "1:137523138795:web:3dd4c08af4b6a62a1beeae",
  measurementId: "G-JB884XN19Z"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Handle Add User
document.getElementById("userForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const role = document.getElementById("role").value;
  const subjects = document.getElementById("subjects").value.split(",");

  try {
    const docRef = await addDoc(collection(db, "Users"), {
      name,
      email,
      role,
      subjects,
      createdAt: serverTimestamp()
    });
    document.getElementById("output").textContent = `✅ User added with ID: ${docRef.id}`;
  } catch (err) {
    console.error("Error adding user:", err);
  }
});

// Handle Mark Attendance
document.getElementById("attendanceForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const studentId = document.getElementById("studentId").value;
  const subjectId = document.getElementById("subId").value;
  const status = document.getElementById("status").value;

  try {
    const docRef = await addDoc(collection(db, "Attendance"), {
      studentId,
      subjectId,
      status,
      date: new Date().toLocaleDateString(),
      timestamp: serverTimestamp()
    });
    document.getElementById("output").textContent = `✅ Attendance marked with ID: ${docRef.id}`;
  } catch (err) {
    console.error("Error marking attendance:", err);
  }
});

// Handle View Users
document.getElementById("viewUsers").addEventListener("click", async () => {
  const querySnapshot = await getDocs(collection(db, "Users"));
  let output = "👥 Users:\n\n";
  querySnapshot.forEach((doc) => {
    output += JSON.stringify({ id: doc.id, ...doc.data() }, null, 2) + "\n\n";
  });
  document.getElementById("output").textContent = output;
});

// Handle View Attendance
document.getElementById("viewAttendance").addEventListener("click", async () => {
  const querySnapshot = await getDocs(collection(db, "Attendance"));
  let output = "📒 Attendance Records:\n\n";
  querySnapshot.forEach((doc) => {
    output += JSON.stringify({ id: doc.id, ...doc.data() }, null, 2) + "\n\n";
  });
  document.getElementById("output").textContent = output;
});
