import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  Sparkles, 
  ClipboardPaste
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { downloadAppHtmlFile } from '../services/googleDrive';
import { safeGetItem, safeSetItem } from '../services/supabase';

export default function UploadModal({ 
  teachers, 
  selectedTeacher, 
  onClose, 
  onSaveApp, 
  onOpenTeacherModal,
  onOpenAiBuilder
}) {
  const [teacherId, setTeacherId] = useState(() => {
    if (selectedTeacher) return selectedTeacher.id;
    const lastId = safeGetItem('seongdong_last_selected_teacher_id');
    if (lastId && teachers.some(t => t.id === lastId)) return lastId;
    return teachers[0]?.id || '';
  });

  const handleTeacherChange = (id) => {
    setTeacherId(id);
    if (id) {
      safeSetItem('seongdong_last_selected_teacher_id', id);
    }
  };
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('건강/운동');
  const [iconEmoji, setIconEmoji] = useState('📱');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  
  // Tab: 'html_code' only
  const [uploadType, setUploadType] = useState('html_code');
  const [appCode, setAppCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clipboard paste handler
  const handlePasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text && text.trim()) {
        setAppCode(text);
      } else {
        alert('클립보드에 복사된 텍스트 내용이 없습니다.');
      }
    } catch (err) {
      console.error('Failed to read clipboard:', err);
      alert('클립보드 읽기 권한이 필요하거나 브라우저 보안 정책상 허용되지 않았습니다. (Ctrl + V 키를 사용해 붙여넣어 주세요)');
    }
  };

  // Emojis preset
  const emojiPresets = ['📱', '🧘‍♂️', '🧩', '⭐', '🧭', '💖', '🎨', '🍱', '🏃‍♀️', '🎵', '🌻', '🎁'];

  // Categories preset
  const categories = ['건강/운동', '교육/게임', '참여/출석', '복지/지도', '마음/힐링', '기타'];


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('앱 제목을 입력해주세요.');
      return;
    }
    if (!teacherId) {
      alert('제작하신 선생님을 선택해주세요.');
      return;
    }

    if (!appCode.trim()) {
      alert('앱 HTML/JS 소스코드를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const appData = {
        teacher_id: teacherId,
        title: title.trim(),
        description: description.trim(),
        category,
        icon_emoji: iconEmoji,
        thumbnail_url: thumbnailUrl.trim(),
        drive_file_url: '',
        app_code: appCode,
        app_type: 'html_code',
      };

      await onSaveApp(appData);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert('앱 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '680px' }}>
        
        {/* Modal Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(23, 32, 51, 0.5)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #ff6b4a 0%, #fa5252 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(255, 107, 74, 0.45)',
              flexShrink: 0
            }}>
              <Upload size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>
                새로운 앱 등록
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                HTML을 붙여넣기 해서 앱을 등록합니다.
              </p>
            </div>
          </div>

          <button
            className="btn btn-icon"
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              background: '#e2e8f0',
              color: '#0f172a',
              border: '1px solid rgba(0, 0, 0, 0.1)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          
          {/* Teacher Selection */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label className="form-label">
                제작한 선생님 <span style={{ color: '#ff6b4a' }}>*</span>
              </label>

            </div>
            <select
              className="form-select"
              value={teacherId}
              onChange={(e) => handleTeacherChange(e.target.value)}
              required
            >
              <option value="">선생님을 선택해주세요</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.department || '성동복지관'})
                </option>
              ))}
            </select>
          </div>

          {/* App Title & Category in Responsive 2-Columns */}
          <div className="form-row-2col">
            <div className="form-group">
              <label className="form-label">
                앱 제목 <span style={{ color: '#ff6b4a' }}>*</span>
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="예: 어르신 두뇌 비타민 퀴즈"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">카테고리</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Icon Emoji Picker */}
          <div className="form-group">
            <label className="form-label">앱 아이콘 이모지</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {emojiPresets.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setIconEmoji(emoji)}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '12px',
                    fontSize: '1.45rem',
                    border: '1px solid',
                    cursor: 'pointer',
                    background: iconEmoji === emoji ? 'rgba(255, 107, 74, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    borderColor: iconEmoji === emoji ? '#ff6b4a' : 'var(--border-color)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Method Content */}
          <div style={{
            background: 'var(--section-box-bg)',
            borderRadius: 'var(--radius-lg)',
            padding: '16px',
            border: '1px solid var(--border-color)',
            marginBottom: '18px'
          }}>

            {/* HTML Code Input */}
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', flexWrap: 'wrap', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    style={{
                      background: 'linear-gradient(135deg, #9333ea 0%, #c026d3 100%)',
                      border: 'none',
                      color: '#ffffff',
                      padding: '7px 16px',
                      borderRadius: '8px',
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: '0 4px 12px rgba(147, 51, 234, 0.35)',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <ClipboardPaste size={15} />
                    <span>📋 클립보드에서 붙여넣기</span>
                  </button>

                  <label className="form-label" style={{ fontSize: '1.05rem', margin: 0 }}>
                    HTML/CSS/JavaScript 코드 직접 입력
                  </label>
                </div>
                <textarea
                  className="form-textarea"
                  rows={6}
                  placeholder="<!DOCTYPE html><html><body><h1>나의 첫 번째 복지관 앱</h1></body></html>"
                  value={appCode}
                  onChange={(e) => setAppCode(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.92rem' }}
                />
              </div>

          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">앱 소개 및 사용 설명</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="복지관 어르신들과 함께 사용할 수 있는 기능이나 연습 목표를 적어주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>



          {/* Footer Submit */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '24px'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              취소
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ padding: '10px 24px' }}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? '등록 중...' : '✨ 앱 등록 완료'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
