import type { Metadata } from "next";
import { PublicWebsite } from "@/components/site/public-website";
import { getPublicSiteData } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getPublicSiteData();

  return {
    title: settings.website_title,
    description: settings.website_subtitle,
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
      apple: "/favicon.svg",
    },
  };
}

export default async function Home() {
  const { settings, gallery } = await getPublicSiteData();

  return <PublicWebsite gallery={gallery} settings={settings} />;
}
