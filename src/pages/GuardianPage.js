import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const timelineItems = [
  {
    emoji: '🥣',
    time: '12:30 PM',
    title: '점심 식사',
    details: ['건식 사료 150g(완식)', '오메가3 급여 완료'],
    hasLine: true,
  },
  {
    emoji: '💤',
    time: '14:00 PM',
    title: '꿀잠 (2시간)',
    details: [],
    hasLine: true,
  },
  {
    emoji: '🎾',
    time: '16:30 PM',
    title: '야외 놀이',
    details: [],
    hasLine: false,
  },
];

export default function GuardianPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

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
    <div className="min-h-screen bg-white flex flex-col items-center">
      {/* 모바일 컨테이너 */}
      <div className="w-full max-w-[390px] flex flex-col min-h-screen relative bg-white">

        {/* 헤더 */}
        <div className="flex-shrink-0 flex items-center justify-between px-5 py-4 bg-white">
          <button onClick={() => navigate('/')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <img src="/icons/icon-back.svg" alt="back" className="w-4 h-4 object-contain" />
          </button>
          <div className="flex items-center justify-center">
            <img src="/logo.svg" alt="멍니터링" className="w-9 h-9 object-contain" />
          </div>
          <div className="w-10 h-10 rounded-full overflow-hidden bg-[#e1e8ff] flex-shrink-0">
            <img src="/profile.jpg" alt="profile" className="w-full h-full object-cover" />
          </div>
        </div>

        {/* 스크롤 가능한 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col gap-8 px-5 pb-32 overflow-y-auto">

          {/* 섹션 1: 영상 카드 */}
          <div className="flex flex-col gap-4">
            <div className="relative rounded-[32px] overflow-hidden h-[228px] bg-gray-200 cursor-pointer"
              onClick={togglePlay}>
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                src="/guardian-video.mp4"
                loop
                playsInline
              />
              {/* 재생 버튼 */}
              {!playing && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(2px)' }}>
                    <img src="/icons/icon-play-g.svg" alt="play" className="w-5 h-6 object-contain ml-1" />
                  </div>
                </div>
              )}
            </div>
            <p className="px-2 text-[#424751] text-base leading-6 tracking-tight">
              <span>✨ </span>
              <span className="font-medium">봉지가 신나게 노는 모습을 숏클립으로 확인해 보세요!</span>
            </p>
          </div>

          {/* 섹션 2: 타임라인 */}
          <div className="flex flex-col gap-6 px-2">
            {timelineItems.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                {/* 아이콘 + 연결선 */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-base relative"
                    style={{ background: 'rgba(207,229,255,0.6)' }}>
                    <div className="absolute inset-0 rounded-full"
                      style={{ boxShadow: '0 4px 12px -4px rgba(30,42,68,0.08)' }} />
                    <span>{item.emoji}</span>
                  </div>
                  {item.hasLine && (
                    <div className="mt-2 w-0.5 h-12 bg-[#e1e8ff]" />
                  )}
                </div>
                {/* 텍스트 */}
                <div className="flex flex-col gap-1.5 pt-2.5">
                  <span className="text-[#737782] text-sm font-semibold tracking-wide">{item.time}</span>
                  <span className="text-[#1e2a44] text-base font-semibold">{item.title}</span>
                  {item.details.map((d, j) => (
                    <span key={j} className="text-[#424751] text-sm">{d}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 섹션 3: AI 리포트 카드 */}
          <div className="rounded-[32px] p-6 flex flex-col gap-3" style={{ background: '#cfe5ff' }}>
            <div className="flex items-center gap-2">
              <span className="text-base">🤖</span>
              <span className="text-[#1e2a44] text-base font-semibold tracking-tight">봉지의 하루 AI 리포트</span>
            </div>
            <p className="text-[#424751] text-base leading-[26px] tracking-tight">
              오늘은 활동량이 아주 많았습니다. 오후에 친구들과 장난치다 살짝 흥분하는 모습이 감지되었지만, 부드러운 클래식 음악을 듣고 금세 안정을 찾았습니다. 밥도 잘 먹고 낮잠도 잘 잤으며, 전반적으로 평온하고 건강한 하루를 보냈습니다.
            </p>
          </div>
        </div>

        {/* 스티키 하단 버튼 */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-8 pt-4"
          style={{ background: 'linear-gradient(to top, white 60%, rgba(255,255,255,0.9) 80%, transparent)' }}>
          <button className="w-full py-4 rounded-full text-white text-base font-semibold text-center transition-opacity hover:opacity-90"
            style={{ background: 'rgba(123,167,245,0.6)', boxShadow: '0 12px 32px -8px rgba(30,42,68,0.15)' }}>
            💬 담당 선생님과 1:1 채팅하기
          </button>
        </div>
      </div>
    </div>
  );
}
