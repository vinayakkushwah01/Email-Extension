// const emailInput = document.getElementById("email");
// const passInput = document.getElementById("password");
// const loginBtn = document.getElementById("loginBtn");
// const logoutBtn = document.getElementById("logoutBtn");
// const fetchBtn = document.getElementById("fetchBtn");
// const subjectsUl = document.getElementById("subjects");
// const emailBody = document.getElementById("emailBody");
// const emailSubject = document.getElementById("emailSubject");
// const speakBtn = document.getElementById("speakBtn");
// const pauseBtn = document.getElementById("pauseBtn");
// const resumeBtn = document.getElementById("resumeBtn");
// const stopBtn = document.getElementById("stopBtn");
// const backBtn = document.getElementById("backBtn");
// const messageBox = document.getElementById("messageBox");
// const messageBoxList = document.getElementById("messageBoxList");

// const loginForm = document.getElementById("loginForm");
// const emailList = document.getElementById("emailList");
// const emailView = document.getElementById("emailView");

// let utterance;

// function showMessage(msg, box = messageBox) {
//   box.textContent = msg;
//   box.style.display = "block";
// }

// function clearMessages() {
//   messageBox.textContent = "";
//   messageBoxList.textContent = "";
// }

// document.addEventListener("DOMContentLoaded", () => {
//   const saved = JSON.parse(localStorage.getItem("creds"));
//   if (saved) {
//     fetchSubjects(saved.email, saved.encryptedPass);
//     loginForm.classList.add("hidden");
//     emailList.classList.remove("hidden");
//     fetchBtn.classList.remove("hidden");
//   }
// });

// loginBtn.onclick = async () => {
//   const email = emailInput.value.trim();
//   const pass = passInput.value.trim();
//   if (!email || !pass) return showMessage("Enter both email and password");

//   try {
//     const encryptedRes = await fetch(`http://localhost:8080/api/auth/encrypt-password?plain=${encodeURIComponent(pass)}`);
    
//     if (!encryptedRes.ok) {
//       const errText = await encryptedRes.text();
//       return showMessage("Encryption failed: " + errText);
//     }

//     const encryptedPass = await encryptedRes.text();
//     localStorage.setItem("creds", JSON.stringify({ email, encryptedPass }));

//     fetchSubjects(email, encryptedPass);
//     loginForm.classList.add("hidden");
//     emailList.classList.remove("hidden");
//     fetchBtn.classList.remove("hidden");
//     clearMessages();
//   } catch (e) {
//     console.error("Encryption error", e);
//     showMessage("Something went wrong during encryption.");
//   }
// };

// logoutBtn.onclick = () => {
//   localStorage.removeItem("creds");
//   emailList.classList.add("hidden");
//   emailView.classList.add("hidden");
//   loginForm.classList.remove("hidden");
//   fetchBtn.classList.add("hidden");
//   stopSpeech();
// };

// fetchBtn.onclick = () => {
//   const saved = JSON.parse(localStorage.getItem("creds"));
//   if (saved) {
//     fetchSubjects(saved.email, saved.encryptedPass);
//   }
// };

// backBtn.onclick = () => {
//   emailView.classList.add("hidden");
//   emailList.classList.remove("hidden");
//   stopSpeech();
// };

// speakBtn.onclick = () => {
//   const text = emailBody.textContent;
//   if (!text) return;
//   utterance = new SpeechSynthesisUtterance(text);
//   speechSynthesis.speak(utterance);
// };

// pauseBtn.onclick = () => speechSynthesis.pause();
// resumeBtn.onclick = () => speechSynthesis.resume();
// stopBtn.onclick = stopSpeech;

// function stopSpeech() {
//   if (speechSynthesis.speaking) speechSynthesis.cancel();
// }

// async function fetchSubjects(email, encryptedPass) {
//   subjectsUl.innerHTML = "";
//   clearMessages();

//   try {
//     const url = `http://localhost:8080/api/email/list-unread-today?email=${encodeURIComponent(email)}&appPassword=${encodeURIComponent(encryptedPass)}`;
//     const res = await fetch(url);
//     if (!res.ok) throw new Error("Server error while fetching emails");
    
//     const data = await res.json();
//     if (!data || data.length === 0) {
//       showMessage("No unread emails for today.", messageBoxList);
//       return;
//     }

//     data.forEach(item => {
//       const li = document.createElement("li");
//       li.textContent = item.subject;
//       li.onclick = () => readEmail(item.subject, email, encryptedPass);
//       subjectsUl.appendChild(li);
//     });
//   } catch (err) {
//     console.error(err);
//     showMessage("Failed to fetch emails.", messageBoxList);
//   }
// }

// async function readEmail(subject, email, encryptedPass) {
//   try {
//     const url = `http://localhost:8080/api/email/read?email=${encodeURIComponent(email)}&appPassword=${encodeURIComponent(encryptedPass)}&subject=${encodeURIComponent(subject)}`;
//     const res = await fetch(url);
//     const body = await res.text();

//     emailSubject.textContent = subject;
//     emailBody.textContent = body;

