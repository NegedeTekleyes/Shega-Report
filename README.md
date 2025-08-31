# BackendSR - Backend Server

A Node.js/Express backend server with TypeScript, PostgreSQL, and JWT authentication.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3001
```

**Important:** Make sure to set a strong, random JWT_SECRET. You can generate one using:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Database Setup
Make sure PostgreSQL is running and create the necessary tables. The server will automatically test the connection on startup.

### 4. Run the Server
```bash
# Development mode with auto-reload
npm run dev

# Build and run production
npm run build
npm start

# Test database connection
npm run test-db
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration

### Health Check
- `GET /api/health` - Server health status

## Error Fixes Applied

- Fixed JWT secret environment variable validation in `authController.ts`
- Fixed JWT secret environment variable validation in `auth.ts` middleware
- Added proper error handling for missing environment variables
- Removed unsafe non-null assertion operators (`!`)

## Dependencies

- Express.js - Web framework
- PostgreSQL - Database
- JWT - Authentication
- bcryptjs - Password hashing
- dotenv - Environment variable management
- CORS - Cross-origin resource sharing
