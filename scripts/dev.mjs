import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const signedNode =
  "/Applications/Open Design.app/Contents/Resources/open-design/bin/node";
const nodeRuntime = existsSync(signedNode) ? signedNode : process.execPath;

const processes = [
  {
    name: "cms",
    command: nodeRuntime,
    args: [
      "node_modules/next/dist/bin/next",
      "dev",
      "--webpack",
      "--hostname",
      "0.0.0.0",
      "--port",
      "3001",
    ],
  },
  {
    name: "vite",
    command: nodeRuntime,
    args: ["node_modules/vite/bin/vite.js", "--host", "0.0.0.0"],
  },
];

const children = processes.map(({ args, command, name }) => {
  const child = spawn(command, args, {
    cwd: rootDir,
    env: {
      ...process.env,
      PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || "genisys-local-payload-secret-change-me",
      PAYLOAD_PUBLIC_SERVER_URL:
        process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3001",
    },
    stdio: ["inherit", "pipe", "pipe"],
  });

  const prefix = `[${name}]`;
  child.stdout.on("data", (chunk) => process.stdout.write(`${prefix} ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`${prefix} ${chunk}`));
  child.on("exit", (code) => {
    if (code && !shuttingDown) {
      console.error(`${prefix} exited with code ${code}`);
      shutdown(code);
    }
  });

  return child;
});

let shuttingDown = false;

function shutdown(code = 0) {
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill("SIGTERM");
    }
  }
  setTimeout(() => process.exit(code), 250);
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));
