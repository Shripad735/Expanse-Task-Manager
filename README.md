# Personal Dashboard - Expense & Task Manager

A full-stack web application designed to help you manage your personal finances and tasks in one convenient dashboard. This project features an intuitive expense tracker and an effective task manager, built with a modern tech stack.

## ✨ Features

### 💰 Expense Tracker
- **Add & Delete Expenses**: Quickly log new expenses with a description, amount, and category.
- **Categorization**: Assign expenses to predefined categories like Food, Transport, Shopping, etc.
- **Dynamic Filtering**: Filter expenses by category or search by description.
- **Statistics**: View total expenses and a summary of your spending.

### ✅ Task Manager
- **Add & Delete Tasks**: Create new tasks with descriptions, priority levels, and optional due dates.
- **Task Prioritization**: Set priority to Low, Medium, or High.
- **Status Tracking**: Mark tasks as complete or pending.
- **Overdue Alerts**: Visual indicators for tasks that are past their due date.

### 🎨 General
- **Light & Dark Mode**: Toggle between light and dark themes for comfortable viewing.
- **Responsive Design**: Fully responsive layout for seamless use on desktop and mobile devices.
- **Modern UI**: Clean and user-friendly interface built with React.

## 🛠️ Tech Stack

- **Frontend**:
  - **React**: For building the user interface.
  - **Axios**: For making API requests to the backend.
  - **CSS**: For custom styling and responsiveness.

- **Backend**:
  - **Node.js & Express**: For the server-side application and REST API.
  - **MongoDB & Mongoose**: As the database for storing expenses and tasks.
  - **CORS**: To handle cross-origin requests between frontend and backend.
  - **Dotenv**: For managing environment variables.

## 🚀 Getting Started (Local Development)

To run this project on your local machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/)
- A [MongoDB](https://www.mongodb.com/try/download/community) instance (local or a free Atlas cluster).

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create a .env file and add your environment variables
# (copy from .env.example)
cp .env.example .env

# Start the backend server
npm start
```
> The backend will be running on `http://localhost:5000`.

### 3. Frontend Setup
```bash
# Navigate to the frontend directory from the root
cd frontend

# Install dependencies
npm install

# Start the React development server
npm start
```
> The frontend will open and run on `http://localhost:3000`, automatically connecting to the local backend.
