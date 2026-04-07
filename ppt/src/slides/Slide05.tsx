import { SlideShell } from '../components/SlideShell';
import { CheckCircle2 } from 'lucide-react';

export function Slide05() {
  return (
    <SlideShell title="주요 기능 검증" subtitle="프로토타입에서 무엇이 작동하나요?" step="04 / 주요 기능">
      <div className="grid grid-cols-2 gap-12 h-[500px]">
        <div className="flex flex-col gap-6">
          {[
            { title: '새로고침에 안전한 스토리지 초기화', desc: '공개 시드와 로컬 저장 데이터는 새로고침 후에도 안전하게 복구되어, 사용자가 처음부터 다시 시작할 필요가 없습니다.' },
            { title: '쿠키 우선 다국어(i18n) 및 메타데이터 동기화', desc: '루트 레이아웃에서 한국어 및 영어 사전이 연결되며, 클라이언트 화면에서 페이지 수준의 메타데이터가 동기화됩니다.' },
            { title: '테마 설정 유지', desc: '초기 테마는 렌더링 전 복구되며, 선택한 모드는 로컬 스토리지를 통해 영구적으로 유지됩니다.' }
          ].map((feat) => (
            <div key={feat.title} className="bg-white p-6 rounded-2xl border border-slate-200 flex gap-6 items-center shadow-sm">
              <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold">{feat.title}</h4>
                <p className="text-slate-600 mt-1">{feat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-3xl p-10 text-white relative overflow-hidden flex flex-col justify-center shadow-2xl">
          <div className="absolute inset-0 bg-blue-500/20 blur-3xl rounded-full" />
          <div className="relative z-10">
            <h4 className="text-2xl font-bold text-blue-400 mb-6">복구 가능한 UI 패턴</h4>
            <ul className="space-y-6">
              <li className="border-l-2 border-blue-500 pl-6">
                <p className="font-bold text-xl">해커톤 정보 없음 → 빈 상태(EmptyState)</p>
                <p className="text-slate-400 mt-2">전체 페이지가 다운되는 대신, 상세 화면은 유지되며 리소스가 없음을 안내합니다.</p>
              </li>
              <li className="border-l-2 border-slate-700 pl-6">
                <p className="font-bold text-xl">스토리지 오류 → 에러 상태(ErrorState)</p>
                <p className="text-slate-400 mt-2">목록 위주의 화면은 로딩, 빈 상태, 스토리지 사용 불가 상태를 명확히 구분하여 안전한 복구를 돕습니다.</p>
              </li>
              <li className="border-l-2 border-slate-700 pl-6">
                <p className="font-bold text-xl">스크롤 스파이 및 랭킹 갱신</p>
                <p className="text-slate-400 mt-2">상세 페이지 목차(TOC)는 스크롤 위치를 추적하며, 랭킹은 스토리지 및 포커스 기반 업데이트를 통해 갱신됩니다.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </SlideShell>
  );
}
