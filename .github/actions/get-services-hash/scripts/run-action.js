const child_process = require("child_process");

console.log("------------");
console.log("------------");
console.log("NPM INSTALL:");
console.log("------------");
console.log("------------");
child_process.execSync("npm install", {stdio:"inherit"})


console.log("-----------");
console.log("-----------");
console.log("RUN ACTION:");
console.log("-----------");
console.log("-----------");
child_process.execSync("npm run start", {stdio:"inherit"})
