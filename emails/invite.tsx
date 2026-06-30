import { Heading, Link } from "react-email";
import { BaseEmail, styles } from "./base-email";

interface InviteEmailProps {
  url: string;
  brandName: string;
  brandTagline?: string;
  brandLogoUrl?: string;
}

export default function InviteEmail({
  url,
  brandName,
  brandTagline,
  brandLogoUrl,
}: InviteEmailProps) {
  return (
    <BaseEmail
      previewText={`You're invited to ${brandName}`}
      brandName={brandName}
      brandTagline={brandTagline}
      brandLogoUrl={brandLogoUrl}
    >
      <Heading style={styles.h1}>{`You're invited to ${brandName}`}</Heading>
      <Link
        href={url}
        target="_blank"
        style={{
          ...styles.link,
          display: "block",
          marginBottom: "16px",
        }}
      >
        Accept Invitation
      </Link>
    </BaseEmail>
  );
}
