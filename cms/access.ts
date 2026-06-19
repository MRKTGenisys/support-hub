import type { Access } from "payload";

export type UserRole = "admin" | "marketing" | "support";

type AccessContext = {
  req: {
    user?: unknown;
  };
};

const roleValues: readonly UserRole[] = ["admin", "marketing", "support"];
const fullAccessRoles: readonly UserRole[] = ["admin", "marketing"];
const supportHubRoles: readonly UserRole[] = ["admin", "marketing", "support"];

function isUserRole(role: unknown): role is UserRole {
  return typeof role === "string" && roleValues.includes(role as UserRole);
}

export function getUserRole(user: unknown): UserRole | null {
  if (!user || typeof user !== "object") {
    return null;
  }

  const role = (user as { role?: unknown }).role;

  if (isUserRole(role)) {
    return role;
  }

  // Existing local Payload users were created before roles existed.
  // Treat authenticated legacy users as admins until their role is explicitly set.
  return "admin";
}

export function isAdmin({ req }: AccessContext): boolean {
  return getUserRole(req.user) === "admin";
}

export function isAdminOrMarketing({ req }: AccessContext): boolean {
  const role = getUserRole(req.user);
  return Boolean(role && fullAccessRoles.includes(role));
}

export function isSupport({ req }: AccessContext): boolean {
  return getUserRole(req.user) === "support";
}

export function canManageSupportHub({ req }: AccessContext): boolean {
  const role = getUserRole(req.user);
  return Boolean(role && supportHubRoles.includes(role));
}

export const adminsOnly: Access = ({ req }) => isAdmin({ req });

export const adminOrMarketingOnly: Access = ({ req }) =>
  isAdminOrMarketing({ req });

export const supportHubOnly: Access = ({ req }) =>
  canManageSupportHub({ req });

export const publishedOrFullAccess: Access = ({ req }) => {
  if (isAdminOrMarketing({ req })) {
    return true;
  }

  if (req.user) {
    return false;
  }

  return {
    status: {
      equals: "published",
    },
  };
};

export const publishedOrSupportHubAccess: Access = ({ req }) => {
  if (canManageSupportHub({ req })) {
    return true;
  }

  return {
    status: {
      equals: "published",
    },
  };
};

export const publicOrFullAccess: Access = ({ req }) => {
  if (!req.user) {
    return true;
  }

  return isAdminOrMarketing({ req });
};

export const publicOrSupportHubAccess: Access = ({ req }) => {
  if (!req.user) {
    return true;
  }

  return canManageSupportHub({ req });
};

export const readUsersAccess: Access = ({ req }) => isAdminOrMarketing({ req });
