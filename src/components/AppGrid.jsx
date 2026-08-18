import React, { useState, useMemo } from 'react';
import { LayoutGrid, Filter, ArrowUpDown, Sparkles, Inbox } from 'lucide-react';
import AppCard from './AppCard';

export default function AppGrid({ apps, teachers, onRunApp, onSelectTeacher, onDeleteApp, onEditApp }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('latest'); // 'latest', 'popular', 'title'
  const [storageFilter, setStorageFilter] = useState('all'); // 'all', 'gdrive', 'html'

  // Teacher lookup map for fast lookup
  const teacherMap = useMemo(() => {
    const map = {};
    teachers.forEach(t => {
      map[t.id] = t;
    });
    return map;
  }, [teachers]);

  // Categories
  const categories = [
    'all',
    '건강/운동',
    '교육/게임',
    '참여/출석',
    '복지/지도',
    '마음/힐링',
    '기타'
  ];

  // Filtered & Sorted Apps
  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      // Category filter
      if (selectedCategory !== 'all' && app.category !== selectedCategory) return false;
      
      // Storage filter
      if (storageFilter === 'gdrive' && !app.drive_file_url) return false;
      if (storageFilter === 'html' && app.drive_file_url) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'popular') {
        return (b.view_count || 0) - (a.view_count || 0);
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'ko');
      }
      // latest
      return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });
  }, [apps, selectedCategory, storageFilter, sortBy]);

  return (
    <section>
      
      {/* Control Bar: Categories & Sorting */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '24px'
      }}>
        
        {/* Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'rgba(99, 102, 241, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#818cf8'
          }}>
            <LayoutGrid size={16} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
            전체 공유 앱 갤러리
          </h2>
          <span className="badge badge-blue" style={{ fontSize: '0.8rem' }}>
            총 {filteredApps.length}개
          </span>
        </div>

        {/* Filters & Sorting Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          


          {/* Sort Select */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ArrowUpDown size={14} style={{ color: 'var(--text-muted)' }} />
            <select
              className="form-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                padding: '6px 12px',
                fontSize: '0.82rem',
                width: 'auto',
                height: '36px',
                borderRadius: 'var(--radius-md)'
              }}
            >
              <option value="latest">최신 등록순</option>
              <option value="popular">인기 실행순</option>
              <option value="title">가나다순</option>
            </select>
          </div>

        </div>
      </div>

      {/* Category Pills */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px 10px',
        marginBottom: '24px'
      }}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.84rem',
              fontWeight: '600',
              border: '1px solid',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease',
              background: selectedCategory === cat ? '#6366f1' : 'rgba(255, 255, 255, 0.04)',
              borderColor: selectedCategory === cat ? '#6366f1' : 'var(--border-color)',
              color: selectedCategory === cat ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            {cat === 'all' ? '전체 카테고리' : cat}
          </button>
        ))}
      </div>

      {/* Apps Grid */}
      {filteredApps.length > 0 ? (
        <div className="app-grid">
          {filteredApps.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              teacher={teacherMap[app.teacher_id]}
              teachers={teachers}
              onRunApp={onRunApp}
              onSelectTeacher={onSelectTeacher}
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
            marginTop: '20px'
          }}
        >
          <Inbox size={48} style={{ color: 'var(--text-subtle)', marginBottom: '14px' }} />
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px', color: '#e2e8f0' }}>
            선택한 조건에 맞는 앱이 없습니다
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            다른 카테고리나 필터를 선택해보세요.
          </p>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedCategory('all');
              setStorageFilter('all');
            }}
          >
            필터 초기화
          </button>
        </div>
      )}

    </section>
  );
}
