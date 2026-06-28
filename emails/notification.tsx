import type { Organization, User } from "better-auth/client";
import { Button, Link, Section, Text } from "react-email";
import { BaseEmail } from "./components/base-email";

interface NotificationEmailProps {
  siteUrl: string;
  user: User;
  organization: Organization;
  testimonialsCount: number;
}

export default function NotificationEmail({
  siteUrl,
  organization,
  user,
  testimonialsCount,
}: NotificationEmailProps) {
  const previewText = `[${organization.name}] You have ${testimonialsCount} testimonial${testimonialsCount !== 1 ? "s" : ""} pending for review`;
  const urlForReview = new URL(
    `/o/${organization.slug}/dashboard/testimonials`,
    siteUrl,
  );
  urlForReview.searchParams.set("statuses", "pending");

  const urlForSettings = new URL(
    `/o/${organization.slug}/dashboard/settings/notification`,
    siteUrl,
  );

  return (
    <BaseEmail previewText={previewText}>
      <Section className="px-4 pt-4 pb-8">
        <Text>Hi {user.name},</Text>
        <Text>
          You have{" "}
          <strong>
            {testimonialsCount} testimonial
            {testimonialsCount !== 1 ? "s" : ""}
          </strong>{" "}
          pending for review on <strong>{organization.name}</strong>. Click the
          link below to view and approve them.
        </Text>
        <Button
          href={urlForReview.toString()}
          className="font-semibold bg-primary text-primary-foreground rounded px-4 py-2 font-12 inline-block"
        >
          View pending testimonials
        </Button>
        <Text className="text-xs text-muted-foreground">
          This is automated notification. You can change the email frequency in{" "}
          <Link
            href={urlForSettings.toString()}
            className="text-primary underline"
          >
            your account settings
          </Link>
          .
        </Text>
      </Section>
    </BaseEmail>
  );
}

NotificationEmail.PreviewProps = {
  organization: {
    name: "Club Freedom",
    slug: "club-freedom",
  },
  user: {
    name: "John Doe",
  },
  testimonialsCount: 2,
  siteUrl: "https://localhost:3000",
} as NotificationEmailProps;
