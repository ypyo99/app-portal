import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Sparkles, 
  Wand2, 
  Smartphone, 
  Tablet, 
  Monitor, 
  RotateCw, 
  Copy, 
  Check, 
  Code, 
  Eye, 
  Plus, 
  Key, 
  Sliders, 
  ArrowRight,
  Layers,
  HelpCircle,
  Download,
  ExternalLink,
  HardDrive
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { 
  generateAppWithPrompt, 
  PROMPT_PRESETS, 
  getGeminiApiKey, 
  saveGeminiApiKey 
} from '../services/aiGenerator';
import { downloadAppHtmlFile, getOfficialDriveFolderUrl } from '../services/googleDrive';

export default function AiAppBuilderModal({ 
  teachers, 
  selectedTeacher, 
  onClose, 
  onSaveApp, 
  onOpenTeacherModal 
}) {
  const [teacherId, setTeacherId] = useState(selectedTeacher ? selectedTeacher.id : (teachers[0]?.id || ''));
  const [prompt, setPrompt] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('교육/게임');
  const [iconEmoji, setIconEmoji] = useState('✨');
  
  // Generation & Status state
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0); // 0 to 4
  const [generatedApp, setGeneratedApp] = useState(null);
  const [editableCode, setEditableCode] = useState('');
  
  // Preview Controls
  const [activeTab, setActiveTab] = useState('preview'); // 'preview', 'code'
  const [deviceMode, setDeviceMode] = useState('mobile'); // 'mobile', 'tablet', 'desktop'
  const [isCopied, setIsCopied] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [refinementPrompt, setRefinementPrompt] = useState('');
  
  // Gemini API Key config
  const [apiKey, setApiKey] = useState(getGeminiApiKey());
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Prompt preset pagination
  const PRESETS_PER_PAGE = 5;
  const [promptPage, setPromptPage] = useState(0);
  const totalPromptPages = Math.ceil(PROMPT_PRESETS.length / PRESETS_PER_PAGE);
  const currentPagePresets = PROMPT_PRESETS.slice(promptPage * PRESETS_PER_PAGE, (promptPage + 1) * PRESETS_PER_PAGE);

  const emojiPresets = ['✨', '🧠', '🧩', '💊', '🎯', '🧮', '🍱', '🧘‍♂️', '🎵', '💖', '⭐', '📱'];
  const categories = ['교육/게임', '건강/운동', '참여/출석', '복지/지도', '마음/힐링', '기타'];

  // Handle Preset Click
  const handleSelectPreset = (preset) => {
    setPrompt(preset.prompt);
    setTitle(preset.title);
    setCategory(preset.category);
    setIconEmoji(preset.emoji);
  };

  // Generate App
  const handleGenerate = async (customPrompt = null) => {
    const textToUse = customPrompt || prompt;
    if (!textToUse.trim()) {
      alert('앱에 대한 설명이나 원하는 기능을 프롬프트로 입력해주세요.');
      return;
    }

    setIsGenerating(true);
    setProgressStep(1);

    const stepTimer1 = setTimeout(() => setProgressStep(2), 600);
    const stepTimer2 = setTimeout(() => setProgressStep(3), 1200);
    const stepTimer3 = setTimeout(() => setProgressStep(4), 1800);

    try {
      const result = await generateAppWithPrompt(textToUse, {
        title,
        category,
        iconEmoji
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      setProgressStep(4);

      setGeneratedApp(result);
      setEditableCode(result.code);
      if (!title.trim() && result.title) {
        setTitle(result.title);
      }
      if (result.category) setCategory(result.category);
      if (result.icon_emoji) setIconEmoji(result.icon_emoji);
      setIsGenerating(false);
      setActiveTab('preview');
      setReloadKey(prev => prev + 1);

      // Confetti burst on generation success
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (err) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      console.error('Generation failed:', err);
      alert('앱 생성 중 문제가 발생했습니다: ' + err.message);
      setIsGenerating(false);
    }
  };

  // Refine App
  const handleRefine = () => {
    if (!refinementPrompt.trim()) return;
    const combinedPrompt = `${prompt}\n\n[추가 수정 및 개선 요청사항]: ${refinementPrompt}`;
    setPrompt(combinedPrompt);
    setRefinementPrompt('');
    handleGenerate(combinedPrompt);
  };

  // Copy Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(editableCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Save Gemini Key
  const handleSaveKey = (e) => {
    e.preventDefault();
    saveGeminiApiKey(apiKey);
    setShowKeyInput(false);
    alert('Gemini API 키가 저장되었습니다.');
  };

  // Save to Welfare Apps
  const handleSaveToPlatform = async () => {
    if (!title.trim()) {
      alert('앱 제목을 입력해주세요.');
      return;
    }
    if (!teacherId) {
      alert('앱을 등록할 선생님을 선택해주세요.');
      return;
    }
    if (!editableCode.trim()) {
      alert('생성된 앱 코드가 없습니다.');
      return;
    }

    setIsSaving(true);
    try {
      const appData = {
        teacher_id: teacherId,
        title: title.trim(),
        description: prompt.slice(0, 180) || 'AI 프롬프트로 생성된 맞춤형 웹 앱입니다.',
        category: category,
        icon_emoji: iconEmoji,
        thumbnail_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80',
        drive_file_url: '',
        app_code: editableCode,
        app_type: 'html_code',
      };

      await onSaveApp(appData);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.5 }
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert('앱 저장에 실패했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div 
      className="modal-overlay" 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{ padding: '16px' }}
    >
      <div 
        className="modal-content" 
        style={{ 
          maxWidth: '1280px', 
          width: '95vw', 
          height: '92vh', 
          maxHeight: '92vh',
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 0
        }}
      >
        {/* Modal Top Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'linear-gradient(90deg, rgba(23, 32, 51, 0.95), rgba(15, 23, 42, 0.95))',
          flexShrink: 0
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 4px 15px rgba(168, 85, 247, 0.4)'
            }}>
              <Wand2 size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  AI 프롬프트 앱 스튜디오
                </h2>
                <span className="badge badge-purple" style={{ fontSize: '0.75rem', padding: '2px 8px' }}>
                  <Sparkles size={12} /> Instant App Builder
                </span>
                {apiKey ? (
                  <span className="badge badge-green" style={{ fontSize: '0.72rem' }}>
                    Gemini 3.6 Flash 연동
                  </span>
                ) : (
                  <span className="badge badge-blue" style={{ fontSize: '0.72rem' }}>
                    스마트 빌트인 엔진 (즉시 생성)
                  </span>
                )}
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                한 줄의 아이디어만 입력하면 어르신들을 위한 반응형 인터랙티브 앱을 3초 만에 완성합니다.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => setShowKeyInput(!showKeyInput)}
              style={{ fontSize: '0.8rem', gap: '5px' }}
            >
              <Key size={13} />
              <span>{apiKey ? 'API 키 설정됨' : 'Gemini 키 입력(선택)'}</span>
            </button>

            <button
              className="btn btn-secondary btn-icon"
              onClick={onClose}
              style={{ width: '36px', height: '36px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Optional API Key Accordion */}
        {showKeyInput && (
          <div style={{
            padding: '12px 24px',
            background: 'rgba(99, 102, 241, 0.1)',
            borderBottom: '1px solid rgba(99, 102, 241, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap',
            flexShrink: 0
          }}>
            <div style={{ fontSize: '0.82rem', color: '#cbd5e1' }}>
              🔑 <strong>Google Gemini API Key</strong>를 입력하면 AI가 더 다양한 무제한 커스텀 앱 코드를 실시간 생성합니다. (미입력 시에도 스마트 내장 엔진으로 즉시 작동)
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <input
                type="password"
                className="form-input"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                style={{ width: '220px', padding: '6px 10px', fontSize: '0.82rem' }}
              />
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleSaveKey}
              >
                저장
              </button>
            </div>
          </div>
        )}

        {/* Studio 2-Column Split Workspace */}
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '460px 1fr',
          overflow: 'hidden',
          background: '#090d16'
        }}>
          
          {/* ================= LEFT COLUMN: Prompt Input & Config ================= */}
          <div style={{
            borderRight: '1px solid var(--border-color)',
            background: 'rgba(17, 24, 39, 0.65)',
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            padding: '20px'
          }}>
            
            {/* 1. Target Teacher */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>
                  제작 선생님 <span style={{ color: '#ff6b4a' }}>*</span>
                </label>
                <button
                  type="button"
                  onClick={onOpenTeacherModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ff8b73',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Plus size={12} /> 새 선생님 등록
                </button>
              </div>
              <select
                className="form-select"
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                style={{ padding: '8px 12px', fontSize: '0.88rem' }}
              >
                <option value="">선생님을 선택해주세요</option>
                {teachers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.department || '성동복지관'})
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Prompt Input Area */}
            <div className="form-group" style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label className="form-label" style={{ fontSize: '0.85rem' }}>
                  어떤 앱을 만들고 싶으신가요? <span style={{ color: '#ff6b4a' }}>*</span>
                </label>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  자연어로 편하게 적어보세요
                </span>
              </div>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="예: 어르신들의 치매 예방을 위한 꽃과 과일 초성 퀴즈 게임 앱 만들어줘. 큰 글씨와 경쾌한 축하 소리도 넣어줘!"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                style={{ 
                  fontSize: '0.88rem',
                  lineHeight: '1.5',
                  borderColor: prompt ? 'rgba(168, 85, 247, 0.4)' : 'var(--border-color)'
                }}
              />
            </div>

            {/* 3. Recommended Prompt Preset Chips */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: '700', color: '#cbd5e1' }}>
                  💡 추천 프롬프트 아이디어 (1-클릭 선택)
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {promptPage * PRESETS_PER_PAGE + 1}–{Math.min((promptPage + 1) * PRESETS_PER_PAGE, PROMPT_PRESETS.length)} / {PROMPT_PRESETS.length}개
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {currentPagePresets.map((p) => (
                  <div
                    key={p.id}
                    onClick={() => handleSelectPreset(p)}
                    style={{
                      padding: '8px 12px',
                      background: prompt === p.prompt ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: `1px solid ${prompt === p.prompt ? '#a855f7' : 'var(--border-color)'}`,
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: '700', color: '#f3f4f6', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {p.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Pagination Controls */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '10px' }}>
                <button
                  onClick={() => setPromptPage(p => Math.max(0, p - 1))}
                  disabled={promptPage === 0}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    background: promptPage === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(168, 85, 247, 0.1)',
                    color: promptPage === 0 ? 'var(--text-muted)' : '#c084fc',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: promptPage === 0 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  ← 이전
                </button>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {Array.from({ length: totalPromptPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setPromptPage(i)}
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        border: 'none',
                        background: i === promptPage ? '#a855f7' : 'rgba(255,255,255,0.08)',
                        color: i === promptPage ? '#fff' : 'var(--text-muted)',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        display: Math.abs(i - promptPage) <= 2 ? 'flex' : 'none',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPromptPage(p => Math.min(totalPromptPages - 1, p + 1))}
                  disabled={promptPage === totalPromptPages - 1}
                  style={{
                    padding: '5px 12px',
                    borderRadius: '20px',
                    border: '1px solid var(--border-color)',
                    background: promptPage === totalPromptPages - 1 ? 'rgba(255,255,255,0.03)' : 'rgba(168, 85, 247, 0.1)',
                    color: promptPage === totalPromptPages - 1 ? 'var(--text-muted)' : '#c084fc',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    cursor: promptPage === totalPromptPages - 1 ? 'not-allowed' : 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  다음 →
                </button>
              </div>
            </div>

            {/* 4. App Details (Title, Category, Emoji) */}
            <div style={{
              background: 'rgba(0, 0, 0, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: '12px',
              border: '1px solid var(--border-color)',
              marginBottom: '16px'
            }}>
              <div className="form-group" style={{ marginBottom: '10px' }}>
                <label className="form-label" style={{ fontSize: '0.8rem' }}>앱 제목</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="자동 생성되거나 직접 입력"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  style={{ padding: '6px 10px', fontSize: '0.84rem' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>카테고리</label>
                  <select
                    className="form-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{ padding: '6px 8px', fontSize: '0.82rem' }}
                  >
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ fontSize: '0.8rem' }}>아이콘 이모지</label>
                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                    {emojiPresets.slice(0, 5).map((emo) => (
                      <button
                        key={emo}
                        type="button"
                        onClick={() => setIconEmoji(emo)}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          border: '1px solid',
                          background: iconEmoji === emo ? '#a855f7' : 'rgba(255,255,255,0.05)',
                          borderColor: iconEmoji === emo ? '#c084fc' : 'var(--border-color)',
                          cursor: 'pointer',
                          fontSize: '0.95rem'
                        }}
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Main Generation Button */}
            <div style={{ marginTop: 'auto' }}>
              <button
                type="button"
                className="btn btn-accent"
                onClick={() => handleGenerate()}
                disabled={isGenerating || !prompt.trim()}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '1rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #f43f5e 100%)',
                  boxShadow: '0 4px 20px rgba(168, 85, 247, 0.4)',
                  cursor: isGenerating ? 'not-allowed' : 'pointer'
                }}
              >
                <Sparkles size={18} />
                <span>{isGenerating ? 'AI가 앱을 코딩하는 중...' : '✨ AI로 앱 생성하기'}</span>
              </button>
            </div>

          </div>

          {/* ================= RIGHT COLUMN: Live Interactive Sandbox & Code Viewer ================= */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            background: '#040714',
            overflow: 'hidden'
          }}>
            
            {/* Top Toolbar */}
            <div style={{
              padding: '10px 18px',
              background: 'rgba(15, 23, 42, 0.95)',
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              flexShrink: 0
            }}>
              
              {/* Tab Switcher: Preview vs Code */}
              <div style={{
                display: 'flex',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: 'var(--radius-md)',
                padding: '3px',
                border: '1px solid var(--border-color)'
              }}>
                <button
                  onClick={() => setActiveTab('preview')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'preview' ? '#6366f1' : 'transparent',
                    color: activeTab === 'preview' ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  <Eye size={13} />
                  <span>실시간 실행 미리보기</span>
                </button>

                <button
                  onClick={() => setActiveTab('code')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '5px 12px',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    border: 'none',
                    cursor: 'pointer',
                    background: activeTab === 'code' ? '#6366f1' : 'transparent',
                    color: activeTab === 'code' ? '#fff' : 'var(--text-muted)'
                  }}
                >
                  <Code size={13} />
                  <span>HTML 소스코드 보기</span>
                </button>
              </div>

              {/* Device Mode Switcher (Visible on preview tab) */}
              {activeTab === 'preview' && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: 'var(--radius-full)',
                  padding: '3px',
                  border: '1px solid var(--border-color)'
                }}>
                  <button
                    onClick={() => setDeviceMode('mobile')}
                    title="모바일 폰 화면 (390px)"
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      background: deviceMode === 'mobile' ? '#a855f7' : 'transparent',
                      color: deviceMode === 'mobile' ? '#fff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Smartphone size={13} /> 폰
                  </button>

                  <button
                    onClick={() => setDeviceMode('tablet')}
                    title="태블릿 화면 (768px)"
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      background: deviceMode === 'tablet' ? '#a855f7' : 'transparent',
                      color: deviceMode === 'tablet' ? '#fff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Tablet size={13} /> 태블릿
                  </button>

                  <button
                    onClick={() => setDeviceMode('desktop')}
                    title="데스크톱 전체화면"
                    style={{
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      background: deviceMode === 'desktop' ? '#a855f7' : 'transparent',
                      color: deviceMode === 'desktop' ? '#fff' : 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Monitor size={13} /> 데스크톱
                  </button>
                </div>
              )}

              {/* Utility actions */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {activeTab === 'preview' && (
                  <button
                    className="btn btn-secondary btn-icon"
                    onClick={() => setReloadKey(prev => prev + 1)}
                    title="앱 다시 시작"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <RotateCw size={14} />
                  </button>
                )}

                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleCopyCode}
                  disabled={!editableCode}
                  style={{ fontSize: '0.78rem', gap: '4px' }}
                >
                  {isCopied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
                  <span>{isCopied ? '복사됨!' : '코드 복사'}</span>
                </button>
              </div>

            </div>

            {/* Middle Main Preview / Editor Area */}
            <div style={{
              flex: 1,
              position: 'relative',
              overflow: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px'
            }}>
              
              {/* Case 1: Generating Loading State with Steps */}
              {isGenerating ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  maxWidth: '420px',
                  animation: 'fadeIn 0.3s'
                }}>
                  <div style={{
                    width: '70px',
                    height: '70px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, #ec4899 0%, #a855f7 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    margin: '0 auto 24px auto',
                    boxShadow: '0 0 35px rgba(236, 72, 153, 0.6)',
                    animation: 'pulseGlow 2s infinite'
                  }}>
                    ✨
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                    AI가 복지관 스마트 앱을 제작하고 있습니다
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
                    요구사항에 맞춘 최적의 HTML5 인터랙션 코드를 구성 중입니다.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.85rem',
                      color: progressStep >= 1 ? '#6ee7b7' : '#64748b'
                    }}>
                      <span>{progressStep >= 1 ? '✅' : '⏳'}</span>
                      <span>1. 프롬프트 기획 & 사용자 UX 구조 분석</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.85rem',
                      color: progressStep >= 2 ? '#6ee7b7' : '#64748b'
                    }}>
                      <span>{progressStep >= 2 ? '✅' : '⏳'}</span>
                      <span>2. 어르신 시니어 맞춤 가독성 UI/UX 디자인 생성</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.85rem',
                      color: progressStep >= 3 ? '#6ee7b7' : '#64748b'
                    }}>
                      <span>{progressStep >= 3 ? '✅' : '⏳'}</span>
                      <span>3. 인터랙션 스크립트 & 사운드 이펙트 코딩</span>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      fontSize: '0.85rem',
                      color: progressStep >= 4 ? '#6ee7b7' : '#64748b'
                    }}>
                      <span>{progressStep >= 4 ? '✅' : '⏳'}</span>
                      <span>4. 모바일 & 태블릿 반응형 호환성 검증</span>
                    </div>
                  </div>
                </div>
              ) : editableCode ? (
                activeTab === 'preview' ? (
                  /* Case 2: Interactive Sandbox Preview */
                  <div className={`device-frame-${deviceMode}`} style={{ margin: 'auto' }}>
                    <iframe
                      key={reloadKey}
                      title="AI Generated App Preview"
                      className="sandbox-iframe"
                      srcDoc={editableCode}
                      sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                    />
                  </div>
                ) : (
                  /* Case 3: Code Inspector & Editor */
                  <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ fontSize: '0.8rem', color: '#93c5fd', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                      <span>💻 실시간 HTML/CSS/JS 소스코드 (직접 수정 시 미리보기에 즉시 반영됩니다)</span>
                      <span>{editableCode.length} 글자</span>
                    </div>
                    <textarea
                      value={editableCode}
                      onChange={(e) => setEditableCode(e.target.value)}
                      style={{
                        flex: 1,
                        width: '100%',
                        background: '#0d1117',
                        color: '#58a6ff',
                        fontFamily: 'monospace',
                        fontSize: '0.84rem',
                        lineHeight: '1.5',
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid #30363d',
                        outline: 'none',
                        resize: 'none'
                      }}
                    />
                  </div>
                )
              ) : (
                /* Case 4: Initial Empty Guide State */
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  maxWidth: '460px',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ fontSize: '3.5rem', marginBottom: '14px' }}>✨</div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--text-main)', marginBottom: '8px' }}>
                    나만의 아이디어를 멋진 앱으로 만들어보세요!
                  </h3>
                  <p style={{ fontSize: '0.88rem', lineHeight: '1.6', marginBottom: '24px' }}>
                    좌측에서 추천 프롬프트를 선택하거나, 원하는 기능(퀴즈, 건강 루틴, 룰렛, 타이머 등)을 자유롭게 입력한 후 
                    <strong style={{ color: '#ec4899' }}> [AI로 앱 생성하기]</strong> 버튼을 눌러보세요.
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px',
                    textAlign: 'left'
                  }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#a5b4fc', marginBottom: '4px' }}>📱 원클릭 즉시 실행</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>별도 개발 도구 없이 브라우저에서 바로 조작 테스트</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontWeight: '700', fontSize: '0.82rem', color: '#fbcfe8', marginBottom: '4px' }}>💖 선생님 앱 쉐어</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>마음에 들면 내 이름으로 1초 만에 등록 및 공유</div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Refinement & Save Action Bar */}
            {editableCode && (
              <div style={{
                padding: '14px 20px',
                background: 'rgba(15, 23, 42, 0.95)',
                borderTop: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                flexWrap: 'wrap',
                flexShrink: 0
              }}>
                
                {/* Refinement input */}
                <div style={{ display: 'flex', flex: 1, minWidth: '260px', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="수정 요청 (예: 글자 크기 더 키워줘, 주황색 테마로 바꿔줘)..."
                    value={refinementPrompt}
                    onChange={(e) => setRefinementPrompt(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleRefine(); }}
                    style={{ padding: '8px 12px', fontSize: '0.85rem' }}
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleRefine}
                    disabled={!refinementPrompt.trim() || isGenerating}
                    style={{ whiteSpace: 'nowrap' }}
                  >
                    🔄 수정 요청
                  </button>
                </div>

                {/* Action Buttons: Download HTML for Google Drive + Save to Platform */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => downloadAppHtmlFile(selectedTeacherObj?.name, title, editableCode)}
                    title="선생님_앱이름.html 파일로 다운로드하여 구글 드라이브에 보관합니다"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '8px 14px',
                      fontSize: '0.82rem',
                      background: 'rgba(59, 130, 246, 0.15)',
                      borderColor: '#3b82f6',
                      color: '#93c5fd'
                    }}
                  >
                    <Download size={14} />
                    <span>📥 HTML 다운로드</span>
                  </button>

                  <a
                    href="https://drive.google.com/drive/folders/1-hpo5T2Qvas3QsH2DBOKYOpY6fmSaXjC?usp=drive_link"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary btn-sm"
                    title="성동복지관 구글 드라이브 공식 폴더를 엽니다"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      padding: '8px 12px',
                      fontSize: '0.82rem',
                      color: '#cbd5e1',
                      textDecoration: 'none'
                    }}
                  >
                    <ExternalLink size={13} />
                    <span>드라이브 열기</span>
                  </a>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveToPlatform}
                    disabled={isSaving}
                    style={{
                      padding: '10px 20px',
                      fontSize: '0.92rem',
                      fontWeight: '800',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Check size={17} />
                    <span>{isSaving ? '저장 중...' : '🎉 내 앱으로 즉시 등록 & 배포'}</span>
                  </button>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
