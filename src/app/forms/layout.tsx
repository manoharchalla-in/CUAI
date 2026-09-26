import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Registration Portal",
  description: "Official Campus Student Registration Portal",
  openGraph: {
    title: "Student Registration Portal",
    description: "Official Campus Student Registration Portal",
    type: "website",
    siteName: "Student Portal",
  },
  twitter: {
    card: "summary",
    title: "Student Registration Portal",
    description: "Official Campus Student Registration Portal",
  },
};

export default function FormsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
