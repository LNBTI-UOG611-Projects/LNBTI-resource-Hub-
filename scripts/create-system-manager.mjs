
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

// Load environment variables from .env and .env.local
for (const file of [".env", ".env.local"]) {
  const path = resolve(process.cwd(), file);

  if (existsSync(path)) {
    const values = dotenv.parse(readFileSync(path));

    for (const [key, value] of Object.entries(values)) {
      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured.");
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

const rl = readline.createInterface({
  input: stdin,
  output: stdout,
});

// Read password without displaying characters
async function readHiddenPassword(prompt) {
  if (!stdin.isTTY || typeof stdin.setRawMode !== "function") {
    throw new Error("Please run this script directly in Windows CMD.");
  }

  stdout.write(prompt);

  stdin.setRawMode(true);
  stdin.resume();
  stdin.setEncoding("utf8");

  let password = "";

  try {
    while (true) {
      const character = await new Promise((resolve, reject) => {
        const onData = (data) => {
          stdin.removeListener("error", onError);
          resolve(data);
        };

        const onError = (error) => {
          stdin.removeListener("data", onData);
          reject(error);
        };

        stdin.once("data", onData);
        stdin.once("error", onError);
      });

      if (character === "\u0003") {
        throw new Error("Cancelled.");
      }

      if (character === "\r" || character === "\n") {
        stdout.write("\n");
        return password;
      }

      if (character === "\u007f" || character === "\b") {
        password = password.slice(0, -1);
      } else if (character >= " ") {
        password += character;
      }
    }
  } finally {
    stdin.setRawMode(false);
  }
}

async function main() {
  // Check whether System Manager role exists
  const role = await prisma.role.findUnique({
    where: {
      name: "System Manager",
    },
  });

  if (!role) {
    throw new Error("System Manager role does not exist.");
  }

  console.log("System Manager role found.");

  // Get account details
  const fullName = (
    await rl.question("Full name: ")
  ).trim();

  const email = (
    await rl.question("Email: ")
  ).trim().toLowerCase();

  const password = await readHiddenPassword("Password (hidden): ");

  // Validate required fields
  if (!fullName || !email || !password) {
    throw new Error("All fields are required.");
  }

  if (fullName.length > 150) {
    throw new Error("Full name is too long.");
  }

  if (password.length < 8) {
    throw new Error("Password must contain at least 8 characters.");
  }

  // Validate email format
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Please enter a valid email address.");
  }

  // Check for existing email (case-insensitive)
  const existingUser = await prisma.user.findFirst({
    where: {
      email: {
        equals: email,
        mode: "insensitive",
      },
    },
  });

  if (existingUser) {
    throw new Error(
      "An account with this email already exists. No changes were made."
    );
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // Create user and assign System Manager role
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        status: "ACTIVE",
      },
    });

    await tx.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
      },
    });
  });

  console.log("\nSystem Manager account created successfully!");
  console.log("Email:", email);
}

try {
  await main();
} catch (error) {
  console.error("\nERROR:", error.message);
  process.exitCode = 1;
} finally {
  rl.close();
  await prisma.$disconnect();
}
