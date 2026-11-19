import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import dotenv from "dotenv";
import { defineConfig } from "prisma/config";

const inheritedKeys = new Set(Object.keys(process.env));

for (const file of [".env", ".env.local"]) {
  const filePath = resolve(process.cwd(), file);
  if (!existsSync(filePath)) continue;

  const values = dotenv.parse(readFileSync(filePath));
  for (const [key, value] of Object.entries(values)) {
    if (!inheritedKeys.has(key)) process.env[key] = value;
  }
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DIRECT_URL ?? process.env.DATABASE_URL ?? "",
  },
});