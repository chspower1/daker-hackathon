import { SharedAppShell } from "@/components/layout/SharedAppShell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SharedAppShell>{children}</SharedAppShell>;
}
