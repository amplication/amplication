#!/usr/bin/env node

/**
 * Creates an example user in the database for testing the login functionality
 */

import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

client.user
  .create({
    data: {
      username: "bob",
      password: "password",
      roles: {
        set: ["user"],
      },
    },
  })
  .then(() => {
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
