import fs from "node:fs";
import path from "node:path";

export function loadJsonFixture<T = any>(relativePath: string): T {
  const full = path.join(process.cwd(), "cypress", "fixtures", relativePath);
  return JSON.parse(fs.readFileSync(full, "utf8"));
}

export function saveExpectedResult(relativePath: string, data: any) {
  const full = path.join(process.cwd(), "cypress", "fixtures", relativePath);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, JSON.stringify(data, null, 2), "utf8");
}

