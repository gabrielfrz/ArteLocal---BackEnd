Backend Express - Authentication API
A RESTful authentication API built with Node.js, Express, and MongoDB, using JWT for secure access control with a clean layered architecture.

Key Features
User registration (POST /user/register)

JWT token authentication (POST /user/login)

Protected endpoint (GET /protected) requiring valid token

Password hashing with bcrypt

Organized structure (routes, controllers, services, models, middlewares)

Ready-to-use curl test scripts in /requests folder

Quick Start
Install dependencies:
npm install

Configure .env file:

PORT=3000
MONGO_URI=your_mongodb_connection_string
MONGO_DB_NAME=your_db_name
JWT_SECRET=your_secret_key
Run the server:
npm run start:app

Testing
Execute test scripts from /requests folder:

sh
sh requests/POST_Register_User.sh
sh requests/POST_Login_User.sh
sh requests/GET_Protected_Valid_Token.sh
Project Structure
api/
├── controllers/    # Route handlers
├── database/       # DB connection
├── middlewares/    # Auth middleware
├── models/         # Mongoose models
├── routes/         # API endpoints
└── services/       # Business logic
Deployment Ready
Includes vercel.json for seamless Vercel deployment.

Developed with ❤️ by @gabrielfrz

# Backend PostgreSQL
_Forçando redeploy na Vercel._
