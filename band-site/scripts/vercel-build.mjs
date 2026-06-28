import { spawnSync } from "node:child_process";

const cwd = process.cwd();

const build = spawnSync("npm", ["run", "build"], {
  cwd,
  stdio: "inherit",
  shell: true
});

if (build.status !== 0) {
  process.exit(build.status ?? 1);
}
