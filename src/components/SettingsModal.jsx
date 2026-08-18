import React, { useState } from 'react';
import { X, Settings, Database, HardDrive, CheckCircle2, AlertCircle, RefreshCw, Sparkles, BookOpen, Key, Wand2 } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { getSupabaseConfig, saveSupabaseConfig } from '../services/supabase';
import { getGeminiApiKey, saveGeminiApiKey } from '../services/aiGenerator';

export default function SettingsModal({ 
  onClose, 
  onSaveConfig, 
  onResetData, 
  onOpenGuide 
}) {
  const currentConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url || '');
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.key || '');
  const [geminiKey, setGeminiKey] = useState(getGeminiApiKey());
  const [testStatus, setTestStatus] = useState(null); // 'testing', 'success', 'error'
  const [testMessage, setTestMessage] = useState('');

  const handleSave = (e) => {
    e.preventDefault();
    saveSupabaseConfig(supabaseUrl, supabaseKey);
    saveGeminiApiKey(geminiKey);
    onSaveConfig();
    alert('설정이 저장되었습니다. 페이지가 새 구성으로 업데이트됩니다.');
    onClose();
  };

  const handleTestConnection = async () => {
    if (!supabaseUrl.trim() || !supabaseKey.trim()) {
      setTestStatus('error');
      setTestMessage('Supabase URL과 Anon Key를 모두 입력해주세요.');
      return;
    }

    setTestStatus('testing');
    setTestMessage('Supabase 서버와 연결 테스트 중...');

    try {
      const client = createClient(supabaseUrl.trim(), supabaseKey.trim());
      const { data, error } = await client.from('teachers').select('id').limit(1);

      if (error) {
        setTestStatus('error');
        setTestMessage(`연결 실패: ${error.message} (테이블이 생성되었는지 확인해주세요)`);
      } else {
        setTestStatus('success');
        setTestMessage('🎉 Supabase 연결 성공! `teachers` 테이블이 정상 확인되었습니다.');
      }
    } catch (err) {
      setTestStatus('error');
      setTestMessage(`오류 발생: ${err.message}`);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-content" style={{ maxWidth: '600px' }}>
        
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
              background: 'rgba(255, 255, 255, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Settings size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                환경설정 (Supabase & 구글 드라이브)
              </h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                데이터베이스 연동 및 공유 스토리지 설정
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

        {/* Modal Form */}
        <form onSubmit={handleSave} style={{ padding: '24px' }}>
          
          {/* Supabase Box */}
          <div style={{
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: 'var(--radius-lg)',
            padding: '18px',
            border: '1px solid var(--border-color)',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Database size={18} style={{ color: '#3ecf8e' }} />
                <span style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--text-main)' }}>
                  Supabase 데이터베이스 연동
                </span>
              </div>

              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={onOpenGuide}
                style={{ fontSize: '0.78rem', gap: '4px' }}
              >
                <BookOpen size={13} />
                <span>테이블 생성 SQL 가이드</span>
              </button>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.84rem' }}>
                Project URL (고정 연동)
              </label>
              <input
                type="text"
                className="form-input"
                placeholder="https://xyzcompany.supabase.co"
                value={supabaseUrl}
                readOnly
                style={{ fontSize: '0.88rem', opacity: 0.8, cursor: 'not-allowed', background: 'rgba(0, 0, 0, 0.4)' }}
              />
            </div>

            <div className="form-group" style={{ marginBottom: '12px' }}>
              <label className="form-label" style={{ fontSize: '0.84rem' }}>
                Anon Public API Key (고정 연동)
              </label>
              <input
                type="password"
                className="form-input"
                placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                value={supabaseKey}
                readOnly
                style={{ fontSize: '0.88rem', opacity: 0.8, cursor: 'not-allowed', background: 'rgba(0, 0, 0, 0.4)' }}
              />
            </div>

            {/* Test Connection Button & Result */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handleTestConnection}
              >
                <RefreshCw size={13} />
                <span>연결 테스트</span>
              </button>

              {testStatus && (
                <div style={{
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: testStatus === 'success' ? '#6ee7b7' : '#fca5a5'
                }}>
                  {testStatus === 'success' ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                  <span>{testMessage}</span>
                </div>
              )}
            </div>
          </div>



          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px'
          }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              닫기
            </button>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '10px 24px' }}
            >
              설정 저장
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
