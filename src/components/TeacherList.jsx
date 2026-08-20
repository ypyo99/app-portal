import React, { useState } from 'react';
import { Users, Layers, Plus, ArrowRight, Sparkles, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { sortTeachersByTeamAndGroup, getTeamColor, safeGetItem, safeSetItem } from '../services/supabase';

export default function TeacherList({ 
  teachers, 
  apps, 
  onSelectTeacher, 
  onOpenTeacherModal,
  onOpenUploadForTeacher
}) {
  const [selectedDept, setSelectedDept] = useState(() => {
    return safeGetItem('seongdong_selected_team', 'all');
  });

  const [isCollapsed, setIsCollapsed] = useState(true);

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      safeSetItem('seongdong_teacher_grid_collapsed', String(next));
      return next;
    });
  };

  const handleSelectDept = (deptId) => {
    setSelectedDept(deptId);
    safeSetItem('seongdong_selected_team', deptId);
  };

  // Defined Department Tabs: 전체, 1팀, 2팀, 3팀, 취업팀
  const departmentTabs = [
    { id: 'all', label: '전체' },
    { id: '1팀', label: '1팀' },
    { id: '2팀', label: '2팀' },
    { id: '3팀', label: '3팀' },
    { id: '취업팀', label: '취업팀' }
  ];

  // Sort all teachers by 1팀 -> 2팀 -> 3팀 -> 취업팀, and then by 1조 -> 2조 -> 3조...
  const sortedAllTeachers = sortTeachersByTeamAndGroup(teachers);

  // Filter teachers by selected team
  const filteredTeachers = selectedDept === 'all'
    ? sortedAllTeachers
    : sortedAllTeachers.filter(t => (t.team === selectedDept || (t.department && t.department.includes(selectedDept))));

  // Count apps per teacher
  const getAppCount = (teacherId) => {
    return apps.filter(a => a.teacher_id === teacherId).length;
  };

  // Count teachers per department
  const getTeacherCountByDept = (deptId) => {
    if (deptId === 'all') return teachers.length;
    return teachers.filter(t => (t.team === deptId || (t.department && t.department.includes(deptId)))).length;
  };

  return (
    <section style={{ marginBottom: '44px' }}>
      
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: 'rgba(255, 107, 74, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ff6b4a'
            }}>
              <Users size={16} />
            </div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '800' }}>
              선생님 목록
            </h2>
            <span className="badge badge-coral" style={{ fontSize: '0.8rem' }}>
              총 {filteredTeachers.length}명
            </span>
          </div>
        </div>

        {/* Right Controls: Department Filter Tabs & Fold/Unfold Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
          {/* Department Filter Tabs & Fold/Unfold Toggle in one single bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2px',
            flexWrap: 'nowrap',
            background: 'var(--input-bg)',
            padding: '3px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid var(--border-color)'
          }}>
            {departmentTabs.map(dept => {
              const isSelected = selectedDept === dept.id;
              return (
                <button
                  key={dept.id}
                  onClick={() => handleSelectDept(dept.id)}
                  style={{
                    padding: '6px 11px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.84rem',
                    fontWeight: '700',
                    border: '1px solid',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    whiteSpace: 'nowrap',
                    background: isSelected 
                      ? (dept.id === '1팀' ? '#ff6b4a' : dept.id === '2팀' ? '#3b82f6' : dept.id === '3팀' ? '#10b981' : dept.id === '취업팀' ? '#a855f7' : '#ff6b4a')
                      : 'transparent',
                    borderColor: 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-muted)'
                  }}
                >
                  <span>{dept.label}</span>
                </button>
              );
            })}

            {/* Subtle Vertical Divider */}
            <div style={{ width: '1px', height: '16px', background: 'var(--border-color)', margin: '0 2px' }} />

            {/* Toggle Fold/Unfold Button */}
            <button
              onClick={toggleCollapse}
              title={isCollapsed ? "선생님 목록 펼치기" : "선생님 목록 접기"}
              style={{
                padding: '7px 14px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.84rem',
                fontWeight: '700',
                border: '1px solid',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                background: isCollapsed ? '#ff6b4a' : 'var(--collapse-btn-bg)',
                borderColor: isCollapsed ? '#ff6b4a' : 'var(--border-color)',
                color: isCollapsed ? '#ffffff' : 'var(--text-main)',
                boxShadow: isCollapsed ? '0 2px 8px rgba(255, 107, 74, 0.35)' : 'none'
              }}
            >
              {isCollapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
              <span>{isCollapsed ? '펼치기' : '접기'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teachers Grid */}
      {!isCollapsed && (
        <div className="teacher-grid">
        {filteredTeachers.map((teacher) => {
          const appCount = getAppCount(teacher.id);
          const teacherColor = teacher.color || getTeamColor(teacher.team || teacher.department || '');
          const teamText = teacher.team ? `${teacher.team} ${teacher.group_name || ''}`.trim() : (teacher.department || '성동복지관');

          return (
            <div
              key={teacher.id}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '12px 14px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: `3px solid ${teacherColor}`,
                gap: '12px'
              }}
              onClick={() => onSelectTeacher(teacher)}
            >
              <div>
                {/* Top Row: Avatar & App Count Badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {teacher.avatar_url ? (
                      <img
                        src={teacher.avatar_url}
                        alt={teacher.name}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: `2px solid ${teacherColor}`
                        }}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        background: 'rgba(255, 255, 255, 0.08)',
                        display: teacher.avatar_url ? 'none' : 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        border: `2px solid ${teacherColor}`
                      }}
                    >
                      {teacher.icon_emoji || '👩‍🏫'}
                    </div>

                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
                        {(teacher.name || '').replace(/선생님$/g, '').trim()}
                      </h3>
                    </div>
                  </div>

                  <span className="badge badge-blue" style={{ fontSize: '0.78rem' }}>
                    {appCount}
                  </span>
                </div>


              </div>

              {/* Card Footer Actions */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255, 255, 255, 0.06)'
              }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenUploadForTeacher(teacher);
                  }}
                  style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                >
                  <Plus size={13} />
                  <span>앱 등록</span>
                </button>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '0.82rem',
                  fontWeight: '600',
                  color: '#ff8b73'
                }}>
                  <span>앱 목록 보기</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          );
        })}


      </div>
      )}
    </section>
  );
}
