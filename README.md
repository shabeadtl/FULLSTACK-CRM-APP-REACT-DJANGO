🚀 CRM-4B – Full Stack Customer Relationship Management System

A modern full-stack CRM web application to manage Leads, Companies, Deals, and Support Tickets with activity tracking, analytics dashboard, authentication, and admin user management.

Built with React + Django REST + PostgreSQL for scalable, real-world usage.

✨ Features

🔐 JWT Authentication (Register / Login / Reset Password)

🧾 Full CRUD for Leads, Companies, Deals & Tickets

📊 Live Dashboard with:

Revenue charts

Pipeline conversion funnel

Team performance

🗂 Activity tracking
(Notes, Calls, Emails, Tasks, Meetings)

🔎 Global search across modules

📥 CSV Import

📤 PDF Export

🔔 In-app notifications

👤 User profile management

🛠 Admin panel for user control

📱 Fully responsive UI

🧰 Tech Stack
Frontend

React 19 + Vite

Material UI (MUI)

React Router DOM

React Toastify

React Quill

jsPDF

Backend

Python + Django

Django REST Framework

Simple JWT

PostgreSQL

📂 Project Structure
crm-4b/
 ├── frontend (React + Vite)
 └── backend (Django + DRF)
🔑 Core Modules

Leads Management

Company Management

Deal Pipeline

Ticket Support System

Reports & Analytics

Admin User Control

🔐 Authentication Flow

User registers → JWT tokens generated

Login → access + refresh token

Tokens stored in frontend

Protected API routes with Bearer token

📊 Dashboard

Total leads & active deals

Closed deal revenue

Monthly / yearly sales chart

Conversion funnel

Sales team performance

⚙️ Installation & Setup
🔹 Prerequisites

Python 3+

Node.js 18+

PostgreSQL

Git

🔹 Backend Setup
cd crm-4b-backend

python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt

python manage.py migrate
python manage.py runserver

Backend runs on → http://localhost:8000

🔹 Frontend Setup
cd crm-4b

npm install
npm run dev

Frontend runs on → http://localhost:5173

🗄 Database Configuration
DB NAME : crm_db
HOST    : localhost
PORT    : 5432
USER    : postgres
🎨 UI Theme

Primary: #5B4DDB

Background: #f8f9fc

Text: #1e293b

Success: #059669

Danger: #dc2626

📌 API Highlights
/api/auth/
/api/leads/
/api/companies/
/api/deals/
/api/tickets/

Full RESTful structure with activity endpoints.

👨‍💻 Role

Team Lead & Full Stack Developer

Designed scalable architecture

Implemented REST APIs

Built responsive UI with reusable components

Integrated authentication & dashboard analytics

🚀 Future Enhancements

AI lead insights

Email automation

Role-based access control

Cloud deployment

📜 License

This project is for educational & portfolio purposes.

⭐ If you like this project, give it a star!
