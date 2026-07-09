import { Button, Heading, Section, Text } from "react-email";
import { BaseEmail } from "./components/base-email";

interface ResetPasswordEmailProps {
  url: string;
}

export default function ResetPasswordEmail({ url }: ResetPasswordEmailProps) {
  return (
    <BaseEmail previewText="Reset your password">
      <Section className="px-4 pt-4 pb-8">
        <Heading className="font-24">Password Reset</Heading>
        <Text>
          We received a request to reset your password. Click the link below to
          set a new password.
        </Text>
        <Text className="text-muted-foreground font-12">
          If you didn&apos;t request a password reset, you can safely ignore
          this email.
        </Text>
        <Button
          href={url}
          className="font-semibold bg-primary text-primary-foreground rounded px-4 py-2 font-12 inline-block"
        >
          Create New Password
        </Button>
      </Section>
    </BaseEmail>
  );
}

ResetPasswordEmail.PreviewProps = {
  url: "https://example.com",
} as ResetPasswordEmailProps;
