import { spawn } from "node:child_process";
import { existsSync } from "node:fs";

const signedNode =
  "/Applications/Open Design.app/Contents/Resources/open-design/bin/node";
const nodeRuntime = existsSync(signedNode) ? signedNode : process.execPath;
const port = process.env.PORT || "3001";

const child = spawn(
  nodeRuntime,
  [
    "node_modules/next/dist/bin/next",
    "start",
    "--hostname",
    "0.0.0.0",
    "--port",
    port,
  ],
  {
    env: {
      ...process.env,
      PAYLOAD_SECRET:
        process.env.PAYLOAD_SECRET || "genisys-local-payload-secret-change-me",
      PAYLOAD_PUBLIC_SERVER_URL:
        process.env.PAYLOAD_PUBLIC_SERVER_URL || `http://localhost:${port}`,
    },
    stdio: "inherit",
  },
);

child.on("exit", (code) => {
  process.exit(code || 0);
});
