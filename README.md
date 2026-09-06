<div align="center">
  <h1>🦡 Open Stoat</h1>
  <p><strong>An open launcher & desktop client for <a href="https://stoat.chat">Stoat</a> (formerly Revolt) with first-class self-hosted server support.</strong></p>

  <p>
    <a href="https://github.com/xyzmr114/open-stoat"><img src="https://img.shields.io/badge/Status-Active-brightgreen.svg?style=flat-square" alt="Status" /></a>
    <a href="https://github.com/xyzmr114/open-stoat/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-AGPL%20v3-blue.svg?style=flat-square" alt="License: AGPL v3" /></a>
    <a href="https://github.com/stoatchat/for-desktop"><img src="https://img.shields.io/badge/Upstream-stoatchat%2Ffor--desktop-orange.svg?style=flat-square" alt="Upstream" /></a>
  </p>
</div>

---

## 🌟 Why Open Stoat?

The official Stoat desktop client hardcodes the official cloud server (`https://stoat.chat/app`) and only allows self-hosted instances via a hidden command-line flag (`--force-server`).

**Open Stoat** is a community-driven fork that puts self-hosting first:
- 🚀 **Interactive Launcher**: Built-in graphical launcher to choose or enter your server URL on launch.
- 🌐 **1-Click Official Connect**: Quickly connect to the official Stoat network (`https://stoat.chat/app`).
- ⚡ **Self-Hosted & Custom Instances**: Easily connect to any self-hosted or private Stoat server (`https://` or `http://`).
- 📡 **Live Ping / Reachability Test**: Test latency and verify server reachability before connecting.
- 💾 **Favorites & History**: Save your favorite servers and quickly switch between them.
- 🔄 **Quick Server Switching**: Return to the launcher anytime via the **System Tray** or using the global shortcut <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> (or <kbd>Cmd</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> on macOS).
- ⚙️ **Auto-Connect**: Remember your preferred server and connect automatically on launch, while keeping the launcher accessible anytime.
- 🎨 **Stoat Dark Theme**: Sleek, polished UI matching Stoat's signature design language.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [pnpm](https://pnpm.io/)

### Installation & Running

```bash
# 1. Clone your fork
git clone https://github.com/xyzmr114/open-stoat.git
cd open-stoat

# 2. Install dependencies
npm install

# 3. Start the application in development mode
npm start
```

### Building Standalone Packages

```bash
# Build the packaged executable
npm run package

# Create platform installers (Squirrel for Windows, Zip, Flatpak, etc.)
npm run make
```

---

## 🧭 How to Switch Servers

1. **Via System Tray**: Right-click the Stoat icon in your system tray and select **"Switch Server / Launcher"**.
2. **Via Keyboard Shortcut**: Press <kbd>Ctrl</kbd> + <kbd>Alt</kbd> + <kbd>S</kbd> anywhere while using the client to immediately return to the launcher.

---

## 🛠️ Self-Hosting Resources

- [Official Stoat Self-Hosted Guide](https://github.com/stoatchat/self-hosted)
- [Stoat Developer Wiki](https://github.com/stoatchat/developer-wiki)

---

## 🤝 Contributing

Contributions, bug reports, and suggestions are welcome!
Feel free to open an issue or submit a pull request to [xyzmr114/open-stoat](https://github.com/xyzmr114/open-stoat).

---

## 📄 License

Open Stoat is licensed under the **GNU Affero General Public License v3 (AGPL-3.0)**, preserving the same copyleft license as the upstream Stoat / Revolt client. See [LICENSE](./LICENSE) for details.
