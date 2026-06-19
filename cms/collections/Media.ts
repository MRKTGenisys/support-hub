import type { CollectionConfig } from "payload";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { adminOrMarketingOnly, supportHubOnly } from "../access";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    create: supportHubOnly,
    delete: adminOrMarketingOnly,
    read: () => true,
    update: supportHubOnly,
  },
  admin: {
    group: "Media Library",
  },
  upload: {
    focalPoint: true,
    imageSizes: [
      {
        name: "thumbnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 900,
        height: 506,
        position: "centre",
      },
      {
        name: "hero",
        width: 1920,
        height: 900,
        position: "centre",
      },
      {
        name: "openGraph",
        width: 1200,
        height: 630,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"],
    staticDir: path.resolve(dirname, "../uploads/media"),
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "caption",
      type: "textarea",
    },
  ],
};
