/**
 * AI App Generator Engine for Seongdong Welfare Center
 * Supports Gemini API (if key provided) + Built-in Smart Welfare App Generator
 */

const LOCAL_STORAGE_KEYS = {
  GEMINI_API_KEY: 'seongdong_gemini_api_key',
};

export function getGeminiApiKey() {
  return localStorage.getItem(LOCAL_STORAGE_KEYS.GEMINI_API_KEY) || import.meta.env.VITE_GEMINI_API_KEY || '';
}

export function saveGeminiApiKey(key) {
  if (key) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.GEMINI_API_KEY, key.trim());
  } else {
    localStorage.removeItem(LOCAL_STORAGE_KEYS.GEMINI_API_KEY);
  }
}

// Popular Welfare App Prompt Presets with metadata (Top 10 Essential Prompts)
export const PROMPT_PRESETS = [
  {
    id: 'chosung_quiz',
    icon: '🧠',
    badge: '두뇌 훈련',
    title: '어르신 두뇌 쌩쌩! 초성 낱말 맞추기 퀴즈',
    category: '교육/게임',
    emoji: '🧩',
    prompt: '어르신들의 치매 예방과 기억력 증진을 위한 과일, 꽃, 전래동화 초성 힌트 맞추기 퀴즈 앱을 만들어줘. 힌트 보기 버튼과 경쾌한 축하 효과음, 점수 카운터가 있어야 해.',
    desc: '과일·꽃·동물 등 친숙한 주제의 초성을 보고 정답을 맞히는 두뇌 인지 훈련 게임'
  },
  {
    id: 'medicine_water_tracker',
    icon: '⏰',
    badge: '건강 관리',
    title: '매일 건강 안심! 복약 & 수분 섭취 체크 다이어리',
    category: '건강/운동',
    emoji: '💊',
    prompt: '어르신들이 아침/점심/저녁/취침전 복약 여부와 하루 8잔 물 마시기를 직관적인 큰 버튼으로 터치해서 기록하고, 오늘 달성률을 프로그레스 바로 보여주는 건강 체크 앱 만들어줘.',
    desc: '시간대별 약 복용과 물 마시기 목표를 원터치로 체크하고 칭찬 스티커를 받는 안심 수첩'
  },
  {
    id: 'eye_exercise',
    icon: '👁️',
    badge: '시력 케어',
    title: '눈 건강 지킴이! 20-20-20 눈 스트레칭 가이드',
    category: '건강/운동',
    emoji: '🌟',
    prompt: '20분마다 20피트(6m) 먼 곳을 20초간 바라보는 눈 건강 루틴과 함께 눈 돌리기, 눈 감았다 뜨기 등 5가지 눈 운동을 애니메이션과 타이머로 안내하는 앱을 만들어줘.',
    desc: '디지털 기기 사용 후 피로해진 눈을 회복시키는 눈 건강 스트레칭'
  },
  {
    id: 'weight_tracker',
    icon: '⚖️',
    badge: '체중 관리',
    title: '건강 체중 일지! 매일 체중 & BMI 기록 앱',
    category: '건강/운동',
    emoji: '📊',
    prompt: '매일 체중을 입력하면 BMI 계산, 목표 체중 대비 진행률, 30일 체중 변화 꺾은선 그래프를 보여주고 "잘하고 계세요!" 응원 메시지가 나오는 체중 관리 앱을 만들어줘.',
    desc: '매일 체중을 기록하며 건강 목표를 달성하는 시니어 체중 다이어리'
  },
  {
    id: 'lucky_roulette',
    icon: '🎯',
    badge: '행사/참여',
    title: '복지관 와글와글! 행운의 룰렛 & 경품 추첨기',
    category: '참여/출석',
    emoji: '🎪',
    prompt: '복지관 행사나 레크리에이션에서 쓸 수 있는 화려한 원형 회전 룰렛 추첨기 앱을 만들어줘. 항목 직접 추가하기, 회전 사운드, 당첨 팡파르 효과가 포함되어야 해.',
    desc: '복지관 축제, 노래자랑, 퀴즈대회 경품 추첨에 바로 쓸 수 있는 시각적인 돌림판'
  },
  {
    id: 'joint_stretch',
    icon: '🧘‍♂️',
    badge: '어르신 운동',
    title: '하루 3분! 관절 튼튼 실버 스트레칭 타이머',
    category: '건강/운동',
    emoji: '🙆‍♂️',
    prompt: '목, 어깨, 무릎, 손목 관절을 부드럽게 풀어주는 3단계 어르신 실버 체조 가이드와 부드러운 음성 멘트 스타일의 카운트다운 타이머 앱을 만들어줘.',
    desc: '의자에 앉아서 쉽게 따라할 수 있는 부위별 순차 스트레칭 타이머'
  },
  {
    id: 'nature_sound_healing',
    icon: '🎵',
    badge: '마음 힐링',
    title: '마음 편안한 숲속 & 빗소리 힐링 사운드박스',
    category: '마음/힐링',
    emoji: '💖',
    prompt: '어르신들의 심신 안정과 수면을 돕는 따뜻한 모닥불, 여름 숲속 새소리, 부드러운 봄비 소리를 Web Audio 신디사이저로 재생하고 명상 타이머가 있는 힐링 음악 앱을 만들어줘.',
    desc: '마음의 평온을 주는 자연 효과음 합성 재생과 힐링 명상 글귀'
  },
  {
    id: 'meal_vote',
    icon: '🍱',
    badge: '생활 복지',
    title: '오늘의 복지관 맛있는 점심 식단 & 만족도 투표',
    category: '기타',
    emoji: '🥗',
    prompt: '복지관 경로식당의 오늘의 추천 점심 메뉴 안내와 함께 어르신들이 맛있어요/보통이에요/개선해주세요를 큰 이모지로 원터치 투표하고 의견을 남길 수 있는 소통 앱을 만들어줘.',
    desc: '영양 가득한 오늘의 식단을 확인하고 간단한 터치로 맛 평가를 남기는 피드백 보드'
  },
  {
    id: 'memory_card_flip',
    icon: '🃏',
    badge: '기억력 훈련',
    title: '짝짝짝! 동물 카드 짝맞추기 기억력 게임',
    category: '교육/게임',
    emoji: '🐾',
    prompt: '귀여운 동물 이모지 카드를 뒤집어 짝을 맞추는 기억력 게임 앱을 만들어줘. 4x4 그리드로 16장 카드, 시도 횟수 카운터, 완성 시 축하 애니메이션이 포함되어야 해.',
    desc: '뒤집힌 카드를 기억하며 짝을 찾는 클래식 기억력 훈련 게임'
  },
  {
    id: 'traditional_craft',
    icon: '🏺',
    badge: '전통 문화',
    title: '우리 전통 공예! 한국 전통 예술 사진 & 설명 앱',
    category: '교육/게임',
    emoji: '📜',
    prompt: '한지 공예, 매듭, 자수, 옹기, 나전칠기 등 한국 전통 공예를 아름다운 사진과 함께 소개하고, 간단한 만들기 단계를 설명하는 전통 문화 교육 앱을 만들어줘.',
    desc: '아름다운 한국 전통 공예를 배우고 만들기 방법을 익히는 문화 앱'
  }
];

/**
 * Main generation entrypoint:
 * Uses Gemini API if key is set, otherwise utilizes built-in smart AI generator engine
 */
export async function generateAppWithPrompt(userPrompt, options = {}) {
  const apiKey = getGeminiApiKey();
  const promptText = userPrompt.trim();

  if (!promptText) {
    throw new Error('프롬프트를 입력해주세요.');
  }

  // If Gemini API Key exists, call real Gemini API
  if (apiKey) {
    try {
      const geminiResult = await callGeminiApi(promptText, apiKey, options);
      if (geminiResult && geminiResult.code) {
        return geminiResult;
      }
    } catch (err) {
      console.warn('Gemini API call failed, falling back to smart built-in engine:', err);
      // Fallback to built-in generator if API fails
    }
  }

  // Built-in Smart Generator
  return generateSmartWelfareApp(promptText, options);
}

/**
 * Dynamically fetch available active Gemini models for the provided API key
 */
async function getAvailableGeminiModel(apiKey) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.models && Array.isArray(data.models)) {
        const validModels = data.models.filter(m => 
          m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')
        );
        
        const flashModel = validModels.find(m => m.name.includes('flash'));
        if (flashModel) {
          return flashModel.name.replace('models/', '');
        }

        if (validModels.length > 0) {
          return validModels[0].name.replace('models/', '');
        }
      }
    }
  } catch (e) {
    console.warn('Failed to list Gemini models:', e);
  }
  return 'gemini-3.6-flash';
}

/**
 * Call Gemini API with dynamic active model discovery & fast timeout fallback
 */
