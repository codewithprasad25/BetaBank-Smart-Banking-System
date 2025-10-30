# BetaBank – Digital Banking Application

BetaBank is a full-stack Digital Banking Platform built with Spring Boot and React (Vite).  
It provides secure authentication, account management, transaction tracking, and a modern responsive UI — delivering a smooth banking experience.

---

## Features

- User Authentication (JWT-based Register & Login)  
- Account Management – Create and view multiple accounts  
- Transaction History – Track deposits and withdrawals  
- Spring Boot + React Integration  
- Responsive, modern UI with clean routing  
- Proper validation & error handling on frontend and backend  

---

## Tech Stack

### Frontend
- React (Vite)  
- Axios  
- React Router  
- Tailwind CSS / CSS  

### Backend
- Spring Boot (Java)  
- Spring Security + JWT Authentication  
- Spring Data JPA / Hibernate  
- MySQL Database  

---

## Project Structure
```
BetaBank/
├── backend/ # Spring Boot (Port 8080)
│ ├── src/
│ ├── pom.xml
│ └── ...
└── frontend/ # React Vite (Port 8081)
├── public/
├── src/
├── .env
├── vite.config.js
├── package.json
└── ...
```


## Setup Instructions

### 1. Clone the Repository

git clone https://github.com/your-username/BetaBank.git
then if you are not in BetaBank directory -->
```bash
cd BetaBank
```

### 2. Backend Setup (Spring Boot)
Navigate to backend directory :
```bash
cd backend
```

Step 1 - For Configuring MySQL Database
Edit 'src/main/resources/application.properties' :
```
application.properties

spring.datasource.url=jdbc:mysql://localhost:3306/BetaBank
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
jwt.secret=your_jwt_secret_key
server.port=8080
```

Step 2 - Now We Run the Backend

- **If Maven is installed locally**:
```
bash
mvn spring-boot:run
```

- **If Maven is NOT installed, use the Maven Wrapper included**:
```
bash
# Linux/macOS 
./mvnw spring-boot:run

# Windows (PowerShell)
./mvnw.cmd spring-boot:run
```

- Now Backend runs on: http://localhost:8080

### 3. Frontend Setup (React Vite)
Install frontend dependencies :
```
bash
cd ../frontend
npm install
```

--> Configure .env file

--> Create a .env file in frontend/ 
> This environment variable tells the frontend where to find the backend API:
```
VITE_API_BASE_URL=http://localhost:8080/api
```

--> Run the Frontend
```
bash
npm run dev
```
Frontend runs on: http://localhost:8081




