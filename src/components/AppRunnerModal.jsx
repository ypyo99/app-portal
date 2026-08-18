import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Sparkles,
  Info,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { createExecutableSrc, extractDriveFileId, getDrivePreviewUrl, downloadAppHtmlFile } from '../services/googleDrive';

export default function AppRunnerModal({ app, teacher, onClose }) {
  const [deviceMode, setDeviceMode] = useState('mobile'); // 'mobile', 'tablet', 'desktop'
  const [keyIndex, setKeyIndex] = useState(0); // for iframe reloading
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef(null);

  if (!app) return null;

  const isGDrive = !!app.drive_file_url;
  const driveFileId = extractDriveFileId(app.drive_file_url);

  // Compute executable source URL
  const execSrc = createExecutableSrc(app);

  // Direct HTML code execution
  const hasAppCode = !!(app.app_code && app.app_code.trim());

  // Reload iframe
  const handleReload = () => {
    setIsLoading(true);
    setKeyIndex(prev => prev + 1);
  };

  // Open in new tab
  const handleOpenNewTab = () => {
    if (hasAppCode) {
      const blob = new Blob([app.app_code], { type: 'text/html;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    } else if (app.drive_file_url) {
      window.open(app.drive_file_url, '_blank');
    }
  };

  // Toggle browser fullscreen
  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  // Escape key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !document.fullscreenElement) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div 
      className="modal-overlay"
      style={{ padding: '0', zIndex: 2000 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={containerRef}
        className="runner-container"
        style={{
          width: '100vw',
          height: '100vh',
          borderRadius: isFullscreen ? '0' : '0',
          border: 'none'
        }}
      >
        
        {/* Top Control Bar */}
        <div className="runner-header">
          
          {/* Left: App Title & Creator Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: '1 1 240px', overflow: 'hidden' }}>
            <div style={{
              width: '38px',
              height: '38px',
              minWidth: '38px',
              borderRadius: '10px',
              background: 'rgba(255, 107, 74, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              flexShrink: 0
            }}>
              {app.icon_emoji || '📱'}
            </div>

            <div style={{ minWidth: 0, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'nowrap', overflow: 'hidden' }}>
                <h2 style={{ 
                  fontSize: '1.05rem', 
                  fontWeight: '800', 
                  color: '#fff', 
                  margin: 0,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {app.title}
                </h2>
                <span className="badge badge-coral" style={{ fontSize: '0.7rem', flexShrink: 0, whiteSpace: 'nowrap', padding: '2px 7px' }}>
                  {app.category || '일반'}
                </span>

              </div>
              <div style={{ 
                fontSize: '0.78rem', 
                color: 'var(--text-muted)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                marginTop: '1px'
              }}>
                제작자: <span style={{ color: '#ff9e87', fontWeight: '600' }}>{teacher?.name || '성동복지관 선생님'}</span>
                {teacher?.department && ` (${teacher.department})`}
              </div>
            </div>
          </div>

          {/* Center: Device Mode Switcher */}
          <div className="runner-device-switcher">
            <button
              onClick={() => setDeviceMode('mobile')}
              title="스마트폰 모바일 화면 (390px)"
              style={{
                background: deviceMode === 'mobile' ? '#ff6b4a' : 'transparent',
                color: deviceMode === 'mobile' ? '#fff' : 'var(--text-muted)'
              }}
            >
              <Smartphone size={14} />
              <span>모바일</span>
            </button>

            <button
              onClick={() => setDeviceMode('tablet')}
              title="태블릿 화면 (768px)"
              style={{
                background: deviceMode === 'tablet' ? '#ff6b4a' : 'transparent',
                color: deviceMode === 'tablet' ? '#fff' : 'var(--text-muted)'
              }}
            >
              <Tablet size={14} />
              <span>태블릿</span>
            </button>

            <button
              onClick={() => setDeviceMode('desktop')}
              title="데스크톱 전체화면 (100%)"
              style={{
                background: deviceMode === 'desktop' ? '#ff6b4a' : 'transparent',
                color: deviceMode === 'desktop' ? '#fff' : 'var(--text-muted)'
              }}
            >
              <Monitor size={14} />
              <span>데스크톱</span>
            </button>
          </div>

          {/* Right: Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Close Button */}
            <button
              className="btn btn-secondary btn-icon"
              onClick={onClose}
              title="닫기 (ESC)"
              style={{
                width: '34px',
                height: '34px',
                background: 'rgba(239, 68, 68, 0.15)',
                borderColor: 'rgba(239, 68, 68, 0.3)',
                color: '#fca5a5'
              }}
            >
              <X size={17} />
            </button>
          </div>
        </div>

        {/* Runner Interactive Body / Device Frame */}
        <div className="runner-body">
          
          <div className={`device-frame-${deviceMode}`}>
            
            {/* Dynamic Iframe Sandbox */}
            {hasAppCode ? (
              <iframe
                key={keyIndex}
                title={app.title}
                className="sandbox-iframe"
                srcDoc={app.app_code}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                onLoad={() => setIsLoading(false)}
              />
            ) : execSrc ? (
              <iframe
                key={keyIndex}
                title={app.title}
                className="sandbox-iframe"
                src={execSrc}
                sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-modals"
                onLoad={() => setIsLoading(false)}
              />
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                padding: '30px',
                color: '#64748b',
                textAlign: 'center'
              }}>
                <Info size={40} style={{ marginBottom: '12px' }} />
                <p>실행 가능한 앱 소스코드 또는 구글 드라이브 링크가 없습니다.</p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
