import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const imgLogo = "/logo.svg";
const imgProfile = "/profile.jpg";
const imgAiIcon = "/icons/icon-ai.svg";
const imgPlayIcon = "/icons/icon-play-t.svg";
const imgIconActivity = "/icons/nav-activity-g.svg";
const imgIconMeal = "/icons/icon-meal.svg";
const imgIconPlay2 = "/icons/icon-play-t.svg";
const imgIconSleep = "/icons/icon-sleep.svg";
const imgNavActivity = "/icons/nav-activity-g.svg";
const imgNavDog = "/icons/nav-dog-g.svg";
const imgNavAttend = "/icons/nav-attend-g.svg";
const imgNavSettings = "/icons/nav-settings-g.svg";
const imgChatIcon = "/icons/icon-chat.svg";
const imgDownload = "/icons/icon-download.svg";

const timelineItems = [
  {
    icon: imgIconMeal,
    title: '오전 식사',
    time: '09:00 AM',
    desc: ['건식 사료 150g 완식', '오메가3 급여 완료'],
    active: false,
  },
  {
    icon: imgIconPlay2,
    title: '오후 놀이 활동',
    time: '02:00 PM',
    desc: ['실내 놀이방에서 활발한 활동', '친하게 지낸 친구: 노을'],
    active: true,
  },
  {
    icon: imgIconSleep,
    title: '휴식 및 낮잠',
    time: '04:30 PM',
    desc: ['조용한 방에서 수면'],
    active: false,
  },
];

