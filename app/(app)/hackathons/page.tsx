import { HackathonList } from "@/components/hackathons/HackathonList";

export default function HackathonsPage() {
  return (
    <div className="min-h-screen bg-surface-muted/50 pb-16 pt-8">
      <div className="max-w-[90rem] mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <HackathonList />
      </div>
    </div>
  );
}
