import { SharedAppShell } from "@/components/layout/SharedAppShell";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f4f4f0] flex flex-col font-sans selection:bg-primary-base selection:text-white">
      <SharedAppShell>{children}</SharedAppShell>
    </div>
  );
}
