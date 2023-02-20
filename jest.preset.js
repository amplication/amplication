const nxPreset = require("@nrwl/jest/preset").default;

module.exports = {
  ...nxPreset,
  reporters: ["default", "github-actions"],
};
