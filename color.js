const chalk = require("chalk");

connected = chalk.bold.cyan;
error = chalk.bold.yellow;
disconnected = chalk.bold.red;
termination = chalk.bold.magenta;

module.exports.colordb = {
  connected: chalk.bold.cyan,
  error: chalk.bold.yellow,
  disconnected: chalk.bold.red,
  termination: chalk.bold.magenta,
};
