#!/usr/bin/env node

/**
 * Creates an example user in the database for testing the login functionality
 */

import { PrismaClient } from "@prisma/client";

const EXAMPLE_USER = {
  username: "bob",
  password: "password",
  roles: ["user"],
};

const client = new PrismaClient();

client.user
  .create({ data: EXAMPLE_USER })
  .then(() => {
    process.exit(0);
  })
  .catch((error: Error) => {
    console.error(error);
    process.exit(1);
  });
