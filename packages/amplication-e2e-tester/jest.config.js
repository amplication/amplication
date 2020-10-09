// eslint-disable

const merge = require("merge");
const tsPreset = require("ts-jest/jest-preset");
const puppeteerPreset = require("jest-puppeteer/jest-preset");

module.exports = merge.recursive(puppeteerPreset, tsPreset);
