import type { CollectionConfig } from "payload";
import { lexicalEditor } from "@payloadcms/richtext-lexical";

import { publishedOrSupportHubAccess, supportHubOnly } from "../access";
import { slugify } from "../utilities/slugify";

const guideIconOptions = [
  { label: "Arrow Right", value: "arrow-right" },
  { label: "Book", value: "book-open" },
  { label: "Check", value: "check-circle" },
  { label: "Clock", value: "clock" },
  { label: "Cloud", value: "cloud" },
  { label: "Grid", value: "grid-2x2" },
  { label: "Headset", value: "headphones" },
  { label: "Info", value: "info" },
  { label: "Lock", value: "lock" },
  { label: "Mail", value: "mail" },
  { label: "Message", value: "message-circle" },
  { label: "Monitor", value: "monitor" },
  { label: "Phone", value: "phone" },
  { label: "Smartphone", value: "smartphone" },
  { label: "Shield", value: "shield-check" },
  { label: "Warning", value: "shield-alert" },
  { label: "Wi-Fi", value: "wifi" },
  { label: "X", value: "x" },
];

export const KnowledgeArticles: CollectionConfig = {
  slug: "knowledge-articles",
  labels: {
    singular: "Knowledge Article",
    plural: "Knowledge Articles",
  },
  access: {
    create: supportHubOnly,
    delete: supportHubOnly,
    read: publishedOrSupportHubAccess,
    update: supportHubOnly,
  },
  admin: {
    defaultColumns: ["title", "category", "status", "popularArticle", "updatedAt"],
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
      name: "subtitle",
      type: "textarea",
      admin: {
        description:
          "Optional article subtitle shown on the frontend article header.",
      },
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
      name: "category",
      type: "relationship",
      relationTo: "knowledge-categories",
      required: true,
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "authors",
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "summary",
      type: "textarea",
      required: true,
      admin: {
        description:
          "Short summary used for cards and as a fallback article excerpt.",
      },
    },
    {
      name: "excerpt",
      type: "textarea",
      admin: {
        description:
          "Optional listing excerpt. If empty, the summary is used instead.",
      },
    },
    {
      name: "difficulty",
      type: "select",
      options: [
        { label: "Easy", value: "easy" },
        { label: "Medium", value: "medium" },
        { label: "Advanced", value: "advanced" },
      ],
      admin: {
        description: "Optional difficulty label shown in the article metadata.",
      },
    },
    {
      name: "appliesTo",
      type: "array",
      labels: {
        singular: "Applies to item",
        plural: "Applies to items",
      },
      admin: {
        description:
          "Products, platforms or audiences this article applies to. Falls back to tags when empty.",
        initCollapsed: true,
      },
      fields: [
        {
          name: "item",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "content",
      type: "richText",
      editor: lexicalEditor({}),
      admin: {
        description:
          "Optional rich text fallback. Use Guide layout below for structured support articles.",
      },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "tags",
      type: "array",
      labels: {
        singular: "Tag",
        plural: "Tags",
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
      name: "guideLayout",
      type: "group",
      admin: {
        description:
          "Structured fields used by the Support Hub article template. Use these for all guide-style articles.",
      },
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          defaultValue: true,
          admin: {
            description:
              "When enabled, the frontend renders the article using the guide layout instead of plain rich text.",
          },
        },
        {
          name: "overview",
          type: "textarea",
          admin: {
            description:
              "Optional overview shown before the Before You Start checklist.",
          },
        },
        {
          name: "beforeYouStart",
          dbName: "before",
          type: "array",
          labels: {
            singular: "Before you start item",
            plural: "Before you start items",
          },
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: "item",
              type: "text",
              required: true,
            },
          ],
        },
        {
          name: "beforeYouStartCallout",
          type: "textarea",
          admin: {
            description:
              "Optional information box shown below the Before you start checklist.",
          },
        },
        {
          name: "steps",
          dbName: "steps",
          type: "array",
          labels: {
            singular: "Step",
            plural: "Steps",
          },
          admin: {
            initCollapsed: true,
            description:
              "Use one item per article step. Each step can include checklist items, screenshot placeholders, info cards and a callout.",
          },
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
            },
            {
              name: "intro",
              type: "textarea",
            },
            {
              name: "checklist",
              type: "array",
              labels: {
                singular: "Checklist item",
                plural: "Checklist items",
              },
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: "item",
                  type: "text",
                  required: true,
                },
              ],
            },
            {
              name: "screenshotPlaceholder",
              type: "group",
              admin: {
                description:
                  "Optional visual block shown within this step. Upload a screenshot to display it, or leave the image empty to show a styled placeholder.",
              },
              fields: [
                {
                  name: "enabled",
                  type: "checkbox",
                  defaultValue: false,
                },
                {
                  name: "image",
                  type: "upload",
                  relationTo: "media",
                  admin: {
                    description:
                      "Optional screenshot image. When set, this renders instead of the placeholder icon.",
                  },
                },
                {
                  name: "alt",
                  type: "text",
                  admin: {
                    description:
                      "Accessible description for the uploaded screenshot.",
                  },
                },
                {
                  name: "label",
                  type: "text",
                  admin: {
                    description:
                      "Placeholder label or visible caption for the screenshot.",
                  },
                },
                {
                  name: "caption",
                  type: "textarea",
                  admin: {
                    description:
                      "Optional supporting text displayed below the screenshot.",
                  },
                },
                {
                  name: "icon",
                  dbName: "icon",
                  enumName: "article_guide_step_shot_icon",
                  type: "select",
                  defaultValue: "monitor",
                  options: guideIconOptions,
                },
              ],
            },
            {
              name: "infoCards",
              dbName: "cards",
              type: "array",
              labels: {
                singular: "Info card",
                plural: "Info cards",
              },
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: "title",
                  type: "text",
                  required: true,
                },
                {
                  name: "body",
                  type: "textarea",
                },
                {
                  name: "icon",
                  dbName: "icon",
                  enumName: "article_guide_step_card_icon",
                  type: "select",
                  defaultValue: "info",
                  options: guideIconOptions,
                },
              ],
            },
            {
              name: "callout",
              type: "group",
              fields: [
                {
                  name: "type",
                  dbName: "type",
                  enumName: "article_guide_callout_type",
                  type: "select",
                  defaultValue: "info",
                  options: [
                    { label: "None", value: "none" },
                    { label: "Info", value: "info" },
                    { label: "Warning", value: "warning" },
                  ],
                },
                {
                  name: "body",
                  type: "textarea",
                },
              ],
            },
          ],
        },
        {
          name: "extraSections",
          dbName: "extra",
          type: "array",
          labels: {
            singular: "Extra section",
            plural: "Extra sections",
          },
          admin: {
            initCollapsed: true,
            description:
              "Optional sections after the main steps, such as Mobile Teams Calling.",
          },
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
            },
            {
              name: "checklist",
              type: "array",
              labels: {
                singular: "Checklist item",
                plural: "Checklist items",
              },
              admin: {
                initCollapsed: true,
              },
              fields: [
                {
                  name: "item",
                  type: "text",
                  required: true,
                },
              ],
            },
            {
              name: "featureCard",
              type: "group",
              fields: [
                {
                  name: "enabled",
                  type: "checkbox",
                  defaultValue: false,
                },
                {
                  name: "title",
                  type: "text",
                },
                {
                  name: "body",
                  type: "textarea",
                },
                {
                  name: "icon",
                  dbName: "icon",
                  enumName: "article_guide_extra_feature_icon",
                  type: "select",
                  defaultValue: "phone",
                  options: guideIconOptions,
                },
              ],
            },
          ],
        },
        {
          name: "troubleshooting",
          dbName: "trouble",
          type: "array",
          labels: {
            singular: "Troubleshooting Q&A",
            plural: "Troubleshooting Q&A",
          },
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
            },
            {
              name: "content",
              type: "textarea",
              required: true,
            },
          ],
        },
        {
          name: "bestPracticeTips",
          dbName: "tips",
          type: "array",
          labels: {
            singular: "Best practice tip",
            plural: "Best practice tips",
          },
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: "title",
              type: "text",
              required: true,
            },
            {
              name: "body",
              type: "textarea",
            },
            {
              name: "icon",
              dbName: "icon",
              enumName: "article_guide_tip_icon",
              type: "select",
              defaultValue: "shield-check",
              options: guideIconOptions,
            },
          ],
        },
        {
          name: "faqs",
          dbName: "faqs",
          type: "array",
          labels: {
            singular: "FAQ",
            plural: "FAQs",
          },
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: "question",
              type: "text",
              required: true,
            },
            {
              name: "answer",
              type: "textarea",
              required: true,
            },
          ],
        },
        {
          name: "relatedArticles",
          type: "relationship",
          relationTo: "knowledge-articles",
          hasMany: true,
          admin: {
            description:
              "Choose related articles to display at the bottom of the guide.",
          },
        },
      ],
    },
    {
      name: "relatedArticles",
      type: "relationship",
      relationTo: "knowledge-articles",
      hasMany: true,
      admin: {
        description:
          "Choose related articles to display with this support article.",
      },
    },
    {
      name: "articleCTA",
      type: "group",
      admin: {
        description:
          "Optional article-specific call-to-action shown above related articles.",
      },
      fields: [
        {
          name: "enabled",
          type: "checkbox",
          defaultValue: false,
        },
        {
          name: "headline",
          type: "text",
        },
        {
          name: "description",
          type: "textarea",
        },
        {
          name: "primaryButton",
          type: "group",
          fields: [
            {
              name: "label",
              type: "text",
            },
            {
              name: "url",
              type: "text",
            },
          ],
        },
        {
          name: "secondaryButton",
          type: "group",
          fields: [
            {
              name: "label",
              type: "text",
            },
            {
              name: "url",
              type: "text",
            },
          ],
        },
      ],
    },
    {
      name: "seo",
      type: "group",
      admin: {
        description: "Search engine metadata for this article.",
      },
      fields: [
        {
          name: "title",
          type: "text",
          admin: {
            description: "SEO title. If empty, the article title is used.",
          },
        },
        {
          name: "description",
          type: "textarea",
          admin: {
            description:
              "SEO description. If empty, the subtitle, excerpt or summary is used.",
          },
        },
        {
          name: "primaryKeyword",
          type: "text",
        },
        {
          name: "secondaryKeywords",
          type: "array",
          labels: {
            singular: "Secondary keyword",
            plural: "Secondary keywords",
          },
          admin: {
            initCollapsed: true,
          },
          fields: [
            {
              name: "keyword",
              type: "text",
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: "popularArticle",
      type: "checkbox",
      defaultValue: false,
      admin: {
        position: "sidebar",
      },
    },
    {
      name: "estimatedReadTime",
      type: "number",
      defaultValue: 5,
      min: 1,
      required: true,
      admin: {
        description: "Estimated reading time in minutes.",
        position: "sidebar",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      index: true,
      options: [
        {
          label: "Draft",
          value: "draft",
        },
        {
          label: "Published",
          value: "published",
        },
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
