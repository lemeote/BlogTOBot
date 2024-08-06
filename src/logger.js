const fs = require("fs");
const logFilePath = "log.txt";

function logMessage(message) {
  const timestamp = new Date().toISOString();

  let logEntry = `${timestamp}: `;

  if (Array.isArray(message)) {
    logEntry += `[${message.join(", ")}]\n`;
  } else {
    logEntry += `${message}\n`;
  }
  console.log(logEntry);

  fs.appendFileSync(logFilePath, logEntry);
}

module.exports = { logMessage };
