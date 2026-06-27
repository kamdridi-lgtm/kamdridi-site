import { cpSync, existsSync, rmSync } from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const appRoot = path.join(root, "band-site");

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npm", ["install"], appRoot);
run("npm", ["run", "build"], appRoot);

const sourceNext = path.join(appRoot, ".next");
const targetNext = path.join(root, ".next");
const sourcePublic = path.join(appRoot, "public");
const targetPublic = path.join(root, "public");
const sourceData = path.join(appRoot, "data");
const targetData = path.join(root, "data");

if (!existsSync(path.join(sourceNext, "routes-manifest.json"))) {
  console.error("Missing band-site .next/routes-manifest.json after build.");
  process.exit(1);
}

rmSync(targetNext, { recursive: true, force: true });
cpSync(sourceNext, targetNext, { recursive: true });

if (existsSync(sourcePublic)) {
  rmSync(targetPublic, { recursive: true, force: true });
  cpSync(sourcePublic, targetPublic, { recursive: true });
}

if (existsSync(sourceData)) {
  rmSync(targetData, { recursive: true, force: true });
  cpSync(sourceData, targetData, { recursive: true });
}

console.log("Mirrored band-site build output to repository root for Vercel.");