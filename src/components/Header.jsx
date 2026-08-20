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
    <header className="main-header">
      <div className="header-container">
        
        {/* Left: Brand Logo */}
        <div 
          className="header-brand"
          onClick={() => setActiveView('home')} 
        >
          <div className="header-brand-icon">
            🌟
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <h1 className="header-brand-title">
                성동종합노인복지관
              </h1>
              <span className="badge badge-coral header-brand-badge">
                앱 쉐어스페이스
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Search Bar */}
        <div className="header-search-bar" style={{
          flex: '1',
          maxWidth: '450px',
          minWidth: '200px',
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
              height: '40px',
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
        <div className="header-actions">

          {/* Dark / Light Theme Toggle Button */}
          <button 
            className="btn btn-secondary btn-icon header-action-btn"
            onClick={onToggleTheme}
            title={theme === 'dark' ? "라이트 모드로 전환" : "다크 모드로 전환"}
            aria-label="화면 테마 토글 (다크/라이트 모드)"
          >
            {theme === 'dark' ? (
              <Sun size={17} style={{ color: '#f59e0b' }} />
            ) : (
              <Moon size={17} style={{ color: '#6366f1' }} />
            )}
          </button>

          {/* Settings Button */}
          <button 
            className="btn btn-secondary btn-icon header-action-btn"
            onClick={onOpenSettings}
            title="Supabase & 구글 드라이브 환경설정"
          >
            <Settings size={16} />
          </button>

        </div>
      </div>
    </header>
  );
}
