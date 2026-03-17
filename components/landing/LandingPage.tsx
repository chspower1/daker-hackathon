"use client";

import Link from "next/link";
import { Button } from "@/components/design-system/primitives/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/design-system/primitives/Card";
import { Badge } from "@/components/design-system/primitives/Badge";
import { toLanguageTag } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useDocumentMetadata } from "@/lib/i18n/useDocumentMetadata";
import { DepthScene } from "./DepthScene";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cn } from "@/lib/cn";
import { useEffect, useState } from "react";

const landingRouteMap = {
  discover: "/hackathons",
  team: "/camp",
  rankings: "/rankings",
} as const;

function NoiseOverlay() {
  return (
    <div className="pointer-events-none fixed inset-0 z-50 h-full w-full opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/200/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>
  );
}

function Marquee({ text }: { text: string }) {
  return (
    <div className="relative flex overflow-x-hidden bg-primary-base text-primary-content py-4 border-y-4 border-content-base -rotate-2 scale-110 shadow-2xl z-20 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-3xl md:text-5xl font-black uppercase tracking-widest">
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
      </div>
      <div className="absolute top-4 animate-marquee2 whitespace-nowrap flex items-center gap-8 text-3xl md:text-5xl font-black uppercase tracking-widest" style={{ animationDelay: '-12.5s' }}>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
        <span>•</span>
        <span>{text}</span>
      </div>
    </div>
  );
}

function AnchorButton({ href, variant = "primary", className, children }: { href: string; variant?: "primary" | "outline" | "brutal"; className?: string; children: React.ReactNode }) {
  const variants = {
    primary: "bg-primary-base text-white hover:bg-primary-hover shadow-sm border border-transparent",
    outline: "bg-transparent text-content-base hover:bg-surface-muted border-2 border-content-base",
    brutal: "bg-content-base text-surface-base hover:bg-primary-base hover:text-white border-4 border-content-base hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] uppercase font-black tracking-widest",
  };
  const buttonClassName = cn(
    "inline-flex items-center justify-center rounded-none transition-all duration-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-base focus-visible:ring-offset-2 h-14 px-8 text-lg",
    variants[variant],
    className
  );

  if (href.startsWith("/")) {
    return <Link href={href} className={buttonClassName}>{children}</Link>;
  }
  return <a href={href} className={buttonClassName}>{children}</a>;
}

