import React from 'react';
import { 
  Sparkles, 
  UserPlus, 
  Settings, 
  Search, 
  Database, 
  CheckCircle2, 
  AlertCircle,
  FolderOpen,
  Sun,
  Moon
} from 'lucide-react';

export default function Header({ 
  searchQuery, 
  setSearchQuery, 
  onOpenUpload, 
  onOpenAiBuilder,
  onOpenTeacherModal, 
  onOpenSettings, 
  onOpenSupabaseGuide,
  isSupabaseConnected,
  activeView,
  setActiveView,
  selectedTeacher,
  theme,
  onToggleTheme
}) {
  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--header-bg)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--border-color)',
      padding: '14px 24px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        
        {/* Left: Brand Logo */}
        <div 
          onClick={() => setActiveView('home')} 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '14px', 
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #ff6b4a 0%, #fa5252 50%, #6366f1 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.6rem',
            boxShadow: '0 4px 18px rgba(255, 107, 74, 0.4)'
          }}>
            🌟
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ 
                fontSize: '1.25rem', 
                fontWeight: '800', 
                background: 'var(--brand-title-gradient)', 
                WebkitBackgroundClip: 'text', 
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}>
                성동복지관
              </h1>
              <span className="badge badge-coral" style={{ fontSize: '0.72rem', padding: '2px 8px' }}>
                선생님 앱 쉐어
              </span>
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              EduApp Hub & Cloud Storage Runner
            </div>
          </div>
        </div>

        {/* Center: Live Search Bar */}
        <div className="header-search-bar" style={{
          flex: '1',
          maxWidth: '450px',
          minWidth: '220px',
          position: 'relative'
        }}>
          <Search 
            size={18} 
            style={{ 
              position: 'absolute', 
              left: '14px', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-muted)' 
            }} 
          />
          <input
            type="text"
            className="form-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="선생님 이름, 앱 제목, 카테고리 검색..."
            style={{
              paddingLeft: '42px',
              paddingRight: '16px',
              height: '42px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--input-bg)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem'
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Right: Actions and Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>

          {/* Dark / Light Theme Toggle Button */}
          <button 
            className="btn btn-secondary btn-icon"
            onClick={onToggleTheme}
            title={theme === 'dark' ? "라이트 모드로 전환" : "다크 모드로 전환"}
            style={{ width: '38px', height: '38px', borderRadius: '12px' }}
            aria-label="화면 테마 토글 (다크/라이트 모드)"
          >
            {theme === 'dark' ? (
              <Sun size={18} style={{ color: '#f59e0b' }} />
            ) : (
              <Moon size={18} style={{ color: '#6366f1' }} />
            )}
          </button>

          {/* Settings Button */}
          <button 
            className="btn btn-secondary btn-icon"
            onClick={onOpenSettings}
            title="Supabase & 구글 드라이브 환경설정"
            style={{ width: '38px', height: '38px', borderRadius: '12px' }}
          >
            <Settings size={17} />
          </button>

        </div>
      </div>
    </header>
  );
}
