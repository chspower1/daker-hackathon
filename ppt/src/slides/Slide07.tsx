import { SlideShell } from '../components/SlideShell';
import { DatabaseBackup, Globe, Moon, FileWarning, AlertTriangle, ListOrdered } from 'lucide-react';

export function Slide07() {
  return (
    <SlideShell title="주요 구현 기능" subtitle="시각적으로 명확한 6가지 핵심 프로토타입 기능" step="05 / 주요 기능">
      <div className="grid grid-cols-3 gap-6 h-[480px] mt-4">
        {[
          { icon: DatabaseBackup, title: '안전한 스토리지', desc: '새로고침 후에도 시드 및 로컬 데이터 완전 복구' },
          { icon: Globe, title: '쿠키 우선 i18n', desc: '루트 레이아웃 사전 연결 및 메타데이터 동기화' },
          { icon: Moon, title: '테마 지속성', desc: '렌더링 전 테마 복구 및 로컬 스토리지 유지' },
          { icon: FileWarning, title: '빈 상태 (Empty)', desc: '정보가 없을 때 전체 다운 없이 리소스 없음 안내' },
          { icon: AlertTriangle, title: '에러 상태 (Error)', desc: '목록뷰에서 로딩, 빈 화면, 스토리지 오류 명확히 구분' },
          { icon: ListOrdered, title: '스크롤 및 갱신', desc: '상세 TOC 스파이 및 포커스 기반 실시간 랭킹 갱신' }
        ].map((feat) => (
          <div key={feat.title} className="glass-panel rounded-3xl p-8 premium-shadow flex flex-col justify-center transition-all hover:-translate-y-1 duration-500">
            <div className="w-12 h-12 rounded-xl bg-slate-100/50 border border-slate-200/60 flex items-center justify-center text-slate-700 mb-6">
              <feat.icon className="w-6 h-6" strokeWidth={1.5} />
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900 tracking-tight">{feat.title}</h3>
            <p className="text-sm text-slate-500 font-light leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
