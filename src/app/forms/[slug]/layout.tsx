import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const yearLabel = slug
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  const title = `Student Registration Form - ${yearLabel}`;
  const description = `Student Registration and Intake Form for ${yearLabel}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: "Student Portal",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function FormSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
