import express = require("express");

$$IMPORTS;

const app = express();

$$MIDDLEWARES;

const port = 8000;

app.listen(port, () => {
  console.log(`App is listening at http://localhost:${port}`);
});
