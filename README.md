# Interview Feedback Management System (IFMS)

An end-to-end web-based platform to manage interview schedules, gather structured feedback from interviewers, and streamline communication through automated emails and downloadable reports.

---

## 📌 Project Overview

This system provides HR teams and interviewers with a centralized tool to:
- Schedule interviews with candidate details
- Record and evaluate interviews based on skill-based parameters
- Generate structured feedback reports as PDFs
- Notify stakeholders via automated emails

Built with modern web technologies and a robust backend to ensure reliability, maintainability, and user-friendly interactions.

---

## 🚀 Tech Stack

### Backend
- **Java 17**
- **Spring Boot**
- **PostgreSQL**
- **EmailJS** – for automated email notifications
- **jsPDF** – for generating downloadable feedback reports

### Frontend
- **HTML**
- **CSS**
- **JavaScript**

### Version Control
- **GitHub** for source control and collaboration

---

## 🏗️ Project Structure

### Backend
backend/ ├── src/ │ ├── main/ │ │ ├── java/ │ │ │ └── com/ │ │ │ └── ifms/ │ │ │ ├── controller/ │ │ │ ├── model/ │ │ │ ├── repository/ │ │ │ ├── service/ │ │ │ └── InterviewFeedbackApplication.java │ │ └── resources/ │ │ └── application.properties ├── pom.xml

### Frontend
frontend/ ├── css/ │ └── styles.css ├── js/ │ └── main.js ├── index.html ├── login.html ├── dashboard.html

---

## ⚙️ Setup & Installation

### Prerequisites
- Java 17
- PostgreSQL
- Git

### Backend Setup
# Clone the repo
git clone https://github.com/rit2003/myrepo.git

# Navigate to backend
cd backend/interviewer-scheduler

# Configure PostgreSQL DB in application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ifms
spring.datasource.username=postgres
spring.datasource.password=1234

# Run the app
./mvnw spring-boot:run
🌐 Frontend Setup
You can run the frontend locally without any build tools. Just open the HTML files directly in your browser:

# Navigate to the frontend folder
cd frontend

# Open index.html or login.html using your browser
open index.html    # Mac
start index.html   # Windows
xdg-open index.html # Linux
💡 Or use a Live Server (like the VS Code extension) for a smoother dev experience.

-----------------------

📬 API Overview
All APIs are available in the included Postman Collection file: IFMS_Postman_Collection.json

🔐 Authentication
POST /api/auth/login
POST /api/auth/register

📅 Schedule Management
POST /api/schedule/add
GET /api/schedule/getAll
GET /api/schedule/getByEmail/{email}

📝 Evaluation Management
POST /api/evaluation/save
GET /api/evaluation/getByEmail/{email}
POST /api/evaluation/exportPdf/{intervieweeEmail}

📧 Email Service
POST /api/email/send

-----------------------------

🧩 Features
✅ User Authentication (HR & Interviewers)

✅ Create and manage interview schedules

✅ Save skill-based evaluations

✅ Auto-generate PDF reports

✅ Automated email notifications

✅ Clean and responsive UI

