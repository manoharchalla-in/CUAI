import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Campus AI Assistant",
  description: "Official Campus AI Student Assistant",
  openGraph: {
    title: "Campus AI Assistant",
    description: "Official Campus AI Student Assistant",
    type: "website",
    siteName: "Student Portal",
  },
  twitter: {
    card: "summary",
    title: "Campus AI Assistant",
    description: "Official Campus AI Student Assistant",
  },
};

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
