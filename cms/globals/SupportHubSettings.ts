import type { GlobalConfig } from "payload";

import { adminOrMarketingOnly, publicOrFullAccess } from "../access";

export const SupportHubSettings: GlobalConfig = {
  slug: "support-hub-settings",
  label: "Support Hub Settings",
  access: {
    read: publicOrFullAccess,
    update: adminOrMarketingOnly,
  },
  admin: {
    group: "Support Hub",
  },
  fields: [
    {
      name: "heroTitle",
      type: "text",
      defaultValue: "How can we help today?",
      required: true,
    },
    {
      name: "heroSubtitle",
      type: "textarea",
      defaultValue:
        "Search our knowledge base, check system status or get in touch with our support team.",
      required: true,
    },
    {
      name: "searchPlaceholder",
      type: "text",
      defaultValue: "Search for articles or guides...",
      required: true,
    },
    {
      name: "supportCTA",
      type: "group",
      fields: [
        {
          name: "heading",
          type: "text",
          defaultValue: "Need support?",
          required: true,
        },
        {
          name: "body",
          type: "textarea",
          defaultValue:
            "Get help from the Genisys team through your preferred support channel.",
          required: true,
        },
        {
          name: "buttonLabel",
          type: "text",
          defaultValue: "Create a Support Ticket",
          required: true,
        },
        {
          name: "buttonURL",
          type: "text",
          defaultValue: "https://my.genisys.com.au/login",
          required: true,
        },
      ],
    },
  ],
};
