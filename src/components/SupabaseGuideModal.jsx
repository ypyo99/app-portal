import React, { useState } from 'react';
import { X, Database, Copy, Check, ExternalLink, Terminal } from 'lucide-react';
import { SUPABASE_SCHEMA_SQL } from '../services/supabase';

export default function SupabaseGuideModal({ onClose }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '720px' }}>
        
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
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(62, 207, 142, 0.15)',
              color: '#3ecf8e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Database size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff' }}>
                Supabase 테이블 생성 가이드
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                `teachers` 및 `apps` 테이블을 1분 만에 구성하는 방법
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

        {/* Modal Content */}
        <div style={{ padding: '24px' }}>
          
          {/* Step-by-step instructions */}
          <div style={{ marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span className="badge badge-coral" style={{ minWidth: '24px', justifyContent: 'center' }}>1</span>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                <strong>Supabase 대시보드</strong> (<a href="https://supabase.com/dashboard" target="_blank" rel="noreferrer" style={{ color: '#60a5fa', textDecoration: 'underline' }}>supabase.com</a>) 접속 후 프로젝트를 선택합니다.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span className="badge badge-coral" style={{ minWidth: '24px', justifyContent: 'center' }}>2</span>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                왼쪽 메뉴에서 <strong>SQL Editor</strong> 를 클릭하고 <strong>[+ New query]</strong> 버튼을 누릅니다.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <span className="badge badge-coral" style={{ minWidth: '24px', justifyContent: 'center' }}>3</span>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-main)' }}>
                아래의 <strong>SQL 스크립트를 복사하여 붙여넣고 [Run]</strong>을 클릭하면 모든 준비가 완료됩니다.
              </div>
            </div>
          </div>

          {/* SQL Code Block Box */}
          <div style={{ position: 'relative', marginBottom: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#090d16',
              padding: '8px 14px',
              borderTopLeftRadius: 'var(--radius-md)',
              borderTopRightRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              borderBottom: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <Terminal size={14} />
                <span>supabase_schema.sql</span>
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={handleCopy}
                style={{ fontSize: '0.78rem', padding: '4px 10px', gap: '5px' }}
              >
                {copied ? <Check size={13} color="#10b981" /> : <Copy size={13} />}
                <span>{copied ? '복사 완료!' : 'SQL 전체 복사'}</span>
              </button>
            </div>

            <pre style={{
              background: '#040711',
              padding: '16px',
              borderBottomLeftRadius: 'var(--radius-md)',
              borderBottomRightRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              color: '#38bdf8',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              maxHeight: '260px',
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              lineHeight: '1.5'
            }}>
              {SUPABASE_SCHEMA_SQL}
            </pre>
          </div>

          {/* Footer Action */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              onClick={onClose}
            >
              확인 완료
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
