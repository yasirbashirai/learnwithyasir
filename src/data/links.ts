/** Yasir's wider presence, referenced across the LMS so it's editable in one place. */
export const SITE_URL = "https://learnwith.yasirbashir.com";
export const SITE_NAME = "Learn With Yasir";
export const OG_IMAGE = `${SITE_URL}/og-image.png`;
export const TWITTER_HANDLE = "@YasirBashirai";
export const SERVICES_SITE = "https://yasirbashir.com";
export const CHAT_SITE = "https://chatwith.yasirbashir.com";
export const CONTACT_EMAIL = "hello@yasirbashir.com";

export type SocialKey = "linkedin" | "instagram" | "github" | "facebook" | "youtube";

export interface Social {
  label: string;
  href: string;
  key: SocialKey;
}

export const socials: Social[] = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/yasirbashiraiengineer/", key: "linkedin" },
  { label: "Instagram", href: "https://www.instagram.com/yasirbhatti.331/", key: "instagram" },
  { label: "GitHub", href: "https://github.com/yasirbashirai", key: "github" },
  { label: "Facebook", href: "https://web.facebook.com/yasirprodev/", key: "facebook" },
  { label: "YouTube", href: "https://www.youtube.com/@YasirBashirai", key: "youtube" },
];
