# Bank Application

This is a simple bank application built with a **Node.js backend** and a **Next.js frontend**. The application allows users to register, log in, view their account balance, and perform transactions like depositing money.

## Features

- User Registration
- User Login (Generates a one-time token for the session)
- View Account Balance
- Deposit Money

## Technologies

- **Backend**: Node.js, Express, body-parser, CORS
- **Frontend**: Next.js (React)
- **Database**: In-memory data (no persistent storage)
- **Authentication**: One-time token for session management

## Setup

### 1. Clone the Repository

Clone this repository to your local machine:

```bash
git clone https://github.com/Shabbo0o/bank.git
```

### 2. Set Up Backend

1. Navigate to the `backend` directory:

```bash
cd backend
```

2. Install required dependencies:

```bash
npm install
```

3. Start the backend server:

```bash
node server.js
```

The backend server will run on `http://localhost:4000`.

### 3. Set Up Frontend

1. Navigate to the `frontend` directory:

```bash
cd frontend
```

2. Install required dependencies:

```bash
npm install
```

3. Start the frontend server:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000`.

### 4. API Endpoints

**POST** `/signup`: Create a new user

- Request Body: `{ "username": "string", "password": "string" }`

- Response: `{ "message": "User created", "userId": "number" }`

**POST** `/login`: Log in a user and get a token

- Request Body: `{ "username": "string", "password": "string" }`

- Response: `{ "message": "Login successful", "token": "string" }`

**POST** `/me/accounts`: Get the account balance (requires a token)

- Request Body: `{ "token": "string" }`

- Response: `{ "balance": "number" }`

**POST** `/me/accounts/transactions`: Deposit money into the account (requires a token)

- Request Body: `{ "token": "string", "amount": "number" }`

- Response: `{ "message": "Deposit successful", "balance": "number" }`

### 5. Deploying on AWS

### 6. Troubleshooting

- Ensure that your backend is running on` http://localhost:4000` and your frontend on `http://localhost:3000`.

- If you encounter any CORS issues, ensure that the `cors` middleware is set up in the backend.

- If the frontend can't find the backend route, verify that you are using the correct URL (`http://localhost:4000/signup` for example).
