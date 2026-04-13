import { components } from "./_generated/api";
import { query } from "./_generated/server";
import { authComponent } from "./auth";

export const listAllOrganizations = query({
  args: {},
  handler: async (ctx) => {
    const { role } = await authComponent.getAuthUser(ctx);
    if (role !== "admin") {
      throw new Error("Unauthorized");
    }
    return ctx.runQuery(
      components.betterAuth.organization.listAllOrganizations,
    );
  },
});
