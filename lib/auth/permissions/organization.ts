import { createAccessControl } from "better-auth/plugins/access";

import type { InferAdminRolesFromOption } from "better-auth/plugins/admin";
import type { OrganizationOptions } from "better-auth/plugins/organization";
import {
  adminAc,
  defaultStatements,
  memberAc,
  ownerAc,
} from "better-auth/plugins/organization/access";

const statement = {
  testimonial: ["view", "approve", "download", "delete"] as const,
  ...defaultStatements,
};

export const ac = createAccessControl(statement);

export const viewer = ac.newRole({
  testimonial: ["view"],
  ...memberAc.statements,
});

export const editor = ac.newRole({
  testimonial: ["view", "approve", "download", "delete"],
  ...memberAc.statements,
});

export const admin = ac.newRole({
  testimonial: ["view", "approve", "download", "delete"],
  ...adminAc.statements,
});

export const owner = ac.newRole({
  testimonial: ["view", "approve", "download", "delete"],
  ...ownerAc.statements,
});

export const roles = {
  viewer,
  editor,
  admin,
  owner,
} as const;

export const organizationRBAC = {
  ac,
  roles,
} satisfies OrganizationOptions;

export type Role = InferAdminRolesFromOption<typeof organizationRBAC>;

export const ALL_ROLES = Object.keys(roles) as Array<Role>;

type StatementsType = typeof ac.statements;

// 2. Pass your statement typeof into it
export type OrganizationPermissionCheck = {
  [K in keyof StatementsType]?: StatementsType[K][number][] | undefined;
};
