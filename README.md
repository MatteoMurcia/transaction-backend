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

---

## API Usage

### Base URL
`http://localhost:5000/api`

---

### Authentication

#### Register
- **Endpoint**: `POST /api/auth/register`
- **Description**: Register a new user.
- **Request**:
    - **Headers**: None
    - **Body** (JSON):
        ```json
        {
          "username": "string",
          "password": "string",
          "role": "string (user or admin)"
        }
        ```
- **Response** (JSON):
    - **Status**: `201 Created`
        ```json
        {
          "message": "User registered successfully"
        }
        ```

#### Login
- **Endpoint**: `POST /api/auth/login`
- **Description**: Authenticate a user and get a JWT token.
- **Request**:
    - **Headers**: None
    - **Body** (JSON):
        ```json
        {
          "username": "string",
          "password": "string"
        }
        ```
- **Response** (JSON):
    - **Status**: `200 OK`
        ```json
        {
          "token": "string (JWT)"
        }
        ```

---

### Transactions

#### Create a Transaction
- **Endpoint**: `POST /api/transactions`
- **Description**: Authenticated users can create a transaction request.
- **Request**:
    - **Headers**: 
        ```http
        Authorization: Bearer <token>
        ```
    - **Body** (JSON):
        ```json
        {
          "amount": "number"
        }
        ```
- **Response** (JSON):
    - **Status**: `201 Created`
        ```json
        {
          "_id": "string",
          "userId": "string",
          "amount": "number",
          "status": "pending",
          "createdAt": "date"
        }
        ```

#### Get All Transactions (Admin Only)
- **Endpoint**: `GET /api/transactions`
- **Description**: Admins can fetch all transaction requests.
- **Request**:
    - **Headers**: 
        ```http
        Authorization: Bearer <token>
        ```
- **Response** (JSON):
    - **Status**: `200 OK`
        ```json
        [
          {
            "_id": "string",
            "userId": "string",
            "amount": "number",
            "status": "pending",
            "createdAt": "date",
            "updatedAt": "date"
          }
        ]
        ```

#### Approve or Reject a Transaction (Admin Only)
- **Endpoint**: `PUT /api/transactions/:id`
- **Description**: Admins can approve or reject a transaction.
- **Request**:
    - **Headers**: 
        ```http
        Authorization: Bearer <token>
        ```
    - **Body** (JSON):
        ```json
        {
          "status": "string (approved or rejected)"
        }
        ```
- **Response** (JSON):
    - **Status**: `200 OK`
        ```json
        {
          "_id": "string",
          "userId": "string",
          "amount": "number",
          "status": "string (approved or rejected)",
          "createdAt": "date",
          "updatedAt": "date"
        }
        ```

---

## Running Tests

### Prerequisites
Ensure you have the following:
- A `.env` file configured with the necessary variables, including `MONGO_URI_TEST` for the test database.

### Run the Tests
To run the tests, use the following command:
```bash
npm test
```

### Test Environment
The project uses **Jest** as the testing framework to ensure all functionalities are working as expected.

### Structure of the Tests
- The tests are located in the `tests` directory and cover both authentication and transaction functionalities.
- Each test suite uses the `beforeEach` hook to clean the respective MongoDB collections (`users`, `transactions`) to ensure a consistent environment for each test.

### Test Workflow
1. **Setup Connection**: A separate MongoDB test database is used to avoid interfering with development or production data.
2. **Running the Tests**: Jest will automatically pick up all `.test.ts` files and run them.
3. **Isolated Tests**: Each test runs in isolation, meaning that the test data is cleaned before each individual test is executed.

### Expected Output
- **Passing Tests**: If all functionalities work as expected, you will see output indicating that all tests have passed:
    ```bash
    PASS  tests/auth.test.ts
    PASS  tests/transaction.test.ts
    ```
- **Failing Tests**: If there are any issues, Jest will provide detailed information about which tests have failed and what the expected behavior was.

### Running Tests in Watch Mode
To run tests in **watch mode** (automatically re-run tests when you make changes), use:
```bash
npm run test:watch
```
You can add the following script to your package.json to enable watch mode:
```json
"scripts": {
  "test:watch": "jest --watch"
}
```

---

## Notes

- **Environment Variables**: Ensure that you set all the required environment variables in your `.env` file. The `.env.example` file provides a template to guide you. Remember to keep sensitive information private and never expose your `.env` file in a public repository.

- **Test Database**: Always use a separate MongoDB URI for testing (`MONGO_URI_TEST`). This ensures that your test operations do not affect your development or production data. Update your `.env` file with the appropriate URI for your test environment.

- **Git Ignore**: Make sure to add the `.env` file to your `.gitignore` to prevent sensitive information from being committed to the repository. A typical `.gitignore` might include:
    ```
    node_modules/
    dist/
    .env
    *.log
    ```

- **Security Best Practices**: When deploying your application, always use strong secrets for `JWT_SECRET` and database URIs. It is recommended to rotate your secrets regularly and monitor any unauthorized access attempts.

- **Code Quality**: Follow good coding practices such as using linting tools, writing clear and maintainable code, and keeping your dependencies updated.

- **API Documentation**: Keep your API documentation up to date. This `README.md` provides a basic overview of the API endpoints and their usage, but for a more comprehensive guide, consider using tools like Swagger or Postman collections.

- **Tests and Continuous Integration**: Run your tests regularly and consider setting up Continuous Integration (CI) with services like GitHub Actions, Travis CI, or CircleCI to automate the testing process every time you push changes to your repository.
