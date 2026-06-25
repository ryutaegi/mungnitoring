import { useNavigate } from 'react-router-dom';

const logoUrl = "/logo.svg";

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center"
      style={{ background: 'linear-gradient(135deg, #0d0f14 0%, #111318 50%, #1a1b21 100%)' }}>

      {/* 로고 + 브랜드 */}
      <div className="flex items-center gap-4 mb-16">
        <div className="bg-[#111318] rounded-lg p-1 overflow-hidden w-10 h-10 relative">
          <img src={logoUrl} alt="logo" className="absolute inset-0 w-full h-full object-contain" />
        </div>
        <span className="text-[#abc7ff] text-3xl font-semibold tracking-wide">멍니터링</span>
      </div>

      <h1 className="text-[#e2e2e9] text-4xl font-bold mb-3 text-center">
        PPCF 애견유치원
      </h1>
      <p className="text-[#c3c6d2] text-base mb-14 text-center tracking-wide">
        AI 기반 실시간 모니터링 시스템
      </p>

      {/* 입장 버튼 */}
      <div className="flex gap-6">
        <button
          onClick={() => navigate('/guardian')}
          className="flex flex-col items-center gap-4 bg-[#1e2a44] border border-[rgba(123,167,245,0.2)] rounded-2xl px-12 py-8 hover:bg-[#284a79] hover:border-[#7ba7f5] transition-all duration-200 cursor-pointer group"
        >
          <div className="w-16 h-16 bg-[#284a79] rounded-full flex items-center justify-center group-hover:bg-[#7ba7f5] transition-colors duration-200">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#abc7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="text-center">
            <div className="text-[#e2e2e9] text-xl font-semibold mb-1">보호자</div>
            <div className="text-[#c3c6d2] text-sm tracking-wide">일일 리포트 · 활동 기록</div>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin')}
          className="flex flex-col items-center gap-4 bg-[#1e2a44] border border-[rgba(123,167,245,0.2)] rounded-2xl px-12 py-8 hover:bg-[#284a79] hover:border-[#7ba7f5] transition-all duration-200 cursor-pointer group"
        >
          <div className="w-16 h-16 bg-[#284a79] rounded-full flex items-center justify-center group-hover:bg-[#7ba7f5] transition-colors duration-200">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#abc7ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2"/>
              <path d="M8 21h8M12 17v4"/>
              <circle cx="17" cy="8" r="2"/>
              <path d="M17 8v.01"/>
            </svg>
          </div>
          <div className="text-center">
            <div className="text-[#e2e2e9] text-xl font-semibold mb-1">관리자</div>
            <div className="text-[#c3c6d2] text-sm tracking-wide">실시간 모니터링 · 제어</div>
          </div>
        </button>
      </div>

      <div className="mt-16 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#4ade80]" />
        <span className="text-[#c3c6d2] text-sm tracking-wide">AI 모니터링 활성화 중</span>
      </div>
    </div>
  );
}
