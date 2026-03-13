import { Button } from "@/components/design-system/primitives/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system/primitives/Card";
import { Badge } from "@/components/design-system/primitives/Badge";
import { DataTable, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/design-system/primitives/DataTable";
import { DepthScene } from "./DepthScene";
import { landingContent } from "./content";
import { cn } from "@/lib/cn";

function AnchorButton({ href, variant = "primary", size = "lg", className, children }: { href: string; variant?: "primary" | "outline"; size?: "lg" | "sm"; className?: string; children: React.ReactNode }) {
  const variants = {
    primary: "bg-primary-base text-white hover:bg-primary-hover shadow-sm border border-transparent",
    outline: "bg-surface-base text-content-muted hover:bg-surface-muted border border-border-strong shadow-sm",
  };
  const sizes = {
    sm: "h-8 px-3 text-xs",
    lg: "h-12 px-6 text-base",
  };
  return (
    <a
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-base focus-visible:ring-offset-2 active:scale-[0.98]",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </a>
  );
}

export function LandingPage() {
  return (
    <DepthScene className="bg-surface-muted text-content-base font-sans overflow-x-hidden selection:bg-primary-subtle selection:text-primary-content">
      <nav className="fixed top-0 w-full z-50 border-b border-border-base/50 bg-surface-base/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-primary-base flex items-center justify-center text-white">H</div>
            HackPlatform
          </div>
          <div className="hidden md:flex gap-6 text-sm font-medium text-content-muted">
            <a href="#discover" className="hover:text-primary-base transition-colors">Discover</a>
            <a href="#team" className="hover:text-primary-base transition-colors">Teams</a>
            <a href="#rankings" className="hover:text-primary-base transition-colors">Rankings</a>
          </div>
          <AnchorButton href="#discover" size="sm">Get Started</AnchorButton>
        </div>
      </nav>

      <section className="relative min-h-[90vh] flex flex-col justify-center pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <div 
          className="absolute top-1/4 left-1/2 w-[800px] h-[600px] bg-primary-base/20 blur-[120px] rounded-full pointer-events-none -z-10" 
          style={{ transform: "translate3d(-50%, calc(var(--landing-scroll-y) * 0.4px), 0)" }}
        />
        <div 
          className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none -z-10" 
          style={{ transform: "translate3d(0, calc(var(--landing-scroll-y) * -0.2px), 0)" }}
        />
        
        <div className="grid lg:grid-cols-2 gap-12 items-center z-10">
          <div className="space-y-8 animate-slide-up">
            <Badge variant="info" className="px-3 py-1 text-sm border-primary-base/20">Welcome to the arena</Badge>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter leading-[1.1] text-content-base">
              {landingContent.hero.headline}
            </h1>
            <p className="text-xl text-content-muted max-w-lg leading-relaxed">
              {landingContent.hero.subcopy}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <AnchorButton href={landingContent.hero.primaryCta.href} variant="primary" className="shadow-lg shadow-primary-base/25 hover:shadow-xl hover:shadow-primary-base/30 transition-shadow">
                {landingContent.hero.primaryCta.label}
              </AnchorButton>
              <AnchorButton href={landingContent.hero.secondaryCta.href} variant="outline">
                {landingContent.hero.secondaryCta.label}
              </AnchorButton>
            </div>
          </div>

          <div className="relative h-[500px] w-full preserve-3d perspective-1000 hidden lg:block">
            <div 
              className="absolute inset-0 w-full h-full preserve-3d flex items-center justify-center"
              style={{
                transform: "perspective(1200px) rotateX(calc(var(--landing-tilt-x) * 1deg)) rotateY(calc(var(--landing-tilt-y) * 1deg))",
                transition: "transform 0.1s ease-out"
              }}
            >
              <Card 
                className="absolute top-[5%] left-[0%] w-72 h-48 opacity-90 shadow-xl bg-surface-base/95 border-border-base backdrop-blur-sm"
                style={{ transform: "translate3d(0, calc(var(--landing-scroll-y) * 0.4px), -80px) rotate(-6deg)" }}
              >
                <CardHeader>
                  <Badge variant="warning" className="w-fit mb-2">Live</Badge>
                  <CardTitle className="text-lg">Global AI Hack</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-content-muted">Join 500+ hackers building the future of AI tools.</p>
                </CardContent>
              </Card>

              <Card 
                className="absolute bottom-[10%] right-[0%] w-64 h-56 shadow-xl bg-surface-base/95 border-border-base backdrop-blur-sm"
                style={{ transform: "translate3d(0, calc(var(--landing-scroll-y) * 0.15px), 30px) rotate(4deg)" }}
              >
                <CardHeader>
                  <Badge variant="success" className="w-fit mb-2">Looking for Team</Badge>
                  <CardTitle className="text-lg">Frontend Dev</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-sm text-content-muted">React, Tailwind, Motion.</p>
                    <div className="flex gap-2">
                      <div className="h-6 w-6 rounded-full bg-blue-100 border border-blue-200" />
                      <div className="h-6 w-6 rounded-full bg-purple-100 border border-purple-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="absolute top-1/2 left-1/2 w-80 h-64 shadow-2xl bg-surface-base/90 border-primary-base/30 ring-1 ring-primary-base/10 z-10 backdrop-blur-md"
                style={{ 
                  marginLeft: "-160px",
                  marginTop: "-128px",
                  transform: "translate3d(0, calc(var(--landing-scroll-y) * -0.2px), 120px)" 
                }}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">Leaderboard</CardTitle>
                    <span className="text-2xl">🏆</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mt-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-md bg-surface-muted">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-content-muted">#{i}</span>
                          <span className="font-medium">Team Alpha {i}</span>
                        </div>
                        <span className="text-primary-base font-bold">2.4k</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-base border-y border-border-base">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {landingContent.flow.map((step) => (
              <div key={step.step} className="space-y-4 group">
                <div className="text-4xl font-black text-border-strong group-hover:text-primary-base transition-colors">
                  {step.step}
                </div>
                <h3 className="text-2xl font-bold">{step.title}</h3>
                <p className="text-content-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="discover" className="py-32 px-6 max-w-7xl mx-auto relative">
        <div className="mb-16 text-center max-w-2xl mx-auto space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything you need</h2>
          <p className="text-lg text-content-muted">A platform designed for speed, collaboration, and showcasing your best work.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 preserve-3d">
          {landingContent.features.map((feature, i) => (
            <Card 
              key={feature.id} 
              id={feature.id} 
              className="group overflow-hidden border-border-base hover:border-primary-base/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-xl bg-surface-base"
              style={{
                transform: `translateY(calc(max(0, 1 - var(--landing-scroll-progress) * 4) * ${40 + i * 15}px))`
              }}
            >
              <div className={`h-2 w-full ${feature.color}`} />
              <CardHeader>
                <CardTitle className="text-2xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-content-muted text-lg mb-6">
                  {feature.description}
                </p>
                <Button variant="ghost" className="group-hover:translate-x-1 transition-transform p-0 hover:bg-transparent text-primary-base">
                  Learn more →
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section id="rankings" className="py-24 bg-surface-muted border-t border-border-base relative overflow-hidden">
        <div 
          className="absolute -right-64 top-0 w-96 h-96 bg-primary-base/5 rounded-full blur-3xl" 
          style={{ transform: "translateY(calc(var(--landing-scroll-progress) * 200px))" }} 
        />
        
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12 space-y-4">
            <Badge variant="warning">Live Rankings</Badge>
            <h2 className="text-4xl font-bold tracking-tight">Top Teams This Season</h2>
          </div>
          
          <Card className="shadow-xl shadow-black/5">
            <CardContent className="p-0 sm:p-6">
              <div className="overflow-x-auto">
                <DataTable>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-20">Rank</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {landingContent.rankingsPreview.map((row) => (
                      <TableRow key={row.team} className="group cursor-pointer">
                        <TableCell className="font-bold text-lg">#{row.rank}</TableCell>
                        <TableCell className="font-medium group-hover:text-primary-base transition-colors">{row.team}</TableCell>
                        <TableCell className="font-mono">{row.score.toLocaleString()}</TableCell>
                        <TableCell><Badge variant="success">{row.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </DataTable>
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-8 text-center">
            <AnchorButton href="#rankings" variant="outline">
              View Full Leaderboard
            </AnchorButton>
          </div>
        </div>
      </section>

      <footer className="py-32 px-6 bg-content-base text-surface-base text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        
        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
          <h2 className="text-5xl md:text-6xl font-black tracking-tight text-white">
            {landingContent.footer.headline}
          </h2>
          <AnchorButton href={landingContent.footer.cta.href} className="h-14 px-10 text-lg bg-primary-base hover:bg-primary-hover text-white border-0 shadow-xl shadow-primary-base/20">
            {landingContent.footer.cta.label}
          </AnchorButton>
        </div>
        
        <div className="relative z-10 mt-24 text-content-muted text-sm flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto border-t border-content-muted/20 pt-8">
          <p>© {new Date().getFullYear()} HackPlatform. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#discover" className="hover:text-white transition-colors">Discover</a>
            <a href="#host" className="hover:text-white transition-colors">Host</a>
            <a href="#rankings" className="hover:text-white transition-colors">Rankings</a>
          </div>
        </div>
      </footer>
    </DepthScene>
  );
}
