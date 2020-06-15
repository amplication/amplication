import express = require("express");
import { PrismaClient } from "@prisma/client";

const app = express();
const client = new PrismaClient();

const router = app.Router();

/** List all customers */
router.get("/customers", async (req, res) => {
  await client.connect();
  try {
    /** @todo smarter parameters to prisma args */
    const results = await client.customer.findMany({
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

/** Create a customer */
router.post("/customers", async (req, res) => {
  await client.connect();
  try {
    /** @todo request body to prisma args */
    await client.customer.create({ body: req.body });
    res.status(201).end();
  } catch (error) {
    console.error(error);
    res.status(500).end();
  } finally {
    await client.disconnect();
  }
});

/** Info for a specific customer */
router.get("/customers/:id", async (req, res) => {
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

app.use(router);