export default function GuardianPage() {
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'long',
  });

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
    <div className="w-screen h-screen overflow-hidden flex flex-col"
      style={{ background: '#111318' }}>

      {/* TopAppBar */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-10 border-b z-10"
        style={{ background: 'rgba(17,19,24,0.95)', backdropFilter: 'blur(12px)', borderColor: 'rgba(66,71,81,0.3)' }}>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-md overflow-hidden relative bg-[#111318]">
            <img src={imgLogo} alt="logo" className="absolute inset-0 w-full h-full object-contain" />
          </div>
          <span className="text-[#abc7ff] text-xl font-semibold">멍니터링</span>
        </div>
        <button onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-white/10 transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c3c6d2" strokeWidth="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </button>
      </div>

      <div className="flex h-full pt-16">
        {/* 사이드바 */}
        <div className="w-64 h-full flex flex-col justify-between py-4 px-4 border-r flex-shrink-0"
          style={{ background: '#1a1b21', borderColor: 'rgba(66,71,81,0.2)' }}>
          {/* 프로필 */}
          <div>
            <div className="flex items-center gap-4 px-2 py-4 border-b mb-3"
              style={{ borderColor: 'rgba(66,71,81,0.1)' }}>
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#7ba7f5] flex-shrink-0">
                <img src={imgProfile} alt="profile" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="text-[#e2e2e9] text-lg font-normal">봉지네</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#abc7ff]" />
                  <span className="text-[#c3c6d2] text-xs tracking-wide">AI 모니터링 중</span>
                </div>
              </div>
            </div>
            {/* 네비게이션 */}
            <nav className="flex flex-col gap-1">
              {[
                { icon: imgNavActivity, label: '활동 기록', active: true },
                { icon: imgNavDog, label: '강아지 관리', active: false },
                { icon: imgNavAttend, label: '등하원 현황', active: false },
                { icon: imgNavSettings, label: '설정', active: false },
              ].map(({ icon, label, active }) => (
                <button key={label}
                  className="flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors"
                  style={{ background: active ? '#284a79' : 'transparent' }}>
                  <img src={icon} alt={label} className="w-5 h-5 object-contain" />
                  <span className="text-base" style={{ color: active ? '#9abaf0' : '#c3c6d2' }}>{label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex-1 flex flex-col px-10 py-6 gap-4 overflow-y-auto min-h-0"
          style={{ background: '#111318' }}>
          {/* 헤더 */}
          <div className="flex items-end justify-between pb-3 border-b flex-shrink-0"
            style={{ borderColor: 'rgba(66,71,81,0.1)' }}>
            <div>
              <div className="text-[#abc7ff] text-xs font-semibold tracking-wide mb-2">{today}</div>
              <div className="text-[#e2e2e9] text-4xl font-bold">
                <span className="font-bold">봉지</span>
                <span className="font-medium text-3xl">의 일일 요약 리포트 🐾</span>
              </div>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:bg-white/5 transition-colors"
              style={{ borderColor: 'rgba(66,71,81,0.5)' }}>
              <img src={imgDownload} alt="" className="w-3 h-3 object-contain" />
              <span className="text-[#c3c6d2] text-sm font-semibold">리포트 다운로드</span>
            </button>
          </div>

          {/* 그리드 */}
          <div className="grid grid-cols-12 gap-6">
            {/* 왼쪽 8col */}
            <div className="col-span-8 flex flex-col gap-6">
              {/* 영상 카드 */}
              <div className="relative rounded-2xl overflow-hidden border cursor-pointer"
                style={{ background: '#1e1f25', borderColor: 'rgba(66,71,81,0.3)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)' }}
                onClick={togglePlay}>
                <video
                  ref={videoRef}
                  className="w-full aspect-video object-cover"
                  src="/guardian-video.mp4"
                  loop
                  playsInline
                />
                {/* 그라데이션 오버레이 */}
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(to top, rgba(17,19,24,0.8) 0%, rgba(17,19,24,0) 50%)' }} />
                {/* 재생 버튼 */}
                {!playing && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center border"
                      style={{ background: 'rgba(17,19,24,0.6)', backdropFilter: 'blur(6px)', borderColor: 'rgba(255,255,255,0.1)' }}>
                      <img src={imgPlayIcon} alt="play" className="w-6 h-6 object-contain ml-1" />
                    </div>
                  </div>
                )}
                {/* 메타데이터 */}
                <div className="absolute bottom-0 left-0 right-0 p-6 flex items-end justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[#abc7ff] text-xs px-2 py-1 rounded"
                        style={{ background: 'rgba(171,199,255,0.2)' }}>하이라이트</span>
                      <span className="text-[#c3c6d2] text-base">오후 2:30</span>
                    </div>
                    <div className="text-[#e2e2e9] text-2xl font-normal">오후 실내 놀이 시간</div>
                  </div>
                  <div className="px-3 py-1 rounded-full text-[#c3c6d2] text-base"
                    style={{ background: 'rgba(12,14,19,0.5)', backdropFilter: 'blur(2px)' }}>01:45</div>
                </div>
              </div>

              {/* AI 케어 요약 카드 */}
              <div className="relative rounded-2xl border p-8 overflow-hidden"
                style={{ background: '#282a2f', borderColor: 'rgba(66,71,81,0.2)' }}>
                <div className="absolute w-64 h-64 rounded-full pointer-events-none"
                  style={{ background: 'rgba(123,167,245,0.05)', filter: 'blur(32px)', right: '-80px', top: '-80px' }} />
                <div className="flex items-start gap-5 relative">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: '#284a79' }}>
                    <img src={imgAiIcon} alt="ai" className="w-6 h-5.5 object-contain" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-[#e2e2e9] text-2xl">AI 케어 종합 요약</span>
                      <span className="text-[#abc7ff] text-2xl px-2 py-0.5 rounded border"
                        style={{ background: 'rgba(171,199,255,0.05)', borderColor: 'rgba(171,199,255,0.3)' }}>
                        분석 완료
                      </span>
                    </div>
                    <p className="text-[#c3c6d2] text-lg leading-relaxed">
                      오늘 봉지는 전반적으로 아주 활기차고 긍정적인 하루를 보냈습니다.
                      오전 수면 시간에는 뒤척임 없이 약 10시간의 깊은 숙면을 취해{' '}
                      <span className="text-[#abc7ff] font-semibold">수면 지수 최고 등급</span>을 기록했습니다.
                      오후 놀이 시간에는 <span className="text-[#abc7ff] font-semibold">노을</span>이와 적극적으로 교류하며
                      평소보다 <span className="text-[#abc7ff] font-semibold">20% 증가한 활동량</span>을 보였습니다.
                      식사 또한 정해진 급여량을 남김없이 규칙적으로 섭취하여 건강 상태가 매우 양호한 것으로 분석됩니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 4col: 타임라인 */}
            <div className="col-span-4">
              <div className="rounded-2xl border h-full p-6 flex flex-col gap-6"
                style={{ background: '#1e1f25', borderColor: 'rgba(66,71,81,0.3)' }}>
                <div className="flex items-center justify-between">
                  <span className="text-[#e2e2e9] text-lg">오늘의 활동 타임라인</span>
                  <img src={imgIconActivity} alt="" className="w-1 h-4 object-contain opacity-60" />
                </div>
                <div className="flex flex-col gap-8 relative">
                  {/* 수직 라인 */}
                  <div className="absolute left-5 top-4 bottom-4 w-0.5"
                    style={{ background: 'rgba(66,71,81,0.2)' }} />
                  {timelineItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 z-10 border p-0.5 ${item.active ? 'drop-shadow-[0_0_7.5px_rgba(123,167,245,0.2)]' : ''}`}
                        style={{
                          background: item.active ? '#7ba7f5' : '#33353a',
                          borderColor: item.active ? 'rgba(171,199,255,0.3)' : 'rgba(66,71,81,0.5)',
                        }}>
                        <img src={item.icon} alt={item.title} className="w-4 h-5 object-contain" />
                      </div>
                      <div className="flex-1 pt-2">
                        <div className="flex items-baseline gap-3 mb-1">
                          <span className="text-base" style={{ color: item.active ? '#abc7ff' : '#e2e2e9' }}>{item.title}</span>
                          <span className="text-xs tracking-wide text-[#c3c6d2] font-semibold">{item.time}</span>
                        </div>
                        {item.desc.map((d, j) => (
                          <div key={j} className="text-sm text-[#c3c6d2]">{d}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA 버튼 */}
          <button className="mt-auto w-full h-24 rounded-2xl flex items-center justify-center gap-3 font-medium text-[#003b7b] text-lg hover:opacity-90 transition-opacity"
            style={{ background: '#7ba7f5', boxShadow: '0 4px 10px rgba(123,167,245,0.15)' }}>
            <img src={imgChatIcon} alt="" className="w-5 h-5 object-contain" />
            담당 선생님과 1:1 채팅하기
          </button>
        </div>
      </div>
    </div>
  );
}
