import React, { useState } from 'react';
import { X, Edit3, Save, ClipboardPaste } from 'lucide-react';
import { safeGetItem, safeSetItem } from '../services/supabase';

export default function EditAppModal({ 
  app, 
  teachers, 
  onClose, 
  onSave 
}) {
  const [teacherId, setTeacherId] = useState(() => {
    if (app.teacher_id) return app.teacher_id;
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
  const [title, setTitle] = useState(app.title || '');
  const [description, setDescription] = useState(app.description || '');
  const [category, setCategory] = useState(app.category || '건강/운동');
  const [iconEmoji, setIconEmoji] = useState(app.icon_emoji || '📱');
  const [appCode, setAppCode] = useState(app.app_code || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Emojis preset
  const emojiPresets = ['📱', '🧘‍♂️', '🧩', '⭐', '🧭', '💖', '🎨', '🍱', '🏃‍♀️', '🎵', '🌻', '🎁'];

  // Categories preset
  const categories = ['건강/운동', '교육/게임', '참여/출석', '복지/지도', '마음/힐링', '기타'];

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

    setIsSubmitting(true);

    try {
      const updatedFields = {
        id: app.id,
        teacher_id: teacherId,
        title: title.trim(),
        description: description.trim(),
        category,
        icon_emoji: iconEmoji,
        app_code: appCode,
      };

      await onSave(updatedFields);
      onClose();
    } catch (err) {
      console.error('Failed to update app:', err);
      alert('앱 정보 수정 중 오류가 발생했습니다.');
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
              background: 'linear-gradient(135deg, #6366f1 0%, #818cf8 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.45)',
              flexShrink: 0
            }}>
              <Edit3 size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
                앱 정보 수정
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                등록된 앱의 이름, 아이콘, 카테고리 및 설명을 수정합니다.
              </p>
            </div>
          </div>

          <button
            className="btn btn-secondary btn-icon"
            onClick={onClose}
            style={{ width: '34px', height: '34px' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          
          {/* Teacher Select */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
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
              {teachers.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.department || '성동복지관'})
                </option>
              ))}
            </select>
          </div>

          {/* Title & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '18px' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
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

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">카테고리</label>
              <select
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Icon Emoji */}
          <div className="form-group" style={{ marginBottom: '18px' }}>
            <label className="form-label">앱 아이콘 이모지</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '6px' }}>
              {emojiPresets.map(emoji => (
                <button
                  type="button"
                  key={emoji}
                  onClick={() => setIconEmoji(emoji)}
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    border: '1px solid',
                    background: iconEmoji === emoji ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    borderColor: iconEmoji === emoji ? '#818cf8' : 'var(--border-color)',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Code Input (Optional update) */}
          {app.app_code !== undefined && (
            <div className="form-group" style={{ marginBottom: '18px' }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                border: '1px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label className="form-label" style={{ margin: 0, fontWeight: '700' }}>
                    HTML/CSS/JavaScript 소스코드
                  </label>

                  <button
                    type="button"
                    onClick={handlePasteFromClipboard}
                    className="btn btn-secondary btn-sm"
                    style={{
                      fontSize: '0.78rem',
                      padding: '4px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(168, 85, 247, 0.2)',
                      borderColor: 'rgba(168, 85, 247, 0.4)',
                      color: '#e9d5ff'
                    }}
                  >
                    <ClipboardPaste size={13} />
                    <span>클립보드에서 붙여넣기</span>
                  </button>
                </div>

                <textarea
                  className="form-textarea"
                  rows={5}
                  value={appCode}
                  onChange={(e) => setAppCode(e.target.value)}
                  style={{ fontFamily: 'monospace', fontSize: '0.84rem' }}
                />
              </div>
            </div>
          )}

          {/* Description */}
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label">앱 소개 및 사용 설명</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="복지관 어르신들과 함께 사용할 수 있는 기능이나 연습 목표를 적어주세요."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
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
              style={{
                padding: '10px 24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)'
              }}
            >
              <Save size={16} />
              <span>{isSubmitting ? '저장 중...' : '수정 완료'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
