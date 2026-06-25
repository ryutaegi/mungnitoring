import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">

      {/* 로고 + 브랜드 */}
      <div className="flex items-center gap-3 mb-4">
        <img src="/logo.svg" alt="logo" className="w-10 h-10 object-contain" />
        <span className="text-[#4885ff] text-3xl font-semibold tracking-tight">멍니터링</span>
      </div>

      <h1 className="text-[#191b23] text-4xl font-bold mb-2 text-center break-keep">
        AI 기반 실시간 모니터링 시스템
      </h1>
      <p className="text-[#737782] text-base mb-16 text-center tracking-wide break-keep">
        {/* AI 기반 실시간 모니터링 시스템 */}
      </p>

      {/* 입장 카드 */}
      <div className="flex gap-5 w-full max-w-lg">
        <button
          onClick={() => navigate('/guardian')}
          className="flex-1 flex flex-col items-center gap-5 rounded-[32px] p-8 border border-[#e1e8ff] hover:border-[#4885ff] hover:shadow-lg transition-all duration-200 group"
          style={{ background: 'rgba(207,229,255,0.2)' }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ background: 'rgba(207,229,255,0.6)' }}>
            🐾
          </div>
          <div className="text-center">
            <div className="text-[#191b23] text-xl font-semibold mb-1">보호자</div>
            <div className="text-[#737782] text-sm break-keep">일일 리포트 · 활동 기록</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin')}
          className="flex-1 flex flex-col items-center gap-5 rounded-[32px] p-8 border border-[#e1e8ff] hover:border-[#4885ff] hover:shadow-lg transition-all duration-200 group"
          style={{ background: 'rgba(207,229,255,0.2)' }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl"
            style={{ background: 'rgba(207,229,255,0.6)' }}>
            📹
          </div>
          <div className="text-center">
            <div className="text-[#191b23] text-xl font-semibold mb-1">관리자</div>
            <div className="text-[#737782] text-sm break-keep">실시간 모니터링 · 제어</div>
          </div>
        </button>
      </div>

      {/* AI 상태 */}
      <div className="mt-14 flex items-center gap-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#059669]" />
        </span>
        <span className="text-[#737782] text-sm tracking-wide">AI 모니터링 활성화 중</span>
      </div>
    </div>
  );
}
