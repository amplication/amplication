const path = require("path");

require("ts-node").register();
require(path.resolve(__dirname, "./server-worker.ts"));
