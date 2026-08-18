import React from 'react';
import { ArrowLeft, Plus, Eye, Layers, ExternalLink, HardDrive } from 'lucide-react';
import AppCard from './AppCard';

export default function TeacherDetail({ 
  teacher, 
  teachers,
  apps, 
  onBack, 
  onRunApp, 
  onOpenUploadForTeacher,
  onOpenAiBuilderForTeacher,
  onDeleteApp,
  onEditApp
}) {
  if (!teacher) return null;

  // Filter apps created by this teacher
  const teacherApps = apps.filter(a => a.teacher_id === teacher.id);
  
  // Calculate total views
  const totalViews = teacherApps.reduce((acc, curr) => acc + (curr.view_count || 0), 0);

  const teacherColor = teacher.color || '#ff6b4a';

  return (
    <div style={{ animation: 'fadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)' }}>
      
      {/* Back Navigation Bar */}
      <div style={{ marginBottom: '24px' }}>
        <button
          className="btn btn-secondary btn-sm"
          onClick={onBack}
          style={{ gap: '8px' }}
        >
          <ArrowLeft size={16} />
          <span>전체 목록으로 돌아가기</span>
        </button>
      </div>

      {/* Teacher Profile Hero Banner */}
      <div 
        className="glass-panel"
        style={{
          padding: '32px',
          borderRadius: 'var(--radius-xl)',
          marginBottom: '36px',
          position: 'relative',
          overflow: 'hidden',
          borderTop: `4px solid ${teacherColor}`,
          background: 'var(--hero-bg)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '24px'
        }}>
          
          {/* Left: Avatar & Bio */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: '1', minWidth: '280px' }}>
            {teacher.avatar_url ? (
              <img
                src={teacher.avatar_url}
                alt={teacher.name}
                style={{
                  width: '84px',
                  height: '84px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: `3px solid ${teacherColor}`,
                  boxShadow: `0 8px 24px ${teacherColor}40`
                }}
              />
            ) : (
              <div style={{
                width: '84px',
                height: '84px',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2.8rem',
                border: `3px solid ${teacherColor}`
              }}>
                {teacher.icon_emoji || '👩‍🏫'}
              </div>
            )}

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {teacher.name}
                </h1>
                <span className="badge badge-coral" style={{ fontSize: '0.82rem' }}>
                  {teacher.department || '성동복지관'}
                </span>
              </div>


            </div>
          </div>

          {/* Right: Stats & Quick Upload Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              gap: '12px',
              background: 'rgba(0, 0, 0, 0.25)',
              padding: '12px 18px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ textAlign: 'center', paddingRight: '12px', borderRight: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#60a5fa' }}>
                  {teacherApps.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>제작한 앱</div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fca5a5' }}>
                  {totalViews}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>총 실행수</div>
              </div>
            </div>



            <button
              className="btn btn-primary"
              onClick={() => onOpenUploadForTeacher(teacher)}
              style={{ fontWeight: '700', padding: '12px 20px' }}
            >
              <Plus size={18} />
              <span>새 앱 등록</span>
            </button>
          </div>

        </div>
      </div>

      {/* Teacher's Apps Section */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: '800' }}>
            📦 {teacher.name}님이 제작한 앱 ({teacherApps.length})
          </h2>
        </div>

        {teacherApps.length > 0 ? (
          <div className="app-grid">
            {teacherApps.map(app => (
              <AppCard
                key={app.id}
                app={app}
                teacher={teacher}
                teachers={teachers || []}
                onRunApp={onRunApp}
                onDeleteApp={onDeleteApp}
                onEditApp={onEditApp}
              />
            ))}
          </div>
        ) : (
          <div 
            className="glass-panel"
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              borderRadius: 'var(--radius-xl)',
              background: 'rgba(255, 255, 255, 0.02)'
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '14px' }}>✨</div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '8px', color: 'var(--text-main)' }}>
              아직 등록된 앱이 없습니다
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              선생님이 구글 드라이브나 HTML 코드로 첫 번째 멋진 앱을 등록해보세요!
            </p>
            <button
              className="btn btn-primary"
              onClick={() => onOpenUploadForTeacher(teacher)}
            >
              <Plus size={16} />
              <span>첫 번째 앱 업로드하기</span>
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
