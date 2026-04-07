import { SlideShell } from '../components/SlideShell';
import screenLanding from '../assets/screen-landing.png';
import screenHackathons from '../assets/screen-hackathons.png';
import screenCamp from '../assets/screen-camp.png';
import screenRankings from '../assets/screen-rankings.png';

export function Slide03() {
  return (
    <SlideShell title="실제 제품 화면" subtitle="직접 구현 및 캡처된 4가지 핵심 뷰 (랜딩, 탐색, 팀 구성, 글로벌 랭킹)" step="02 / 화면 구성">
      <div className="grid grid-cols-4 gap-6 h-[480px]">
        <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-lg flex flex-col group">
          <div className="text-xs font-bold tracking-[0.16em] text-blue-600 mb-3 px-3 pt-3">/</div>
          <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-100">
            <img src={screenLanding} alt="Landing" className="absolute top-0 left-0 w-full object-cover transition-transform duration-[2s] group-hover:translate-y-[-20%]" />
          </div>
          <div className="px-3 py-4">
            <h3 className="text-xl font-bold">랜딩</h3>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">핵심 기능과 제품 화면 안내</p>
          </div>
        </div>

        <div className="rounded-3xl border border-blue-600 bg-blue-50/50 p-3 shadow-xl shadow-blue-600/10 flex flex-col group">
          <div className="text-xs font-bold tracking-[0.16em] text-blue-600 mb-3 px-3 pt-3">/hackathons</div>
          <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-100 shadow-inner">
            <img src={screenHackathons} alt="Hackathons" className="absolute top-0 left-0 w-full object-cover transition-transform duration-[2s] group-hover:translate-y-[-40%]" />
          </div>
          <div className="px-3 py-4">
            <h3 className="text-xl font-bold text-blue-950">탐색 및 상세</h3>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">필터링, 리더보드 등 통합뷰</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-lg flex flex-col group">
          <div className="text-xs font-bold tracking-[0.16em] text-slate-500 mb-3 px-3 pt-3">/camp</div>
          <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-100">
            <img src={screenCamp} alt="Camp" className="absolute top-0 left-0 w-full object-cover transition-transform duration-[2s] group-hover:translate-y-[-30%]" />
          </div>
          <div className="px-3 py-4">
            <h3 className="text-xl font-bold">팀 구성</h3>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">로컬 스토리지 기반 모집글</p>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-lg flex flex-col group">
          <div className="text-xs font-bold tracking-[0.16em] text-slate-500 mb-3 px-3 pt-3">/rankings</div>
          <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-100">
            <img src={screenRankings} alt="Rankings" className="absolute top-0 left-0 w-full object-cover transition-transform duration-[2s] group-hover:translate-y-[-30%]" />
          </div>
          <div className="px-3 py-4">
            <h3 className="text-xl font-bold">공개 결과</h3>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">스토리지 기반 글로벌 랭킹</p>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
