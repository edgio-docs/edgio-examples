const { createServer } = require("http");
const { join, resolve } = require("path");

module.exports = function prod(port) {
  const server = require(join(process.cwd(), "build", "server.js")).default;

  return new Promise((resolve) => {
    createServer(server).listen(port, () => {
      resolve();
    });
  });
};
