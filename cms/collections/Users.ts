import type { CollectionConfig } from "payload";

import { adminsOnly, readUsersAccess } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  access: {
    create: adminsOnly,
    delete: adminsOnly,
    read: readUsersAccess,
    update: adminsOnly,
  },
  admin: {
    group: "Admin",
    useAsTitle: "email",
  },
  fields: [
    {
      name: "role",
      type: "select",
      defaultValue: "support",
      required: true,
      options: [
        { label: "Admin", value: "admin" },
        { label: "Marketing", value: "marketing" },
        { label: "Support", value: "support" },
      ],
      admin: {
        description:
          "Controls Payload admin and API access. Admin and Marketing have full access; Support is limited to the Support Hub.",
        position: "sidebar",
      },
    },
  ],
};
