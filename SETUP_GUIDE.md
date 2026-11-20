# LNBTI Resource Hub - System Setup Guide

## 1. Project Overview

The LNBTI Resource Hub is a web-based system developed to provide centralized access to academic resources and services. This document explains the required software, installation steps, project configuration, database setup, and execution steps required to run the system successfully.

---

# 2. Installation Requirements

Before running the system, ensure the following requirements are installed.

## Software Requirements

- Operating System:
  - Windows 10 / Windows 11

- Code Editor:
  - Visual Studio Code

- Version Control:
  - Git

- Runtime Environment:
  - Node.js (LTS Version)

- Package Manager:
  - npm

- Database:
  - MySQL / Required Database Server

- Web Browser:
  - Google Chrome or Microsoft Edge

---

# 3. Verify Required Installations

Check Node.js installation:

```bash
node -v
```

Check npm installation:

```bash
npm -v
```

Check Git installation:

```bash
git --version
```

---

# 4. Project Setup

## Step 1: Clone the Repository

Clone the repository using:

```bash
git clone <repository-url>
```

Navigate into the project directory:

```bash
cd LNBTI-resource-Hub-
```

---

## Step 2: Install Project Dependencies

Install all required packages:

```bash
npm install
```

This will install all dependencies defined in the package.json file.

---

# 5. Database Configuration

## Step 1: Create Database

1. Open the database management system.
2. Create the required database.
3. Ensure the database service is running.

Database Name:

```
(Add your database name here)
```

---

## Step 2: Configure Database Connection

Update the environment configuration file:

```
.env
```

Add the required database credentials:

```
DATABASE_HOST=
DATABASE_USERNAME=
DATABASE_PASSWORD=
DATABASE_NAME=
```

---

# 6. Running the Application

Start the development server using:

```bash
npm run dev
```

The application will start successfully.

---

# 7. Accessing the System

Open the browser and navigate to:

```
http://localhost:3000
```

The system interface will be displayed.

---

# 8. Troubleshooting

## Dependency Installation Errors

Run:

```bash
npm install
```

again to reinstall required packages.

## Database Connection Errors

Check:

- Database server is running.
- Database credentials are correct.
- Environment configuration is properly updated.

---

# 9. Git Contribution

After completing changes:

Check modified files:

```bash
git status
```

Add the setup guide:

```bash
git add SETUP_GUIDE.md
```

Commit changes:

```bash
git commit -m "Add detailed system setup guide"
```

Push changes:

```bash
git push origin Monasha
```

---

# 10. Conclusion

This setup guide provides the necessary instructions to install, configure, and execute the LNBTI Resource Hub system successfully.