import React, { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

// ⚡ Firebase Config (replace with yours)
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
  const [page, setPage] = useState("home");
  const [role, setRole] = useState(null);
  const [weeklyData, setWeeklyData] = useState([]);
  const [dailyData, setDailyData] = useState([]);

  // Load Weekly Attendance
  const loadWeeklyAttendance = async () => {
    const snapshot = await getDocs(collection(db, "Attendance"));
    const rows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setWeeklyData(rows);
  };

  // Load Daily Attendance
  const loadDailyAttendance = async () => {
    const snapshot = await getDocs(collection(db, "Attendance"));
    const rows = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setDailyData(rows);
  };

  // Mark Weekly
  const markAttendance = async (id, day) => {
    if (role !== "teacher") {
      alert("Only Teacher can update attendance!");
      return;
    }
    const status = prompt(`Enter status for ${day} (present/absent):`);
    if (!status) return;

    const ref = doc(db, "Attendance", id);
    await updateDoc(ref, { [`week1.${day}`]: status.toLowerCase() });
    loadWeeklyAttendance();
  };

  // Mark Daily
  const markDaily = async (id, status) => {
    if (role !== "teacher") {
      alert("Only Teacher can mark daily attendance!");
      return;
    }
    const today = new Date().toISOString().split("T")[0];
    const ref = doc(db, "Attendance", id);
    await updateDoc(ref, { [`daily.${today}`]: status });
    loadDailyAttendance();
  };

  // Auto-load when switching pages
  useEffect(() => {
    if (page === "weekly") loadWeeklyAttendance();
    if (page === "daily") loadDailyAttendance();
  }, [page]);

  return (
    <div style={{ padding: "20px" }}>
      {page === "home" && (
        <div>
          <h1>📘 Attendance Tracker</h1>
          <button onClick={() => { setRole("student"); setPage("dashboard"); }}>
            🎓 Student
          </button>
          <button onClick={() => { setRole("teacher"); setPage("dashboard"); }}>
            👨‍🏫 Teacher
          </button>
        </div>
      )}

      {page === "dashboard" && (
        <div>
          <h2>Welcome {role}</h2>
          <button onClick={() => setPage("daily")}>📅 Daily Attendance</button>
          <button onClick={() => setPage("weekly")}>📊 Weekly Attendance</button>
          <button onClick={() => setPage("home")}>⬅ Logout</button>
        </div>
      )}

      {page === "weekly" && (
        <div>
          <h2>Weekly Attendance</h2>
          <table border="1" cellPadding="5">
            <thead>
              <tr>
                <th>Name</th>
                <th>Mon</th>
                <th>Tue</th>
                <th>Wed</th>
                <th>Thur</th>
                <th>Fri</th>
                <th>Sat</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.week1?.Mon || "-"}</td>
                  <td>{student.week1?.Tue || "-"}</td>
                  <td>{student.week1?.Wed || "-"}</td>
                  <td>{student.week1?.Thur || "-"}</td>
                  <td>{student.week1?.Fri || "-"}</td>
                  <td>{student.week1?.Sat || "-"}</td>
                  <td>
                    {role === "teacher" ? (
                      <>
                        {["Mon", "Tue", "Wed", "Thur", "Fri", "Sat"].map((day) => (
                          <button key={day} onClick={() => markAttendance(student.id, day)}>{day}</button>
                        ))}
                      </>
                    ) : (
                      "View Only"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setPage("dashboard")}>⬅ Back</button>
        </div>
      )}

      {page === "daily" && (
        <div>
          <h2>Daily Attendance</h2>
          <ul>
            {dailyData.map((student) => {
              const today = new Date().toISOString().split("T")[0];
              const status = student.daily?.[today] || "Not marked yet";
              return (
                <li key={student.id}>
                  <b>{student.name}</b> — {role === "teacher" ? (
                    <>
                      <button onClick={() => markDaily(student.id, "present")}>Present</button>
                      <button onClick={() => markDaily(student.id, "absent")}>Absent</button>
                    </>
                  ) : (
                    <i>{status}</i>
                  )}
                </li>
              );
            })}
          </ul>
          <button onClick={() => setPage("dashboard")}>⬅ Back</button>
        </div>
      )}
    </div>
  );
}

export default App;
