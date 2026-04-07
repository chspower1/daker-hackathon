import { SlideShell } from '../components/SlideShell';
import screenLanding from '../assets/screen-landing.png';
import screenHackathons from '../assets/screen-hackathons.png';
import screenCamp from '../assets/screen-camp.png';
import screenRankings from '../assets/screen-rankings.png';

export function Slide03() {
  return (
    <SlideShell title="실제 제품 화면" subtitle="직접 구현 및 캡처된 4가지 핵심 뷰 (랜딩, 탐색, 팀 구성, 글로벌 랭킹)" step="02 / 화면 구성">
      <div className="grid grid-cols-4 gap-6 h-[480px]">
        {[
          { title: '랜딩', path: '/', img: screenLanding, desc: '핵심 기능과 제품 화면 안내' },
          { title: '탐색 및 상세', path: '/hackathons', img: screenHackathons, desc: '필터링, 리더보드 등 통합뷰', active: true },
          { title: '팀 구성', path: '/camp', img: screenCamp, desc: '로컬 스토리지 기반 모집글' },
          { title: '공개 결과', path: '/rankings', img: screenRankings, desc: '스토리지 기반 글로벌 랭킹' },
        ].map((item) => (
          <div key={item.title} className={`glass-panel rounded-3xl p-3 premium-shadow flex flex-col group ${item.active ? 'border-slate-300 bg-white/60' : ''}`}>
            <div className={`text-xs font-mono tracking-[0.16em] mb-3 px-3 pt-3 ${item.active ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
              {item.path}
            </div>
            <div className="relative flex-1 rounded-2xl overflow-hidden border border-slate-200/60 bg-slate-50">
              <img src={item.img} alt={item.title} className="absolute top-0 left-0 w-full object-cover transition-transform duration-[3s] group-hover:translate-y-[-20%]" />
            </div>
            <div className="px-3 py-5">
              <h3 className={`text-lg font-bold tracking-tight ${item.active ? 'text-slate-900' : 'text-slate-800'}`}>{item.title}</h3>
              <p className="mt-2 text-sm text-slate-500 font-light line-clamp-2">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