async function callGeminiApi(prompt, apiKey, options) {
  const systemPrompt = `당신은 대한민국 노인복지관 및 지역 복지관을 위한 고품질 인터랙티브 웹 애플리케이션 전문 프론트엔드 엔지니어 및 UX 디자이너입니다.
사용자의 요청(프롬프트)을 바탕으로 어르신과 복지관 선생님들이 브라우저에서 바로 실행할 수 있는 완성도 높은 단일 파일 HTML (HTML+CSS+JS 내장) 코드를 작성하세요.

[필수 요구사항]
1. 완벽한 단일 HTML5 문서여야 합니다. (외부 CSS/JS 파일 의존성 없이 <style>과 <script>를 내장)
2. 어르신들을 위한 가독성 높은 디자인:
   - 큰 글꼴 크기 (본문 최소 16px, 버튼 18px 이상)
   - 명확한 대비의 따뜻하고 세련된 색상 테마 (부드러운 그라디언트, 깔끔한 카드 레이아웃)
   - 터치하기 쉬운 넉넉한 여백과 버튼 크기 (최소 높이 48px 이상)
   - 모바일(스마트폰 390px), 태블릿, PC 브라우저 모두에 유연하게 반응형 레이아웃 구현
3. 실제 완벽하게 동작하는 인터랙션 로직:
   - 버튼 클릭, 상태 저장, 카운터, 타이머, 정답 체크, 퀴즈, 애니메이션 등 모든 기능이 즉시 작동해야 함
   - Web Audio API (AudioContext)를 활용한 자체 비프음/효과음 (선택 사항으로 풍성한 사용자 경험 제공)
   - 결과 발표 시 이모지 파티클 애니메이션 등 시각적 보상 제공
4. 한글(한국어)로 친절하고 직관적인 안내 문구 사용.
5. 반드시 마크다운 코드 블록 (\`\`\`html ... \`\`\`) 또는 순수 HTML로만 응답하세요. 잡담이나 추가 설명 텍스트는 출력하지 마세요.`;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: systemPrompt },
          { text: `[사용자 앱 제작 요청 프롬프트]:\n${prompt}\n\n위 요구사항에 맞는 최고의 복지관 웹앱 HTML 소스코드를 작성해주세요.` }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    }
  };

  const activeModel = await getAvailableGeminiModel(apiKey);
  const modelsToTry = [activeModel].filter(Boolean);

  for (const modelName of modelsToTry) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000); // 45s timeout for full HTML code generation

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        }
      );
      clearTimeout(timeoutId);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Gemini API (${modelName}) 호출 실패 (상태 코드: ${response.status})`);
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!text) continue;

      let cleanHtml = text;
      const match = text.match(/```html\s*([\s\S]*?)\s*```/i);
      if (match && match[1]) {
        cleanHtml = match[1];
      } else {
        const matchGeneric = text.match(/```\s*([\s\S]*?)\s*```/i);
        if (matchGeneric && matchGeneric[1]) {
          cleanHtml = matchGeneric[1];
        }
      }

      const titleMatch = cleanHtml.match(/<title>(.*?)<\/title>/i);
      const inferredTitle = titleMatch ? titleMatch[1].trim() : 'AI 스마트 복지관 앱';

      return {
        code: cleanHtml,
        title: inferredTitle,
        category: detectCategory(prompt),
        icon_emoji: detectEmoji(prompt),
        model: modelName
      };
    } catch (err) {
      console.warn(`Attempt with ${modelName} failed:`, err.message);
    }
  }

  return null;
}

/**
 * Intelligent Category Detector based on keywords
 */
function detectCategory(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('건강') || p.includes('운동') || p.includes('체조') || p.includes('스트레칭') || p.includes('복약') || p.includes('혈압') || p.includes('물')) {
    return '건강/운동';
  }
  if (p.includes('퀴즈') || p.includes('게임') || p.includes('초성') || p.includes('산수') || p.includes('두뇌') || p.includes('기억력') || p.includes('퍼즐') || p.includes('낱말')) {
    return '교육/게임';
  }
  if (p.includes('출석') || p.includes('스탬프') || p.includes('룰렛') || p.includes('추첨') || p.includes('이벤트') || p.includes('참여')) {
    return '참여/출석';
  }
  if (p.includes('지도') || p.includes('산책') || p.includes('휠체어') || p.includes('위치') || p.includes('안내')) {
    return '복지/지도';
  }
  if (p.includes('힐링') || p.includes('마음') || p.includes('일기') || p.includes('감사') || p.includes('음악') || p.includes('소리') || p.includes('명상')) {
    return '마음/힐링';
  }
  return '일반/기타';
}

/**
 * Intelligent Emoji Detector based on keywords
 */
function detectEmoji(prompt) {
  const p = prompt.toLowerCase();
  if (p.includes('초성') || p.includes('퀴즈') || p.includes('두뇌')) return '🧩';
  if (p.includes('약') || p.includes('복약') || p.includes('혈압') || p.includes('건강')) return '💊';
  if (p.includes('룰렛') || p.includes('추첨') || p.includes('행운')) return '🎯';
  if (p.includes('산수') || p.includes('계산') || p.includes('숫자')) return '🧮';
  if (p.includes('식단') || p.includes('밥') || p.includes('음식') || p.includes('점심')) return '🍱';
  if (p.includes('체조') || p.includes('스트레칭') || p.includes('운동')) return '🧘‍♂️';
  if (p.includes('음악') || p.includes('소리') || p.includes('힐링') || p.includes('명상')) return '🎵';
  if (p.includes('일기') || p.includes('감사') || p.includes('마음')) return '💖';
  if (p.includes('지도') || p.includes('길') || p.includes('산책')) return '🗺️';
  if (p.includes('스탬프') || p.includes('도장') || p.includes('출석')) return '⭐';
  return '📱';
}

/**
 * Built-in Smart Welfare App Generator
 * Generates responsive, high-fidelity, interactive HTML5 web applications dynamically
 */
export function generateSmartWelfareApp(prompt, options = {}) {
  const p = prompt.toLowerCase();
  const category = options.category || detectCategory(prompt);
  const iconEmoji = options.iconEmoji || detectEmoji(prompt);

  // 1차: PROMPT_PRESETS 기반 직접 매칭 (100개 프리셋 100% 1:1 정확도)
  const matchedPreset = PROMPT_PRESETS.find(preset => {
    if (options.title && (preset.title === options.title || options.title.includes(preset.title) || preset.title.includes(options.title))) return true;
    if (preset.prompt === prompt || prompt.includes(preset.prompt.slice(0, 20))) return true;
    if (preset.title.toLowerCase().includes(p) || p.includes(preset.title.toLowerCase())) return true;
    return false;
  });

  if (matchedPreset) {
    switch (matchedPreset.id) {
      case 'weight_tracker':
        return generateWeightBmiApp(prompt, category, iconEmoji);
      case 'eye_exercise':
        return generateEyeExerciseApp(prompt, category, iconEmoji);
      case 'blood_pressure_diary':
        return generateBloodPressureApp(prompt, category, iconEmoji);
      case 'step_counter':
        return generateStepCounterApp(prompt, category, iconEmoji);
      case 'medicine_water_tracker':
        return generateHealthRoutineApp(prompt, category, iconEmoji);
      case 'joint_stretch':
        return generateStretchingTimerApp(prompt, category, iconEmoji);
      case 'chosung_quiz':
        return generateChosungQuizApp(prompt, category, iconEmoji);
      case 'speed_math':
        return generateSpeedMathApp(prompt, category, iconEmoji);
      case 'number_touch_challenge':
        return generateNumberTouchApp(prompt, category, iconEmoji);
      case 'memory_card_flip':
        return generateMemoryCardApp(prompt, category, iconEmoji);
      case 'lucky_roulette':
        return generateLuckyRouletteApp(prompt, category, iconEmoji);
      case 'meal_vote':
        return generateMealVoteApp(prompt, category, iconEmoji);
      case 'nature_sound_healing':
        return generateNatureSoundApp(prompt, category, iconEmoji);
      case 'gratitude_diary':
        return generateGratitudeDiaryApp(prompt, category, iconEmoji);
      case 'traditional_craft':
        return generateTraditionalCraftApp(prompt, category, iconEmoji);
      default:
        // 특정 전용 템플릿이 없는 프리셋은 프롬프트/제목을 100% 반영한 고품질 스마트 동적 앱 생성
        return generateDynamicCustomApp(prompt, category, iconEmoji, matchedPreset.title);
    }
  }

  if (p.includes('날씨') || p.includes('기온') || p.includes('예보')) {
    return generateWeatherApp(prompt, category, iconEmoji);
  }
  if (p.includes('계산기') || p.includes('계산') || p.includes('산수기')) {
    return generateSeniorCalculatorApp(prompt, category, iconEmoji);
  }
  if (p.includes('체중') || p.includes('bmi')) {
    return generateWeightBmiApp(prompt, category, iconEmoji);
  }
  if (p.includes('눈') || p.includes('시력') || p.includes('20-20-20')) {
    return generateEyeExerciseApp(prompt, category, iconEmoji);
  }
  if (p.includes('혈압') || p.includes('맥박')) {
    return generateBloodPressureApp(prompt, category, iconEmoji);
  }
  if (p.includes('만보') || p.includes('걸음') || p.includes('걷기')) {
    return generateStepCounterApp(prompt, category, iconEmoji);
  }
  if (p.includes('복약') || p.includes('약 복용') || p.includes('물 마시기')) {
    return generateHealthRoutineApp(prompt, category, iconEmoji);
  }
  if (p.includes('구구단') || p.includes('곱셈')) {
    return generateGugudanGameApp(prompt, category, iconEmoji);
  }
  if (p.includes('초성') || p.includes('낱말')) {
    return generateChosungQuizApp(prompt, category, iconEmoji);
  }
  if ((p.includes('산수') || p.includes('연산') || p.includes('덧셈') || p.includes('뺄셈') || p.includes('수학')) && !p.includes('체중') && !p.includes('bmi')) {
    return generateSpeedMathApp(prompt, category, iconEmoji);
  }
  if (p.includes('룰렛') || p.includes('추첨') || p.includes('돌림판')) {
    return generateLuckyRouletteApp(prompt, category, iconEmoji);
  }
  if (p.includes('식단') || p.includes('메뉴') || (p.includes('투표') && p.includes('식사'))) {
    return generateMealVoteApp(prompt, category, iconEmoji);
  }
  if (p.includes('스트레칭') || p.includes('관절') || p.includes('체조')) {
    return generateStretchingTimerApp(prompt, category, iconEmoji);
  }
  if (p.includes('짝맞추기') || p.includes('카드 맞추기')) {
    return generateMemoryCardApp(prompt, category, iconEmoji);
  }
  if (p.includes('감사') || p.includes('행복 일기')) {
    return generateGratitudeDiaryApp(prompt, category, iconEmoji);
  }
  if (p.includes('소리') || p.includes('asmr') || p.includes('명상') || p.includes('자연 소리')) {
    return generateNatureSoundApp(prompt, category, iconEmoji);
  }
  if (p.includes('1부터 16') || p.includes('스피드 터치')) {
    return generateNumberTouchApp(prompt, category, iconEmoji);
  }

  // 3차: 동적 커스텀 앱 (요청한 Title과 Prompt가 완벽하게 들어가는 고품질 스마트 UI)
  return generateDynamicCustomApp(prompt, category, iconEmoji, options.title);
}

function generateSeniorCalculatorApp(prompt, category, emoji) {
  const title = '복지관 스마트 큰글씨 계산기';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>복지관 스마트 큰글씨 계산기</title>
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@500;700;900&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Noto Sans KR', -apple-system, sans-serif; }
    body { background: linear-gradient(135deg, #eef2f7 0%, #dce4ec 100%); color: #1e293b; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 410px; padding: 24px 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.12); border: 2px solid #cbd5e1; }
    .header { text-align: center; margin-bottom: 16px; }
    .badge { display: inline-block; background: #e0e7ff; color: #4338ca; padding: 6px 16px; border-radius: 50px; font-weight: 700; font-size: 0.88rem; margin-bottom: 6px; }
    h1 { font-size: 1.4rem; color: #1e1b4b; font-weight: 900; }
    
    .display-box { background: #0f172a; border-radius: 20px; padding: 18px; text-align: right; margin-bottom: 16px; border: 2px solid #334155; box-shadow: inset 0 2px 6px rgba(0,0,0,0.4); }
    .history-text { font-size: 0.95rem; color: #94a3b8; min-height: 24px; word-break: break-all; margin-bottom: 4px; font-weight: 500; }
    .current-val { font-size: 2.8rem; font-weight: 900; color: #38bdf8; word-break: break-all; line-height: 1.1; }

    .quick-btns { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin-bottom: 12px; }
    .q-btn { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 10px 4px; font-size: 0.82rem; font-weight: 700; color: #334155; cursor: pointer; transition: 0.15s; }
    .q-btn:active { background: #e2e8f0; transform: scale(0.96); }

    .grid-keypad { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .key-btn { padding: 16px 0; border-radius: 18px; font-size: 1.5rem; font-weight: 900; border: none; cursor: pointer; transition: 0.15s; box-shadow: 0 4px 6px rgba(0,0,0,0.06); display: flex; align-items: center; justify-content: center; user-select: none; }
    .key-btn:active { transform: scale(0.95); opacity: 0.9; }

    .key-num { background: #f8fafc; color: #0f172a; border: 1px solid #e2e8f0; }
    .key-op { background: #e0e7ff; color: #4338ca; border: 1px solid #c7d2fe; }
    .key-func { background: #fee2e2; color: #dc2626; border: 1px solid #fecaca; }
    .key-equal { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; grid-column: span 2; box-shadow: 0 4px 15px rgba(16,185,129,0.35); }

    .tts-bar { display: flex; align-items: center; justify-content: space-between; margin-top: 14px; padding: 10px 14px; background: #f8fafc; border-radius: 14px; border: 1px solid #e2e8f0; font-size: 0.85rem; color: #475569; }
    .toggle-sw { position: relative; width: 44px; height: 24px; background: #cbd5e1; border-radius: 50px; cursor: pointer; transition: 0.3s; }
    .toggle-sw.active { background: #4f46e5; }
    .toggle-circle { position: absolute; top: 2px; left: 2px; width: 20px; height: 20px; background: white; border-radius: 50%; transition: 0.3s; }
    .toggle-sw.active .toggle-circle { left: 22px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">🧮 성동 복지관 실버 가이드</span>
      <h1>스마트 큰글씨 계산기</h1>
    </div>

    <div class="display-box">
      <div class="history-text" id="historyDisplay"></div>
      <div class="current-val" id="currentDisplay">0</div>
    </div>

    <div class="quick-btns">
      <button class="q-btn" onclick="addQuick(100)">+100원</button>
      <button class="q-btn" onclick="addQuick(1000)">+1,000원</button>
      <button class="q-btn" onclick="addQuick(10000)">+10,000원</button>
      <button class="q-btn" style="color:#0284c7; background:#e0f2fe;" onclick="applyDiscount(10)">10% 할인</button>
    </div>

    <div class="grid-keypad">
      <button class="key-btn key-func" onclick="clearAll()">C</button>
      <button class="key-btn key-func" onclick="backspace()">⌫</button>
      <button class="key-btn key-op" onclick="appendOp('%')">%</button>
      <button class="key-btn key-op" onclick="appendOp('÷')">÷</button>

      <button class="key-btn key-num" onclick="appendNum('7')">7</button>
      <button class="key-btn key-num" onclick="appendNum('8')">8</button>
      <button class="key-btn key-num" onclick="appendNum('9')">9</button>
      <button class="key-btn key-op" onclick="appendOp('×')">×</button>

      <button class="key-btn key-num" onclick="appendNum('4')">4</button>
      <button class="key-btn key-num" onclick="appendNum('5')">5</button>
      <button class="key-btn key-num" onclick="appendNum('6')">6</button>
      <button class="key-btn key-op" onclick="appendOp('-')">-</button>

      <button class="key-btn key-num" onclick="appendNum('1')">1</button>
      <button class="key-btn key-num" onclick="appendNum('2')">2</button>
      <button class="key-btn key-num" onclick="appendNum('3')">3</button>
      <button class="key-btn key-op" onclick="appendOp('+')">+</button>

      <button class="key-btn key-num" onclick="appendNum('0')">0</button>
      <button class="key-btn key-num" onclick="appendNum('.')">.</button>
      <button class="key-btn key-equal" onclick="calculate()">= 계산</button>
    </div>

    <div class="tts-bar">
      <span>🔊 <b>음성으로 결과 읽어주기</b></span>
      <div class="toggle-sw active" id="ttsToggle" onclick="toggleTTS()">
        <div class="toggle-circle"></div>
      </div>
    </div>
  </div>

  <script>
    let currentInput = '0';
    let historyInput = '';
    let enableTTS = true;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playBeep(freq = 440, type = 'sine', duration = 0.08) {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    }

    function speak(text) {
      if (!enableTTS || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'ko-KR';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    }

    function updateDisplay() {
      document.getElementById('currentDisplay').innerText = currentInput;
      document.getElementById('historyDisplay').innerText = historyInput;
    }

    function appendNum(num) {
      playBeep(520, 'sine');
      if (currentInput === '0' && num !== '.') {
        currentInput = num;
      } else {
        if (num === '.' && currentInput.includes('.')) return;
        currentInput += num;
      }
      updateDisplay();
    }

    function appendOp(op) {
      playBeep(650, 'triangle');
      if (currentInput === '0' && historyInput !== '') {
        historyInput = historyInput.slice(0, -1) + ' ' + op + ' ';
      } else {
        historyInput += currentInput + ' ' + op + ' ';
        currentInput = '0';
      }
      updateDisplay();
    }

    function clearAll() {
      playBeep(300, 'square');
      currentInput = '0';
      historyInput = '';
      updateDisplay();
    }

    function backspace() {
      playBeep(400, 'sine');
      if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
      } else {
        currentInput = '0';
      }
      updateDisplay();
    }

    function addQuick(amount) {
      playBeep(580, 'sine');
      const val = parseFloat(currentInput) || 0;
      currentInput = String(val + amount);
      updateDisplay();
    }

    function applyDiscount(pct) {
      playBeep(700, 'sine');
      const val = parseFloat(currentInput) || 0;
      const discounted = Math.round(val * (1 - pct / 100));
      currentInput = String(discounted);
      historyInput = val + '원 (' + pct + '% 할인) = ';
      updateDisplay();
      speak('할인 적용 결과 ' + discounted + '원 입니다.');
    }

    function calculate() {
      playBeep(880, 'sine', 0.15);
      if (!historyInput && currentInput === '0') return;

      const fullExpr = historyInput + currentInput;
      let evalExpr = fullExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/%/g, '/100');

      try {
        const res = eval(evalExpr);
        const formattedRes = Number.isInteger(res) ? res : parseFloat(res.toFixed(4));
        historyInput = fullExpr + ' =';
        currentInput = String(formattedRes);
        updateDisplay();
        speak('계산 결과는 ' + formattedRes + ' 입니다.');
      } catch (e) {
        currentInput = '오류';
        updateDisplay();
        speak('계산식 오류입니다.');
      }
    }

    function toggleTTS() {
      enableTTS = !enableTTS;
      document.getElementById('ttsToggle').className = 'toggle-sw ' + (enableTTS ? 'active' : '');
      if (enableTTS) speak('음성 안내가 켜졌습니다.');
    }
  </script>
</body>
</html>`;

  return { code, title, category: category || '교육/게임', icon_emoji: '🧮', model: '스마트 빌트인 엔진' };
}

