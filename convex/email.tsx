import { Resend } from "@convex-dev/resend";
import { render } from "@react-email/components";
import InviteEmail from "@/emails/invite";
import ResetPasswordEmail from "@/emails/reset-password";
import { components } from "./_generated/api";
import type { ActionCtx } from "./_generated/server";

export const resend = new Resend(components.resend, {
  testMode: false,
});

export const sendResetPassword = async (
  ctx: ActionCtx,
  {
    to,
    url,
  }: {
    to: string;
    url: string;
  },
) => {
  await resend.sendEmail(ctx, {
    from: `Sypur <${process.env.AUTH_EMAIL}>`,
    to,
    subject: "Reset your password",
    html: await render(<ResetPasswordEmail url={url} />),
  });
};

export const sendInvite = async (
  ctx: ActionCtx,
  {
    to,
    url,
    subject,
    organization,
  }: {
    to: string;
    url: string;
    subject: string;
    organization: string;
  },
) => {
  await resend.sendEmail(ctx, {
    from: `Sypur <${process.env.AUTH_EMAIL}>`,
    to,
    subject,
    html: await render(<InviteEmail brandName={organization} url={url} />),
  });
};
