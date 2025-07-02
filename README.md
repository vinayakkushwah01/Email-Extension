# 📧 Email Reader + MCP Voice Assistant Chrome Extension

An intelligent browser extension + backend service that **reads your Gmail messages aloud** and manages your inbox like a **Mini Control Panel (MCP)**. Built for simplicity, speed, and voice-based interaction.

---

## 🚀 Features

### 🌐 Chrome Extension (`.crx`)
- 🔐 Secure login using Gmail App Passwords
- 📥 Fetches **unread emails** for today
- 📢 Read aloud your email content using browser's **SpeechSynthesis**
- 🧠 Controls: Speak, Pause, Resume, Stop
- 🎛️ MCP-style panel with fast navigation
- 💾 Caches fetched emails for offline/fast repeat access
- ⚡ Background body preloading for faster voice playback

### 🖥️ Backend Server (`.jar`)
- Built with **Spring Boot**
- REST API for:
  - 🔑 Encrypting credentials
  - 📬 Reading Gmail using IMAP
  - 🧠 Filtering today's unread emails
- Supports easy deployment via **`.jar` file**

---

## 📦 Downloads

| Component        | Link                                                                 |
|------------------|----------------------------------------------------------------------|
| 🧩 Chrome Extension `.crx` | [Download Extension `.crx`](https://github.com/vinayakkushwah01/Email-Extension/blob/main/email-extension.crx) |
| ⚙️ Spring Boot `.jar`       | [Download Backend `.jar`](https://github.com/vinayakkushwah01/Email-Extension/blob/main/email-reader-0.0.1-SNAPSHOT.jar)    |

---

## 🛠️ System Requirements

### ✅ For Backend (`.jar`)
- Java 17 or higher
- Internet connection (for IMAP access)
- Gmail account with:
  - App password enabled
  - IMAP enabled

### ✅ For Extension
- Chrome 112+ (or Chromium-based browser)
- Gmail account

---

## 🧑‍💻 Setup Instructions

### 🔹 1. Run the Backend

```bash
java -jar email-reader-backend.jar
By default, it runs on: `http://localhost:8080`
```
---

### 🔹 2. Install the Extension

- Go to `chrome://extensions/`
- Enable **Developer Mode**
- Drag and drop `email-reader-extension.crx` **OR** click **"Load unpacked"** to test
- **Pin the extension** in your toolbar

---

### 🔹 3. Usage

- Login using your **Gmail address** and **App Password**
- Click **📥 Fetch Emails**
- Select a subject to view full content
- Use 🗣️ buttons to listen to your email

---

### 🎨 Preview
![image](https://github.com/user-attachments/assets/77265bb2-8c9b-47dc-8f46-dba52f2a560d)

- **View in browser**  
![image](https://github.com/user-attachments/assets/46aff4f2-bbbe-481c-a320-0fe26aa9eb5d)

- **Inside any subject of email**  
![image](https://github.com/user-attachments/assets/c65d3440-2220-4297-a30d-23e530067089)


---

### 🧩 Micro Control Panel (MCP) Functionality

The system follows the principles of a lightweight **MCP**:

- ✅ Modular voice commands  
- ⚡ Pre-fetched data for minimal lag  
- 🧭 Multi-panel navigation  
- 🔌 Easy extensibility for **Email, WhatsApp, Notes**, and more *(future support planned)*

---

### 🤝 Contributing

We welcome contributions! Here's how you can help:

- 🐞 Report bugs via **Issues**
- 🌟 Star the project if you like it
- 🧩 Submit new features via **Pull Requests**

---

### 🔧 To Run Locally

1. Clone the repo
2. Open backend in any Java IDE or run `.jar`
3. Load extension via `chrome://extensions`

---

### 📄 License

This project is licensed under the **MIT License** – feel free to use, modify, and share.

---

### 🙋 FAQ

**Q: Why use App Passwords?**  
A: For security — they’re required for IMAP access if 2FA is enabled.

**Q: Does it read emails aloud?**  
A: Yes! With Chrome’s built-in text-to-speech engine.

**Q: Can I add WhatsApp/Notes to this?**  
A: We're building an MCP ecosystem. Stay tuned or fork it for your needs!

---

### 💬 Contact

**Made with ❤️ by Vinayak Kushwah**