//     emailList.classList.add("hidden");
//     emailView.classList.remove("hidden");
//   } catch (err) {
//     alert("Failed to read email.");
//     console.error(err);
//   }
// }
const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const fetchBtn = document.getElementById("fetchBtn");

const subjectsUl = document.getElementById("subjects");
const emailBody = document.getElementById("emailBody");
const emailSubject = document.getElementById("emailSubject");
const speakBtn = document.getElementById("speakBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resumeBtn = document.getElementById("resumeBtn");
const stopBtn = document.getElementById("stopBtn");
const backBtn = document.getElementById("backBtn");

const loginForm = document.getElementById("loginForm");
const emailList = document.getElementById("emailList");
const emailView = document.getElementById("emailView");

const messageBox = document.getElementById("messageBox");
const messageBoxList = document.getElementById("messageBoxList");

let utterance;

document.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("creds"));
  if (saved) {
    fetchSubjects(saved.email, saved.encryptedPass);
    loginForm.classList.add("hidden");
    emailList.classList.remove("hidden");
  }
});

loginBtn.onclick = async () => {
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();
  messageBox.textContent = "";

  if (!email || !pass) {
    messageBox.textContent = "❗ Enter email and password.";
    return;
  }

  try {
    const encryptedRes = await fetch(`http://localhost:8080/api/auth/encrypt-password?plain=${encodeURIComponent(pass)}`);
    
    if (!encryptedRes.ok) {
      const errText = await encryptedRes.text();
      messageBox.textContent = "Encryption failed: " + errText;
      return;
    }

    const encryptedPass = await encryptedRes.text();
    localStorage.setItem("creds", JSON.stringify({ email, encryptedPass }));
    sessionStorage.clear(); // Clear cached bodies

    fetchSubjects(email, encryptedPass);
    loginForm.classList.add("hidden");
    emailList.classList.remove("hidden");
  } catch (e) {
    console.error("Encryption error", e);
    messageBox.textContent = "Something went wrong during encryption.";
  }
};

logoutBtn.onclick = () => {
  localStorage.removeItem("creds");
  sessionStorage.clear();
  emailList.classList.add("hidden");
  emailView.classList.add("hidden");
  loginForm.classList.remove("hidden");
  stopSpeech();
};

fetchBtn.onclick = () => {
  const saved = JSON.parse(localStorage.getItem("creds"));
  if (saved) {
    sessionStorage.clear(); // Clear cached bodies
    fetchSubjects(saved.email, saved.encryptedPass);
  }
};

backBtn.onclick = () => {
  emailView.classList.add("hidden");
  emailList.classList.remove("hidden");
  stopSpeech();
};

speakBtn.onclick = () => {
  const text = emailBody.innerText;
  if (!text) return;
  utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
};

pauseBtn.onclick = () => speechSynthesis.pause();
resumeBtn.onclick = () => speechSynthesis.resume();
stopBtn.onclick = stopSpeech;

function stopSpeech() {
  if (speechSynthesis.speaking) speechSynthesis.cancel();
}

async function fetchSubjects(email, encryptedPass) {
  subjectsUl.innerHTML = "";
  messageBoxList.textContent = "⏳ Loading emails...";

  try {
    const url = `http://localhost:8080/api/email/list-unread-today?email=${encodeURIComponent(email)}&appPassword=${encodeURIComponent(encryptedPass)}`;
    const res = await fetch(url);
    
    if (!res.ok) {
      messageBoxList.textContent = "❗ Error fetching email list.";
      return;
    }

    const data = await res.json();
    if (!data.length) {
      messageBoxList.textContent = "✅ No unread emails for today.";
      return;
    }

    messageBoxList.textContent = `📬 ${data.length} unread emails found. Loading content...`;

    // Render subject list
    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.subject;
      li.onclick = () => {
        const body = sessionStorage.getItem(item.subject);
        if (body) {
          showEmail(item.subject, body);
        } else {
          messageBoxList.textContent = "⏳ Still loading content, please wait.";
        }
      };
      subjectsUl.appendChild(li);
    });

    // Fetch each email body in background
    for (const item of data) {
      const body = await fetchEmailBody(item.subject, email, encryptedPass);
      if (body) sessionStorage.setItem(item.subject, body);
    }

    messageBoxList.textContent = `✅ Ready. Click any subject to view.`;
  } catch (err) {
    console.error(err);
    messageBoxList.textContent = "❗ Failed to fetch emails.";
  }
}

async function fetchEmailBody(subject, email, encryptedPass) {
  try {
    const url = `http://localhost:8080/api/email/read?email=${encodeURIComponent(email)}&appPassword=${encodeURIComponent(encryptedPass)}&subject=${encodeURIComponent(subject)}`;
    const res = await fetch(url);
    const body = await res.text();
    return body;
  } catch (err) {
    console.error(`Failed to fetch body for ${subject}`, err);
    return null;
  }
}

function showEmail(subject, body) {
  emailSubject.textContent = subject;
  emailBody.innerHTML = body; // ✅ HTML safe
  emailList.classList.add("hidden");
  emailView.classList.remove("hidden");
}
