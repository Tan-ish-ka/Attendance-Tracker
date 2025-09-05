

import { collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Show one page at a time
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
}

// Track whether Student or Teacher is logged in
let currentRole = null;

document.addEventListener("DOMContentLoaded", () => {
  const welcomeTitle = document.getElementById("welcomeTitle");

  // Home → Dashboard
  document.getElementById("studentBtn").addEventListener("click", () => {
    currentRole = "student";  // save role
    showPage("dashboardPage");
    welcomeTitle.innerText = "Welcome Student 🎓";
  });

  document.getElementById("teacherBtn").addEventListener("click", () => {
    currentRole = "teacher";  // save role
    showPage("dashboardPage");
    welcomeTitle.innerText = "Welcome Teacher 👨‍🏫";
  });

  // Dashboard → Feature Pages
  
  document.getElementById("weeklyBtn").addEventListener("click", async () => {
    showPage("weeklyAttendancePage");
    await loadWeeklyAttendance();
  });

  document.getElementById("dailyBtn").addEventListener("click", async () => {
  showPage("dailyAttendancePage");
  await loadDailyAttendance();
});


  document.getElementById("criteriaBtn").addEventListener("click", () => showPage("criteriaPage"));
  document.getElementById("addUserBtn").addEventListener("click", () => showPage("addUserPage"));
  document.getElementById("reviewBtn").addEventListener("click", () => showPage("reviewPage"));
  document.getElementById("subjectBtn").addEventListener("click", () => showPage("subjectPage"));
  document.getElementById("batchBtn").addEventListener("click", () => showPage("batchPage"));
  document.getElementById("updateBtn").addEventListener("click", () => showPage("updatePage"));

  // Logout → Back to Home
  document.getElementById("logoutBtn").addEventListener("click", () => {
    currentRole = null; // reset role on logout
    showPage("homePage");
  });

  // Back buttons
  document.querySelectorAll(".backBtn").forEach(btn => {
    btn.addEventListener("click", e => {
      const target = e.target.getAttribute("data-target") || "homePage";
      showPage(target);
    });
  });

  console.log("Firestore ready:", window.db);
});

// ==========================
// Weekly Attendance Feature
// ==========================

async function loadWeeklyAttendance() {
  const weeklyChart = document.getElementById("weeklyChart");
  weeklyChart.innerHTML = "<p>Loading...</p>";

  try {
    const snapshot = await getDocs(collection(window.db, "Attendance"));

    if (snapshot.empty) {
      weeklyChart.innerHTML = "<p>No attendance records found.</p>";
      return;
    }

    let html = `
      <table border="1" style="width:100%; text-align:center; border-collapse:collapse;">
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
    `;

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const week = data.week1 || {};

      html += `
        <tr>
          <td>${data.name || "-"}</td>
          <td>${week.Mon || "-"}</td>
          <td>${week.Tue || "-"}</td>
          <td>${week.Wed || "-"}</td>
          <td>${week.Thur || "-"}</td>
          <td>${week.Fri || "-"}</td>
          <td>${week.Sat || "-"}</td>
      `;

      // Only Teacher gets update buttons
      if (currentRole==="teacher") {
        html += `
          <td>
            <button onclick="markAttendance('${docSnap.id}', 'Mon')">Mon</button>
            <button onclick="markAttendance('${docSnap.id}', 'Tue')">Tue</button>
            <button onclick="markAttendance('${docSnap.id}', 'Wed')">Wed</button>
            <button onclick="markAttendance('${docSnap.id}', 'Thur')">Thur</button>
            <button onclick="markAttendance('${docSnap.id}', 'Fri')">Fri</button>
            <button onclick="markAttendance('${docSnap.id}', 'Sat')">Sat</button>
          </td>
        `;
      } else {
        html += `<td>View Only</td>`;
      }

      html += `</tr>`;
    });

    html += "</table>";
    weeklyChart.innerHTML = html;

  } catch (err) {
    console.error(err);
    weeklyChart.innerHTML = "<p>Error loading attendance.</p>";
  }
}

// ==========================
// Daily Attendance Feature
// ==========================
async function loadDailyAttendance() {
  const studentList = document.getElementById("studentList");
  studentList.innerHTML = "<p>Loading...</p>";

  try {
    const snapshot = await getDocs(collection(window.db, "Attendance"));

    if (snapshot.empty) {
      studentList.innerHTML = "<p>No students found.</p>";
      return;
    }

    let html = "<ul style='list-style:none; padding:0;'>";

    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      html += `<li style="margin:10px 0;">
        <b>${data.name}</b>
      `;

      if (currentRole === "teacher") {
        html += `
          <button onclick="markDaily('${docSnap.id}', 'present')">Present</button>
          <button onclick="markDaily('${docSnap.id}', 'absent')">Absent</button>
        `;
     } else {
  const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const todayStatus = data.daily ? data.daily[today] : null;
  html += ` — <i>${todayStatus || "Not marked yet"}</i>`;
}


      html += "</li>";
    });

    html += "</ul>";
    studentList.innerHTML = html;

  } catch (err) {
    console.error(err);
    studentList.innerHTML = "<p>Error loading students.</p>";
  }
}

// Function to mark daily attendance
window.markDaily = async function(studentId, status) {
  if (currentRole !== "teacher") {
    alert("Only Teacher can mark daily attendance!");
    return;
  }

  const today = new Date().toISOString().split("T")[0]; // e.g., "2025-09-05"

  try {
    const ref = doc(window.db, "Attendance", studentId);
    await updateDoc(ref, {
      [`daily.${today}`]: status
    });
    alert(`Marked ${status} for ${today}`);
    loadDailyAttendance(); // refresh list
  } catch (err) {
    console.error(err);
    alert("Error updating daily attendance");
  }
};


// Function to update attendance (Teacher only)
window.markAttendance = async function(studentId, day) {
  if (currentRole !== "teacher") {
    alert("Only Teacher can update attendance!");
    return;
  }

  const status = prompt(`Enter status for ${day} (present/absent):`);
  if (!status) return;

  try {
    const ref = doc(window.db, "Attendance", studentId);
    await updateDoc(ref, {
      [`week1.${day}`]: status.toLowerCase()
    });
    alert(`Updated ${day} as ${status}`);
    loadWeeklyAttendance(); // refresh
  } catch (err) {
    console.error(err);
    alert("Error updating attendance");
  }
};
