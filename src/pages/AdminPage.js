import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const imgLogo = "/logo.svg";
const imgIconExpand = "/icons/icon-expand.svg";
const imgIconAudio = "/icons/icon-audio.svg";
const imgIconPlay = "/icons/btn-play.svg";
const imgIconSiren = "/icons/btn-siren.svg";
const imgIconLog = "/icons/icon-log.svg";
const imgNavMonitor = "/icons/nav-monitor.svg";
const imgNavActivity = "/icons/nav-activity.svg";
const imgNavDog = "/icons/nav-dog.svg";
const imgNavAttend = "/icons/nav-attend.svg";
const imgNavSettings = "/icons/nav-settings.svg";
const imgIconBell = "/icons/icon-bell.svg";
const imgIconGear = "/icons/icon-gear.svg";

const logItems = [
  { time: '13:42', event: '놀이방 흥분 감지', action: '클래식 자동 재생 완료', color: '#abc7ff', bg: 'rgba(123,167,245,0.2)', border: 'rgba(171,199,255,0.3)', dot: '#abc7ff' },
  { time: '11:15', event: '비정상 활동 감지', action: '관리자 알림 전송', color: '#ffb4ab', bg: 'rgba(147,0,10,0.2)', border: 'rgba(255,180,171,0.3)', dot: '#ffb4ab' },
  { time: '09:30', event: '오전 활동 모니터링 시작', action: '시스템 정상', color: '#c3c6d2', bg: '#1e1f25', border: 'rgba(66,71,81,0.3)', dot: '#424751' },
  { time: '09:00', event: '카메라 피드 연결 완료', action: null, color: '#c3c6d2', bg: null, border: null, dot: '#424751' },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [time, setTime] = useState('');

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ko-KR', { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col"
      style={{ background: 'linear-gradient(90deg, #0d0f14 0%, #0d0f14 100%)' }}>

      {/* TopAppBar */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-10 border-b z-10"
        style={{ background: 'rgba(17,19,24,0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(66,71,81,0.3)' }}>
        {/* 로고 */}
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-md overflow-hidden relative bg-[#111318]">
            <img src={imgLogo} alt="logo" className="absolute inset-0 w-full h-full object-contain" />
          </div>
          <span className="text-[#abc7ff] text-xl font-semibold">멍니터링</span>
        </div>
        {/* 상태 + 시계 + 아이콘 */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{ background: '#282a2f', borderColor: 'rgba(66,71,81,0.5)' }}>
            <div className="w-2.5 h-2.5 rounded-full bg-[#4ade80]" />
            <span className="text-[#c3c6d2] text-xs tracking-wide">AI 모니터링 상태 원할</span>
          </div>
          <span className="text-[#e2e2e9] text-2xl tracking-widest">{time}</span>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <img src={imgIconBell} alt="bell" className="w-4 h-5 object-contain" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <img src={imgIconGear} alt="settings" className="w-5 h-5 object-contain" />
            </button>
            <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-white/10 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c3c6d2" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="flex h-full pt-16">
        {/* 사이드바 */}
        <div className="w-64 h-full flex flex-col justify-between py-4 px-4 border-r flex-shrink-0"
          style={{ background: '#1a1b21', borderColor: 'rgba(66,71,81,0.2)' }}>
          {/* 유치원 정보 */}
          <div>
            <div className="px-4 py-4 mb-2">
              <div className="text-[#abc7ff] text-xl font-normal mb-1">PPCF 애견유치원</div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#abc7ff]" />
                <span className="text-[#c3c6d2] text-sm">AI 모니터링 활성화 중</span>
              </div>
            </div>
            {/* 네비게이션 */}
            <nav className="flex flex-col gap-2">
              {[
                { icon: imgNavMonitor, label: '실시간 모니터링', active: true },
                { icon: imgNavActivity, label: '활동 기록', active: false },
                { icon: imgNavDog, label: '강아지 관리', active: false },
                { icon: imgNavAttend, label: '등하원 현황', active: false },
              ].map(({ icon, label, active }) => (
                <button key={label}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors"
                  style={{ background: active ? '#284a79' : 'transparent' }}>
                  <img src={icon} alt={label} className="w-5 h-4 object-contain" />
                  <span className="text-xs tracking-wide" style={{ color: active ? '#9abaf0' : '#c3c6d2' }}>{label}</span>
                </button>
              ))}
            </nav>
          </div>
          {/* 하단 설정 */}
          <div className="border-t pt-4" style={{ borderColor: 'rgba(66,71,81,0.2)' }}>
            <button className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left hover:bg-white/5 transition-colors">
              <img src={imgNavSettings} alt="설정" className="w-5 h-5 object-contain" />
              <span className="text-[#c3c6d2] text-xs tracking-wide">설정</span>
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex gap-6 p-6 overflow-hidden">
          {/* 영상 영역 (75%) */}
          <div className="flex-1 relative rounded-xl overflow-hidden border"
            style={{ background: '#1e2a44', borderColor: 'rgba(123,167,245,0.1)', boxShadow: '0 0 15px rgba(123,167,245,0.2)' }}>
            {/* 영상 */}
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src="/관리자영상.mov"
              autoPlay
              loop
              muted
              playsInline
            />
            {/* 상단 오버레이 */}
            <div className="absolute top-0 left-0 right-0 h-16 z-10 flex items-center justify-between px-4"
              style={{ background: 'linear-gradient(to bottom, rgba(17,19,24,0.8), rgba(17,19,24,0))' }}>
              <div className="flex items-center gap-2">
                <img src={imgNavMonitor} alt="" className="w-5 h-4 object-contain" />
                <span className="text-[#e2e2e9] text-xl font-bold">놀이방 모니터링</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border"
                style={{ background: 'rgba(51,53,58,0.8)', backdropFilter: 'blur(6px)', borderColor: 'rgba(66,71,81,0.3)' }}>
                <div className="w-3 h-3 rounded-full bg-[#4ade80]" />
                <span className="text-[#4ade80] text-xs tracking-wide">평온</span>
              </div>
            </div>
            {/* 하단 오버레이 */}
            <div className="absolute bottom-0 left-0 right-0 h-14 z-10 flex items-center justify-between px-4"
              style={{ background: 'linear-gradient(to top, rgba(17,19,24,0.9), rgba(17,19,24,0))' }}>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-[#e2e2e9] text-xs tracking-wide hover:bg-white/10 transition-colors"
                  style={{ background: 'rgba(30,31,37,0.5)', borderColor: 'rgba(66,71,81,0.3)' }}>
                  <img src={imgIconExpand} alt="" className="w-3 h-3 object-contain" />
                  확대
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded border text-[#e2e2e9] text-xs tracking-wide hover:bg-white/10 transition-colors"
                  style={{ background: 'rgba(30,31,37,0.5)', borderColor: 'rgba(66,71,81,0.3)' }}>
                  <img src={imgIconAudio} alt="" className="w-2.5 h-3 object-contain" />
                  오디오 켜기
                </button>
              </div>
              <span className="text-[#c3c6d2] text-xs tracking-wide">CAM 01 - MAIN PLAYROOM</span>
            </div>
          </div>

          {/* 우측 패널 (25%) */}
          <div className="w-60 flex flex-col gap-6 flex-shrink-0">
            {/* 빠른 제어 */}
            <div className="rounded-xl border p-6 flex flex-col gap-4"
              style={{ background: '#1e2a44', borderColor: 'rgba(123,167,245,0.1)' }}>
              <span className="text-[#c3c6d2] text-xs tracking-wide">빠른 제어</span>
              <button className="w-full h-14 rounded-lg flex items-center justify-center gap-3 font-medium text-[#002f65] hover:opacity-90 transition-opacity"
                style={{ background: '#7ba7f5', boxShadow: '0 4px 7px rgba(123,167,245,0.39)' }}>
                <img src={imgIconPlay} alt="" className="w-3 h-4.5 object-contain" />
                놀이방 클래식 재생
              </button>
              <button className="w-full h-14 rounded-lg flex items-center justify-center gap-3 font-medium text-[#690005] hover:opacity-90 transition-opacity"
                style={{ background: '#ffb4ab', boxShadow: '0 4px 7px rgba(255,180,171,0.39)' }}>
                <img src={imgIconSiren} alt="" className="w-5 h-4 object-contain" />
                놀이방 사이렌 송출
              </button>
            </div>

            {/* 자동 개입 기록 */}
            <div className="flex-1 rounded-xl border overflow-hidden flex flex-col min-h-0"
              style={{ background: '#1e2a44', borderColor: 'rgba(123,167,245,0.1)' }}>
              {/* 헤더 */}
              <div className="flex items-center gap-2 px-4 py-4 border-b flex-shrink-0"
                style={{ background: 'rgba(40,42,47,0.5)', borderColor: 'rgba(66,71,81,0.2)' }}>
                <img src={imgIconLog} alt="" className="w-3 h-3 object-contain" />
                <span className="text-[#e2e2e9] text-sm">오늘의 자동 개입 기록</span>
              </div>
              {/* 로그 리스트 */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 min-h-0">
                {logItems.map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="flex flex-col items-center relative pt-1.5">
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.dot }} />
                      {i < logItems.length - 1 && (
                        <div className="w-px flex-1 mt-1 absolute top-4 left-1/2 -translate-x-1/2 bottom-0"
                          style={{ background: 'rgba(66,71,81,0.3)', minHeight: '60px' }} />
                      )}
                    </div>
                    <div className="flex flex-col gap-1 pb-4">
                      <span className="text-xs" style={{ color: item.color }}>{item.time}</span>
                      <span className="text-sm text-[#e2e2e9]">{item.event}</span>
                      {item.action && (
                        <span className="text-xs px-2 py-0.5 rounded inline-block border"
                          style={{ color: item.color, background: item.bg, borderColor: item.border }}>
                          {item.action}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
