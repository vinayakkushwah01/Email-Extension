const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
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
  const email = emailInput.value;
  const pass = passInput.value;
  if (!email || !pass) return alert("Enter email and password");

  const encryptedRes = await fetch(`http://localhost:8080/api/auth/encrypt-password?value=${encodeURIComponent(pass)}`);
  const encryptedPass = await encryptedRes.text();

  localStorage.setItem("creds", JSON.stringify({ email, encryptedPass }));
  fetchSubjects(email, encryptedPass);

  loginForm.classList.add("hidden");
  emailList.classList.remove("hidden");
};

logoutBtn.onclick = () => {
  localStorage.removeItem("creds");
  emailList.classList.add("hidden");
  loginForm.classList.remove("hidden");
};

backBtn.onclick = () => {
  emailView.classList.add("hidden");
  emailList.classList.remove("hidden");
  stopSpeech();
};

speakBtn.onclick = () => {
  const text = emailBody.textContent;
  if (!text) return;
  utterance = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utterance);
};

pauseBtn.onclick = () => speechSynthesis.pause();
resumeBtn.onclick = () => speechSynthesis.resume();
stopBtn.onclick = stopSpeech;

function stopSpeech() {
  speechSynthesis.cancel();
}

async function fetchSubjects(email, encryptedPass) {
  subjectsUl.innerHTML = "";
  const res = await fetch(`http://localhost:8080/api/email/list-unread-today?email=${email}&appPassword=${encryptedPass}`);
  const data = await res.json();

  data.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item.subject;
    li.onclick = () => readEmail(item.subject, email, encryptedPass);
    subjectsUl.appendChild(li);
  });
}

async function readEmail(subject, email, encryptedPass) {
  const res = await fetch(`http://localhost:8080/api/email/read?email=${email}&appPassword=${encryptedPass}&subject=${encodeURIComponent(subject)}`);
  const body = await res.text();

  emailSubject.textContent = subject;
  emailBody.textContent = body;

  emailList.classList.add("hidden");
  emailView.classList.remove("hidden");
}
