import type { Organization } from "better-auth/client";
import { Button, Heading, Section, Text } from "react-email";
import { BaseEmail } from "./components/base-email";

interface InviteEmailProps {
  url: string;
  organization: Organization;
}

export default function InviteEmail({ url, organization }: InviteEmailProps) {
  return (
    <BaseEmail previewText={`You're invited to ${organization.name}`}>
      <Section className="px-4 pt-4 pb-8">
        <Heading className="font-24 font-normal">
          Join <strong>{organization.name}</strong> on <strong>Sypur</strong>
        </Heading>
        <Text>
          You're invited to join <strong>{organization.name}</strong> on{" "}
          <strong>Sypur</strong>. Click the link below to accept the invitation.
        </Text>
        <Button
          href={url}
          className="font-semibold bg-primary text-primary-foreground rounded px-4 py-2 font-12 inline-block"
        >
          Accept Invitation
        </Button>
      </Section>
    </BaseEmail>
  );
}

InviteEmail.PreviewProps = {
  url: "https://example.com",
  organization: {
    name: "Example",
  },
} as InviteEmailProps;