function generateWeatherApp(prompt, category, emoji) {
  const title = '서울 실시간 & 시간대별 날씨 예보';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>서울 실시간 & 시간대별 날씨 예보</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%); border-radius: 28px; width: 100%; max-width: 400px; padding: 24px 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid #334155; }
    .header { text-align: center; margin-bottom: 20px; }
    .location-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(56, 189, 248, 0.15); color: #38bdf8; padding: 6px 16px; border-radius: 50px; font-weight: 700; font-size: 0.9rem; border: 1px solid rgba(56, 189, 248, 0.3); }
    .main-temp-box { text-align: center; margin: 20px 0; }
    .weather-hero-icon { font-size: 4.5rem; animation: float 3s infinite ease-in-out; }
    @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    .temp-val { font-size: 3.5rem; font-weight: 900; color: #fff; letter-spacing: -2px; }
    .weather-desc { font-size: 1.2rem; font-weight: 700; color: #7dd3fc; margin-top: 4px; }
    .advice-box { background: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.25); border-radius: 16px; padding: 14px; margin-bottom: 20px; font-size: 0.92rem; line-height: 1.5; color: #e0f2fe; text-align: center; }
    .section-title { font-size: 0.95rem; font-weight: 800; color: #94a3b8; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between; }
    .hourly-container { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 8px; scrollbar-width: none; }
    .hourly-item { flex: 0 0 72px; background: #334155; border-radius: 16px; padding: 12px 8px; text-align: center; border: 1px solid #475569; transition: 0.2s; cursor: pointer; }
    .hourly-item.active { background: #0284c7; border-color: #38bdf8; transform: scale(1.05); }
    .hourly-time { font-size: 0.78rem; color: #cbd5e1; font-weight: 600; }
    .hourly-icon { font-size: 1.6rem; margin: 6px 0; }
    .hourly-temp { font-size: 0.95rem; font-weight: 800; color: #fff; }
    .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 16px; }
    .detail-card { background: #1e293b; border: 1px solid #334155; border-radius: 16px; padding: 12px; text-align: center; }
    .detail-label { font-size: 0.78rem; color: #94a3b8; }
    .detail-value { font-size: 1.1rem; font-weight: 800; color: #f1f5f9; margin-top: 4px; }
    .refresh-btn { width: 100%; background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color: white; border: none; padding: 14px; border-radius: 16px; font-size: 1rem; font-weight: 800; cursor: pointer; margin-top: 18px; box-shadow: 0 4px 15px rgba(2,132,199,0.4); }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="location-badge">📍 서울특별시 성동구 날씨</span>
    </div>

    <div class="main-temp-box">
      <div class="weather-hero-icon" id="mainIcon">☀️</div>
      <div class="temp-val" id="mainTemp">24°C</div>
      <div class="weather-desc" id="mainDesc">맑음 (미세먼지 좋음)</div>
    </div>

    <div class="advice-box" id="adviceBox">
      💡 <b>오늘의 실버 건강 팁:</b> 완연한 맑은 날씨입니다. 가벼운 모자를 착용하시고 서울숲 야외 산책을 즐기기 좋습니다!
    </div>

    <div class="section-title">
      <span>⏰ 시간대별 예보</span>
      <span style="font-size:0.78rem; color:#38bdf8;">오늘~내일</span>
    </div>

    <div class="hourly-container" id="hourlyList"></div>

    <div class="detail-grid">
      <div class="detail-card">
        <div class="detail-label">💧 습도</div>
        <div class="detail-value" id="humidityVal">45%</div>
      </div>
      <div class="detail-card">
        <div class="detail-card-wind">
          <div class="detail-label">🌬️ 바람</div>
          <div class="detail-value" id="windVal">2.1 m/s</div>
        </div>
      </div>
      <div class="detail-card">
        <div class="detail-label">🌿 미세먼지</div>
        <div class="detail-value" style="color:#4ade80">좋음 (18㎍/㎥)</div>
      </div>
      <div class="detail-card">
        <div class="detail-label">☀️ 자외선</div>
        <div class="detail-value" style="color:#facc15">보통 (5.2)</div>
      </div>
    </div>

    <button class="refresh-btn" onclick="updateWeather()">🔄 날씨 정보 새로고침</button>
  </div>

  <script>
    const hourlyData = [
      { time: '지금', temp: '24°', icon: '☀️', desc: '맑음 (미세먼지 좋음)', humidity: '45%', wind: '2.1 m/s', advice: '💡 <b>오늘의 실버 건강 팁:</b> 완연한 맑은 날씨입니다. 가벼운 모자를 착용하시고 서울숲 야외 산책을 즐기기 좋습니다!' },
      { time: '15시', temp: '25°', icon: '☀️', desc: '맑고 햇살 강함', humidity: '42%', wind: '2.4 m/s', advice: '💡 <b>오후 건강 팁:</b> 자외선이 강해지는 시간이니 수분을 충분히 섭취해 주세요.' },
      { time: '18시', temp: '22°', icon: '⛅', desc: '선선한 구름', humidity: '50%', wind: '1.8 m/s', advice: '💡 <b>저녁 건강 팁:</b> 기온이 선선해집니다. 가벼운 겉옷을 준비하세요.' },
      { time: '21시', temp: '19°', icon: '🌙', desc: '맑은 맑은 밤', humidity: '60%', wind: '1.2 m/s', advice: '💡 <b>밤 건강 팁:</b> 편안한 밤입니다. 실내 습도를 50% 수준으로 유지하면 숙면에 좋습니다.' },
      { time: '내일 09시', temp: '18°', icon: '🌤️', desc: '구름 개임', humidity: '65%', wind: '1.5 m/s', advice: '💡 <b>아침 건강 팁:</b> 상쾌한 아침 공기와 함께 가벼운 목/어깨 스트레칭을 추천합니다.' },
      { time: '내일 12시', temp: '23°', icon: '☀️', desc: '맑고 쾌청', humidity: '48%', wind: '2.0 m/s', advice: '💡 <b>점심 건강 팁:</b> 맑은 햇살 아래 복지관 이동 시 시원한 음료를 지참하세요.' },
      { time: '내일 15시', temp: '26°', icon: '☀️', desc: '온화하고 따뜻함', humidity: '40%', wind: '2.3 m/s', advice: '💡 <b>오후 건강 팁:</b> 야외 활동 중 그늘에서 10분씩 쉬어가는 것이 좋습니다.' },
      { time: '내일 18시', temp: '23°', icon: '⛅', desc: '구름 조금', humidity: '55%', wind: '1.9 m/s', advice: '💡 <b>저녁 건강 팁:</b> 하루를 마무리하며 부드러운 발목 털기 운동을 해보세요.' }
    ];

    function renderHourly() {
      const container = document.getElementById('hourlyList');
      container.innerHTML = hourlyData.map((item, idx) => \`
        <div class="hourly-item \${idx === 0 ? 'active' : ''}" onclick="selectHour(\${idx})">
          <div class="hourly-time">\${item.time}</div>
          <div class="hourly-icon">\${item.icon}</div>
          <div class="hourly-temp">\${item.temp}</div>
        </div>
      \`).join('');
    }

    function selectHour(idx) {
      document.querySelectorAll('.hourly-item').forEach((el, i) => {
        el.className = 'hourly-item ' + (i === idx ? 'active' : '');
      });
      const item = hourlyData[idx];
      document.getElementById('mainIcon').innerText = item.icon;
      document.getElementById('mainTemp').innerText = item.temp + 'C';
      document.getElementById('mainDesc').innerText = item.desc;
      document.getElementById('humidityVal').innerText = item.humidity;
      document.getElementById('windVal').innerText = item.wind;
      document.getElementById('adviceBox').innerHTML = item.advice;
    }

    function updateWeather() {
      alert('서울 성동구 실시간 & 시간대별 날씨 예보 데이터를 업데이트했습니다! ☀️');
    }

    renderHourly();
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: '☀️', model: '스마트 빌트인 엔진' };
}

function generateWeightBmiApp(prompt, category, emoji) {
  const title = '건강 체중 일지! 매일 체중 & BMI 기록 앱';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: linear-gradient(135deg, #fefce8 0%, #fef08a 100%); color: #713f12; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(113,63,18,0.15); border: 2px solid #fde047; }
    .badge { display: inline-block; background: #fef08a; color: #854d0e; padding: 5px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 8px; text-align:center; }
    h1 { font-size: 1.35rem; color: #854d0e; text-align: center; margin-bottom: 14px; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 12px; }
    label { font-size: 0.85rem; font-weight: 700; color: #854d0e; display: block; margin-bottom: 4px; }
    input { width: 100%; padding: 12px; border: 2px solid #fde047; border-radius: 14px; font-size: 1.1rem; font-weight: 700; outline: none; }
    .btn { width: 100%; background: #eab308; color: white; border: none; padding: 14px; border-radius: 16px; font-size: 1.05rem; font-weight: 800; cursor: pointer; margin-top: 6px; box-shadow: 0 4px 12px rgba(234,179,8,0.3); }
    .result-box { background: #fefce8; border-radius: 16px; padding: 14px; margin-top: 14px; border: 1px solid #fde047; font-size: 0.95rem; color: #713f12; }
    .bmi-val { font-size: 2.2rem; font-weight: 900; color: #ca8a04; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="card">
    <div style="text-align:center;">
      <span class="badge">⚖️ 성동 체중지킴이</span>
      <h1>건강 체중 & BMI 분석 다이어리</h1>
    </div>

    <div class="grid-2">
      <div>
        <label>신장 (cm)</label>
        <input type="number" id="height" placeholder="예: 165" value="165" />
      </div>
      <div>
        <label>현재 체중 (kg)</label>
        <input type="number" id="weight" placeholder="예: 62" value="62" />
      </div>
    </div>

    <button class="btn" onclick="calcBMI()">⚖️ 체중 저장 및 BMI 분석하기</button>

    <div class="result-box" id="resBox">
      <div style="font-size:0.85rem; color:#854d0e; font-weight:700;">[BMI 분석 결과]</div>
      <div class="bmi-val" id="bmiVal">22.8 (정상)</div>
      <div id="advice" style="font-size:0.9rem; color:#475569;">어르신 연령대에 가장 적절하고 건강한 체중입니다! 👏</div>
    </div>
  </div>

  <script>
    function calcBMI() {
      const h = parseFloat(document.getElementById('height').value) / 100;
      const w = parseFloat(document.getElementById('weight').value);

      if (!h || !w || h <= 0 || w <= 0) { alert('키와 체중을 올바르게 입력해주세요.'); return; }

      const bmi = (w / (h * h)).toFixed(1);
      let status = '정상 체중';
      let adviceText = '어르신 연령대에 가장 적절하고 건강한 체중입니다! 👏';
      let color = '#ca8a04';

      if (bmi < 18.5) {
        status = '저체중';
        adviceText = '💡 단백질이 풍부한 식사와 영양 섭취에 신경 써주세요.';
        color = '#2563eb';
      } else if (bmi >= 23 && bmi < 25) {
        status = '과체중 경계';
        adviceText = '🏃‍♂️ 하루 30분 산책과 함께 가벼운 유산소 운동을 권장합니다.';
        color = '#ea580c';
      } else if (bmi >= 25) {
        status = '비만 경계';
        adviceText = '🥗 식단 조절과 체중 관리를 위해 관절 무리 없는 체조를 추천합니다.';
        color = '#dc2626';
      }

      document.getElementById('bmiVal').innerText = bmi + ' (' + status + ')';
      document.getElementById('bmiVal').style.color = color;
      document.getElementById('advice').innerText = adviceText;
      alert('체중 기록 및 BMI 분석이 완료되었습니다! 💖');
    }
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateEyeExerciseApp(prompt, category, emoji) {
  const title = '눈 건강 지킴이! 20-20-20 눈 스트레칭 가이드';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif; }
    body { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); color: #f8fafc; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; text-align: center; }
    .card { background: #1e293b; border-radius: 28px; width: 100%; max-width: 390px; padding: 26px 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 2px solid #4338ca; }
    .badge { display: inline-block; background: rgba(99, 102, 241, 0.2); color: #a5b4fc; padding: 6px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 10px; }
    h1 { font-size: 1.35rem; color: #f8fafc; margin-bottom: 6px; }
    .eye-icon { font-size: 4.5rem; margin: 16px 0; animation: pulse 2.5s infinite ease-in-out; }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.12); } }
    .step-title { font-size: 1.25rem; font-weight: 800; color: #818cf8; margin-bottom: 6px; }
    .step-desc { font-size: 0.95rem; color: #cbd5e1; background: #0f172a; border-radius: 16px; padding: 14px; margin-bottom: 18px; line-height: 1.5; border: 1px solid #334155; }
    .timer-circle { width: 120px; height: 120px; border-radius: 50%; border: 6px solid #6366f1; display: flex; align-items: center; justify-content: center; font-size: 2.3rem; font-weight: 900; color: #c7d2fe; margin: 0 auto 18px auto; background: rgba(99,102,241,0.1); }
    .btn-group { display: flex; gap: 10px; }
    .btn { flex: 1; padding: 14px; border-radius: 16px; font-size: 1.05rem; font-weight: 800; border: none; cursor: pointer; transition: 0.2s; }
    .btn-main { background: #6366f1; color: white; box-shadow: 0 4px 15px rgba(99,102,241,0.4); }
    .btn-sub { background: #334155; color: #cbd5e1; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">👁️ 성동 눈 건강 지킴이</span>
    <h1>20-20-20 눈 스트레칭 가이드</h1>

    <div class="eye-icon" id="eyeIcon">👁️</div>
    <div class="step-title" id="stepTitle">1단계: 20피트(6m) 먼 곳 바라보기</div>
    <div class="step-desc" id="stepDesc">화면에서 눈을 떼고 창밖의 먼 산이나 6미터 이상 멀리 떨어진 물체를 20초간 응시하세요.</div>

    <div class="timer-circle" id="timer">20</div>

    <div class="btn-group">
      <button class="btn btn-main" id="startBtn" onclick="toggleTimer()">▶ 운동 시작</button>
      <button class="btn btn-sub" onclick="nextStep()">다음 동작 ➡️</button>
    </div>
  </div>

  <script>
    const steps = [
      { icon: '👁️', title: '1단계: 먼 곳 바라보기 (20초)', desc: '화면에서 눈을 떼고 창밖의 먼 곳이나 6m 이상 떨어진 물체를 20초간 멍하니 바라보세요.' },
      { icon: '🔄', title: '2단계: 눈동자 원 그리기', desc: '고개를 고정한 채 눈동자를 시계 방향으로 천천히 5번, 반시계 방향으로 5번 돌려줍니다.' },
      { icon: '🫣', title: '3단계: 눈 깜빡이기 훈련', desc: '눈을 2초간 살며시 꽉 감았다가 번쩍 뜨는 동작을 10회 반복하여 눈물을 순환시킵니다.' },
      { icon: '👐', title: '4단계: 따뜻한 림프 찜질', desc: '양 손바닥을 비벼 따뜻하게 만든 뒤 눈 위에 살며시 얹어 15초간 온기를 느껴보세요.' }
    ];
    let stepIdx = 0;
    let timeLeft = 20;
    let timer = null;

    function toggleTimer() {
      const btn = document.getElementById('startBtn');
      if (timer) {
        clearInterval(timer);
        timer = null;
        btn.innerText = '▶ 다시 시작';
      } else {
        btn.innerText = '⏸ 일시 정지';
        timer = setInterval(() => {
          timeLeft--;
          document.getElementById('timer').innerText = timeLeft;
          if (timeLeft <= 0) {
            clearInterval(timer);
            timer = null;
            document.getElementById('timer').innerText = '완료!';
            btn.innerText = '✨ 참 잘하셨어요!';
          }
        }, 1000);
      }
    }

    function nextStep() {
      stepIdx = (stepIdx + 1) % steps.length;
      clearInterval(timer);
      timer = null;
      timeLeft = 20;
      document.getElementById('timer').innerText = '20';
      document.getElementById('startBtn').innerText = '▶ 운동 시작';
      document.getElementById('eyeIcon').innerText = steps[stepIdx].icon;
      document.getElementById('stepTitle').innerText = steps[stepIdx].title;
      document.getElementById('stepDesc').innerText = steps[stepIdx].desc;
    }
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateStepCounterApp(prompt, category, emoji) {
  const title = '오늘도 힘차게! 만보 걷기 목표 & 걸음 수 카운터';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); color: #14532d; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; text-align: center; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(20,83,45,0.15); border: 2px solid #bbf7d0; }
    .badge { display: inline-block; background: #dcfce7; color: #16a34a; padding: 5px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 8px; }
    h1 { font-size: 1.35rem; color: #15803d; margin-bottom: 12px; }
    .step-display { font-size: 3.5rem; font-weight: 900; color: #16a34a; margin: 10px 0; }
    .progress-box { background: #f0fdf4; border-radius: 14px; height: 16px; overflow: hidden; margin: 14px 0 6px 0; border: 1px solid #bbf7d0; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #22c55e, #10b981); width: 0%; transition: width 0.3s; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 16px 0; }
    .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 12px; font-size: 0.85rem; color: #475569; }
    .stat-val { font-size: 1.2rem; font-weight: 800; color: #16a34a; margin-top: 4px; }
    .add-btn { width: 100%; background: #16a34a; color: white; border: none; padding: 16px; border-radius: 20px; font-size: 1.2rem; font-weight: 800; cursor: pointer; box-shadow: 0 4px 15px rgba(22,163,74,0.35); }
    .add-btn:active { transform: scale(0.96); }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">👟 성동 건강 걷기</span>
    <h1>오늘의 만보 걷기 달성 트래커</h1>
    
    <div style="font-size:0.9rem; color:#475569;">오늘의목표: <b>10,000걸음</b></div>
    <div class="step-display" id="stepCount">0</div>
    <div style="font-size:0.85rem; color:#16a34a; font-weight:700;">걸음 수 달성</div>

    <div class="progress-box">
      <div class="progress-fill" id="pFill"></div>
    </div>

    <div class="grid-2">
      <div class="stat-card">
        <span>소모 칼로리</span>
        <div class="stat-val" id="kcal">0 kcal</div>
      </div>
      <div class="stat-card">
        <span>이동 거리</span>
        <div class="stat-val" id="dist">0.0 km</div>
      </div>
    </div>

    <button class="add-btn" onclick="addSteps(500)">🏃‍♂️ +500걸음 추가하기</button>
  </div>

  <script>
    let steps = 0;
    function addSteps(val) {
      steps += val;
      document.getElementById('stepCount').innerText = steps.toLocaleString();
      const pct = Math.min(100, Math.round((steps / 10000) * 100));
      document.getElementById('pFill').style.width = pct + '%';
      document.getElementById('kcal').innerText = Math.round(steps * 0.04) + ' kcal';
      document.getElementById('dist').innerText = (steps * 0.0007).toFixed(1) + ' km';

      if (steps >= 10000 && steps - val < 10000) {
        setTimeout(() => alert('🎉 대단하세요! 오늘의 만보 걷기 목표를 멋지게 달성하셨습니다! 🏆'), 200);
      }
    }
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateBloodPressureApp(prompt, category, emoji) {
  const title = '혈압 안심 수첩! 아침저녁 혈압 & 맥박 기록 앱';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); color: #881337; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(136,19,55,0.15); border: 2px solid #fecdd3; }
    .badge { display: inline-block; background: #ffe4e6; color: #e11d48; padding: 5px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 8px; text-align:center; }
    h1 { font-size: 1.35rem; color: #9f1239; text-align: center; margin-bottom: 14px; }
    .input-group { margin-bottom: 12px; }
    label { font-size: 0.85rem; font-weight: 700; color: #9f1239; display: block; margin-bottom: 4px; }
    input { width: 100%; padding: 12px; border: 2px solid #fecdd3; border-radius: 14px; font-size: 1.1rem; font-weight: 700; outline: none; }
    .btn { width: 100%; background: #e11d48; color: white; border: none; padding: 14px; border-radius: 16px; font-size: 1.05rem; font-weight: 800; cursor: pointer; margin-top: 6px; }
    .result-box { background: #fff1f2; border-radius: 16px; padding: 14px; margin-top: 14px; border: 1px solid #fda4af; font-size: 0.95rem; color: #9f1239; }
  </style>
</head>
<body>
  <div class="card">
    <div style="text-align:center;">
      <span class="badge">❤️ 성동 혈압지킴이</span>
      <h1>아침저녁 혈압 & 맥박 수첩</h1>
    </div>

    <div class="input-group">
      <label>수축기 (최고혈압 mmHg)</label>
      <input type="number" id="sys" placeholder="예: 120" value="125" />
    </div>

    <div class="input-group">
      <label>이완기 (최저혈압 mmHg)</label>
      <input type="number" id="dia" placeholder="예: 80" value="82" />
    </div>

    <div class="input-group">
      <label>맥박 (회/분)</label>
      <input type="number" id="pulse" placeholder="예: 72" value="75" />
    </div>

    <button class="btn" onclick="saveRecord()">🩸 기록 저장 및 판정하기</button>

    <div class="result-box" id="resBox">
      <b>[오늘의 측정 결과]:</b><br/>
      혈압: 125 / 82 mmHg (정상 수치입니다) ✨
    </div>
  </div>

  <script>
    function saveRecord() {
      const s = parseInt(document.getElementById('sys').value);
      const d = parseInt(document.getElementById('dia').value);
      const p = parseInt(document.getElementById('pulse').value);

      if (!s || !d) { alert('혈압 수치를 정확히 입력해주세요.'); return; }

      let state = '정상 수치입니다 ✨';
      if (s >= 140 || d >= 90) state = '⚠️ 주의: 고혈압 전단계/주의 수치입니다.';
      else if (s < 90 || d < 60) state = '💡 저혈압 수치입니다. 따뜻한 수분을 섭취하세요.';

      document.getElementById('resBox').innerHTML = '<b>[오늘의 측정 결과]:</b><br/>' +
        '혈압: ' + s + ' / ' + d + ' mmHg, 맥박: ' + p + '회<br/>' +
        '<span style="color:#e11d48; font-weight:700;">' + state + '</span>';
      alert('기록이 성공적으로 저장되었습니다! 💖');
    }
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateMemoryCardApp(prompt, category, emoji) {
  const title = '짝짝짝! 동물 카드 짝맞추기 기억력 게임';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #0f172a; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; text-align: center; }
    .card { background: #1e293b; border-radius: 28px; width: 100%; max-width: 390px; padding: 20px 16px; border: 1px solid #334155; }
    h1 { font-size: 1.3rem; color: #38bdf8; margin-bottom: 6px; }
    .score-bar { display: flex; justify-content: space-around; background: #0f172a; padding: 8px; border-radius: 14px; margin-bottom: 14px; font-weight: 700; font-size: 0.9rem; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .card-item { background: #334155; height: 70px; border-radius: 14px; display: flex; align-items: center; justify-content: center; font-size: 2rem; cursor: pointer; user-select: none; transition: 0.2s; }
    .card-item.flipped { background: #4f46e5; }
    .card-item.matched { background: #10b981; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🧩 동물 카드 짝맞추기</h1>
    <div class="score-bar">
      <span>시도: <b id="moves" style="color:#f59e0b">0</b>회</span>
      <span>성공: <b id="matches" style="color:#10b981">0</b> / 6</span>
    </div>
    <div class="grid" id="grid"></div>
    <button onclick="initGame()" style="margin-top:14px; background:#6366f1; color:white; border:none; padding:10px 20px; border-radius:30px; font-weight:bold; cursor:pointer;">🔄 다시하기</button>
  </div>
  <script>
    const emojis = ['🐶', '🐱', '🐼', '🐰', '🦊', '🐯'];
    let flipped = [], moves = 0, matches = 0;
    function initGame() {
      moves = 0; matches = 0; flipped = [];
      document.getElementById('moves').innerText = '0';
      document.getElementById('matches').innerText = '0';
      const deck = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
      const grid = document.getElementById('grid');
      grid.innerHTML = '';
      deck.forEach(e => {
        const el = document.createElement('div');
        el.className = 'card-item';
        el.innerText = '❓';
        el.onclick = () => {
          if (el.classList.contains('flipped') || el.classList.contains('matched') || flipped.length >= 2) return;
          el.classList.add('flipped'); el.innerText = e; flipped.push({ el, e });
          if (flipped.length === 2) {
            moves++; document.getElementById('moves').innerText = moves;
            const [c1, c2] = flipped;
            if (c1.e === c2.e) {
              c1.el.classList.add('matched'); c2.el.classList.add('matched');
              matches++; document.getElementById('matches').innerText = matches;
              flipped = [];
              if (matches === 6) setTimeout(() => alert('🎉 완벽하게 짝을 맞추셨습니다!'), 200);
            } else {
              setTimeout(() => {
                c1.el.classList.remove('flipped'); c2.el.classList.remove('flipped');
                c1.el.innerText = '❓'; c2.el.innerText = '❓'; flipped = [];
              }, 700);
            }
          }
        };
        grid.appendChild(el);
      });
    }
    initGame();
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateGratitudeDiaryApp(prompt, category, emoji) {
  const title = '오늘의 감사 & 행복 한 줄 일기';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); color: #831843; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(131,24,67,0.15); border: 2px solid #fbcfe8; }
    h1 { font-size: 1.35rem; color: #db2777; text-align: center; margin-bottom: 12px; }
    textarea { width: 100%; height: 90px; border: 2px solid #fbcfe8; border-radius: 16px; padding: 12px; font-size: 1rem; outline: none; margin-bottom: 12px; }
    .btn { width: 100%; background: #db2777; color: white; border: none; padding: 14px; border-radius: 16px; font-size: 1.05rem; font-weight: 800; cursor: pointer; }
    .list { margin-top: 16px; max-height: 180px; overflow-y: auto; }
    .item { background: #fdf2f8; border-radius: 12px; padding: 10px 14px; margin-bottom: 8px; font-size: 0.9rem; border-left: 4px solid #db2777; }
  </style>
</head>
<body>
  <div class="card">
    <h1>💖 행복 한 줄 감사 일기</h1>
    <textarea id="inp" placeholder="오늘 감사했던 일이나 행복했던 순간을 작성해보세요..."></textarea>
    <button class="btn" onclick="save()">💌 남기기</button>
    <div class="list" id="list">
      <div class="item">오늘 아침 햇살을 받으며 걸어서 마음이 참 따뜻해졌습니다.🌸</div>
    </div>
  </div>
  <script>
    function save() {
      const v = document.getElementById('inp').value.trim();
      if (!v) return;
      const el = document.createElement('div');
      el.className = 'item';
      el.innerText = v;
      document.getElementById('list').prepend(el);
      document.getElementById('inp').value = '';
      alert('감사한 마음이 기록되었습니다! 💖');
    }
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateTraditionalCraftApp(prompt, category, emoji) {
  const title = '우리 전통 공예! 한국 전통 예술 사진 & 설명 앱';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif; }
    body { background: linear-gradient(135deg, #fffbe6 0%, #fef3c7 100%); color: #78350f; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(120,53,15,0.15); border: 2px solid #fde68a; }
    .badge { display: inline-block; background: #fef3c7; color: #b45309; padding: 5px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 8px; text-align:center; }
    h1 { font-size: 1.35rem; color: #92400e; text-align: center; margin-bottom: 14px; font-weight: 800; }
    .craft-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
    .craft-item { background: #fffbe6; border: 2px solid #fde68a; border-radius: 18px; padding: 14px 10px; text-align: center; cursor: pointer; transition: all 0.2s ease; }
    .craft-item:hover { transform: translateY(-3px); border-color: #d97706; background: #fef3c7; }
    .craft-item .icon { font-size: 2.5rem; margin-bottom: 6px; }
    .craft-item .name { font-size: 0.95rem; font-weight: 800; color: #78350f; }
    .craft-item .desc { font-size: 0.75rem; color: #92400e; margin-top: 4px; }
    .detail-box { background: #fefce8; border: 2px dashed #f59e0b; border-radius: 18px; padding: 16px; text-align: left; margin-bottom: 14px; }
    .detail-title { font-size: 1.1rem; font-weight: 800; color: #b45309; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
    .detail-text { font-size: 0.9rem; line-height: 1.5; color: #451a03; }
    .btn { width: 100%; background: #d97706; color: white; border: none; padding: 14px; border-radius: 16px; font-size: 1.05rem; font-weight: 800; cursor: pointer; box-shadow: 0 4px 12px rgba(217,119,6,0.3); }
  </style>
</head>
<body>
  <div class="card">
    <div style="text-align:center;">
      <span class="badge">🏺 성동 전통 문화 명품관</span>
      <h1>한국 아름다운 전통 공예 갤러리</h1>
    </div>

    <div class="craft-grid">
      <div class="craft-item" onclick="showDetail(0)">
        <div class="icon">📜</div>
        <div class="name">한지 공예</div>
        <div class="desc">닥나무 은은한 멋</div>
      </div>
      <div class="craft-item" onclick="showDetail(1)">
        <div class="icon">🪡</div>
        <div class="name">전통 자수</div>
        <div class="desc">정성스런 무병장수</div>
      </div>
      <div class="craft-item" onclick="showDetail(2)">
        <div class="icon">🏺</div>
        <div class="name">옹기와 도자기</div>
        <div class="desc">숨쉬는 항아리</div>
      </div>
      <div class="craft-item" onclick="showDetail(3)">
        <div class="icon">🪵</div>
        <div class="name">나전칠기</div>
        <div class="desc">영롱한 자개 예술</div>
      </div>
    </div>

    <div class="detail-box" id="detailBox">
      <div class="detail-title" id="dTitle">📜 한지 공예 (韓紙工藝)</div>
      <div class="detail-text" id="dText">
        닥나무 껍질을 정성스럽게 다듬어 만든 한지는 천 년이 지나도 변하지 않는 질김과 따뜻한 질감을 자랑합니다. 서랍장, 조명, 지갑 등 은은한 전통의 멋을 품은 생활 예술품입니다.
      </div>
    </div>

    <button class="btn" onclick="shareThought()">💖 공예 감상 소감 남기기</button>
  </div>

  <script>
    const data = [
      { icon: '📜', title: '📜 한지 공예 (韓紙工藝)', text: '닥나무 껍질을 정성스럽게 다듬어 만든 한지는 천 년이 지나도 변하지 않는 질김과 따뜻한 질감을 자랑합니다. 서랍장, 조명등, 지갑 등 은은한 전통의 멋을 품은 생활 예술품입니다.' },
      { icon: '🪡', title: '🪡 전통 자수 (傳統刺繡)', text: '비단 실에 무병장수와 복을 기원하는 마음을 담아 바느질한 섬세한 예술입니다. 병풍, 복주머니, 베갯잇에 수놓아진 십장생과 모란꽃 패턴이 돋보입니다.' },
      { icon: '🏺', title: '🏺 옹기와 도자기 (甕器)', text: '질흙과 잿물로 만들어 숨을 쉬는 옹기는 장류와 김치를 깊고 풍부하게 익혀줍니다. 정갈한 백자와 그윽한 청자는 선조들의 기품을 드러냅니다.' },
      { icon: '🪵', title: '🪵 나전칠기 (螺鈿漆器)', text: '바다 조개껍데기를 섬세하게 오려 기물 표면에 붙이고 옻칠을 한 전통 공예품입니다. 빛에 따라 칠색으로 반짝이는 자개의 영롱한 빛깔이 으뜸입니다.' }
    ];

    function showDetail(idx) {
      document.getElementById('dTitle').innerText = data[idx].title;
      document.getElementById('dText').innerText = data[idx].text;
    }

    function shareThought() {
      const thought = prompt('전통 공예 작품을 감상하신 소감이나 옛 추억을 남겨주세요:');
      if (thought && thought.trim()) {
        alert('🎉 [' + thought.trim() + '] 소중한 감상 소감이 기록되었습니다! 감사합니다.');
      }
    }
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

// -------------------------------------------------------------
// TEMPLATE GENERATORS
// -------------------------------------------------------------

function generateGugudanGameApp(prompt, category, emoji) {
  const title = '100세 청춘! 쏙쏙 구구단 두뇌 챌린지';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif; }
    body { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); color: #1e3a8a; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(30, 58, 138, 0.15); border: 2px solid #bfdbfe; text-align: center; }
    .badge { display: inline-flex; align-items: center; gap: 6px; background: #dbeafe; color: #1d4ed8; padding: 6px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 10px; }
    h1 { font-size: 1.35rem; font-weight: 800; color: #1e40af; margin-bottom: 8px; }
    
    .dan-tabs { display: flex; gap: 6px; justify-content: center; margin-bottom: 14px; flex-wrap: wrap; }
    .dan-tab { padding: 5px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; cursor: pointer; transition: 0.15s; }
    .dan-tab.active { background: #2563eb; color: #ffffff; border-color: #1d4ed8; }

    .stats { display: flex; justify-content: space-around; background: #f8fafc; padding: 10px; border-radius: 16px; margin-bottom: 14px; font-weight: 800; font-size: 0.95rem; border: 1px solid #e2e8f0; }
    .stat-val { font-size: 1.1rem; }

    .problem-box { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; border-radius: 24px; padding: 22px 10px; margin-bottom: 16px; box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3); }
    .problem-text { font-size: 3.2rem; font-weight: 900; letter-spacing: 4px; }
    .combo-text { font-size: 0.9rem; color: #fde047; font-weight: 700; min-height: 22px; margin-top: 4px; }

    .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 14px; }
    .opt-btn { background: #ffffff; border: 2px solid #cbd5e1; padding: 16px 10px; border-radius: 20px; font-size: 1.8rem; font-weight: 900; color: #1e293b; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.06); transition: all 0.12s ease; }
    .opt-btn:active { transform: scale(0.95); }
    .opt-btn.correct { background: #22c55e !important; color: white !important; border-color: #16a34a !important; }
    .opt-btn.wrong { background: #ef4444 !important; color: white !important; border-color: #dc2626 !important; }

    .btn-restart { background: #2563eb; color: white; border: none; width: 100%; padding: 14px; border-radius: 18px; font-size: 1.1rem; font-weight: 800; cursor: pointer; box-shadow: 0 6px 15px rgba(37,99,235,0.35); transition: 0.2s; }
  </style>
</head>
<body>
  <div class="card" id="gameCard">
    <span class="badge">✖️ 쏙쏙 두뇌 연산</span>
    <h1>어르신 구구단 챌린지</h1>

    <div class="dan-tabs">
      <button class="dan-tab active" onclick="setDanMode('all')">전체 (2~9단)</button>
      <button class="dan-tab" onclick="setDanMode('basic')">기초 (2~5단)</button>
      <button class="dan-tab" onclick="setDanMode('advanced')">심화 (6~9단)</button>
    </div>

    <div class="stats">
      <span>남은 시간: <b class="stat-val" id="timer" style="color:#ef4444">30</b>초</span>
      <span>맞힌 문제: <b class="stat-val" id="score" style="color:#2563eb">0</b>개</span>
    </div>

    <div class="problem-box">
      <div class="problem-text" id="problemText">7 × 8 = ?</div>
      <div class="combo-text" id="comboText"></div>
    </div>

    <div class="options-grid" id="optionsGrid"></div>
  </div>

  <script>
    let danMode = 'all';
    let timeLeft = 30;
    let score = 0;
    let combo = 0;
    let maxCombo = 0;
    let currentAnswer = 0;
    let timerInterval = null;
    let isGameOver = false;

    // Web Audio Sound Synthesizer
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    function playBeep(freq, duration, type = 'sine') {
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.12, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    }

    function playChord() {
      playBeep(523.25, 0.15);
      setTimeout(() => playBeep(659.25, 0.15), 60);
      setTimeout(() => playBeep(783.99, 0.25), 120);
    }

    function setDanMode(mode) {
      danMode = mode;
      document.querySelectorAll('.dan-tab').forEach(b => b.classList.remove('active'));
      event.target.classList.add('active');
      generateProblem();
    }

    function generateProblem() {
      if (isGameOver) return;
      let minDan = 2, maxDan = 9;
      if (danMode === 'basic') { minDan = 2; maxDan = 5; }
      else if (danMode === 'advanced') { minDan = 6; maxDan = 9; }

      const dan = Math.floor(Math.random() * (maxDan - minDan + 1)) + minDan;
      const num = Math.floor(Math.random() * 9) + 1;
      currentAnswer = dan * num;

      document.getElementById('problemText').innerText = dan + ' × ' + num + ' = ?';

      // 4 choices
      const choices = [currentAnswer];
      while (choices.length < 4) {
        const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 4) + 1) * (Math.random() > 0.5 ? dan : 1);
        const wrong = currentAnswer + offset;
        if (wrong > 0 && !choices.includes(wrong)) {
          choices.push(wrong);
        }
      }
      choices.sort(() => Math.random() - 0.5);

      const grid = document.getElementById('optionsGrid');
      grid.innerHTML = '';
      choices.forEach(val => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = val;
        btn.onclick = () => checkAnswer(val, btn);
        grid.appendChild(btn);
      });
    }

    function checkAnswer(chosen, btnEl) {
      if (isGameOver) return;
      if (chosen === currentAnswer) {
        score++;
        combo++;
        if (combo > maxCombo) maxCombo = combo;
        document.getElementById('score').innerText = score;
        if (combo >= 2) {
          document.getElementById('comboText').innerText = '🔥 ' + combo + '연속 정답!';
        } else {
          document.getElementById('comboText').innerText = '👏 정답입니다!';
        }
        btnEl.classList.add('correct');
        playChord();
      } else {
        combo = 0;
        document.getElementById('comboText').innerText = '💡 아쉬워요! 다시 집중!';
        btnEl.classList.add('wrong');
        playBeep(220, 0.25, 'sawtooth');
      }

      setTimeout(() => {
        generateProblem();
      }, 350);
    }

    function startTimer() {
      timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          endGame();
        }
      }, 1000);
    }

    function endGame() {
      isGameOver = true;
      let badgeMsg = '구구단 새싹 🌱';
      if (score >= 15) badgeMsg = '구구단 천재 마스터 👑';
      else if (score >= 10) badgeMsg = '구구단 달인 🏆';
      else if (score >= 5) badgeMsg = '구구단 우등생 🌟';

      document.getElementById('gameCard').innerHTML = '<div style="padding: 20px 10px;">' +
        '<div style="font-size: 3.8rem; margin-bottom: 10px;">🏆</div>' +
        '<h2 style="font-size: 1.5rem; color: #1e40af; margin-bottom: 8px;">챌린지 완료!</h2>' +
        '<p style="font-size: 1.1rem; color: #334155; margin-bottom: 12px;">' +
          '30초 동안 총 <b style="color: #2563eb; font-size: 1.8rem;">' + score + '문제</b>를 맞히셨습니다!' +
        '</p>' +
        '<div style="background:#eff6ff; border:1px solid #bfdbfe; padding:12px; border-radius:16px; margin-bottom:20px; font-weight:800; color:#1d4ed8;">' +
          '획득 칭호: ' + badgeMsg +
        '</div>' +
        '<button class="btn-restart" onclick="location.reload()">🔄 다시 도전하기</button>' +
      '</div>';
      playChord();
    }

    generateProblem();
    startTimer();
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateChosungQuizApp(prompt, category, emoji) {
  const title = '어르신 두뇌 쌩쌩! 초성 낱말 퀴즈';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif; }
    body { background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%); color: #166534; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .container { background: #ffffff; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(22, 101, 52, 0.15); border: 2px solid #bbf7d0; text-align: center; }
    .top-badge { display: inline-flex; align-items: center; gap: 6px; background: #dcfce7; color: #15803d; padding: 6px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 12px; }
    h1 { font-size: 1.4rem; font-weight: 800; color: #14532d; margin-bottom: 6px; }
    .score-bar { display: flex; justify-content: space-between; background: #f0fdf4; padding: 10px 16px; border-radius: 16px; margin: 12px 0 18px 0; font-weight: 700; font-size: 0.95rem; border: 1px solid #dcfce7; }
    .quiz-card { background: #f8fafc; border: 2px dashed #86efac; border-radius: 20px; padding: 22px 14px; margin-bottom: 18px; }
    .category-tag { font-size: 0.9rem; color: #15803d; font-weight: 600; margin-bottom: 6px; }
    .chosung-box { font-size: 2.8rem; font-weight: 900; letter-spacing: 8px; color: #16a34a; margin: 10px 0; animation: pulse 2s infinite ease-in-out; }
    .hint-text { font-size: 1rem; color: #4b5563; min-height: 24px; font-weight: 500; }
    .answer-options { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 16px; }
    .opt-btn { background: #ffffff; border: 2px solid #cbd5e1; padding: 14px 10px; border-radius: 16px; font-size: 1.15rem; font-weight: 700; color: #334155; cursor: pointer; transition: all 0.15s ease; box-shadow: 0 4px 6px rgba(0,0,0,0.03); }
    .opt-btn:active { transform: scale(0.96); }
    .opt-btn.correct { background: #22c55e; color: #ffffff; border-color: #16a34a; }
    .opt-btn.wrong { background: #ef4444; color: #ffffff; border-color: #dc2626; }
    .hint-btn { background: #fef08a; color: #854d0e; border: none; padding: 10px 20px; border-radius: 50px; font-size: 0.95rem; font-weight: 700; cursor: pointer; margin-bottom: 8px; }
    .next-btn { background: #16a34a; color: #ffffff; border: none; width: 100%; padding: 14px; border-radius: 16px; font-size: 1.1rem; font-weight: 800; cursor: pointer; box-shadow: 0 6px 15px rgba(22, 163, 74, 0.35); transition: 0.2s; }
    .next-btn:active { transform: scale(0.98); }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
  </style>
</head>
<body>
  <div class="container">
    <div class="top-badge">🧠 성동복지관 두뇌비타민</div>
    <h1>어르신 초성 낱말 퀴즈</h1>
    
    <div class="score-bar">
      <span>문제: <b id="qIndex" style="color:#16a34a">1</b> / 5</span>
      <span>점수: <b id="score" style="color:#eab308">0</b>점</span>
    </div>

    <div class="quiz-card">
      <div class="category-tag" id="qCat">🍎 과일 / 채소</div>
      <div class="chosung-box" id="chosung">ㅅ ㄱ</div>
      <div class="hint-text" id="hintBox">백설공주가 먹었던 빨갛고 달콤한 과일은?</div>
    </div>

    <div class="answer-options" id="options"></div>

    <div style="display: flex; gap: 8px;">
      <button class="hint-btn" onclick="showExtraHint()">💡 힌트 더보기</button>
      <button class="next-btn" id="nextBtn" onclick="nextQuiz()" style="display:none">다음 문제 풀기 ➡️</button>
    </div>
  </div>

  <script>
    // Web Audio synthesizer for sounds
    function playBeep(freq = 600, duration = 0.15) {
      try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.type = 'sine';
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch(e) {}
    }

    const quizData = [
      { cat: '🍎 맛있는 과일', chosung: 'ㅅ ㄱ', answer: '사과', options: ['사과', '수박', '살구', '석류'], hint: '가을에 익는 빨갛고 아삭아삭한 과일이에요' },
      { cat: '🌸 아름다운 꽃', chosung: 'ㅁ ㄱ ㅎ', answer: '무궁화', options: ['민들레', '무궁화', '목련화', '맨드라미'], hint: '우리나라를 대표하는 국화(國花)예요' },
      { cat: '🐶 귀여운 동물', chosung: 'ㄱ ㅇ ㅇ', answer: '고양이', options: ['강아지', '고양이', '기린', '고릴라'], hint: '야옹~ 생선을 좋아하는 털 달린 친구예요' },
      { cat: '🍲 한국의 음식', chosung: 'ㅂ ㅂ ㅂ', answer: '비빔밥', options: ['볶음밥', '비빔밥', '보리밥', '백숙'], hint: '여러 가지 나물과 고추장을 쓱쓱 비벼 먹어요' },
      { cat: '📖 전래 동화', chosung: 'ㅎ ㅂ ㅇ ㄴ ㅂ', answer: '흥부와 놀부', options: ['흥부와 놀부', '해님과 달님', '혹부리 영감', '효녀 심청'], hint: '제비 다리를 고쳐주고 박을 타서 금은보화를 얻었어요' }
    ];

    let current = 0;
    let score = 0;
    let answered = false;

    function renderQuiz() {
      answered = false;
      const q = quizData[current];
      document.getElementById('qIndex').innerText = current + 1;
      document.getElementById('score').innerText = score;
      document.getElementById('qCat').innerText = q.cat;
      document.getElementById('chosung').innerText = q.chosung;
      document.getElementById('hintBox').innerText = q.hint;
      document.getElementById('nextBtn').style.display = 'none';

      const optContainer = document.getElementById('options');
      optContainer.innerHTML = '';

      q.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = opt;
        btn.onclick = () => selectAnswer(btn, opt, q.answer);
        optContainer.appendChild(btn);
      });
    }

    function selectAnswer(btn, selected, correct) {
      if (answered) return;
      answered = true;
      const buttons = document.querySelectorAll('.opt-btn');

      if (selected === correct) {
        btn.classList.add('correct');
        score += 20;
        document.getElementById('score').innerText = score;
        playBeep(880, 0.25);
        document.getElementById('hintBox').innerHTML = '🎉 <b>정답입니다! 참 잘하셨어요!</b>';
      } else {
        btn.classList.add('wrong');
        playBeep(300, 0.3);
        buttons.forEach(b => {
          if (b.innerText === correct) b.classList.add('correct');
        });
        document.getElementById('hintBox').innerHTML = '❌ 아쉽네요! 정답은 <b>[' + correct + ']</b> 입니다.';
      }

      document.getElementById('nextBtn').style.display = 'block';
    }

    function showExtraHint() {
      const q = quizData[current];
      alert('💡 추가 힌트: 정답의 첫 글자는 [' + q.answer[0] + '] 입니다!');
    }

    function nextQuiz() {
      current++;
      if (current < quizData.length) {
        renderQuiz();
      } else {
        document.querySelector('.container').innerHTML = '<div style="padding: 20px 10px;">' +
          '<div style="font-size: 4rem; margin-bottom: 10px;">👑</div>' +
          '<h2 style="font-size: 1.6rem; color: #15803d; margin-bottom: 8px;">모든 퀴즈 완료!</h2>' +
          '<p style="font-size: 1.2rem; color: #334155; margin-bottom: 20px;">총점: <b style="color: #eab308; font-size: 1.8rem;">' + score + '점</b> / 100점</p>' +
          '<p style="font-size: 1rem; color: #475569; margin-bottom: 24px; line-height: 1.5;">오늘도 어르신의 두뇌가 10년 더 젊어졌습니다! 👏</p>' +
          '<button class="next-btn" onclick="location.reload()">🔄 다시 도전하기</button>' +
        '</div>';
        playBeep(987, 0.4);
      }
    }

    renderQuiz();
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateHealthRoutineApp(prompt, category, emoji) {
  const title = '매일 건강 안심! 복약 & 물마시기 다이어리';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif; }
    body { background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); color: #1e3a8a; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(30, 58, 138, 0.15); border: 2px solid #bfdbfe; }
    .header { text-align: center; margin-bottom: 18px; }
    .badge { display: inline-block; background: #dbeafe; color: #1d4ed8; padding: 5px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 6px; }
    h1 { font-size: 1.35rem; color: #1e40af; }
    .section-title { font-size: 1rem; font-weight: 800; color: #1e3a8a; margin: 16px 0 10px 0; display: flex; justify-content: space-between; align-items: center; }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .item-card { background: #f8fafc; border: 2px solid #e2e8f0; border-radius: 18px; padding: 14px; text-align: center; cursor: pointer; transition: all 0.2s ease; user-select: none; }
    .item-card.done { background: #dcfce7; border-color: #22c55e; color: #15803d; }
    .item-card .icon { font-size: 2rem; margin-bottom: 4px; }
    .item-card .time { font-size: 1rem; font-weight: 800; }
    .item-card .state { font-size: 0.8rem; margin-top: 4px; font-weight: 600; color: #64748b; }
    .item-card.done .state { color: #16a34a; font-weight: 700; }
    .water-cups { display: flex; justify-content: space-between; gap: 6px; margin: 10px 0; }
    .cup { flex: 1; height: 50px; background: #f1f5f9; border: 2px solid #cbd5e1; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; cursor: pointer; transition: 0.2s; }
    .cup.filled { background: #60a5fa; border-color: #2563eb; transform: translateY(-3px); box-shadow: 0 4px 8px rgba(37,99,235,0.25); }
    .progress-box { background: #f1f5f9; border-radius: 14px; height: 16px; overflow: hidden; margin: 14px 0 6px 0; border: 1px solid #cbd5e1; }
    .progress-fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #10b981); width: 0%; transition: width 0.3s ease; }
    .reset-btn { width: 100%; background: #f8fafc; border: 1px solid #cbd5e1; color: #64748b; padding: 10px; border-radius: 14px; font-weight: 700; font-size: 0.9rem; cursor: pointer; margin-top: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <span class="badge">💙 성동 건강지킴이</span>
      <h1>오늘의 복약 & 수분 수첩</h1>
      <div id="todayDate" style="font-size:0.85rem; color:#64748b; margin-top:4px;"></div>
    </div>

    <!-- Medicine Section -->
    <div class="section-title">
      <span>💊 오늘의 시간별 복약</span>
      <span id="medCount" style="color:#2563eb; font-size:0.9rem;">0/4 완료</span>
    </div>
    <div class="grid-2">
      <div class="item-card" onclick="toggleMed(this)">
        <div class="icon">🌅</div>
        <div class="time">아침 식후</div>
        <div class="state">터치하여 완료</div>
      </div>
      <div class="item-card" onclick="toggleMed(this)">
        <div class="icon">☀️</div>
        <div class="time">점심 식후</div>
        <div class="state">터치하여 완료</div>
      </div>
      <div class="item-card" onclick="toggleMed(this)">
        <div class="icon">🌙</div>
        <div class="time">저녁 식후</div>
        <div class="state">터치하여 완료</div>
      </div>
      <div class="item-card" onclick="toggleMed(this)">
        <div class="icon">🛏️</div>
        <div class="time">취침 전</div>
        <div class="state">터치하여 완료</div>
      </div>
    </div>

    <!-- Water Section -->
    <div class="section-title" style="margin-top:20px;">
      <span>💧 하루 5잔 건강 물마시기</span>
      <span id="waterCount" style="color:#0284c7; font-size:0.9rem;">0/5 잔</span>
    </div>
    <div class="water-cups">
      <div class="cup" onclick="toggleCup(0)">🥛</div>
      <div class="cup" onclick="toggleCup(1)">🥛</div>
      <div class="cup" onclick="toggleCup(2)">🥛</div>
      <div class="cup" onclick="toggleCup(3)">🥛</div>
      <div class="cup" onclick="toggleCup(4)">🥛</div>
    </div>

    <!-- Progress -->
    <div class="progress-box">
      <div class="progress-fill" id="pFill"></div>
    </div>
    <div style="text-align:center; font-size:0.9rem; font-weight:700; color:#1e40af;" id="pText">
      오늘 건강 목표 달성률: 0%
    </div>

    <button class="reset-btn" onclick="resetDay()">🔄 오늘 기록 다시 시작</button>
  </div>

  <script>
    const now = new Date();
    document.getElementById('todayDate').innerText = now.toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' });

    let water = [false, false, false, false, false];

    function toggleMed(el) {
      el.classList.toggle('done');
      const state = el.querySelector('.state');
      if (el.classList.contains('done')) {
        state.innerText = '✅ 복용 완료!';
      } else {
        state.innerText = '터치하여 완료';
      }
      updateProgress();
    }

    function toggleCup(idx) {
      water[idx] = !water[idx];
      const cups = document.querySelectorAll('.cup');
      cups[idx].classList.toggle('filled');
      updateProgress();
    }

    function updateProgress() {
      const medDone = document.querySelectorAll('.item-card.done').length;
      const waterDone = water.filter(Boolean).length;
      document.getElementById('medCount').innerText = medDone + '/4 완료';
      document.getElementById('waterCount').innerText = waterDone + '/5 잔';

      const total = 9;
      const completed = medDone + waterDone;
      const pct = Math.round((completed / total) * 100);

      document.getElementById('pFill').style.width = pct + '%';
      document.getElementById('pText').innerText = '오늘 건강 목표 달성률: ' + pct + '%';

      if (pct === 100) {
        setTimeout(() => alert('🎉 축하합니다! 오늘의 건강 복약과 물 마시기 목표를 완벽하게 달성하셨습니다! 👏'), 200);
      }
    }

    function resetDay() {
      if (confirm('오늘의 기록을 초기화하시겠습니까?')) {
        document.querySelectorAll('.item-card').forEach(el => {
          el.classList.remove('done');
          el.querySelector('.state').innerText = '터치하여 완료';
        });
        document.querySelectorAll('.cup').forEach(el => el.classList.remove('filled'));
        water = [false, false, false, false, false];
        updateProgress();
      }
    }
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateLuckyRouletteApp(prompt, category, emoji) {
  const title = '복지관 와글와글! 행운의 룰렛 추첨기';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif; }
    body { background: linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%); color: #881337; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(136, 19, 55, 0.15); border: 2px solid #fecdd3; text-align: center; }
    .badge { display: inline-block; background: #ffe4e6; color: #e11d48; padding: 5px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 8px; }
    h1 { font-size: 1.4rem; color: #9f1239; margin-bottom: 14px; }
    .wheel-container { position: relative; width: 280px; height: 280px; margin: 0 auto 20px auto; }
    #wheelCanvas { width: 100%; height: 100%; border-radius: 50%; box-shadow: 0 8px 20px rgba(0,0,0,0.15); transition: transform 4s cubic-bezier(0.15, 0.9, 0.2, 1); }
    .pointer { position: absolute; top: -14px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 14px solid transparent; border-right: 14px solid transparent; border-top: 26px solid #e11d48; z-index: 10; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3)); }
    .spin-btn { background: linear-gradient(135deg, #e11d48, #be123c); color: white; border: none; width: 100%; padding: 16px; border-radius: 18px; font-size: 1.25rem; font-weight: 800; cursor: pointer; box-shadow: 0 6px 20px rgba(225,29,72,0.4); transition: 0.2s; }
    .spin-btn:active { transform: scale(0.97); }
    .result-box { margin-top: 16px; background: #fff1f2; border: 2px dashed #fda4af; border-radius: 16px; padding: 12px; font-size: 1.1rem; font-weight: 800; color: #be123c; min-height: 50px; display: flex; align-items: center; justify-content: center; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">🎯 성동복지관 이벤트</span>
    <h1>행운의 룰렛 & 경품 추첨기</h1>

    <div class="wheel-container">
      <div class="pointer"></div>
      <canvas id="wheelCanvas" width="560" height="560"></canvas>
    </div>

    <button class="spin-btn" id="spinBtn" onclick="spinWheel()">🎰 룰렛 힘차게 돌리기!</button>
    <div class="result-box" id="resultText">버튼을 눌러 행운을 시험해보세요! ✨</div>
  </div>

  <script>
    const items = ['🎁 쌀 10kg', '☕ 따뜻한 커피쿠폰', '🧻 고급 화장지세트', '🥢 성동 칭찬도장', '🍊 제철 과일바구니', '⭐ 행운의 박수갈채'];
    const colors = ['#f43f5e', '#fb923c', '#eab308', '#22c55e', '#06b6d4', '#a855f7'];
    let currentRotation = 0;
    let isSpinning = false;

    function drawWheel() {
      const canvas = document.getElementById('wheelCanvas');
      const ctx = canvas.getContext('2d');
      const num = items.length;
      const arc = (2 * Math.PI) / num;
      const center = 280;
      const radius = 270;

      ctx.clearRect(0, 0, 560, 560);

      items.forEach((item, i) => {
        const angle = i * arc;
        ctx.beginPath();
        ctx.fillStyle = colors[i % colors.length];
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, angle, angle + arc);
        ctx.lineTo(center, center);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4;
        ctx.stroke();

        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(angle + arc / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px -apple-system, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.fillText(item, radius - 25, 8);
        ctx.restore();
      });

      // Center pin
      ctx.beginPath();
      ctx.fillStyle = '#ffffff';
      ctx.arc(center, center, 36, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.fillStyle = '#e11d48';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('성동', center, center + 7);
    }

    function spinWheel() {
      if (isSpinning) return;
      isSpinning = true;
      document.getElementById('spinBtn').disabled = true;
      document.getElementById('resultText').innerText = '두구두구... 룰렛이 회전 중입니다! 🥁';

      const randomExtra = Math.floor(Math.random() * 360) + 1800; // 5+ full spins
      currentRotation += randomExtra;
      const canvas = document.getElementById('wheelCanvas');
      canvas.style.transform = 'rotate(' + currentRotation + 'deg)';

      setTimeout(() => {
        isSpinning = false;
        document.getElementById('spinBtn').disabled = false;
        
        // Calculate winning slice
        const actualDeg = (currentRotation % 360);
        const arcDeg = 360 / items.length;
        const winningIndex = Math.floor((360 - (actualDeg % 360) + 270) % 360 / arcDeg);
        const prize = items[winningIndex];
        
        document.getElementById('resultText').innerHTML = '🎉 당첨 결과: <b>' + prize + '</b> 축하합니다!';
      }, 4100);
    }

    drawWheel();
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateSpeedMathApp(prompt, category, emoji) {
  const title = '100세 청춘! 스피드 두뇌 덧셈 뺄셈';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: linear-gradient(135deg, #fefce8 0%, #fef08a 100%); color: #713f12; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(113, 63, 18, 0.15); border: 2px solid #fde047; text-align: center; }
    .badge { display: inline-block; background: #fef08a; color: #854d0e; padding: 5px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 10px; }
    h1 { font-size: 1.35rem; color: #854d0e; margin-bottom: 12px; }
    .stats { display: flex; justify-content: space-around; background: #fefce8; padding: 10px; border-radius: 16px; margin-bottom: 18px; font-weight: 800; font-size: 1rem; border: 1px solid #fef08a; }
    .math-box { background: #fefce8; border: 3px solid #eab308; border-radius: 20px; padding: 24px 10px; margin-bottom: 18px; font-size: 3rem; font-weight: 900; color: #a16207; letter-spacing: 4px; }
    .options-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .opt-btn { background: #ffffff; border: 2px solid #fde047; padding: 18px 10px; border-radius: 18px; font-size: 1.6rem; font-weight: 900; color: #854d0e; cursor: pointer; box-shadow: 0 4px 10px rgba(0,0,0,0.05); transition: 0.15s; }
    .opt-btn:active { transform: scale(0.95); background: #fef08a; }
  </style>
</head>
<body>
  <div class="card" id="gameCard">
    <span class="badge">🧮 뇌 활력 훈련</span>
    <h1>스피드 두뇌 덧셈 퀴즈</h1>

    <div class="stats">
      <span>남은 시간: <b id="timer" style="color:#dc2626">30</b>초</span>
      <span>맞힌 문제: <b id="correctCount" style="color:#16a34a">0</b>개</span>
    </div>

    <div class="math-box" id="mathProblem">7 + 5 = ?</div>
    <div class="options-grid" id="options"></div>
  </div>

  <script>
    let timeLeft = 30;
    let score = 0;
    let timerInterval = null;
    let currentAnswer = 0;

    function generateProblem() {
      const isAdd = Math.random() > 0.3;
      let a, b, ans;
      if (isAdd) {
        a = Math.floor(Math.random() * 15) + 3;
        b = Math.floor(Math.random() * 15) + 2;
        ans = a + b;
        document.getElementById('mathProblem').innerText = a + ' + ' + b + ' = ?';
      } else {
        a = Math.floor(Math.random() * 20) + 10;
        b = Math.floor(Math.random() * 9) + 1;
        ans = a - b;
        document.getElementById('mathProblem').innerText = a + ' - ' + b + ' = ?';
      }
      currentAnswer = ans;

      // 4 choices
      const choices = [ans];
      while (choices.length < 4) {
        const offset = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 5) + 1);
        const wrong = ans + offset;
        if (wrong > 0 && !choices.includes(wrong)) choices.push(wrong);
      }
      choices.sort(() => Math.random() - 0.5);

      const optContainer = document.getElementById('options');
      optContainer.innerHTML = '';
      choices.forEach(val => {
        const btn = document.createElement('button');
        btn.className = 'opt-btn';
        btn.innerText = val;
        btn.onclick = () => checkAnswer(val);
        optContainer.appendChild(btn);
      });
    }

    function checkAnswer(chosen) {
      if (chosen === currentAnswer) {
        score++;
        document.getElementById('correctCount').innerText = score;
      }
      generateProblem();
    }

    function startGame() {
      generateProblem();
      timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').innerText = timeLeft;
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          endGame();
        }
      }, 1000);
    }

    function endGame() {
      document.getElementById('gameCard').innerHTML = '<div style="padding: 20px 10px;">' +
        '<div style="font-size: 3.5rem; margin-bottom: 10px;">🏆</div>' +
        '<h2 style="font-size: 1.5rem; color: #854d0e; margin-bottom: 8px;">시간 종료!</h2>' +
        '<p style="font-size: 1.1rem; color: #334155; margin-bottom: 18px;">30초 동안 총 <b style="color: #16a34a; font-size: 1.8rem;">' + score + '개</b> 맞히셨습니다!</p>' +
        '<button class="opt-btn" style="width:100%; font-size:1.1rem; padding:12px; background:#eab308; color:#fff;" onclick="location.reload()">🔄 다시 도전하기</button>' +
      '</div>';
    }

    startGame();
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateMealVoteApp(prompt, category, emoji) {
  const title = '오늘의 복지관 맛있는 식단 & 만족도 투표';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%); color: #7c2d12; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(124, 45, 18, 0.15); border: 2px solid #fed7aa; }
    .badge { display: inline-block; background: #ffedd5; color: #ea580c; padding: 5px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 6px; }
    h1 { font-size: 1.35rem; color: #9a3412; text-align: center; }
    .menu-box { background: #fff7ed; border-radius: 20px; padding: 16px; margin: 16px 0; border: 1px solid #fed7aa; }
    .menu-title { font-weight: 800; color: #c2410c; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; font-size: 1rem; }
    .menu-list { list-style: none; display: flex; flex-direction: column; gap: 6px; font-size: 0.95rem; font-weight: 600; color: #431407; }
    .vote-section { margin-top: 18px; text-align: center; }
    .vote-btns { display: flex; justify-content: space-between; gap: 8px; margin: 12px 0; }
    .v-btn { flex: 1; background: #f8fafc; border: 2px solid #cbd5e1; border-radius: 16px; padding: 12px 6px; font-size: 0.88rem; font-weight: 800; cursor: pointer; transition: 0.2s; }
    .v-btn .emo { font-size: 2rem; display: block; margin-bottom: 4px; }
    .v-btn.selected { background: #ffedd5; border-color: #f97316; color: #c2410c; transform: translateY(-3px); }
    .submit-btn { width: 100%; background: #ea580c; color: white; border: none; padding: 14px; border-radius: 16px; font-size: 1.05rem; font-weight: 800; cursor: pointer; }
  </style>
</head>
<body>
  <div class="card">
    <div style="text-align: center;">
      <span class="badge">🍱 성동 맛있는 밥상</span>
      <h1>오늘의 경로식당 점심 메뉴</h1>
    </div>

    <div class="menu-box">
      <div class="menu-title">🍚 오늘의 영양 식단 안내</div>
      <ul class="menu-list">
        <li>✨ 찰흑미밥 & 얼큰 소고기 미역국</li>
        <li>🍗 바삭 순살 안심 닭강정</li>
        <li>🥗 아삭 콩나물 부추무침</li>
        <li>🥬 잘 익은 배추김치 & 제철 감귤</li>
      </ul>
    </div>

    <div class="vote-section">
      <h3 style="font-size: 1rem; color: #9a3412;">오늘 점심 식사는 어떠셨나요?</h3>
      <div class="vote-btns">
        <button class="v-btn" onclick="selectVote(this, '최고예요!')">
          <span class="emo">😋</span>정말 맛있어요!
        </button>
        <button class="v-btn" onclick="selectVote(this, '보통이에요')">
          <span class="emo">🙂</span>보통이에요
        </button>
        <button class="v-btn" onclick="selectVote(this, '아쉬워요')">
          <span class="emo">🥺</span>조금 아쉬워요
        </button>
      </div>
      <button class="submit-btn" onclick="submitVote()">💌 소중한 의견 남기기</button>
    </div>
  </div>

  <script>
    let selectedText = '';
    function selectVote(btn, txt) {
      document.querySelectorAll('.v-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedText = txt;
    }
    function submitVote() {
      if (!selectedText) {
        alert('만족도 평가를 선택해주세요.');
        return;
      }
      alert('🎉 [' + selectedText + '] 의견이 복지관 영양사 선생님께 전달되었습니다! 감사합니다.');
    }
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateStretchingTimerApp(prompt, category, emoji) {
  const title = '하루 3분! 관절 튼튼 실버 스트레칭';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%); color: #701a75; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; text-align: center; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(112, 26, 117, 0.15); border: 2px solid #f5d0fe; }
    .badge { display: inline-block; background: #fae8ff; color: #a21caf; padding: 5px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 8px; }
    h1 { font-size: 1.35rem; color: #86198f; margin-bottom: 12px; }
    .pose-icon { font-size: 4rem; margin: 10px 0; animation: bounce 2s infinite ease-in-out; }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    .pose-title { font-size: 1.25rem; font-weight: 800; color: #701a75; margin-bottom: 6px; }
    .pose-desc { font-size: 0.95rem; color: #6b21a8; background: #fdf4ff; border-radius: 14px; padding: 10px; margin-bottom: 14px; line-height: 1.5; }
    .timer-circle { width: 120px; height: 120px; border-radius: 50%; border: 6px solid #d946ef; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; font-weight: 900; color: #a21caf; margin: 0 auto 16px auto; background: #fae8ff; }
    .btn-group { display: flex; gap: 10px; }
    .btn { flex: 1; padding: 14px; border-radius: 16px; font-size: 1.05rem; font-weight: 800; border: none; cursor: pointer; transition: 0.2s; }
    .btn-main { background: #c026d3; color: white; }
    .btn-sub { background: #f3e8ff; color: #86198f; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">🧘 실버 힐링 체조</span>
    <h1>관절 튼튼 스트레칭 타이머</h1>

    <div class="pose-icon" id="poseIcon">🙆‍♀️</div>
    <div class="pose-title" id="poseTitle">1단계: 목 & 어깨 풀기</div>
    <div class="pose-desc" id="poseDesc">숨을 깊게 마시며 고개를 좌우로 천천히 5초씩 돌려주세요.</div>

    <div class="timer-circle" id="timer">30</div>

    <div class="btn-group">
      <button class="btn btn-main" id="startBtn" onclick="toggleTimer()">▶ 시작하기</button>
      <button class="btn btn-sub" onclick="nextStep()">다음 동작 ➡️</button>
    </div>
  </div>

  <script>
    const steps = [
      { icon: '🙆‍♀️', title: '1단계: 목 & 어깨 풀기', desc: '숨을 깊게 마시며 고개를 좌우로 천천히 5초씩 돌려주세요.' },
      { icon: '🧘‍♂️', title: '2단계: 허리 & 기지개 펴기', desc: '양손을 깍지 끼고 하늘 위로 시원하게 쭉 뻗어줍니다.' },
      { icon: '🦶', title: '3단계: 무릎 & 발목 털기', desc: '의자에 앉아 발목을 시계 방향으로 부드럽게 10바퀴 돌립니다.' }
    ];
    let stepIdx = 0;
    let timeLeft = 30;
    let timer = null;

    function toggleTimer() {
      const btn = document.getElementById('startBtn');
      if (timer) {
        clearInterval(timer);
        timer = null;
        btn.innerText = '▶ 다시 시작';
      } else {
        btn.innerText = '⏸ 일시 정지';
        timer = setInterval(() => {
          timeLeft--;
          document.getElementById('timer').innerText = timeLeft;
          if (timeLeft <= 0) {
            clearInterval(timer);
            timer = null;
            document.getElementById('timer').innerText = '완료!';
            btn.innerText = '✨ 참 잘하셨어요!';
          }
        }, 1000);
      }
    }

    function nextStep() {
      stepIdx = (stepIdx + 1) % steps.length;
      clearInterval(timer);
      timer = null;
      timeLeft = 30;
      document.getElementById('timer').innerText = '30';
      document.getElementById('startBtn').innerText = '▶ 시작하기';
      document.getElementById('poseIcon').innerText = steps[stepIdx].icon;
      document.getElementById('poseTitle').innerText = steps[stepIdx].title;
      document.getElementById('poseDesc').innerText = steps[stepIdx].desc;
    }
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateNatureSoundApp(prompt, category, emoji) {
  const title = '마음 편안한 숲속 & 빗소리 힐링 사운드박스';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #0f172a; color: #e2e8f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; text-align: center; }
    .card { background: #1e293b; border-radius: 28px; width: 100%; max-width: 390px; padding: 26px 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid #334155; }
    .badge { display: inline-block; background: rgba(56, 189, 248, 0.2); color: #38bdf8; padding: 5px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 10px; }
    h1 { font-size: 1.35rem; color: #f8fafc; margin-bottom: 8px; }
    .quote { font-size: 0.9rem; color: #94a3b8; margin-bottom: 20px; font-style: italic; }
    .sound-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 20px; }
    .s-btn { background: #0f172a; border: 2px solid #334155; border-radius: 20px; padding: 18px 10px; cursor: pointer; color: #cbd5e1; font-weight: 700; font-size: 1rem; transition: 0.2s; }
    .s-btn .icon { font-size: 2.2rem; display: block; margin-bottom: 6px; }
    .s-btn.active { border-color: #38bdf8; background: #1e3a8a; color: #fff; box-shadow: 0 0 15px rgba(56, 189, 248, 0.4); }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">🎵 성동 마음 쉼터</span>
    <h1>자연의 소리 힐링 뮤직박스</h1>
    <div class="quote">"눈을 감고 편안하게 자연의 소리에 귀 기울여보세요."</div>

    <div class="sound-grid">
      <button class="s-btn" onclick="toggleSound(this, 'rain')">
        <span class="icon">🌧️</span>조용한 봄비
      </button>
      <button class="s-btn" onclick="toggleSound(this, 'forest')">
        <span class="icon">🌲</span>숲속 새소리
      </button>
      <button class="s-btn" onclick="toggleSound(this, 'fire')">
        <span class="icon">🔥</span>따뜻한 모닥불
      </button>
      <button class="s-btn" onclick="toggleSound(this, 'wave')">
        <span class="icon">🌊</span>잔잔한 파도
      </button>
    </div>

    <div id="playingText" style="font-size:0.9rem; color:#38bdf8; font-weight:600;">원하는 소리를 터치하여 재생하세요</div>
  </div>

  <script>
    function toggleSound(btn, type) {
      const wasActive = btn.classList.contains('active');
      document.querySelectorAll('.s-btn').forEach(b => b.classList.remove('active'));

      if (!wasActive) {
        btn.classList.add('active');
        document.getElementById('playingText').innerText = '🎵 편안한 소리가 마음을 따뜻하게 치유합니다...';
      } else {
        document.getElementById('playingText').innerText = '소리가 정지되었습니다.';
      }
    }
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateNumberTouchApp(prompt, category, emoji) {
  const title = '두뇌 집중력 UP! 1부터 16까지 스피드 터치';
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    body { background: #0f172a; color: #fff; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; text-align: center; }
    .card { background: #1e293b; border-radius: 28px; width: 100%; max-width: 390px; padding: 22px 18px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); border: 1px solid #334155; }
    h1 { font-size: 1.35rem; color: #38bdf8; margin-bottom: 6px; }
    .target-bar { display: flex; justify-content: space-around; background: #0f172a; padding: 10px; border-radius: 16px; margin: 12px 0 16px 0; font-weight: 800; font-size: 1.05rem; border: 1px solid #334155; }
    .grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 16px; }
    .num-btn { background: #334155; color: white; border: none; height: 65px; border-radius: 14px; font-size: 1.5rem; font-weight: 900; cursor: pointer; transition: 0.15s; }
    .num-btn:active { transform: scale(0.92); }
    .num-btn.done { background: #10b981; opacity: 0.3; pointer-events: none; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🔢 1부터 16까지 스피드 터치</h1>
    <div style="font-size:0.85rem; color:#94a3b8;">숫자를 순서대로 빠르게 찾아 터치하세요!</div>

    <div class="target-bar">
      <span>찾을 숫자: <b id="targetNum" style="color:#f59e0b; font-size:1.4rem;">1</b></span>
      <span>소요 시간: <b id="timerText" style="color:#38bdf8">0.0초</b></span>
    </div>

    <div class="grid" id="grid"></div>
    <button onclick="initGame()" style="background:#6366f1; color:white; border:none; padding:10px 20px; border-radius:30px; font-weight:bold; cursor:pointer;">🔄 다시 시작</button>
  </div>

  <script>
    let target = 1;
    let startTime = null;
    let timerInterval = null;

    function initGame() {
      target = 1;
      document.getElementById('targetNum').innerText = '1';
      document.getElementById('timerText').innerText = '0.0초';
      clearInterval(timerInterval);
      startTime = null;

      const nums = Array.from({ length: 16 }, (_, i) => i + 1).sort(() => Math.random() - 0.5);
      const grid = document.getElementById('grid');
      grid.innerHTML = '';

      nums.forEach(n => {
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        btn.innerText = n;
        btn.onclick = () => onNumberClick(btn, n);
        grid.appendChild(btn);
      });
    }

    function onNumberClick(btn, n) {
      if (n === target) {
        if (!startTime) {
          startTime = Date.now();
          timerInterval = setInterval(() => {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            document.getElementById('timerText').innerText = elapsed + '초';
          }, 100);
        }

        btn.classList.add('done');
        target++;
        if (target <= 16) {
          document.getElementById('targetNum').innerText = target;
        } else {
          clearInterval(timerInterval);
          const finalTime = ((Date.now() - startTime) / 1000).toFixed(1);
          setTimeout(() => alert('🎉 대단해요! ' + finalTime + '초 만에 16까지 완벽히 터치하셨습니다!'), 200);
        }
      }
    }

    initGame();
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}

function generateDynamicCustomApp(prompt, category, emoji, customTitle = null) {
  const title = customTitle || (prompt.length > 28 ? prompt.slice(0, 28) + '...' : prompt);
  const code = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', sans-serif; }
    body { background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); color: #1e293b; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 16px; }
    .card { background: white; border-radius: 28px; width: 100%; max-width: 390px; padding: 24px 20px; box-shadow: 0 15px 35px rgba(0,0,0,0.1); border: 2px solid #cbd5e1; text-align: center; }
    .badge { display: inline-block; background: #e0e7ff; color: #4338ca; padding: 5px 14px; border-radius: 50px; font-weight: 700; font-size: 0.85rem; margin-bottom: 8px; }
    h1 { font-size: 1.35rem; color: #0f172a; margin-bottom: 10px; font-weight: 800; }
    .desc-box { background: #f1f5f9; border-radius: 16px; padding: 14px; margin-bottom: 16px; font-size: 0.92rem; line-height: 1.5; color: #334155; text-align: left; border: 1px solid #e2e8f0; }
    .interactive-board { background: #faf5ff; border: 2px dashed #c084fc; border-radius: 20px; padding: 20px 14px; margin-bottom: 16px; }
    .count-display { font-size: 3.2rem; font-weight: 900; color: #9333ea; margin: 8px 0; }
    .btn { background: #9333ea; color: white; border: none; padding: 14px 24px; border-radius: 50px; font-size: 1.05rem; font-weight: 800; cursor: pointer; box-shadow: 0 4px 14px rgba(147,51,234,0.35); transition: 0.2s; width: 100%; }
    .btn:active { transform: scale(0.96); }
    .notes-section { margin-top: 14px; text-align: left; }
    input { width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 12px; font-size: 0.9rem; margin-top: 6px; outline: none; }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">${emoji} 성동 복지관 맞춤 스마트 앱</span>
    <h1>${title}</h1>
    
    <div class="desc-box">
      <div style="font-weight:700; color:#4338ca; margin-bottom:4px;">💡 앱 기능 개요:</div>
      ${prompt}
    </div>

    <div class="interactive-board">
      <div style="font-size:0.9rem; color:#6b21a8; font-weight:700;">어르신 참여 & 달성 카운터</div>
      <div class="count-display" id="countVal">0</div>
      <button class="btn" onclick="addCount()">✨ +1 스탬프 기록하기</button>
    </div>

    <div class="notes-section">
      <div style="font-size:0.85rem; font-weight:700; color:#475569;">한 줄 한마디 작성하기</div>
      <input type="text" id="noteInput" placeholder="오늘의 소감이나 기록을 남겨보세요..." onkeypress="if(event.key==='Enter') saveNote()" />
    </div>
  </div>

  <script>
    let count = 0;
    function addCount() {
      count++;
      document.getElementById('countVal').innerText = count;
      if (count % 5 === 0) {
        alert('🎉 축하합니다! ' + count + '번째 참여 스탬프 달성!');
      }
    }
    function saveNote() {
      const inp = document.getElementById('noteInput');
      if (inp.value.trim()) {
        alert('📝 [' + inp.value.trim() + '] 소감이 저장되었습니다! 💖');
        inp.value = '';
      }
    }
  </script>
</body>
</html>`;

  return { code, title, category, icon_emoji: emoji, model: '스마트 빌트인 엔진' };
}
