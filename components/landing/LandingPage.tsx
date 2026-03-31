"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { toLanguageTag } from "@/lib/i18n/config";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useDocumentMetadata } from "@/lib/i18n/useDocumentMetadata";
import { DepthScene } from "./DepthScene";
import { ScrambleHeadline } from "./ScrambleHeadline";
import { TopHeader } from "@/components/layout/TopHeader";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/design-system/primitives/Card";

const landingRouteMap = {
  discover: "/hackathons",
  team: "/camp",
  rankings: "/rankings",
} as const;

function useScrollReveal() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const elements = document.querySelectorAll(".scroll-reveal");
    elements.forEach((el) => { observer.observe(el); });

    return () => observer.disconnect();
  }, []);

  return containerRef;
}

export function LandingPage() {
  const { dict, locale } = useI18n();
  const languageTag = toLanguageTag(locale);
  useDocumentMetadata(dict.metadata);
  useScrollReveal();

  return (
    <DepthScene className="bg-surface-base text-content-base font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <TopHeader 
        variant="landing" 
        rightSlot={
          <Link href={landingRouteMap.discover} className="inline-flex h-10 items-center justify-center rounded-full bg-primary-base px-6 text-sm font-medium text-primary-content shadow transition-all duration-300 hover:bg-primary-hover hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-base/30">
            {dict.nav.getStarted}
          </Link>
        } 
      />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 px-6 max-w-[90rem] mx-auto flex flex-col justify-center overflow-visible">
        {/* Animated Background blobs and grid */}
        <div className="absolute inset-0 z-0 bg-grid-pattern [mask-image:linear-gradient(to_bottom,white_40%,transparent_100%)]"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 dark:bg-blue-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 dark:bg-indigo-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob delay-200"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-300 dark:bg-sky-900/40 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-30 animate-blob delay-400"></div>
        
        <div className="flex flex-col items-center text-center z-10 space-y-10 w-full mt-16">
          <div className="scroll-reveal inline-flex items-center rounded-full border border-border-base bg-surface-base/70 px-4 py-1.5 text-sm font-medium text-content-base backdrop-blur-md shadow-sm transition-all hover:shadow-md hover:bg-surface-base cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            {dict.misc.welcome}
          </div>
          
          <div className="w-full flex justify-center scroll-reveal delay-100"><h1 className="text-[2rem] sm:text-4xl md:text-6xl lg:text-[6.5rem] font-bold tracking-tight leading-none text-content-base whitespace-nowrap drop-shadow-sm">
            <ScrambleHeadline key={locale} phrases={dict.hero.headlines} />
          </h1></div>
          <p className="text-xl md:text-2xl text-content-subtle font-medium max-w-2xl leading-relaxed scroll-reveal delay-200">
            {dict.hero.subcopy}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto scroll-reveal delay-300">
            <Link href={dict.hero.primaryCta.href} className="inline-flex h-14 items-center justify-center rounded-full bg-blue-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/30">
              {dict.hero.primaryCta.label}
            </Link>
            <Link href={dict.hero.secondaryCta.href} className="inline-flex h-14 items-center justify-center rounded-full border border-border-base bg-surface-base/80 backdrop-blur-sm px-8 text-base font-semibold text-content-base shadow-sm transition-all hover:bg-surface-muted hover:-translate-y-1 hover:shadow-md">
              {dict.hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Solutions Section */}
      <section id="discover" className="py-32 px-6 max-w-[90rem] mx-auto relative bg-surface-muted/50 rounded-[3rem] my-20">
        <div className="mb-20 flex flex-col items-center text-center space-y-6 scroll-reveal">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-content-base">{dict.misc.featuresTitle}</h2>
          <p className="text-xl text-content-subtle font-medium max-w-2xl">{dict.misc.featuresSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {dict.features.map((feature, idx) => (
            <Card key={feature.id} id={feature.id} className={`scroll-reveal delay-${(idx % 3) * 100} h-full border-border-muted shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-surface-base/90 backdrop-blur-sm group`}>
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 flex items-center justify-center mb-6 shadow-inner transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110">
                  {/* Icon wrapper */}
                  <div>
                    {idx === 0 && (
                      <div className="relative w-9 h-9 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 drop-shadow-sm animate-lively-explore" stroke="currentColor">
                          <title>{feature.title}</title>
                          <circle cx="12" cy="12" r="10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-80 fill-blue-600/10 group-hover:fill-white/10 transition-colors duration-500" />
                          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="fill-white group-hover:fill-blue-600 transition-colors duration-500" />
                          <circle cx="12" cy="12" r="1" fill="currentColor" />
                        </svg>
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="relative w-9 h-9 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 drop-shadow-sm animate-lively-team" strokeWidth="2" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                          <title>{feature.title}</title>
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" className="fill-blue-600/10 group-hover:fill-white/10 transition-colors duration-500" />
                          <path d="M22 21v-2a4 4 0 0 0-3-3.87" className="opacity-60" />
                          <path d="M16 3.13a4 4 0 0 1 0 7.75" className="opacity-60" />
                        </svg>
                      </div>
                    )}
                    {idx === 2 && (
                      <div className="relative w-9 h-9 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 drop-shadow-sm animate-lively-rank" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <title>{feature.title}</title>
                          <path d="M8 21h8" />
                          <path d="M12 17v4" />
                          <path d="M7 4h10" />
                          <path d="M17 4v8a5 5 0 0 1-10 0V4" className="fill-blue-600/10 group-hover:fill-white/10 transition-colors duration-500"/>
                          <path d="M4 4h3v5H4z" className="opacity-60"/>
                          <path d="M17 4h3v5h-3z" className="opacity-60"/>
                        </svg>
                      </div>
                    )}
                    {idx > 2 && (
                      <div className="relative w-9 h-9 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 drop-shadow-sm animate-lively-host" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <title>{feature.title}</title>
                          <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" className="opacity-60" />
                          <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" className="fill-blue-600/10 group-hover:fill-white/10 transition-colors duration-500" />
                          <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" className="opacity-60" />
                          <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" className="opacity-60" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>
                <CardTitle className="text-2xl transition-colors group-hover:text-blue-700">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-content-subtle text-lg mb-8 flex-1 leading-relaxed transition-colors group-hover:text-content-muted">
                  {feature.description}
                </p>
                {feature.id in landingRouteMap ? (
                   <Link
                     href={landingRouteMap[feature.id as keyof typeof landingRouteMap]}
                     className="inline-flex items-center text-blue-600 font-semibold text-lg hover:text-blue-800 transition-colors group/link"
                   >
                     {dict.misc.learnMore}
                     <span className="ml-2 transition-transform duration-300 group-hover/link:translate-x-2">→</span>
                   </Link>
                 ) : (
                   <div className="inline-flex items-center text-content-subtle font-semibold text-lg cursor-not-allowed">
                     {dict.misc.learnMore}
                     <span className="ml-2">→</span>
                   </div>
                 )}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Rankings Preview Section */}
      <section id="rankings" className="py-32 px-6 max-w-[90rem] mx-auto relative mb-20">
        <div className="flex flex-col xl:flex-row gap-16 items-center">
          <div className="xl:w-1/3 space-y-8 scroll-reveal">
            <div className="inline-flex items-center rounded-full bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-300 shadow-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {dict.misc.rankingsBadge}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-content-base leading-tight">{dict.misc.rankingsTitle}</h2>
            <p className="text-xl text-content-subtle leading-relaxed">{dict.misc.rankingsDesc}</p>
            <Link href={landingRouteMap.rankings} className="mt-4 inline-flex h-14 items-center justify-center rounded-full bg-primary-base px-8 text-base font-semibold text-primary-content shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-1 hover:bg-primary-hover hover:shadow-xl">
              {dict.misc.viewFull}
            </Link>
          </div>
          
          <div className="xl:w-2/3 w-full scroll-reveal delay-200">
            <div className="rounded-3xl border border-border-base bg-surface-base shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-border-muted bg-surface-muted/80 backdrop-blur-sm text-content-subtle font-semibold text-sm uppercase tracking-wider">
                      <th className="p-6 font-medium">{dict.misc.tableRank}</th>
                      <th className="p-6 font-medium">{dict.misc.tableTeam}</th>
                      <th className="p-6 font-medium">{dict.misc.tableScore}</th>
                      <th className="p-6 font-medium">{dict.misc.tableStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dict.rankingsPreview.map((row, idx) => (
                      <tr key={row.team} className={`group cursor-pointer transition-colors duration-300 hover:bg-surface-muted ${idx !== dict.rankingsPreview.length - 1 ? 'border-b border-border-muted' : ''}`}>
                        <td className="p-6 text-xl">
                          {idx === 0 ? <span className="animate-pulse">🏆</span> : idx === 1 ? '🥈' : idx === 2 ? '🥉' : <span className="text-content-muted font-semibold">#{row.rank}</span>}
                        </td>
                        <td className="p-6 text-content-base font-bold text-lg group-hover:text-blue-600 transition-colors">{row.team}</td>
                        <td className="p-6 font-mono text-content-muted font-medium">{row.score.toLocaleString(languageTag)}</td>
                        <td className="p-6">
                          <span className="inline-flex items-center rounded-full bg-green-50 dark:bg-green-900/30 px-3 py-1 text-sm font-medium text-green-700 dark:text-green-300 ring-1 ring-inset ring-green-600/20 dark:ring-green-800/50">
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

      {/* Footer */}
      <footer className="py-32 px-6 bg-slate-950 text-white/70 relative rounded-t-[3rem] overflow-hidden mt-20">
        {/* Glow effect on footer */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-600 opacity-[0.05] filter blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.05),transparent_50%)]"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto space-y-12 text-center mb-24 scroll-reveal">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-white leading-tight">
            {dict.footer.headline}
          </h2>
          <div className="flex justify-center pt-8">
             <Link href={dict.footer.cta.href} className="inline-flex h-16 items-center justify-center rounded-full bg-blue-600 px-10 text-lg font-semibold text-white shadow-[0_0_40px_-10px_rgba(37,99,235,0.5)] transition-all duration-300 hover:bg-blue-500 hover:-translate-y-2 hover:shadow-[0_0_60px_-15px_rgba(37,99,235,0.7)] hover:scale-105">
               {dict.footer.cta.label}
             </Link>
          </div>
        </div>
        
        <div className="relative z-10 text-white/60 text-sm flex flex-col md:flex-row items-center justify-between max-w-[90rem] mx-auto border-t border-white/10 pt-10 mt-10 scroll-reveal delay-200">
          <p>© {new Date().getFullYear()} {dict.misc.rights}</p>
          <div className="flex gap-8 mt-6 md:mt-0 font-medium">
            <Link href={landingRouteMap.discover} className="transition-all hover:text-white hover:-translate-y-0.5">{dict.nav.discover}</Link>
            <Link href={landingRouteMap.team} className="transition-all hover:text-white hover:-translate-y-0.5">{dict.nav.teams}</Link>
            <Link href={landingRouteMap.rankings} className="transition-all hover:text-white hover:-translate-y-0.5">{dict.nav.rankings}</Link>
          </div>
        </div>
      </footer>
    </DepthScene>
  );
}
