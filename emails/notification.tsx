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
        <Text className="font-12 text-muted-foreground">
          This is automated notification. You can change the its frequency your
          account settings by going to{" "}
          <Link href={siteUrl} className="text-primary">
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
