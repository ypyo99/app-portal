// Real-world sample teachers and interactive apps for Seongdong Welfare Center
export const INITIAL_TEACHERS = [
  {
    id: 't-1',
    name: '김미경',
    department: '노인복지과',
    bio: '어르신들의 활기찬 일상과 건강 관리를 돕는 스마트 앱을 만들고 있어요 🌿',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    icon_emoji: '👩‍🏫',
    specialty: '건강 체조 / 식단 알리미',
    color: '#ff6b4a',
    created_at: '2026-08-01T09:00:00Z',
  },
  {
    id: 't-2',
    name: '박지훈',
    department: '사회재활과',
    bio: '재미있고 뇌 건강에 도움되는 두뇌 훈련 게임 및 인지 케어 앱을 개발 중입니다 🧩',
    avatar_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=256&q=80',
    icon_emoji: '👨‍💻',
    specialty: '인지 훈련 / 두뇌 퀴즈',
    color: '#6366f1',
    created_at: '2026-08-03T10:30:00Z',
  },
  {
    id: 't-3',
    name: '이수진',
    department: '지역복지과',
    bio: '복지관 프로그램 참여자들을 위한 간편 출석과 스탬프 투어 앱을 연구합니다 ⭐',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    icon_emoji: '🎨',
    specialty: '스탬프북 / 출석 관리',
    color: '#10b981',
    created_at: '2026-08-05T14:15:00Z',
  },
  {
    id: 't-4',
    name: '정우성',
    department: '스마트복지팀',
    bio: '무장애 배리어프리 지도와 복지관 편의시설 스마트 길라잡이를 제작합니다 🗺️',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    icon_emoji: '🧭',
    specialty: '배리어프리 맵 / 이동 지원',
    color: '#06b6d4',
    created_at: '2026-08-07T11:00:00Z',
  },
  {
    id: 't-5',
    name: '최영희',
    department: '평생교육과',
    bio: '선생님들과 어르신들이 매일 마음을 나누는 행복 감사일기와 감정 다이어리입니다 💖',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    icon_emoji: '🌸',
    specialty: '감사 일기 / 힐링 음악',
    color: '#a855f7',
    created_at: '2026-08-10T16:20:00Z',
  },
];

