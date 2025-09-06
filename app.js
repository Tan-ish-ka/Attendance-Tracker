
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
