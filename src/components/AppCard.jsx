import React, { useState } from 'react';
import { Play, HardDrive, Eye, Calendar, ExternalLink, Sparkles, Trash2, AlertTriangle, X, Edit3 } from 'lucide-react';
import { extractDriveFileId, downloadAppHtmlFile } from '../services/googleDrive';
import EditAppModal from './EditAppModal';

// ─── Delete Confirm Dialog ──────────────────────────────────────────────────
function DeleteConfirmDialog({ app, teacher, onConfirm, onCancel }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    await onConfirm();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        animation: 'fadeIn 0.15s ease'
      }}
      onClick={(e) => { if (e.target === e.currentTarget && !isDeleting) onCancel(); }}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '420px',
          borderRadius: '20px',
          overflow: 'hidden',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 40px rgba(239, 68, 68, 0.1)',
          animation: 'slideUp 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 24px 0',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <AlertTriangle size={24} color="#f87171" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '2px' }}>
                이 앱을 삭제하시겠습니까?
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                이 작업은 되돌릴 수 없습니다
              </p>
            </div>
          </div>
          <button
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              color: 'var(--text-muted)',
              flexShrink: 0
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* App Info Preview */}
        <div style={{ padding: '20px 24px' }}>
          <div style={{
            background: 'rgba(239, 68, 68, 0.06)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            borderRadius: '12px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '16px'
          }}>
            <span style={{ fontSize: '2rem' }}>{app.icon_emoji || '📱'}</span>
            <div style={{ minWidth: 0 }}>
              <p style={{
                fontWeight: '700',
                color: 'var(--text-main)',
                fontSize: '0.95rem',
                marginBottom: '3px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap'
              }}>
                {app.title}
              </p>
              <p style={{ fontSize: '0.78rem', color: '#f87171' }}>
                {(teacher?.name || '').replace(/선생님$/g, '').trim() || '제작자'} 제작
              </p>
            </div>
          </div>

          <p style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            <strong style={{ color: '#f87171' }}>"{app.title}"</strong> 앱을 정말 삭제하시겠습니까?
            <br />
            Supabase DB와 로컬 데이터에서 모두 제거되며, 복구가 불가능합니다.
          </p>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={onCancel}
              disabled={isDeleting}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.12)',
                background: 'rgba(255,255,255,0.06)',
                color: '#cbd5e1',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit'
              }}
              onMouseEnter={e => { if (!isDeleting) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
            >
              취소
            </button>
            <button
              onClick={handleConfirm}
              disabled={isDeleting}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '10px',
                border: 'none',
                background: isDeleting
                  ? 'rgba(239, 68, 68, 0.4)'
                  : 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
                color: '#fff',
                fontWeight: '700',
                fontSize: '0.9rem',
                cursor: isDeleting ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '7px',
                transition: 'all 0.2s',
                boxShadow: isDeleting ? 'none' : '0 4px 14px rgba(220, 38, 38, 0.4)',
                fontFamily: 'inherit'
              }}
            >
              {isDeleting ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
                  삭제 중...
                </>
              ) : (
                <>
                  <Trash2 size={15} />
                  삭제하기
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


// ─── AppCard ────────────────────────────────────────────────────────────────
export default function AppCard({ app, teacher, teachers, onRunApp, onSelectTeacher, onDeleteApp, onEditApp }) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const isGDrive = !!app.drive_file_url;
  const driveFileId = extractDriveFileId(app.drive_file_url);

  const handleDeleteConfirm = async () => {
    if (onDeleteApp) await onDeleteApp(app.id);
    setShowDeleteDialog(false);
  };

  // Category Color Map
  const getCategoryBadgeClass = (category) => {
    switch (category) {
      case '건강/운동': return 'badge-coral';
      case '교육/게임': return 'badge-blue';
      case '참여/출석': return 'badge-amber';
      case '복지/지도': return 'badge-green';
      case '마음/힐링': return 'badge-purple';
      default: return 'badge-blue';
    }
  };

  const formattedDate = app.created_at 
    ? new Date(app.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })
    : '최근';

  return (
    <>
    <div 
      className="glass-panel glass-panel-hover"
      style={{
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-color)',
        background: 'var(--bg-card)'
      }}
    >
      {/* Thumbnail Banner / Preview Area */}
      <div 
        onClick={() => onRunApp(app)}
        style={{
          height: '140px',
          width: '100%',
          position: 'relative',
          background: app.thumbnail_url 
            ? `url(${app.thumbnail_url}) center/cover no-repeat`
            : 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          cursor: 'pointer',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Dark overlay for contrast */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(11, 15, 25, 0.2), rgba(11, 15, 25, 0.85))'
        }} />

        {/* Big Emoji / Icon */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          fontSize: '3.5rem',
          filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.5))',
          transition: 'transform 0.3s ease'
        }}>
          {app.icon_emoji || '📱'}
        </div>

        {/* Top Badges */}
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '12px',
          right: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 3
        }}>
          <span 
            className={`badge ${getCategoryBadgeClass(app.category)}`}
            style={{ 
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.25)', 
              backdropFilter: 'blur(6px)',
              fontWeight: '800'
            }}
          >
            {app.category || '일반'}
          </span>
        </div>

        {/* Hover Play Button Overlay */}
        <div 
          className="hover-play-btn"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(255, 107, 74, 0.4)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#fff',
            fontWeight: '700',
            fontSize: '1rem',
            opacity: 0,
            transition: 'opacity 0.2s ease',
            zIndex: 4
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
        >
          <Play size={24} fill="#fff" />
          <span>바로 실행</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div style={{ padding: '16px 14px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        
        {/* Title */}
        <h3 
          onClick={() => onRunApp(app)}
          style={{
            fontSize: '1.15rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            marginBottom: '8px',
            cursor: 'pointer',
            lineHeight: '1.4'
          }}
        >
          {app.title}
        </h3>

        {/* Teacher Info Row (Displays Teacher Name without team info) */}
        {(() => {
          const currentTeacher = teacher || (teachers && teachers.find(t => String(t.id) === String(app.teacher_id)));
          const rawName = currentTeacher ? currentTeacher.name : (app.teacher_name || app.teacherName || '');
          const cleanName = rawName.replace(/선생님$/g, '').trim();
          const displayTeacherName = cleanName || '제작자';
          const teacherEmoji = currentTeacher ? (currentTeacher.icon_emoji || '👩‍🏫') : '👩‍🏫';

          return (
            <div 
              onClick={(e) => {
                e.stopPropagation();
                if (onSelectTeacher && currentTeacher) onSelectTeacher(currentTeacher);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '10px',
                cursor: currentTeacher ? 'pointer' : 'default',
                width: 'fit-content'
              }}
            >
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: 'rgba(255, 107, 74, 0.18)',
                border: '1px solid rgba(255, 107, 74, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.9rem'
              }}>
                {teacherEmoji}
              </div>
              <span style={{ fontSize: '0.96rem', fontWeight: '800', color: 'var(--teacher-name-color)' }}>
                {displayTeacherName}
              </span>
            </div>
          );
        })()}

        {/* Description */}
        <p style={{
          fontSize: '0.86rem',
          color: 'var(--card-desc-color)',
          lineHeight: '1.5',
          marginBottom: '18px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          flex: 1
        }}>
          {app.description || '선생님이 복지관을 위해 제작한 스마트 앱입니다.'}
        </p>

        {/* Stats & Launch CTA */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          paddingTop: '12px',
          borderTop: '1px solid var(--border-color)',
          marginTop: 'auto'
        }}>
          {/* Row 1: Views & Date */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--card-stats-color)', whiteSpace: 'nowrap' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Eye size={12} />
              {app.view_count || 0}회
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={12} />
              {formattedDate}
            </span>
          </div>

          {/* Row 2: Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', width: '100%' }}>
            {/* Edit Button */}
            {onEditApp && (
              <button
                className="btn btn-secondary btn-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                }}
                title="앱 정보 수정 (이름, 이모지, 카테고리, 설명)"
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  padding: 0,
                  borderRadius: 'var(--radius-full)', 
                  background: 'rgba(99, 102, 241, 0.15)',
                  borderColor: 'rgba(99, 102, 241, 0.4)',
                  color: '#818cf8',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.28)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)';
                  e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)';
                }}
              >
                <Edit3 size={14} />
              </button>
            )}

            {/* Delete Button */}
            {onDeleteApp && (
              <button
                className="btn btn-secondary btn-icon"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteDialog(true);
                }}
                title="앱 삭제"
                style={{ 
                  width: '36px', 
                  height: '36px', 
                  padding: 0,
                  borderRadius: 'var(--radius-full)', 
                  background: 'rgba(239, 68, 68, 0.1)',
                  borderColor: 'rgba(239, 68, 68, 0.35)',
                  color: '#f87171',
                  transition: 'all 0.2s',
                  flexShrink: 0
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.6)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.35)';
                }}
              >
                <Trash2 size={14} />
              </button>
            )}

            {/* Launch Play Icon Button */}
            <button
              className="btn btn-primary btn-icon"
              onClick={() => onRunApp(app)}
              title="앱 실행하기"
              style={{
                width: '36px',
                height: '36px',
                padding: 0,
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              <Play size={14} fill="#fff" />
            </button>
          </div>
        </div>
      </div>
    </div>

      {/* Delete Confirm Dialog */}
      {showDeleteDialog && (
        <DeleteConfirmDialog
          app={app}
          teacher={teacher}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteDialog(false)}
        />
      )}

      {/* Edit App Modal */}
      {showEditModal && (
        <EditAppModal
          app={app}
          teachers={teachers || []}
          onClose={() => setShowEditModal(false)}
          onSave={async (updatedFields) => {
            if (onEditApp) await onEditApp(updatedFields);
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
}