export function LandingPage() {
  const { dict, locale } = useI18n();
  const languageTag = toLanguageTag(locale);
  useDocumentMetadata(dict.metadata);

  return (
    <DepthScene className="bg-[#f4f4f0] text-content-base font-sans overflow-x-hidden selection:bg-primary-base selection:text-white">
      <NoiseOverlay />
      
      <nav className="fixed top-0 w-full z-50 border-b-4 border-content-base bg-[#f4f4f0]/95 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-6 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4 font-black text-3xl tracking-tighter uppercase">
            <div className="w-12 h-12 bg-content-base flex items-center justify-center text-[#f4f4f0] shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] text-2xl">H</div>
            HackPlatform
          </div>
          <div className="hidden md:flex gap-10 text-base font-black uppercase tracking-widest text-content-base">
            <Link href={landingRouteMap.discover} className="hover:text-primary-base transition-colors hover:underline decoration-4 underline-offset-8">{dict.nav.discover}</Link>
            <Link href={landingRouteMap.team} className="hover:text-primary-base transition-colors hover:underline decoration-4 underline-offset-8">{dict.nav.teams}</Link>
            <Link href={landingRouteMap.rankings} className="hover:text-primary-base transition-colors hover:underline decoration-4 underline-offset-8">{dict.nav.rankings}</Link>
          </div>
          <div className="flex items-center gap-6">
            <LanguageSwitcher />
            <AnchorButton href={landingRouteMap.discover} variant="brutal" className="h-12 px-6 text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] border-2 border-content-base bg-white text-content-base">{dict.nav.getStarted}</AnchorButton>
          </div>
        </div>
      </nav>

      <section className="relative min-h-screen pt-40 pb-20 px-6 max-w-[1400px] mx-auto flex flex-col justify-center">
        <div className="grid lg:grid-cols-12 gap-12 items-center z-10">
          <div className="lg:col-span-7 space-y-12 animate-slide-up relative">
            <div className="absolute -inset-10 -z-10 opacity-20" style={{ backgroundImage: 'radial-gradient(var(--color-content-base) 2px, transparent 2px)', backgroundSize: '32px 32px' }} />
            
            <div className="inline-block border-4 border-content-base px-6 py-2 bg-yellow-300 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-widest text-lg rotate-[-2deg]">
              {dict.misc.welcome}
            </div>
            
            <h1 className="text-6xl md:text-8xl lg:text-[7.5rem] font-black tracking-tighter leading-[0.85] text-content-base uppercase mix-blend-difference">
              {dict.hero.headline}
            </h1>
            
            <p className="text-2xl md:text-3xl text-content-base font-bold max-w-xl leading-snug border-l-8 border-primary-base pl-8 py-2">
              {dict.hero.subcopy}
            </p>
            
            <div className="flex flex-wrap gap-8 pt-6">
              <AnchorButton href={dict.hero.primaryCta.href} variant="brutal" className="text-2xl px-12 h-20 bg-primary-base text-white border-content-base">
                {dict.hero.primaryCta.label}
              </AnchorButton>
              <AnchorButton href={dict.hero.secondaryCta.href} variant="outline" className="text-xl px-10 h-20 rounded-none font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-none bg-[#f4f4f0] border-4 border-content-base">
                {dict.hero.secondaryCta.label}
              </AnchorButton>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[650px] w-full preserve-3d perspective-1000 hidden lg:block">
            <div className="absolute inset-0 w-full h-full preserve-3d" style={{
                transform: "perspective(1200px) rotateX(calc(var(--landing-tilt-x) * 2deg)) rotateY(calc(var(--landing-tilt-y) * 2deg))",
                transition: "transform 0.1s ease-out"
              }}>
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[420px] border-4 border-content-base bg-white shadow-[16px_16px_0px_0px_rgba(37,99,235,1)] flex flex-col z-20"
                style={{ transform: "translate3d(-50%, calc(-50% + var(--landing-scroll-y) * -0.3px), 100px)" }}>
                <div className="border-b-4 border-content-base p-5 bg-primary-base text-white flex justify-between items-center">
                  <span className="font-black text-xl uppercase tracking-widest">{dict.card.leaderboard}</span>
                  <div className="flex gap-2">
                    <div className="w-4 h-4 rounded-none border-2 border-content-base bg-red-400"></div>
                    <div className="w-4 h-4 rounded-none border-2 border-content-base bg-yellow-400"></div>
                  </div>
                </div>
                <div className="flex-1 p-6 space-y-5 bg-[#f4f4f0] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjI1Ii8+PC9zdmc+')]">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-4 border-4 border-content-base bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
                      <div className="flex items-center gap-4">
                        <span className="font-black text-2xl">0{i}</span>
                        <span className="font-bold uppercase text-lg">{dict.card.teamAlpha} {i}</span>
                      </div>
                      <span className="text-primary-base font-black text-xl">2.4k</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="absolute top-[5%] -left-[15%] w-72 h-56 border-4 border-content-base bg-yellow-300 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 z-10 rotate-[-12deg]"
                style={{ transform: "translate3d(0, calc(var(--landing-scroll-y) * 0.5px), -60px) rotate(-12deg)" }}>
                <div className="bg-content-base text-white inline-block px-3 py-1 uppercase font-black mb-4">{dict.card.live}</div>
                <h3 className="text-3xl font-black uppercase leading-none mb-3">{dict.card.globalAIHack}</h3>
                <p className="mt-2 font-bold text-lg leading-tight">{dict.card.globalAIHackDesc}</p>
              </div>

              <div className="absolute bottom-[5%] -right-[15%] w-80 h-48 border-4 border-content-base bg-green-400 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-6 z-30 rotate-[8deg]"
                style={{ transform: "translate3d(0, calc(var(--landing-scroll-y) * 0.15px), 160px) rotate(8deg)" }}>
                <div className="bg-content-base text-white inline-block px-3 py-1 uppercase font-black mb-4">{dict.card.lookingForTeam}</div>
                <h3 className="text-2xl font-black uppercase leading-none">{dict.card.frontendDev}</h3>
                <div className="mt-6 flex gap-3">
                  <div className="w-10 h-10 border-4 border-content-base bg-blue-500"></div>
                  <div className="w-10 h-10 border-4 border-content-base bg-purple-500"></div>
                  <div className="w-10 h-10 border-4 border-content-base bg-[#f4f4f0] flex items-center justify-center font-black text-xl">+</div>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </section>

      <div className="my-10">
        <Marquee text={dict.hero.headline} />
      </div>

      <section className="py-40 bg-content-base text-white border-y-8 border-primary-base relative">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 2px, transparent 0)', backgroundSize: '48px 48px' }} />
        <div className="max-w-[1400px] mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-3 gap-16 lg:gap-24">
            {dict.flow.map((step) => (
              <div key={step.step} className="space-y-8 group">
                <div className="text-[10rem] leading-none font-black text-transparent [-webkit-text-stroke:4px_white] group-hover:[-webkit-text-stroke:4px_var(--color-primary-base)] group-hover:text-primary-base group-hover:scale-110 origin-left transition-all duration-500">
                  {step.step}
                </div>
                <h3 className="text-4xl font-black uppercase tracking-tighter">{step.title}</h3>
                <p className="text-slate-300 text-xl leading-relaxed font-bold">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="discover" className="py-40 px-6 max-w-[1400px] mx-auto relative">
        <div className="mb-24 flex flex-col md:flex-row gap-10 justify-between items-end border-b-8 border-content-base pb-10">
          <div className="space-y-6 max-w-3xl">
            <h2 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.9]">{dict.misc.featuresTitle}</h2>
            <p className="text-2xl text-content-muted font-black uppercase tracking-widest">{dict.misc.featuresSubtitle}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12">
          {dict.features.map((feature, i) => (
            <div 
              key={feature.id} 
              id={feature.id} 
              className="group border-4 border-content-base bg-white shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-[16px_16px_0px_0px_rgba(37,99,235,1)] hover:-translate-y-4 transition-all duration-300 flex flex-col h-full"
            >
              <div className={`h-8 w-full border-b-4 border-content-base ${feature.color.replace('bg-', 'bg-').replace('500', '400')} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 10px, #000 10px, #000 20px)' }} />
              </div>
              <div className="p-10 flex-1 flex flex-col">
                <h3 className="text-4xl font-black uppercase mb-6 leading-none">{feature.title}</h3>
                <p className="text-content-muted text-xl font-bold mb-10 flex-1 leading-relaxed">
                  {feature.description}
                </p>
                
                 {feature.id in landingRouteMap ? (
                   <Link
                     href={landingRouteMap[feature.id as keyof typeof landingRouteMap]}
                     className="inline-flex items-center justify-between border-4 border-content-base p-6 font-black uppercase tracking-widest text-xl hover:bg-content-base hover:text-white transition-colors"
                   >
                     {dict.misc.learnMore}
                     <span className="text-3xl">→</span>
                   </Link>
                 ) : (
                   <div className="inline-flex items-center justify-between border-4 border-content-base p-6 font-black uppercase tracking-widest text-xl text-content-muted cursor-not-allowed">
                     {dict.misc.learnMore}
                     <span className="text-3xl">→</span>
                   </div>
                 )}
              </div>
             </div>
           ))}
        </div>
      </section>

      <section id="rankings" className="py-40 bg-white border-y-8 border-content-base relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #000, #000 2px, transparent 2px, transparent 100px), repeating-linear-gradient(0deg, #000, #000 2px, transparent 2px, transparent 100px)' }} />
        
        <div className="max-w-[1400px] mx-auto px-6 relative z-10 flex flex-col xl:flex-row gap-20 items-center">
          <div className="xl:w-1/3 space-y-10 bg-[#f4f4f0] border-4 border-content-base p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-primary-base text-white inline-block uppercase font-black px-6 py-3 text-2xl tracking-widest">{dict.misc.rankingsBadge}</div>
            <h2 className="text-6xl md:text-7xl font-black tracking-tighter uppercase leading-[0.9]">{dict.misc.rankingsTitle}</h2>
            <p className="text-2xl font-bold text-content-base border-l-8 border-green-400 pl-6">Who is leading the charge this season?</p>
            <AnchorButton href={landingRouteMap.rankings} variant="brutal" className="w-full text-2xl h-20 mt-8">
              {dict.misc.viewFull}
            </AnchorButton>
          </div>
          
          <div className="xl:w-2/3 w-full">
            <div className="border-4 border-content-base bg-white shadow-[16px_16px_0px_0px_rgba(0,0,0,1)]">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b-4 border-content-base bg-content-base text-white uppercase font-black text-2xl">
                      <th className="p-8">{dict.misc.tableRank}</th>
                      <th className="p-8">{dict.misc.tableTeam}</th>
                      <th className="p-8">{dict.misc.tableScore}</th>
                      <th className="p-8">{dict.misc.tableStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dict.rankingsPreview.map((row, idx) => (
                      <tr key={row.team} className={`group cursor-pointer font-bold text-xl hover:bg-yellow-300 transition-colors ${idx !== dict.rankingsPreview.length - 1 ? 'border-b-4 border-content-base' : ''}`}>
                        <td className="p-8 text-4xl font-black">
                          {idx === 0 ? '🏆' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${row.rank}`}
                        </td>
                        <td className="p-8 uppercase group-hover:underline decoration-4 underline-offset-8 text-3xl font-black">{row.team}</td>
                        <td className="p-8 font-mono text-3xl font-black">{row.score.toLocaleString(languageTag)}</td>
                        <td className="p-8">
                          <span className="inline-block border-4 border-content-base px-4 py-2 bg-green-400 text-lg uppercase font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-40 px-6 bg-[#f4f4f0] text-content-base text-center relative">
        <div className="relative z-10 max-w-5xl mx-auto space-y-16">
          <h2 className="text-[5rem] md:text-[8rem] font-black tracking-tighter uppercase leading-[0.85]">
            {dict.footer.headline}
          </h2>
          <div className="flex justify-center">
             <AnchorButton href={dict.footer.cta.href} className="h-24 px-20 text-3xl bg-primary-base text-white border-4 border-content-base hover:bg-content-base shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:translate-x-3 hover:translate-y-3 hover:shadow-none uppercase font-black transition-all">
               {dict.footer.cta.label}
             </AnchorButton>
          </div>
        </div>
        
        <div className="relative z-10 mt-40 text-content-base font-black uppercase tracking-widest text-lg flex flex-col md:flex-row items-center justify-between max-w-[1400px] mx-auto border-t-8 border-content-base pt-16">
          <p>© {new Date().getFullYear()} {dict.misc.rights}</p>
          <div className="flex gap-12 mt-8 md:mt-0">
            <Link href={landingRouteMap.discover} className="hover:text-primary-base transition-colors hover:underline decoration-4 underline-offset-8">{dict.nav.discover}</Link>
            <Link href={landingRouteMap.team} className="hover:text-primary-base transition-colors hover:underline decoration-4 underline-offset-8">{dict.nav.teams}</Link>
            <Link href={landingRouteMap.rankings} className="hover:text-primary-base transition-colors hover:underline decoration-4 underline-offset-8">{dict.nav.rankings}</Link>
          </div>
        </div>
      </footer>
    </DepthScene>
  );
}
