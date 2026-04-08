# 🚀 GrowthX – Personal Productivity SaaS

> Your **all-in-one growth dashboard** to track tasks, projects, jobs, clients, and progress — built for developers, freelancers, and builders.

---

## ✨ Features

* 📊 **Dashboard Overview**

  * Real-time stats (tasks, projects, jobs, clients)
  * Activity tracking
  * Clean SaaS-style UI

* ✅ **Tasks Management**

  * Add, update, delete tasks
  * Mark as done / pending
  * Daily productivity tracking

* 📦 **Projects Tracker**

  * Track active projects
  * Progress indicators
  * Tech stack management

* 💼 **Job Applications**

  * Track applied jobs
  * Status: applied, interview, rejected, offer

* 👥 **Clients CRM**

  * Manage client data
  * Status tracking (active, pending, inactive)

* 🔥 **Leads Management**

  * Track potential clients
  * Conversion tracking ready

* 📝 **Notes System**

  * Store ideas, learning, and plans
  * Persistent database storage

* ⚙️ **Settings**

  * Profile management
  * Theme system (dark/light ready)

---

## 🧠 Tech Stack

* **Frontend:** Next.js (App Router), React, Tailwind CSS
* **Backend:** Next.js API Routes
* **Database:** MongoDB + Mongoose
* **Animations:** Framer Motion
* **Icons:** Lucide React

---

## 📁 Folder Structure

```
app/
 ├── api/
 │    ├── tasks/
 │    ├── projects/
 │    ├── jobs/
 │    ├── clients/
 │    ├── leads/
 │    ├── notes/
 │    └── settings/
 │
 ├── tasks/
 ├── projects/
 ├── jobs/
 ├── clients/
 ├── leads/
 ├── notes/
 ├── settings/
 └── page.tsx (Dashboard)

components/
 └── Sidebar.tsx

models/
 ├── Task.ts
 ├── Project.ts
 ├── Job.ts
 ├── Client.ts
 ├── Lead.ts
 ├── Note.ts
 └── Setting.ts
```

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/shirajgit/growthx.git
cd growthx
```

---

### 2. Install dependencies

```bash
npm install
```

---

### 3. Setup environment variables

Create `.env.local`

```env
MONGODB_URI=your_mongodb_connection_string
```

---

### 4. Run the app

```bash
npm run dev
```

App will run on:

```
http://localhost:3000
```

---

## 📸 Screenshots

> Add your UI screenshots here (Dashboard, Tasks, Projects, etc.)

---

## 🚀 Future Improvements

* 🔐 Authentication (multi-user SaaS)
* 📊 Charts & analytics
* 🔔 Notifications system
* ☁️ Deployment (Vercel)
* 📱 Mobile optimization
* 🤖 AI productivity assistant

---

## 💡 Inspiration

Built as a **personal growth system** to track:

* Daily work
* Career progress
* Freelancing pipeline

---

## 👨‍💻 Author

**Shiraj Mujawar**
Full Stack Developer (MERN | Next.js | SaaS Builder)

---

## ⭐ Support

If you like this project:

👉 Star this repo
👉 Share with others
👉 Build your own version

---

## 📜 License

MIT License