export const INITIAL_APPS = [
  {
    id: 'app-1',
    teacher_id: 't-1',
    title: '어르신 30초 힐링 스트레칭 & 식단표',
    description: '복지관 어르신들과 매일 수업 전 가볍게 따라할 수 있는 부위별 스트레칭 타이머와 오늘의 건강 식단표 안내 앱입니다.',
    category: '건강/운동',
    icon_emoji: '🧘‍♂️',
    thumbnail_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=600&q=80',
    drive_file_url: 'https://drive.google.com/file/d/1A2B3C4D_sample_health_app/view?usp=sharing',
    app_type: 'html_code',
    view_count: 142,
    created_at: '2026-08-11T10:00:00Z',
    app_code: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>어르신 30초 힐링 스트레칭</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #fff5f5, #ffe3e3); color: #333; margin: 0; padding: 20px; text-align: center; }
    .card { background: white; border-radius: 24px; padding: 24px; box-shadow: 0 10px 25px rgba(255,107,74,0.15); max-width: 360px; margin: 0 auto; }
    h1 { color: #e03131; font-size: 1.4rem; margin-bottom: 8px; }
    .pose-img { font-size: 4.5rem; margin: 15px 0; animation: bounce 2s infinite ease-in-out; }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    .timer-circle { width: 130px; height: 130px; border-radius: 50%; border: 8px solid #ff8787; display: flex; align-items: center; justify-content: center; margin: 15px auto; font-size: 2.2rem; font-weight: bold; color: #c92a2a; background: #fff0f0; }
    .btn { background: #ff6b6b; color: white; border: none; padding: 14px 28px; border-radius: 50px; font-size: 1.1rem; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(255,107,107,0.4); transition: 0.2s; }
    .btn:active { transform: scale(0.95); }
    .step-desc { background: #f8f9fa; border-radius: 14px; padding: 12px; margin: 15px 0; font-size: 0.95rem; line-height: 1.5; color: #495057; font-weight: 500; }
    .tabs { display: flex; gap: 8px; justify-content: center; margin-bottom: 15px; }
    .tab { padding: 6px 14px; border-radius: 20px; background: #f1f3f5; font-size: 0.85rem; cursor: pointer; font-weight: 600; }
    .tab.active { background: #ff6b6b; color: white; }
  </style>
</head>
<body>
  <div class="card">
    <div class="tabs">
      <span class="tab active" onclick="setPose(0)">목/어깨</span>
      <span class="tab" onclick="setPose(1)">허리/등</span>
      <span class="tab" onclick="setPose(2)">손목/발목</span>
    </div>
    <h1 id="poseTitle">목 & 어깨 시원한 체조</h1>
    <div class="pose-img" id="poseEmoji">🙆‍♀️</div>
    <div class="step-desc" id="poseDesc">숨을 깊게 들이쉬며 고개를 좌우로 천천히 5초씩 기울여주세요.</div>
    <div class="timer-circle" id="timer">30</div>
    <button class="btn" id="startBtn" onclick="toggleTimer()">▶ 스트레칭 시작</button>
  </div>
  <script>
    const poses = [
      { title: '목 & 어깨 시원한 체조', emoji: '🙆‍♀️', desc: '숨을 깊게 들이쉬며 고개를 좌우로 천천히 5초씩 기울여주세요.' },
      { title: '허리 쭉 펴기 스트레칭', emoji: '🧘‍♂️', desc: '양손을 깍지 끼고 하늘 높이 기지개를 켜며 숨을 내쉽니다.' },
      { title: '손목 & 발목 털기 운동', emoji: '🏃‍♀️', desc: '의자에 편안히 앉아 손목과 발목을 둥글게 원을 그리며 돌립니다.' }
    ];
    let currentPose = 0;
    let timeLeft = 30;
    let timerInterval = null;

    function setPose(idx) {
      currentPose = idx;
      document.querySelectorAll('.tab').forEach((t, i) => t.className = i === idx ? 'tab active' : 'tab');
      document.getElementById('poseTitle').innerText = poses[idx].title;
      document.getElementById('poseEmoji').innerText = poses[idx].emoji;
      document.getElementById('poseDesc').innerText = poses[idx].desc;
      resetTimer();
    }

    function toggleTimer() {
      const btn = document.getElementById('startBtn');
      if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
        btn.innerText = '▶ 다시 시작';
        btn.style.background = '#ff6b6b';
      } else {
        btn.innerText = '⏸ 일시 정지';
        btn.style.background = '#fa5252';
        timerInterval = setInterval(() => {
          timeLeft--;
          document.getElementById('timer').innerText = timeLeft;
          if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            document.getElementById('timer').innerText = '🎉 완주!';
            btn.innerText = '✨ 참 잘하셨어요!';
            btn.style.background = '#20c997';
          }
        }, 1000);
      }
    }

    function resetTimer() {
      clearInterval(timerInterval);
      timerInterval = null;
      timeLeft = 30;
      document.getElementById('timer').innerText = '30';
      const btn = document.getElementById('startBtn');
      btn.innerText = '▶ 스트레칭 시작';
      btn.style.background = '#ff6b6b';
    }
  </script>
</body>
</html>`
  },
  {
    id: 'app-2',
    teacher_id: 't-2',
    title: '성동 두뇌 비타민! 카드 짝맞추기 챌린지',
    description: '복지관 어르신들의 기억력과 인지 기능을 즐겁게 훈련할 수 있는 동물 & 과일 카드 뒤집기 기억력 게임입니다.',
    category: '교육/게임',
    icon_emoji: '🧩',
    thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
    drive_file_url: 'https://drive.google.com/file/d/1B2C3D4E_sample_memory_game/view?usp=sharing',
    app_type: 'html_code',
    view_count: 289,
    created_at: '2026-08-12T14:30:00Z',
    app_code: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>두뇌 비타민 카드 맞추기</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #fff; margin: 0; padding: 16px; text-align: center; }
    h2 { margin: 4px 0 10px 0; color: #38bdf8; font-size: 1.3rem; }
    .score-board { display: flex; justify-content: space-around; background: #1e293b; padding: 10px; border-radius: 16px; margin-bottom: 16px; font-weight: 600; font-size: 0.95rem; border: 1px solid #334155; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; max-width: 340px; margin: 0 auto; }
    .card { background: #334155; height: 75px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 2rem; cursor: pointer; user-select: none; transition: transform 0.25s, background 0.3s; box-shadow: 0 4px 10px rgba(0,0,0,0.3); }
    .card.flipped { background: #4f46e5; transform: scale(1.05); }
    .card.matched { background: #10b981; animation: pulse 0.5s; cursor: default; }
    @keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.15); } 100% { transform: scale(1); } }
    .reset-btn { margin-top: 18px; background: #6366f1; color: white; border: none; padding: 10px 24px; border-radius: 30px; font-size: 1rem; font-weight: bold; cursor: pointer; }
  </style>
</head>
<body>
  <h2>🧠 두뇌 비타민 짝맞추기</h2>
  <div class="score-board">
    <div>시도: <span id="moves" style="color:#f59e0b">0</span>회</div>
    <div>성공: <span id="matches" style="color:#10b981">0</span> / 6</div>
  </div>
  <div class="grid" id="grid"></div>
  <button class="reset-btn" onclick="initGame()">🔄 다시 하기</button>

  <script>
    const emojis = ['🍎', '🍇', '🍓', '🐶', '🐱', '🐼'];
    let cards = [];
    let flipped = [];
    let moves = 0;
    let matchCount = 0;

    function initGame() {
      const grid = document.getElementById('grid');
      grid.innerHTML = '';
      moves = 0;
      matchCount = 0;
      flipped = [];
      document.getElementById('moves').innerText = '0';
      document.getElementById('matches').innerText = '0';

      const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
      deck.forEach((emoji, idx) => {
        const el = document.createElement('div');
        el.className = 'card';
        el.dataset.emoji = emoji;
        el.dataset.idx = idx;
        el.innerText = '❓';
        el.onclick = () => onCardClick(el, emoji);
        grid.appendChild(el);
      });
    }

    function onCardClick(card, emoji) {
      if (card.classList.contains('flipped') || card.classList.contains('matched') || flipped.length >= 2) return;
      
      card.classList.add('flipped');
      card.innerText = emoji;
      flipped.push(card);

      if (flipped.length === 2) {
        moves++;
        document.getElementById('moves').innerText = moves;
        const [c1, c2] = flipped;
        if (c1.dataset.emoji === c2.dataset.emoji) {
          c1.classList.add('matched');
          c2.classList.add('matched');
          matchCount++;
          document.getElementById('matches').innerText = matchCount;
          flipped = [];
          if (matchCount === emojis.length) {
            setTimeout(() => alert('🎉 대단해요! 모든 짝을 완벽히 맞추셨습니다!'), 300);
          }
        } else {
          setTimeout(() => {
            c1.classList.remove('flipped');
            c2.classList.remove('flipped');
            c1.innerText = '❓';
            c2.innerText = '❓';
            flipped = [];
          }, 800);
        }
      }
    }

    initGame();
  </script>
</body>
</html>`
  },
  {
    id: 'app-3',
    teacher_id: 't-3',
    title: '성동 복지 스탬프 투어 & 출석 수첩',
    description: '매일 복지관 강좌 및 자원봉사에 참여할 때마다 귀여운 도장을 쾅쾅 찍고 레벨업하는 스마트 출석 보드입니다.',
    category: '참여/출석',
    icon_emoji: '⭐',
    thumbnail_url: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=600&q=80',
    drive_file_url: 'https://drive.google.com/file/d/1C3D4E5F_sample_stamp_app/view?usp=sharing',
    app_type: 'html_code',
    view_count: 195,
    created_at: '2026-08-14T09:15:00Z',
    app_code: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>스마트 스탬프북</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fdfbf7; color: #2d3748; margin: 0; padding: 20px; text-align: center; }
    .card { background: white; border: 2px dashed #f6ad55; border-radius: 24px; padding: 20px; max-width: 350px; margin: 0 auto; box-shadow: 0 10px 25px rgba(246,173,85,0.2); }
    h2 { color: #dd6b20; margin-top: 0; }
    .stamp-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin: 20px 0; }
    .slot { width: 80px; height: 80px; border: 2px solid #edf2f7; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.8rem; background: #f7fafc; margin: 0 auto; cursor: pointer; transition: 0.2s; }
    .slot.stamped { background: #feebc8; border-color: #ed8936; animation: stampPop 0.3s ease-out; }
    @keyframes stampPop { 0% { transform: scale(0.5); } 80% { transform: scale(1.15); } 100% { transform: scale(1); } }
    .btn { background: #ed8936; color: white; border: none; padding: 12px 24px; border-radius: 30px; font-weight: bold; cursor: pointer; font-size: 1rem; }
    .status { margin-top: 14px; font-size: 0.95rem; color: #718096; }
  </style>
</head>
<body>
  <div class="card">
    <h2>💮 성동 스마트 스탬프</h2>
    <p style="font-size: 0.9rem; color: #718096; margin: 0;">오늘의 참여 도장을 찍어보세요!</p>
    <div class="stamp-grid" id="stampGrid"></div>
    <button class="btn" onclick="addStamp()">+ 오늘 출석 도장 쾅!</button>
    <div class="status" id="status">현재 <span id="count" style="color:#dd6b20; font-weight:bold;">0</span> / 6 개 모았어요!</div>
  </div>
  <script>
    let stamps = 0;
    const max = 6;
    const icons = ['🌟', '💖', '🍀', '🍎', '🌻', '👑'];

    function render() {
      const grid = document.getElementById('stampGrid');
      grid.innerHTML = '';
      for (let i = 0; i < max; i++) {
        const slot = document.createElement('div');
        slot.className = 'slot' + (i < stamps ? ' stamped' : '');
        slot.innerText = i < stamps ? icons[i] : (i + 1);
        grid.appendChild(slot);
      }
      document.getElementById('count').innerText = stamps;
    }

    function addStamp() {
      if (stamps < max) {
        stamps++;
        render();
        if (stamps === max) {
          setTimeout(() => alert('🎉 축하합니다! 스탬프를 모두 모아 복지관 칭찬 선물을 수령하실 수 있습니다!'), 300);
        }
      } else {
        stamps = 0;
        render();
      }
    }
    render();
  </script>
</body>
</html>`
  },
  {
    id: 'app-4',
    teacher_id: 't-4',
    title: '성동 휠체어 힐링 산책로 길라잡이',
    description: '성동구 일대 무장애 쉼터, 경사로, 휠체어 충전소 위치 및 계단 없는 안전 산책 코스를 한눈에 안내합니다.',
    category: '복지/지도',
    icon_emoji: '🧭',
    thumbnail_url: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80',
    drive_file_url: 'https://drive.google.com/file/d/1D4E5F6G_sample_wheelchair_guide/view?usp=sharing',
    app_type: 'html_code',
    view_count: 310,
    created_at: '2026-08-15T11:40:00Z',
    app_code: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>성동 휠체어 산책로</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; color: #f8fafc; margin: 0; padding: 16px; }
    .header { text-align: center; margin-bottom: 16px; }
    h2 { color: #38bdf8; margin: 0 0 6px 0; font-size: 1.3rem; }
    .route-card { background: #1e293b; border-radius: 16px; padding: 14px; margin-bottom: 12px; border: 1px solid #334155; display: flex; align-items: center; gap: 14px; cursor: pointer; transition: 0.2s; }
    .route-card:hover { border-color: #38bdf8; background: #24324a; }
    .icon { font-size: 2.2rem; background: #0f172a; border-radius: 12px; padding: 8px; }
    .title { font-weight: bold; font-size: 1.05rem; color: #f1f5f9; }
    .desc { font-size: 0.85rem; color: #94a3b8; margin-top: 4px; }
    .badge { display: inline-block; background: #0284c7; color: white; font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div class="header">
    <h2>🗺️ 성동 무장애 힐링 코스</h2>
    <div style="font-size: 0.85rem; color: #94a3b8;">턱 없는 안전 산책로 & 편의시설 가이드</div>
  </div>
  <div class="route-card" onclick="alert('📍 서울숲 무장애 산책로: 경사도 3도 이하 완만 코스, 급수대 및 전동휠체어 충전소 완비')">
    <div class="icon">🌳</div>
    <div>
      <span class="badge">추천 1코스</span>
      <div class="title">서울숲 바람의 언덕 무장애길</div>
      <div class="desc">전구간 평지 데크로드 (총 길이 1.2km)</div>
    </div>
  </div>
  <div class="route-card" onclick="alert('📍 응봉산 데크로드: 완만한 지그재그 데크, 장애인 화장실 인접')">
    <div class="icon">🌸</div>
    <div>
      <span class="badge" style="background:#10b981">추천 2코스</span>
      <div class="title">응봉산 힐링 전망 데크길</div>
      <div class="desc">야경 및 쉼터 벤치 완비 (총 800m)</div>
    </div>
  </div>
  <div class="route-card" onclick="alert('📍 중랑천 물소리길: 휠체어 우선 통행로, 비상벨 50m 간격 설치')">
    <div class="icon">🌊</div>
    <div>
      <span class="badge" style="background:#a855f7">추천 3코스</span>
      <div class="title">중랑천 송정제방 무장애길</div>
      <div class="desc">나무 그늘과 물소리가 함께하는 길 (2.0km)</div>
    </div>
  </div>
</body>
</html>`
  },
  {
    id: 'app-5',
    teacher_id: 't-5',
    title: '오늘의 감사 & 행복 한 줄 일기',
    description: '복지관에서 보낸 하루 중 감사한 순간을 기록하고 따뜻한 격려 명언을 전달받는 감성 힐링 다이어리 앱입니다.',
    category: '마음/힐링',
    icon_emoji: '💖',
    thumbnail_url: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?auto=format&fit=crop&w=600&q=80',
    drive_file_url: 'https://drive.google.com/file/d/1E5F6G7H_sample_gratitude_diary/view?usp=sharing',
    app_type: 'html_code',
    view_count: 220,
    created_at: '2026-08-16T08:20:00Z',
    app_code: `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>행복 한 줄 감사 일기</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #fdf2f8, #f5f3ff); color: #374151; margin: 0; padding: 20px; }
    .box { background: white; border-radius: 20px; padding: 22px; max-width: 360px; margin: 0 auto; box-shadow: 0 10px 25px rgba(236,72,153,0.12); }
    h2 { color: #db2777; margin-top: 0; text-align: center; font-size: 1.3rem; }
    .quote-box { background: #fdf2f8; border-left: 4px solid #ec4899; padding: 10px 14px; border-radius: 8px; font-style: italic; font-size: 0.9rem; color: #9d174d; margin-bottom: 16px; }
    textarea { width: 100%; height: 85px; border: 1px solid #fbcfe8; border-radius: 12px; padding: 10px; box-sizing: border-box; font-family: inherit; font-size: 0.95rem; outline: none; margin-bottom: 12px; }
    textarea:focus { border-color: #db2777; box-shadow: 0 0 0 2px rgba(219,39,119,0.2); }
    .btn { width: 100%; background: #db2777; color: white; border: none; padding: 12px; border-radius: 12px; font-size: 1rem; font-weight: bold; cursor: pointer; }
    .entries { margin-top: 16px; max-height: 180px; overflow-y: auto; }
    .entry-item { background: #f9fafb; border-radius: 10px; padding: 10px; margin-bottom: 8px; font-size: 0.9rem; border-left: 3px solid #ec4899; }
    .entry-time { font-size: 0.75rem; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="box">
    <h2>💖 오늘의 감사 일기</h2>
    <div class="quote-box">"작은 감사 하나가 마음에 따스한 봄빛을 선물합니다."</div>
    <textarea id="diaryInput" placeholder="오늘 복지관에서 기분 좋았던 순간이나 감사한 일을 적어보세요..."></textarea>
    <button class="btn" onclick="saveEntry()">💌 마음 남기기</button>
    <div class="entries" id="entriesList"></div>
  </div>
  <script>
    let list = [
      { text: "아침 프로그램에서 어르신이 활짝 웃으시며 건네주신 귤 하나에 마음이 따뜻해졌습니다.", time: "오늘 10:30" }
    ];
    function render() {
      const el = document.getElementById('entriesList');
      el.innerHTML = list.map(item => '<div class="entry-item">' + item.text + '<div class="entry-time">' + item.time + '</div></div>').join('');
    }
    function saveEntry() {
      const input = document.getElementById('diaryInput');
      if (!input.value.trim()) return;
      list.unshift({ text: input.value.trim(), time: "방금 전" });
      input.value = '';
      render();
    }
    render();
  </script>
</body>
</html>`
  }
];
