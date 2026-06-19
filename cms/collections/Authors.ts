import type { CollectionConfig } from "payload";

import { publicOrSupportHubAccess, supportHubOnly } from "../access";
import { slugify } from "../utilities/slugify";

export const Authors: CollectionConfig = {
  slug: "authors",
  labels: {
    singular: "Author",
    plural: "Authors",
  },
  access: {
    create: supportHubOnly,
    delete: supportHubOnly,
    read: publicOrSupportHubAccess,
    update: supportHubOnly,
  },
  admin: {
    defaultColumns: ["name", "role", "updatedAt"],
    group: "Support Hub",
    useAsTitle: "name",
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      index: true,
      required: true,
      unique: true,
      admin: {
        description: "Generated from the author name when left blank.",
        position: "sidebar",
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) =>
            typeof value === "string" && value.length > 0
              ? slugify(value)
              : slugify(String(data?.name || "")),
        ],
      },
    },
    {
      name: "role",
      type: "text",
      defaultValue: "Genisys Support Team",
    },
    {
      name: "bio",
      type: "textarea",
    },
    {
      name: "avatar",
      type: "upload",
      relationTo: "media",
    },
  ],
};
