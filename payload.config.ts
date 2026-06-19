import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { buildConfig } from "payload";
import path from "node:path";
import sharp from "sharp";
import { fileURLToPath } from "node:url";

import { Authors } from "./cms/collections/Authors";
import { KnowledgeArticles } from "./cms/collections/KnowledgeArticles";
import { KnowledgeCategories } from "./cms/collections/KnowledgeCategories";
import { Media } from "./cms/collections/Media";
import { ResourceFiles } from "./cms/collections/ResourceFiles";
import { Resources } from "./cms/collections/Resources";
import { Users } from "./cms/collections/Users";
import { SupportHubSettings } from "./cms/globals/SupportHubSettings";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const publicServerURL =
  process.env.PAYLOAD_PUBLIC_SERVER_URL || "http://localhost:3001";
const publicFrontendURL =
  process.env.PAYLOAD_PUBLIC_FRONTEND_URL ||
  process.env.VITE_PUBLIC_SITE_URL ||
  "";
const trustedOrigins = Array.from(
  new Set(
    [
      publicServerURL,
      publicFrontendURL,
      "http://localhost:3001",
      "http://localhost:5173",
      "https://rosybrown-mouse-783731.hostingersite.com",
    ].filter(Boolean)
  )
);

export default buildConfig({
  admin: {
    importMap: {
      baseDir: dirname,
      importMapFile: path.resolve(dirname, "app/(payload)/importMap.js"),
    },
    user: Users.slug,
  },
  collections: [
    Users,
    Authors,
    KnowledgeCategories,
    KnowledgeArticles,
    Resources,
    ResourceFiles,
    Media,
  ],
  cors: trustedOrigins,
  csrf: trustedOrigins,
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./cms/payload.sqlite",
    },
    migrationDir: path.resolve(dirname, "cms/migrations"),
    push: true,
  }),
  globals: [SupportHubSettings],
  routes: {
    admin: "/admin",
  },
  secret: process.env.PAYLOAD_SECRET || "genisys-local-payload-secret-change-me",
  serverURL: publicServerURL,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, "cms/payload-types.ts"),
  },
});
