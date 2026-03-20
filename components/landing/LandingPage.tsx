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
    elements.forEach((el) => observer.observe(el));

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
    <DepthScene className="bg-white text-slate-900 font-sans overflow-x-hidden selection:bg-blue-600 selection:text-white">
      <TopHeader 
        variant="landing" 
        rightSlot={
          <Link href={landingRouteMap.discover} className="inline-flex h-10 items-center justify-center rounded-full bg-slate-900 px-6 text-sm font-medium text-white shadow transition-all duration-300 hover:bg-blue-600 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950">
            {dict.nav.getStarted}
          </Link>
        } 
      />

      {/* Hero Section */}
      <section className="relative min-h-screen pt-32 pb-20 px-6 max-w-[90rem] mx-auto flex flex-col justify-center overflow-visible">
        {/* Animated Background blobs and grid */}
        <div className="absolute inset-0 z-0 bg-grid-slate-100 [mask-image:linear-gradient(to_bottom,white_40%,transparent_100%)]"></div>
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob delay-200"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-sky-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob delay-400"></div>
        
        <div className="flex flex-col items-center text-center z-10 space-y-10 w-full mt-16">
          <div className="scroll-reveal inline-flex items-center rounded-full border border-slate-200 bg-white/70 px-4 py-1.5 text-sm font-medium text-slate-800 backdrop-blur-md shadow-sm transition-all hover:shadow-md hover:bg-white cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2 animate-pulse"></span>
            {dict.misc.welcome}
          </div>
          
          <div className="w-full flex justify-center scroll-reveal delay-100"><h1 className="text-[2rem] sm:text-4xl md:text-6xl lg:text-[6.5rem] font-bold tracking-tight leading-none text-slate-950 whitespace-nowrap drop-shadow-sm">
            <ScrambleHeadline key={locale} phrases={dict.hero.headlines} />
          </h1></div>
          <p className="text-xl md:text-2xl text-slate-500 font-medium max-w-2xl leading-relaxed scroll-reveal delay-200">
            {dict.hero.subcopy}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4 w-full sm:w-auto scroll-reveal delay-300">
            <Link href={dict.hero.primaryCta.href} className="inline-flex h-14 items-center justify-center rounded-full bg-blue-600 px-8 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition-all hover:bg-blue-700 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-600/30">
              {dict.hero.primaryCta.label}
            </Link>
            <Link href={dict.hero.secondaryCta.href} className="inline-flex h-14 items-center justify-center rounded-full border border-slate-200 bg-white/80 backdrop-blur-sm px-8 text-base font-semibold text-slate-900 shadow-sm transition-all hover:bg-slate-50 hover:-translate-y-1 hover:shadow-md">
              {dict.hero.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>

      {/* Features/Solutions Section */}
      <section id="discover" className="py-32 px-6 max-w-[90rem] mx-auto relative bg-slate-50/50 rounded-[3rem] my-20">
        <div className="mb-20 flex flex-col items-center text-center space-y-6 scroll-reveal">
          <h2 className="text-5xl md:text-6xl font-bold tracking-tight text-slate-900">{dict.misc.featuresTitle}</h2>
          <p className="text-xl text-slate-500 font-medium max-w-2xl">{dict.misc.featuresSubtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
          {dict.features.map((feature, idx) => (
            <Card key={feature.id} id={feature.id} className={`scroll-reveal delay-${(idx % 3) * 100} h-full border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 bg-white/90 backdrop-blur-sm group`}>
              <CardHeader>
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-inner transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110">
                  {/* Animated float icon wrapper */}
                  <div className="animate-float">
                    {idx === 0 && (
                      <div className="relative w-9 h-9">
                        <svg className="absolute inset-0 w-full h-full opacity-30 transition-opacity duration-500" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <rect x="2" y="3" width="6" height="6" rx="1.5" strokeWidth="1.5" />
                          <rect x="16" y="3" width="6" height="6" rx="1.5" strokeWidth="1.5" />
                          <rect x="2" y="15" width="6" height="6" rx="1.5" strokeWidth="1.5" />
                          <circle cx="19" cy="18" r="2.5" strokeWidth="1.5" />
                          <path d="M10 6h4M10 18h4" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="2 3" />
                        </svg>
                        <div className="absolute inset-0 z-10 animate-search-loop origin-center flex items-center justify-center">
                          <div className="relative bg-white/30 backdrop-blur-[2px] rounded-full p-0.5 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                            <svg className="w-6 h-6 drop-shadow-sm" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 7.5a3.5 3.5 0 00-2.5 2.5" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    )}
                    {idx === 1 && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>}
                    {idx === 2 && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>}
                    {idx > 2 && <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
                <CardTitle className="text-2xl transition-colors group-hover:text-blue-700">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-slate-500 text-lg mb-8 flex-1 leading-relaxed transition-colors group-hover:text-slate-700">
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
                   <div className="inline-flex items-center text-slate-300 font-semibold text-lg cursor-not-allowed">
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
            <div className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 shadow-sm">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {dict.misc.rankingsBadge}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 leading-tight">{dict.misc.rankingsTitle}</h2>
            <p className="text-xl text-slate-500 leading-relaxed">Who is leading the charge this season? Discover the top teams reshaping the future.</p>
            <Link href={landingRouteMap.rankings} className="inline-flex h-14 items-center justify-center rounded-full bg-slate-900 px-8 text-base font-semibold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-blue-600 hover:-translate-y-1 hover:shadow-xl mt-4">
              {dict.misc.viewFull}
            </Link>
          </div>
          
          <div className="xl:w-2/3 w-full scroll-reveal delay-200">
            <div className="rounded-3xl border border-slate-200 bg-white shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/80 backdrop-blur-sm text-slate-500 font-semibold text-sm uppercase tracking-wider">
                      <th className="p-6 font-medium">{dict.misc.tableRank}</th>
                      <th className="p-6 font-medium">{dict.misc.tableTeam}</th>
                      <th className="p-6 font-medium">{dict.misc.tableScore}</th>
                      <th className="p-6 font-medium">{dict.misc.tableStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dict.rankingsPreview.map((row, idx) => (
                      <tr key={row.team} className={`group cursor-pointer transition-colors duration-300 hover:bg-slate-50 ${idx !== dict.rankingsPreview.length - 1 ? 'border-b border-slate-100' : ''}`}>
                        <td className="p-6 text-xl">
                          {idx === 0 ? <span className="animate-pulse">🏆</span> : idx === 1 ? '🥈' : idx === 2 ? '🥉' : <span className="text-slate-400 font-semibold">#{row.rank}</span>}
                        </td>
                        <td className="p-6 text-slate-900 font-bold text-lg group-hover:text-blue-600 transition-colors">{row.team}</td>
                        <td className="p-6 font-mono text-slate-700 font-medium">{row.score.toLocaleString(languageTag)}</td>
                        <td className="p-6">
                          <span className="inline-flex items-center rounded-full bg-green-50 px-3 py-1 text-sm font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
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
      <footer className="py-32 px-6 bg-slate-950 text-slate-300 relative rounded-t-[3rem] overflow-hidden mt-20">
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
        
        <div className="relative z-10 text-slate-400 text-sm flex flex-col md:flex-row items-center justify-between max-w-[90rem] mx-auto border-t border-slate-800/50 pt-10 mt-10 scroll-reveal delay-200">
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
