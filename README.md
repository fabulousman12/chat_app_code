<h1 align="center">✨ Echoid — Encrypted Chat App</h1>

<p align="center">
  <img src="https://img.shields.io/badge/version-0.5.0-blue.svg" />
  <img src="https://img.shields.io/badge/platform-Ionic%20React-green" />
  <img src="https://img.shields.io/badge/encryption-Enabled-orange" />
</p>

> **Echoid** is a privacy-first, full-stack chat app built with Ionic React and powerful encryption under the hood. It includes support for real-time messaging, media sharing, push notifications, and cross-platform builds.

---

## 📦 Features

- 🔐 **End-to-End Encryption** using Hybrid Crypto JS
- 📱 **Built with Ionic + Capacitor** for native Android support
- 🖼️ Image, Video, Audio & File Uploads (with cropping, preview, etc.)
- 🛠️ Background tasks, local notifications, camera, contacts, file picker integrations
- 🧠 Local database with WatermelonDB + RxDB
- 🔔 Push Notifications via OneSignal & Pushy
- 🧪 Unit & E2E testing (Vitest + Cypress)
- 🌐 Realtime messaging with WebSockets
- ☁️ Firebase support for backend features

---

## ⚠️ Disclaimer

> This project was developed solo over the course of **4–5 months** — as both a learning experience and a production-grade prototype. It’s my **first major Ionic Android project**, and naturally, the codebase has grown large and somewhat messy in places.

- Some files or variables might be **leftover**, unused, or not fully cleaned up. This is unintentional, and may cause confusion when reading through the code.
- If you come across any unclear or redundant sections — **don’t overthink it**. They may simply be stubs from testing or earlier features I didn’t have time to clean up.
- I hope to revisit and refactor the codebase in the future, but as a solo developer, it takes time and energy — especially alongside academics.

I appreciate your patience and understanding. Feel free to open issues or PRs to help improve the project!

---

## 🚀 Getting Started

### 📦 Install Dependencies

```bash
npm install


⚙️ Environment & Platform Setup

This repository contains the core application source, but some files are intentionally not included because they are environment-specific, deployment-specific, or runtime-generated.

You are expected to provide these based on your own setup.

📁 Intentionally Excluded / Not Tracked Files
1️⃣ Platform Service Configuration

Certain platform-level service files are not included in this repository, such as:

Android platform service configuration JSON (Play / Firebase related)

iOS platform service plist files

These files:

are generated per project

depend on package name / app ID

differ between development and production

They are only required at build time, not to understand the source code.

2️⃣ Internal Data & App-Specific Modules

Some internal files (for example data.tsx or similar app-specific data providers) are not part of this public repository.

These files typically:

contain deployment-specific data handling

depend on a particular backend or schema

act as glue between services and UI

The surrounding architecture shows where and how such modules plug in, but their concrete implementation is intentionally left out.

3️⃣ Local & Runtime Files

The following are excluded by design:

.env* files

local runtime logs

cached artifacts

temporary build metadata

test output files

These are not source code and should not be committed.

🧱 What This Repository Includes

This repository does include:

Full Ionic React frontend

Capacitor configuration

Android project structure

WebRTC integration logic

Encryption utilities

UI components & screens

State management & database layers

Plugin source (e.g. ionic-thumbnail as a normal folder)

Build & tooling configuration

The codebase is fully readable, extensible, and suitable as:

a reference project

a learning resource

a base for further development

🛠️ Build & Run (Android)
npx cap sync android
npx cap open android


Build and run the app using Android Studio as usual.

🧠 Design Philosophy

Echoid is structured to be:

privacy-first

open-source friendly

environment-agnostic

safe to fork and adapt

Anything that is tied to a specific deployment or account is intentionally excluded.

🤝 Contributions

Issues, discussions, and pull requests are welcome.

If something looks unused, unfinished, or confusing, it likely reflects the realities of building a large application solo. Improvements and cleanups are always appreciated.

📄 License

(Add your license here — MIT or Apache-2.0 recommended)


---

If you want, I can:
- merge this seamlessly into your **existing README**
- tighten the tone (more professional / more casual)
- add a **Backend Overview** section
- add a **Known Limitations** section

Just tell me.
