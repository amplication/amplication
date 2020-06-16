import express = require("express");

import * as customers from "./customers";

const app = express();

app.use(customers.router);

const port = 8000;

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
