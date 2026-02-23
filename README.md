<div align="center">
  <!-- Replace the URL below if you have a logo or screenshot! -->
  <h1>🏯 Kanji Cards</h1>
  <p><strong>An interactive, gamified web application for mastering JLPT N5-N1 Kanji.</strong></p>
  
  [![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-7-purple?logo=vite)](https://vitejs.dev/)
  [![Netlify Deploy](https://img.shields.io/badge/Deploy-Netlify-00C7B7?logo=netlify)](https://www.netlify.com/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg)](#)
</div>

<br />

Welcome to **Kanji Cards**, an open-source developer-friendly tool built to make memorizing Japanese Kanji intuitive, trackable, and fun. Whether you're just starting with N5 or aiming for complete fluency at N1, this platform is designed to provide curated memorization techniques, comprehensive testing, and personalized progress tracking.

---

## ✨ Key Features

- **📚 Full JLPT Coverage:** Study Kanji categorized by JLPT levels, from N5 all the way up to N1.
- **🧠 "Hackable" Memorization:** Learn efficiently with detailed meanings, readings (Onyomi/Kunyomi), and practical vocabulary examples for each card.
- **🏷️ Smart Tagging System:** Mark Kanji as **"Learned"** or **"Needs Review"** to customize your study sessions.
- **✏️ Personal Notes:** Add and track custom notes on individual Kanji to anchor them to your own memory cues.
- **📝 Level-Based Testing:** Challenge yourself with structured tests for each JLPT level to solidify your knowledge.
- **📊 Progress Tracking & Reset:** See your active study metrics on the dashboard, with the ability to completely reset progress, notes, or review lists when you want a fresh start.

---

## 🛠️ Tech Stack

- **Frontend Core:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router](https://reactrouter.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Deployment:** Ready for automatic deployment on [Netlify](https://www.netlify.com/) (configured via `netlify.toml`).

---

## 🚀 Getting Started Locally

Want to run the project on your own machine? It's easy!

### Prerequisites

- Node.js (v20 or higher recommended)
- npm

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/kanji-cards.git
   cd kanji-cards
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Fetch Kanji Data & Build Search Index:**
   _This project uses local scripts to build its comprehensive data sources._

   ```bash
   npm run fetch-data
   ```

4. **Start the development server:**

   ```bash
   npm run dev
   ```

5. **Open your browser:**
   Navigate to `http://localhost:5173` to see the app in action!

---

## 🤝 How to Contribute

We actively welcome and encourage community contributions to make this the best Kanji learning tool possible!

### What we are looking for:

1. **🧠 Better Learning Materials (Content overrides):**
   - Have a great mnemonic device for a difficult Kanji?
   - Know better vocabulary examples that reflect natural, everyday Japanese?
   - Spot an error or typo in the current Kanji meanings or readings?
   - **We want those!** Please open an Issue or Pull Request targeting the learning content.

2. **💡 Feature Requests:**
   - Have an idea for a new study mode, a different testing format, or UI improvement?
   - Please open an Issue and tag it as an `enhancement` so we can discuss and plan it.

_(Note: At this time, we are focusing heavily on curating the best possible content and feature planning before accepting broad code/architectural contributions. **Please restrict your setup to learning material updates and new feature requests via Issues!**)_

---

<div align="center">
  Made with ❤️ for the Japanese learning community.
</div>
