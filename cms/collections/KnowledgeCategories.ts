import type { CollectionConfig } from "payload";

import { publicOrSupportHubAccess, supportHubOnly } from "../access";
import { slugify } from "../utilities/slugify";

export const KnowledgeCategories: CollectionConfig = {
  slug: "knowledge-categories",
  labels: {
    singular: "Knowledge Category",
    plural: "Knowledge Categories",
  },
  access: {
    create: supportHubOnly,
    delete: supportHubOnly,
    read: publicOrSupportHubAccess,
    update: supportHubOnly,
  },
  admin: {
    defaultColumns: ["title", "slug", "sortOrder"],
    group: "Support Hub",
    useAsTitle: "title",
  },
  fields: [
    {
      name: "title",
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
        description: "Generated from the title when left blank.",
      },
      hooks: {
        beforeValidate: [
          ({ data, value }) =>
            typeof value === "string" && value.length > 0
              ? slugify(value)
              : slugify(String(data?.title || "")),
        ],
      },
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "icon",
      type: "text",
      required: true,
      admin: {
        description: "Lucide icon key, for example shield-check, cloud or monitor.",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      required: true,
    },
  ],
};
