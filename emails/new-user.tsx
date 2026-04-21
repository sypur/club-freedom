import { Heading, Link, Text } from "@react-email/components";
import { BaseEmail, styles } from "./base-email";

interface NewUserEmailProps {
  url: string;
  brandName?: string;
  brandTagline?: string;
  brandLogoUrl?: string;
}

export default function NewUserEmail({
  url,
  brandName,
  brandTagline,
  brandLogoUrl,
}: NewUserEmailProps) {
  return (
    <BaseEmail
      previewText="You're invited as an organization owner"
      brandName={brandName}
      brandTagline={brandTagline}
      brandLogoUrl={brandLogoUrl}
    >
      <Heading style={styles.h1}>
        You're invited as an organization owner
      </Heading>
      <Text
        style={{
          ...styles.text,
        }}
      >
        A new account is automatically created with your email.
      </Text>
      <Link
        href={url}
        target="_blank"
        style={{
          ...styles.link,
          display: "block",
          marginBottom: "16px",
        }}
      >
        Click here to reset your password
      </Link>
      <Text
        style={{
          ...styles.text,
          color: "#ababab",
          marginTop: "14px",
          marginBottom: "16px",
        }}
      >
        If you didn&apos;t request for an organization invite, you can safely
        ignore this email.
      </Text>
    </BaseEmail>
  );
}
