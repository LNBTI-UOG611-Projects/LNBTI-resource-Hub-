LNBTI CampusFlow System

Setup and Execution Guide (Implemented Modules)

1. Introduction
This document provides a step-by-step guide for configuring and running the currently implemented components of the LNBTI CampusFlow System.

The purpose of this guide is to help developers and team members successfully set up the project environment, configure the database connection, run the application, and access the completed modules.

The current implementation includes the following completed components:
- PostgreSQL database configuration
- Database schema implementation using Prisma ORM
- User registration functionality
- User login and authentication functionality
- Initial Admin Dashboard interface
The implemented modules demonstrate the foundation of the CampusFlow system, including database management, user account creation, authentication, and administrative interface development.

Note: The LNBTI CampusFlow System is currently under development. This document covers only the features and configurations that have been completed at the current development stage. Additional system modules and functionalities will be implemented in future development phases.

2. System Requirements
Before setting up the project, ensure that the following software requirements are installed on the development machine.
Required Software
Node.js
Node.js is required to run the Next.js application and install project dependencies.

Recommended version:
Node.js v18 or above

Verify installation:
node -v

PostgreSQL Database
PostgreSQL is used as the primary database management system for storing application data.

Required:
PostgreSQL Server
PostgreSQL Database
Database User Credentials

Verify installation:
psql --version

Git
Git is required to clone the project repository and manage source code versions.

Verify installation:
git --version

Code Editor
A code editor is required for project development.

Recommended:
Visual Studio Code

3. Project Setup
Follow these steps to configure the project locally.
Step 1: Clone the Repository
Clone the project repository using Git.
git clone <repository-url>

Navigate into the project directory:
cd LNBTI_CampusFlow

Step 2: Install Project Dependencies
Install all required Node.js packages.
npm install

This command installs all dependencies defined in the package.json file.

4. Database Configuration
The system uses PostgreSQL as the database and Prisma ORM for database communication.
Step 1: Create PostgreSQL Database
Create a new PostgreSQL database.

Example:
CREATE DATABASE campusflow;

Step 2: Configure Environment Variables
Create a .env file in the project root directory.

Add the database connection string:
DATABASE_URL="postgresql://username:password@localhost:5432/campusflow"

Replace:
- username with the PostgreSQL username
- password with the database password
- campusflow with the database name
Step 3: Prisma Configuration
The project uses Prisma ORM to manage database models and queries.

Generate Prisma Client:
npx prisma generate

Apply database migrations:
npx prisma migrate dev

This creates the required database tables according to the Prisma schema.

5. User Registration Module
The user registration module allows new users to create accounts in the system.
Registration Process
The registration process follows this workflow:
User Registration Form
          |
          ↓
Registration API
          |
          ↓
Prisma ORM
          |
          ↓
PostgreSQL Database

Implementation Details
The registration module includes:
- User registration interface
- User input validation
- API handling for registration requests
- Database storage using Prisma ORM
- User record creation in PostgreSQL database
When a user submits the registration form:
1. User information is collected through the registration page.
2. The data is sent to the registration API.
3. Prisma ORM processes the database operation.
4. User details are stored in the PostgreSQL database.
6. User Login and Authentication Module
The login module allows registered users to access the system through authentication.
Login Process
The authentication workflow:
Login Form
      |
      ↓
Login API
      |
      ↓
Database Verification
      |
      ↓
User Authentication

Implementation Details
The login module includes:
- Login interface
- User credential verification
- Database user lookup
- Authentication response handling
When a user attempts to log in:
1. Login credentials are entered through the login page.
2. The credentials are sent to the login API.
3. The system verifies the user information with stored database records.
4. Successful verification allows the user to access the system.
7. Admin Dashboard
The Admin Dashboard provides the initial administrative interface developed for the CampusFlow system.

The currently implemented dashboard includes:
- Administrative interface layout
- Dashboard page structure
- Initial user interface components
The Admin Dashboard is designed as the foundation for future administrative functionalities.

Note: The dashboard does not yet include all planned management features. Additional administrative features will be implemented in future development stages.

8. Running the Application
After completing the database configuration and installing dependencies, run the application using the following commands.
Generate Prisma Client
npx prisma generate

Apply Database Migration
npx prisma migrate dev

Start Development Server
npm run dev

The application will start running locally.

Default URL:
http://localhost:3000

9. Accessing Implemented Modules
The currently available application routes are:
User Registration
http://localhost:3000/register

This page allows new users to create accounts.
User Login
http://localhost:3000/login

This page allows registered users to authenticate and access the system.
Admin Dashboard
http://localhost:3000/admin

This page provides access to the currently implemented administrative interface.

10. Current Development Status
The current implementation status is shown below:
Component	Status
Database Design	Completed
PostgreSQL Database Connection	Completed
Prisma ORM Configuration	Completed
User Registration Module	Completed
User Login and Authentication	Completed
Admin Dashboard Interface	Completed
Additional System Modules	In Progress


11. Conclusion
The current version of the LNBTI CampusFlow System establishes the core foundation required for future development. The implemented database structure, authentication system, and administrative interface provide the necessary base for expanding the system with additional features and modules.

Future development phases will focus on completing the remaining system functionalities and integrating additional features into the platform.