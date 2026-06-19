import type { CollectionConfig } from "payload";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { supportHubOnly } from "../access";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const ResourceFiles: CollectionConfig = {
  slug: "resource-files",
  labels: {
    singular: "Resource File",
    plural: "Resource Files",
  },
  access: {
    create: supportHubOnly,
    delete: supportHubOnly,
    read: () => true,
    update: supportHubOnly,
  },
  admin: {
    defaultColumns: ["title", "filename", "mimeType", "filesize", "updatedAt"],
    group: "Support Hub",
    useAsTitle: "title",
  },
  upload: {
    bulkUpload: true,
    mimeTypes: ["application/pdf"],
    staticDir: path.resolve(dirname, "../uploads/resources"),
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
    },
  ],
};
