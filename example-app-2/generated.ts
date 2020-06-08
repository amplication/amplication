import express = require("express");
import { PrismaClient } from "@prisma/client";

const app = express();
const client = new PrismaClient();

app.get(async (req, res) => {
  await client.connect();
  try {
    /** @todo smarter parameters to prisma args */
    const results = await client.customers.findMany({
      where: req.params,
    });
    res.end(JSON.stringify(results));
  } catch (error) {
    console.error(error);
    res.status(500).end();
  } finally {
    await client.disconnect();
  }
});
app.post(async (req, res) => {
  await client.connect();
  try {
    /** @todo request body to prisma args */
    await client.customer.create(req.body);
    res.status(201).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  } finally {
    await client.disconnect();
  }
});
app.get(async (req, res) => {
  await client.connect();
  try {
    /** @todo smarter parameters to prisma args */
    const result = await client.customer.findOne({
      where: req.params,
    });
    res.end(JSON.stringify(result));
  } catch (error) {
    console.error(error);
    res.status(500).end();
  } finally {
    await client.disconnect();
  }
});
