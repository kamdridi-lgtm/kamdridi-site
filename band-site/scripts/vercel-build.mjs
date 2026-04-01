import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const cwd = process.cwd();
const nestedRoot = path.join(cwd, path.basename(cwd));
const sourceNextDir = path.join(cwd, ".next");
const nestedNextDir = path.join(nestedRoot, ".next");

const build = spawnSync("npm", ["run", "build"], {
  cwd,
  stdio: "inherit",
  shell: true
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}

if (!existsSync(sourceNextDir)) {
  console.error("Missing .next output after build.");
  process.exit(1);
}

mkdirSync(nestedRoot, { recursive: true });
rmSync(nestedNextDir, { recursive: true, force: true });
cpSync(sourceNextDir, nestedNextDir, { recursive: true });

console.log(`Mirrored .next to ${nestedNextDir} for Vercel packaging.`);
