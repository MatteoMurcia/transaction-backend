# transaction-backend

A simple backend API built with Node.js, Express, TypeScript, and MongoDB. This API allows users to register, authenticate, create transaction requests, and manage them with admin approval.

## Table of Contents
- [Setup Instructions](#setup-instructions)
- [Database Schema](#database-schema)
- [API Usage](#api-usage)
  - [Authentication](#authentication)
  - [Transactions](#transactions)
- [Running Tests](#running-tests)
- [Notes](#notes)

---

## Setup Instructions

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm)
- [MongoDB](https://www.mongodb.com/) (or access to a MongoDB Atlas database)

### Clone the Repository
```bash
git clone https://github.com/your-username/transaction-backend.git
cd transaction-backend
```

### Install Dependencies
```bash
npm install
```

### Configure Environment Variables

1. **Create a `.env` File**:
   - Duplicate the `.env.example` file provided in the repository:
     ```bash
     cp .env.example .env
     ```
   - Rename the duplicate file to `.env`.
   
2. **Fill in the Necessary Values**:
   - Open the `.env` file and replace the placeholder values with your actual configuration details.

**Example of `.env.example`**:
```env
MONGO_URI=your_mongodb_uri
MONGO_URI_TEST=your_mongodb_test_uri
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

### Build and Run the Server

- For development:
  ```bash
  npm run dev
  ```
  
- To build and run the production server:
  ```bash
  npm run build
  npm start
  ```

The server will start on the port specified in the .env file (default: 5000).

---

## Database Schema

The database uses MongoDB and has the following collections:

### User Collection

Stores user information including their roles.

```json
{
  "username": "string",
  "password": "string (hashed)",
  "role": "enum: ['user', 'admin']",
  "createdAt": "date"
}
```

### Transaction Collection

Stores the transaction details made by users.

```json
{
  "userId": "ObjectId (reference to User)",
  "amount": "number",
  "status": "enum: ['pending', 'approved', 'rejected']",
  "createdAt": "date",
  "updatedAt": "date"
}
```
