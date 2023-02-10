const nxPreset = require("@nrwl/jest/preset").default;

module.exports = {
  ...nxPreset,
  reporters: ["github-actions"],
};
