import { SlideShell } from '../components/SlideShell';
import { DatabaseBackup, Globe, Moon, FileWarning, AlertTriangle, ListOrdered } from 'lucide-react';

export function Slide07() {
  return (
    <SlideShell title="주요 구현 기능" subtitle="시각적으로 명확한 6가지 핵심 프로토타입 기능" step="05 / 주요 기능">
      <div className="grid grid-cols-3 gap-6 h-[480px]">
        {[
          { 
            icon: DatabaseBackup, 
            color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
            title: '안전한 스토리지', 
            desc: '새로고침 후에도 시드 및 로컬 데이터 완전 복구' 
          },
          { 
            icon: Globe, 
            color: 'text-blue-600 bg-blue-50 border-blue-200',
            title: '쿠키 우선 i18n', 
            desc: '루트 레이아웃 사전 연결 및 메타데이터 동기화' 
          },
          { 
            icon: Moon, 
            color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
            title: '테마 지속성', 
            desc: '렌더링 전 테마 복구 및 로컬 스토리지 유지' 
          },
          { 
            icon: FileWarning, 
            color: 'text-amber-600 bg-amber-50 border-amber-200',
            title: '빈 상태 (Empty)', 
            desc: '정보가 없을 때 전체 다운 없이 리소스 없음 안내' 
          },
          { 
            icon: AlertTriangle, 
            color: 'text-red-600 bg-red-50 border-red-200',
            title: '에러 상태 (Error)', 
            desc: '목록뷰에서 로딩, 빈 화면, 스토리지 오류 명확히 구분' 
          },
          { 
            icon: ListOrdered, 
            color: 'text-sky-600 bg-sky-50 border-sky-200',
            title: '스크롤 및 갱신', 
            desc: '상세 TOC 스파이 및 포커스 기반 실시간 랭킹 갱신' 
          }
        ].map((feat) => (
          <div key={feat.title} className={`rounded-3xl border p-8 shadow-sm flex flex-col justify-center transition-all hover:shadow-xl hover:-translate-y-2 ${feat.color}`}>
            <feat.icon className="w-12 h-12 mb-6" strokeWidth={1.5} />
            <h3 className="text-2xl font-bold mb-3">{feat.title}</h3>
            <p className="text-base font-medium opacity-80 leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </SlideShell>
  );
}
