const emailInput = document.getElementById("email");
const passInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const fetchBtn = document.getElementById("fetchBtn");
const subjectList = document.getElementById("subjects");
const emailBody = document.getElementById("emailBody");
const loginSection = document.getElementById("loginSection");
const mainSection = document.getElementById("mainSection");

window.addEventListener("DOMContentLoaded", () => {
  const email = sessionStorage.getItem("email");
  const pass = sessionStorage.getItem("appPassword");

  if (email && pass) {
    loginSection.classList.add("hidden");
    mainSection.classList.remove("hidden");
    fetchEmails(email, pass);
  }
});

loginBtn.addEventListener("click", () => {
  const email = emailInput.value;
  const pass = passInput.value;

  if (!email || !pass) return alert("Please enter both fields.");

  sessionStorage.setItem("email", email);
  sessionStorage.setItem("appPassword", pass);

  loginSection.classList.add("hidden");
  mainSection.classList.remove("hidden");

  fetchEmails(email, pass);
});

fetchBtn.addEventListener("click", () => {
  const email = sessionStorage.getItem("email");
  const pass = sessionStorage.getItem("appPassword");
  fetchEmails(email, pass);
});

async function fetchEmails(email, pass) {
  subjectList.innerHTML = "";
  emailBody.innerHTML = "";

  try {
    const res = await fetch(`http://localhost:8080/api/email/list-unread-today?email=${email}&appPassword=${pass}`);
    const emails = await res.json();

    if (emails.length === 0) {
      subjectList.innerHTML = "<li>No unread emails today 🎉</li>";
      return;
    }

    emails.forEach(item => {
      const li = document.createElement("li");
      li.textContent = item.subject;

      li.onclick = async () => {
        const r = await fetch(`http://localhost:8080/api/email/read?email=${email}&appPassword=${pass}&subject=${encodeURIComponent(item.subject)}`);
        const text = await r.text();
        emailBody.innerHTML = `<h4>${item.subject}</h4><p>${text}</p>`;
        speak(text);
      };

      subjectList.appendChild(li);
      speak(item.subject);
    });
  } catch (err) {
    subjectList.innerHTML = "<li>❌ Failed to fetch. Check server or credentials.</li>";
  }
}

function speak(text) {
  const utter = new SpeechSynthesisUtterance(text);
  speechSynthesis.speak(utter);
}
