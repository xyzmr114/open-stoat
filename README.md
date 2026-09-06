<div align="center">
  <h1>Open Stoat</h1>
  <p><strong>Open-source launcher and desktop client for Stoat (formerly Revolt) with custom self-hosted server support.</strong></p>
</div>

---

## 🌟 Why Open Stoat?

The official Stoat desktop app hardcodes the official cloud server (`https://stoat.chat/app`) and only allows self-hosted instances through a hidden command-line flag (`--force-server`).

**Open Stoat** is an open-source launcher and client fork designed for self-hosters and decentralization:
- 🚀 **Built-in Launcher**: Choose between official and custom servers on startup.
- 🌐 **Self-Hosted Support**: Connect to any custom server URL (`https://` or `http://`) with live latency/ping testing.
- 💾 **Favorites & Saved Instances**: Easily save and manage multiple server configurations.
- ⚡ **Auto-Connect**: Option to remember your last server and jump straight into chat.
- 🔄 **Quick Server Switching**: Return to the launcher anytime via the system tray menu or with the global shortcut <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> (or <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> on macOS).
- 🎨 **Modern Stoat Dark Theme**: Sleek UI matching Stoat's signature styling.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/)

### Installation & Development
```bash
# Install dependencies
npm install

# Start development mode
npm start

# Package standalone executable
npm run package

# Create installer packages
npm run make
```

---

## 🧭 How to Switch Servers

- **From System Tray**: Right-click the Stoat icon in your system tray and click **Switch Server / Launcher**.
- **Keyboard Shortcut**: Press <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> anywhere in the app to return to the server picker.

---

## 🤝 Forking & Contributing on GitHub

1. Click **Fork** on the upstream repository or this fork.
2. In your local repository directory:
   ```bash
   git remote add origin https://github.com/<your-username>/<your-fork-name>.git
   git push -u origin main
   ```
3. Submit issues or pull requests to improve the open launcher!

---

## 📄 License

GNU AGPL v3 (same as upstream Stoat / Revolt client).
