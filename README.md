# Shotlist | Full-Stack Movie Logging Platform
![Tech Stack](https://private-user-images.githubusercontent.com/192580522/562938241-63b60969-608a-41e8-a1fe-a3ec6882f0e6.png?jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmF3LmdpdGh1YnVzZXJjb250ZW50LmNvbSIsImtleSI6ImtleTUiLCJleHAiOjE3NzMzOTcwOTcsIm5iZiI6MTc3MzM5Njc5NywicGF0aCI6Ii8xOTI1ODA1MjIvNTYyOTM4MjQxLTYzYjYwOTY5LTYwOGEtNDFlOC1hMWZlLWEzZWM2ODgyZjBlNi5wbmc_WC1BbXotQWxnb3JpdGhtPUFXUzQtSE1BQy1TSEEyNTYmWC1BbXotQ3JlZGVudGlhbD1BS0lBVkNPRFlMU0E1M1BRSzRaQSUyRjIwMjYwMzEzJTJGdXMtZWFzdC0xJTJGczMlMkZhd3M0X3JlcXVlc3QmWC1BbXotRGF0ZT0yMDI2MDMxM1QxMDEzMTdaJlgtQW16LUV4cGlyZXM9MzAwJlgtQW16LVNpZ25hdHVyZT1iZjcxYzk0YmU0ZGY0ZjRkZTc5Y2ZmZDdkODdhYWI2OTQ3MjU2NjI5YTY3YzMyNjMwNjFkNGI5ZGQ4MWQ5ZjM1JlgtQW16LVNpZ25lZEhlYWRlcnM9aG9zdCJ9.XZWxqUtyf3NzIdyTkIbAXE6H_JAd6qzZcSUYJPg3WoU)
**Shotlist** is a production-ready MERN application designed for high-fidelity movie logging and discovery. It bridges the gap between artistic UI design and robust software architecture, featuring a decoupled frontend/backend, centralized state management, and deep integration with the TMDB global database.

---

##  Technical Highlights

* **State Architecture:** Leveraged **Zustand** with **Persist Middleware** to maintain complex filtering states and authentication sessions across browser lifecycles, significantly reducing redundant API overhead.
* **Modular Architecture:** Implemented a **Feature-Based Design** pattern, separating concerns between UI, Layout, and Features.
* **Dynamic Query Engine:** Developed a custom filtering logic that synchronizes UI state with **TMDB API parameters**, allowing for real-time, multi-factor discovery (Genre-mapping, Date ranges, and Language codes).
* **Performance Optimization:** Utilized **React Router v6** for nested layouts and optimized asset delivery via lazy-loading and responsive image sets to ensure a fluid user experience.
* **Scalable API Integration:** Engineered an **Axios Interceptor** layer for centralized error handling and automated JWT token management.

---

## Technical Stack

| Category | Technology |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, Zustand |
| **Backend** | Node.js, Express.js, Redis/Upstash |
| **Database** | MongoDB (Mongoose ODM) |
| **Auth** | JWT (JSON Web Tokens), Secure Cookie sessions |
| **Tools** | React Hot Toast, Lucide Icons, TMDB API |

---

##  Directory Structure

```text
src/
├── components/
│   ├── layout/      # High-order components for route-based structural consistency
│   ├── ui/          # Reusable, stateless UI building blocks 
│   └── common/      # Global utility components 
├── features/        # Complex modules: Auth, FilterSystem, VideoPlayer logic

---
├── store/           # Centralized Zustand stores for Auth and User Preferences
├── pages/           # Route-level views and page-specific logic
└── lib/             # API layer, Axios instances, and global constants
