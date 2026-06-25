import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const logItems = [
  {
    time: '15:20',
    label: '평온 상태',
    sub: null,
    dotColor: '#31a24c',
    labelColor: '#191b23',
    gradient: false,
  },
  {
    time: '13:42',
    label: '흥분 감지',
    sub: '클래식 재생 완료',
    dotColor: '#f7b928',
    labelColor: null,
    gradient: true,
  },
  {
    time: '11:15',
    label: '모니터링 시작',
    sub: null,
    dotColor: '#31a24c',
    labelColor: '#5f5e5e',
    gradient: false,
  },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [time, setTime] = useState('');
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('ko-KR', { hour12: false }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex flex-col bg-white">

      {/* 탑 내비바 */}
      <div className="flex-shrink-0 h-16 flex items-center justify-between px-8 border-b"
        style={{ borderColor: 'rgba(195,198,210,0.3)', boxShadow: '0 1px 1px rgba(0,0,0,0.05)' }}>

        {/* 로고 */}
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="logo" className="w-8 h-8 object-contain" />
          <span className="text-[#4885ff] text-2xl font-semibold tracking-tight">멍니터링</span>
        </div>

        {/* 수평 내비 */}
        <nav className="flex items-center gap-6">
          <button className="relative text-[#4885ff] text-base font-bold pb-1 border-b-2 border-[#4885ff] break-keep">
            실시간 모니터링
          </button>
          <button className="text-[#424751] text-base font-medium hover:text-[#4885ff] transition-colors break-keep">활동 기록</button>
          <button className="text-[#424751] text-base font-medium hover:text-[#4885ff] transition-colors break-keep">강아지 관리</button>
          <button className="text-[#424751] text-base font-medium hover:text-[#4885ff] transition-colors break-keep">등하원 현황</button>
        </nav>

        {/* 우측 액션 */}
        <div className="flex items-center gap-4">
          <span className="text-[#424751] text-sm font-semibold tracking-wide">{time}</span>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
            style={{ background: 'rgba(215,227,255,0.3)', borderColor: 'rgba(5,69,141,0.1)' }}>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#059669]" />
            </span>
            <span className="text-[#31a24c] text-sm font-semibold tracking-wide break-keep">AI 모니터링 작동 중</span>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <img src="/icons/icon-bell-new.svg" alt="bell" className="w-4 h-5 object-contain" />
            </button>
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <img src="/icons/icon-gear-new.svg" alt="settings" className="w-5 h-5 object-contain" />
            </button>
            <button onClick={() => navigate('/')} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
              <img src="/icons/icon-logout.svg" alt="logout" className="w-5 h-5 object-contain" />
            </button>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex gap-8 px-12 py-12 overflow-hidden">

        {/* 좌측 85% - CCTV 영상 */}
        <div className="flex-1 relative rounded-[32px] overflow-hidden bg-gray-100 cursor-pointer"
          onClick={togglePlay}>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src="/admin-video.mov"
            loop
            playsInline
          />

          {/* 그리드 오버레이 */}
          <img src="/icons/monitor-grid.svg" alt=""
            className="absolute inset-0 w-full h-full object-cover pointer-events-none opacity-30" />

          {/* 평온 배지 */}
          <div className="absolute top-6 right-6 flex items-center gap-2 px-5 py-2.5 rounded-full border"
            style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(2px)', borderColor: '#f5f5f5', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <div className="w-3 h-3 rounded-full bg-[#31a24c]" />
            <span className="text-[#191b23] text-xl font-semibold">평온</span>
          </div>

          {/* 중앙 재생 버튼 */}
          {!playing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 rounded-full flex items-center justify-center border"
                style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(6px)', borderColor: 'rgba(255,255,255,0.2)' }}>
                <img src="/icons/icon-play-circle.svg" alt="play" className="w-8 h-10 object-contain ml-2" />
              </div>
            </div>
          )}
        </div>

        {/* 우측 컨트롤 & 로그 */}
        <div className="w-72 flex flex-col gap-8 flex-shrink-0">

          {/* 버튼 2개 */}
          <div className="flex flex-col gap-4">
            <button className="w-full flex items-center justify-center gap-3 py-4 rounded-full text-white text-base font-semibold transition-opacity hover:opacity-90"
              style={{ background: 'linear-gradient(to right, rgba(123,167,245,0.8), rgba(103,154,255,0.8))', border: '1px solid #f5f5f5' }}>
              <img src="/icons/icon-music.svg" alt="" className="w-3 h-4 object-contain" />
              클래식 재생
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-4 rounded-full text-[#191b23] text-base font-semibold border-2 border-[#e5e5e5] hover:bg-gray-50 transition-colors"
              style={{ background: 'rgba(255,255,255,0.8)' }}>
              <img src="/icons/icon-siren-new.svg" alt="" className="w-5 h-3.5 object-contain" />
              사이렌 송출
            </button>
          </div>

          {/* 이벤트 로그 */}
          <div className="flex-1 flex flex-col rounded-[24px] border border-[#e5e5e5] p-5 overflow-hidden"
            style={{ background: 'rgba(245,245,245,0.2)' }}>
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-[#e5e5e5]">
              <img src="/icons/icon-eventlog.svg" alt="" className="w-4 h-4 object-contain" />
              <span className="text-[#191b23] text-xl font-semibold">이벤트 로그</span>
            </div>

            <div className="flex-1 flex flex-col justify-end gap-10 overflow-hidden">
              {logItems.map((item, i) => (
                <div key={i} className="flex gap-3 items-start relative">
                  {/* 연결선 */}
                  {i < logItems.length - 1 && (
                    <div className="absolute left-[5px] top-4 bottom-[-40px] w-0.5 bg-[#e5e5e5]" />
                  )}
                  {/* 점 */}
                  <div className="flex-shrink-0 w-3 h-3 rounded-full border-2 border-[#f5f5f5] mt-1.5 relative z-10"
                    style={{ background: item.dotColor }} />
                  <div className="flex-1 flex flex-col gap-1">
                    <span className="text-[#5f5e5e] text-xs font-bold tracking-wider">{item.time}</span>
                    {item.sub ? (
                      <div className="bg-white border border-[#e5e5e5] rounded-xl p-3 shadow-sm flex flex-col gap-1">
                        <span className="text-sm font-semibold"
                          style={{ background: 'linear-gradient(to right, #ffc233, #ffb300)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                          {item.label}
                        </span>
                        <span className="text-[#1e2a44] text-xs font-medium">{item.sub}</span>
                      </div>
                    ) : item.labelColor === '#191b23' ? (
                      <div className="bg-white border border-[#e5e5e5] rounded-xl p-3 shadow-sm">
                        <span className="text-[#191b23] text-sm font-semibold break-keep">{item.label}</span>
                      </div>
                    ) : (
                      <span className="text-[#5f5e5e] text-sm font-semibold px-1 break-keep">{item.label}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
