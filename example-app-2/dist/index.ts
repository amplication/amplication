import * as customers from "./customers";
import express = require("express");

const app = express();

const port = 8000;

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});

app.use(customers.router);
