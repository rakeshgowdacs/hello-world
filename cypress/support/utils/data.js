const fs = require("fs");
const path = require("path");

function loadJsonFixture(relativePath) {
  const full = path.join(process.cwd(), "cypress", "fixtures", relativePath);
  return JSON.parse(fs.readFileSync(full, "utf8"));
}

function saveExpectedResult(relativePath, data) {
  const full = path.join(process.cwd(), "cypress", "fixtures", relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, JSON.stringify(data, null, 2), "utf8");
}

module.exports = {
  loadJsonFixture,
  saveExpectedResult
};