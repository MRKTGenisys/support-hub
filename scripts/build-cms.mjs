import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const rootDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const signedNode =
  "/Applications/Open Design.app/Contents/Resources/open-design/bin/node";
const nodeRuntime = existsSync(signedNode) ? signedNode : process.execPath;

const result = spawnSync(
  nodeRuntime,
  ["node_modules/next/dist/bin/next", "build", "--webpack"],
  {
    cwd: rootDir,
    env: {
      ...process.env,
      PAYLOAD_SECRET: process.env.PAYLOAD_SECRET || "genisys-local-payload-secret-change-me",
      PAYLOAD_PUBLIC_SERVER_URL:
        process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3001",
    },
    stdio: "inherit",
  }
);

process.exit(result.status || 0);
