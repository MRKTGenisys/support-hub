import type { CollectionConfig } from "payload";

import { publishedOrSupportHubAccess, supportHubOnly } from "../access";
import { slugify } from "../utilities/slugify";

const resourceCategoryOptions = [
  { label: "Email Security", value: "Email Security" },
  { label: "Security Awareness", value: "Security Awareness" },
  { label: "Endpoint Security", value: "Endpoint Security" },
  { label: "Compliance", value: "Compliance" },
  { label: "Microsoft 365", value: "Microsoft 365" },
];

const resourceTypeOptions = [
  { label: "PDF Guide", value: "PDF Guide" },
  { label: "Checklist", value: "Checklist" },
  { label: "Template", value: "Template" },
  { label: "Advisory", value: "Advisory" },
  { label: "Whitepaper", value: "Whitepaper" },
];

export const Resources: CollectionConfig = {
  slug: "resources",
  labels: {
    singular: "Resource",
    plural: "Resources",
  },
  access: {
    create: supportHubOnly,
    delete: supportHubOnly,
    read: publishedOrSupportHubAccess,
    update: supportHubOnly,
  },
  admin: {
    defaultColumns: [
      "title",
      "category",
      "resourceType",
      "status",
      "featured",
      "sortOrder",
    ],
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
        position: "sidebar",
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
      name: "category",
      type: "select",
      options: resourceCategoryOptions,
      required: true,
    },
    {
      name: "resourceType",
      type: "select",
      defaultValue: "PDF Guide",
      options: resourceTypeOptions,
      required: true,
    },
    {
      name: "fileUpload",
      type: "upload",
      relationTo: "resource-files",
      admin: {
        description:
          "Upload or choose a PDF file. Published resources without a PDF show a pending file notice on the frontend.",
      },
    },
    {
      name: "thumbnailImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Optional image thumbnail for future resource card artwork.",
      },
    },
    {
      name: "tags",
      type: "array",
      labels: {
        singular: "Tag",
        plural: "Tags",
      },
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: "tag",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "featured",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "sortOrder",
      type: "number",
      defaultValue: 0,
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
      required: true,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "publishedAt",
      type: "date",
      admin: {
        date: {
          pickerAppearance: "dayAndTime",
        },
        position: "sidebar",
      },
    },
  ],
};
