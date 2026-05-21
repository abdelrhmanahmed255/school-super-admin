import { useLocale } from "next-intl";
import WebsiteProtectWrapper from "./_components/website-protect-wrapper";

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = useLocale();
  return <WebsiteProtectWrapper >{children}</WebsiteProtectWrapper>;
}
