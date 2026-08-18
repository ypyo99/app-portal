import React, { useState } from 'react';
import { X, UserPlus, Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TeacherModal({ onClose, onSaveTeacher }) {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('1팀');
  const [groupName, setGroupName] = useState('1조');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [iconEmoji, setIconEmoji] = useState('👩‍🏫');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const emojiPresets = ['👩‍🏫', '👨‍🏫', '👩‍💻', '👨‍💻', '🎨', '🌟', '🧩', '🌻'];
  const departments = ['1팀', '2팀', '3팀', '취업팀'];
  const groups = ['1조', '2조', '3조', '4조', '5조', '오전', '오후', '기타'];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('선생님 성함을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const teacherData = {
        name: name.trim(),
        team: department,
        group_name: groupName,
        department: `${department} ${groupName}`,
        bio: bio.trim(),
        avatar_url: avatarUrl.trim(),
        icon_emoji: iconEmoji,
        color: department === '1팀' ? '#ff6b4a' : department === '2팀' ? '#3b82f6' : department === '3팀' ? '#10b981' : '#a855f7',
      };

      await onSaveTeacher(teacherData);

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 }
      });

      onClose();
    } catch (err) {
      console.error(err);
      alert('선생님 등록 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '540px' }}>
        
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
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(99, 102, 241, 0.45)',
              flexShrink: 0
            }}>
              <UserPlus size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#ffffff' }}>
                새로운 선생님 등록
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                Supabase `teachers` 테이블에 새로운 선생님 정보를 등록합니다.
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

        {/* Modal Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px' }}>
          
          {/* Teacher Name */}
          <div className="form-group">
            <label className="form-label">
              선생님 성함 <span style={{ color: '#ff6b4a' }}>*</span>
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="예: 김선생 / 이은지"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Department (Team) & Group in 2 Columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">소속 부서(팀)</label>
              <select
                className="form-select"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">소속 조</label>
              <select
                className="form-select"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              >
                {groups.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Icon Emoji */}
          <div className="form-group">
            <label className="form-label">대표 프로필 이모지</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
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
                    background: iconEmoji === emoji ? 'rgba(99, 102, 241, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                    borderColor: iconEmoji === emoji ? '#818cf8' : 'var(--border-color)',
                    transition: 'all 0.15s'
                  }}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">소개 및 관심 앱 분야</label>
            <textarea
              className="form-textarea"
              rows={2}
              placeholder="예: 어르신 인지 케어 및 스마트 출석 앱을 만들고 있어요 🌿"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {/* Avatar URL (Optional) */}
          <div className="form-group">
            <label className="form-label">프로필 사진 이미지 URL (선택)</label>
            <input
              type="url"
              className="form-input"
              placeholder="https://..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              style={{ fontSize: '0.88rem' }}
            />
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '20px'
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
              className="btn btn-accent"
              disabled={isSubmitting}
              style={{ padding: '10px 22px' }}
            >
              <Sparkles size={16} />
              <span>{isSubmitting ? '등록 중...' : '선생님 등록하기'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
