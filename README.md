# 💼 ExpenseTracker — React + Node.js + Express + MongoDB

An advanced expense tracking web application that lets users add, filter, upload, and download expenses. It supports updates via Excel upload, report downloads, and filtering by various criteria.

---

## 🧰 Features

- 🔐 **User Authentication**  
  - Protected routes; users must be logged in to interact with their expenses  

- 📑 **Expense Management**  
  - Add new expenses manually (fields: name, source, category, type, amount, date, percentage paid)  
  - Delete existing expenses  

- 🔍 **Filtering & Searching**  
  - Filter expenses by name, source, type  
  - Search across multiple fields (name, source, category)  
  - Filter by date range  

- 📂 **Excel Integration**  
  - Upload Excel files to add or update existing expenses (updates amount, percentagePaid, balanceAmount, type)  
  - Download filtered or full expense reports as Excel  

- 📊 **Frontend UI**  
  - Built with React (JavaScript)  
  - Responsive layouts: table view on desktop, card view on mobile  

- ⚙️ **Backend API**  
  - Node.js + Express  
  - MongoDB for storing data  
  - Bulk operations on uploads  

---

## 🚀 Getting Started

### 📁 Clone the repository

```bash
git clone https://github.com/Calphius18/ExpenseTracker.git
cd ExpenseTracker
```

### 🛠 Setup Backend

- Navigate to backend folder:

```bash
cd backend
```

- Install dependencies:

```bash
npm install
# or
yarn
```

- Create .env with required environment variables, e.g.:

```bash
PORT=8000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

- Start backend server:

```bash
npm run dev
# or
yarn dev
```

---

### 🔧 Setup Frontend

- Navigate to frontend folder:

```bash
cd frontend
```

- Install dependencies:

```bash
npm install
# or
yarn
```

- Configure API base URL in your frontend (e.g. utils/apiPaths.js should match your backend BASE_URL).

- Start React dev server:

```bash
npm start
# or
yarn start
```

Frontend will typically run at http://localhost:3000.

---

### 📋 Endpoints Overview

| Path                             | Method | Description                                |
| -------------------------------- | ------ | ------------------------------------------ |
| `/api/v1/auth/login`             | POST   | Login user                                 |
| `/api/v1/auth/register`          | POST   | Register new user                          |
| `/api/v1/expense/add`            | POST   | Add a new expense                          |
| `/api/v1/expense/get`            | GET    | Get all expenses for user                  |
| `/api/v1/expense/report`         | GET    | Get filtered expenses (with query params)  |
| `/api/v1/expense/downloadReport` | GET    | Download Excel report with applied filters |
| `/api/v1/expense/uploadExcel`    | POST   | Upload Excel to add/update expenses        |

### ⚙️ Scripts

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev` (backend) | Start backend server in development |
| `npm start` (frontend)  | Run React frontend dev server       |
| `npm run build`         | Build frontend for production       |
| `npm run lint`          | Run ESLint checks (if configured)   |

- 🔒 **Validation & Rules**

  -Excel uploads validate type field. Allowed values include CAPEX, OPEX, and Transport Fee.
  -If type is invalid or missing, a default is applied.
  -percentagePaid, amount, balanceAmount, and type updates are supported via uploads.

- 🛠 **Usage Tips**

  -Always click Apply Filters before downloading or viewing filtered results.
  -Use date format YYYY-MM-DD when uploading Excel or entering dates.
  -Keep allowed expense types in sync across both frontend dropdowns and backend validation.
  -Add database indexes on date, type, etc. for faster filtering with large datasets.

## 🙋 Contributors & License

This project was built by Calphius18. Contributions and suggestions are welcome.
