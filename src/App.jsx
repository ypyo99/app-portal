import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import TeacherList from './components/TeacherList';
import TeacherDetail from './components/TeacherDetail';
import AppGrid from './components/AppGrid';
import AppRunnerModal from './components/AppRunnerModal';
import UploadModal from './components/UploadModal';
import TeacherModal from './components/TeacherModal';
import SettingsModal from './components/SettingsModal';
import SupabaseGuideModal from './components/SupabaseGuideModal';
import AiAppBuilderModal from './components/AiAppBuilderModal';
import { 
  fetchTeachers, 
  fetchApps, 
  createTeacher, 
  createApp, 
  updateApp,
  recordAppView,
  deleteApp
} from './services/supabase';
import { Sparkles, Play, Users, ArrowRight } from 'lucide-react';

export default function App() {
  const [teachers, setTeachers] = useState([]);
  const [apps, setApps] = useState([]);
  const [isSupabaseConnected, setIsSupabaseConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation & View State
  const [activeView, setActiveView] = useState('home'); // 'home', 'teacher_detail'
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [runningApp, setRunningApp] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadPresetTeacher, setUploadPresetTeacher] = useState(null);
  const [isAiBuilderOpen, setIsAiBuilderOpen] = useState(false);
  const [aiBuilderPresetTeacher, setAiBuilderPresetTeacher] = useState(null);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupabaseGuideOpen, setIsSupabaseGuideOpen] = useState(false);

  // Load Data
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [teachersRes, appsRes] = await Promise.all([
        fetchTeachers(),
        fetchApps(),
      ]);

      setTeachers(teachersRes.data || []);
      setApps(appsRes.data || []);
      setIsSupabaseConnected(Boolean(teachersRes.isSupabase || appsRes.isSupabase));
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Handlers
  const handleRunApp = (app) => {
    setRunningApp(app);
    recordAppView(app.id, app.view_count);
    // Update local view count state
    setApps(prev => prev.map(a => a.id === app.id ? { ...a, view_count: (a.view_count || 0) + 1 } : a));
  };

  const handleSelectTeacher = (teacher) => {
    setSelectedTeacher(teacher);
    setActiveView('teacher_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setSelectedTeacher(null);
    setActiveView('home');
  };

  const handleOpenUploadForTeacher = (teacher) => {
    setUploadPresetTeacher(teacher);
    setIsUploadOpen(true);
  };

  const handleOpenAiBuilderForTeacher = (teacher) => {
    setAiBuilderPresetTeacher(teacher);
    setIsAiBuilderOpen(true);
  };

  const handleSaveTeacher = async (teacherData) => {
    await createTeacher(teacherData);
    await loadData();
  };

  const handleSaveApp = async (appData) => {
    await createApp(appData);
    await loadData();
  };

  const handleDeleteApp = async (appId) => {
    await deleteApp(appId);
    // Optimistically remove from state
    setApps(prev => prev.filter(a => a.id !== appId));
  };

  const handleUpdateApp = async (updatedFields) => {
    await updateApp(updatedFields.id, updatedFields);
    setApps(prev => prev.map(a => a.id === updatedFields.id ? { ...a, ...updatedFields } : a));
  };

  const handleResetData = () => {
    if (confirm('샘플 기본 데이터를 다시 로드하시겠습니까? (로컬에 저장된 임시 데이터가 초기화됩니다)')) {
      localStorage.removeItem('seongdong_teachers_data');
      localStorage.removeItem('seongdong_apps_data');
      loadData();
    }
  };

  // Search Filtered Data
  const filteredTeachers = teachers.filter(t => 
    !searchQuery || 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (t.department && t.department.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredApps = apps.filter(a => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const teacher = teachers.find(t => t.id === a.teacher_id);
    return (
      a.title.toLowerCase().includes(q) ||
      (a.description && a.description.toLowerCase().includes(q)) ||
      (a.category && a.category.toLowerCase().includes(q)) ||
      (teacher && teacher.name.toLowerCase().includes(q))
    );
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Background Ambient Glows */}
      <div className="ambient-bg">
        <div className="ambient-glow-1" />
        <div className="ambient-glow-2" />
        <div className="ambient-glow-3" />
      </div>

      {/* Main Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenUpload={() => {
          setUploadPresetTeacher(null);
          setIsUploadOpen(true);
        }}
        onOpenAiBuilder={() => {
          setAiBuilderPresetTeacher(null);
          setIsAiBuilderOpen(true);
        }}
        onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenSupabaseGuide={() => setIsSupabaseGuideOpen(true)}
        isSupabaseConnected={isSupabaseConnected}
        activeView={activeView}
        setActiveView={setActiveView}
        selectedTeacher={selectedTeacher}
      />

      {/* Main Container */}
      <main style={{ flex: 1, maxWidth: '1400px', width: '100%', margin: '0 auto', padding: '32px 24px' }}>
        
        {/* Hero Welcome Banner (Visible on Home view) */}
        {activeView === 'home' && !searchQuery && (
          <div 
            className="glass-panel"
            style={{
              padding: '40px 36px',
              borderRadius: 'var(--radius-xl)',
              marginBottom: '40px',
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(135deg, rgba(23, 32, 51, 0.95) 0%, rgba(17, 24, 39, 0.9) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 20px 50px rgba(0,0,0,0.5), 0 0 30px rgba(255, 107, 74, 0.12)'
            }}
          >
            <div style={{ maxWidth: '820px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                <span className="badge badge-coral" style={{ padding: '6px 14px', fontSize: '0.85rem' }}>
                  <Sparkles size={14} /> 성동복지관 선생님 스마트 워크스페이스
                </span>
              </div>

              <h1 style={{
                fontSize: '2.4rem',
                fontWeight: '800',
                lineHeight: '1.25',
                marginBottom: '14px',
                background: 'linear-gradient(90deg, #ffffff 30%, #fca5a5 70%, #c7d2fe 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                선생님들이 만든 앱을 공유하고<br />
                브라우저에서 바로 실행해보세요!
              </h1>



              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    setUploadPresetTeacher(null);
                    setIsUploadOpen(true);
                  }}
                  style={{ padding: '12px 24px', fontSize: '1rem', fontWeight: '700' }}
                >
                  <Sparkles size={18} />
                  <span>새 앱 업로드하기</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* View Routing */}
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '14px', animation: 'spin 1.5s linear infinite' }}>⏳</div>
            <p>선생님 목록과 앱 데이터를 불러오는 중입니다...</p>
          </div>
        ) : activeView === 'teacher_detail' && selectedTeacher ? (
          <TeacherDetail
            teacher={selectedTeacher}
            teachers={teachers}
            apps={apps}
            onBack={handleBackToHome}
            onRunApp={handleRunApp}
            onOpenUploadForTeacher={handleOpenUploadForTeacher}
            onOpenAiBuilderForTeacher={handleOpenAiBuilderForTeacher}
            onDeleteApp={handleDeleteApp}
            onEditApp={handleUpdateApp}
          />
        ) : (
          <>
            {/* 1. Teachers Section */}
            <TeacherList
              teachers={filteredTeachers}
              apps={apps}
              onSelectTeacher={handleSelectTeacher}
              onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
              onOpenUploadForTeacher={handleOpenUploadForTeacher}
            />

            {/* 2. All Apps Section */}
            <AppGrid
              apps={filteredApps}
              teachers={teachers}
              onRunApp={handleRunApp}
              onSelectTeacher={handleSelectTeacher}
              onDeleteApp={handleDeleteApp}
              onEditApp={handleUpdateApp}
            />
          </>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-color)',
        background: 'rgba(11, 15, 25, 0.95)',
        padding: '24px',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-subtle)',
        marginTop: '60px'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', textAlign: 'center' }}>
          <div>
            🌟 <strong>성동복지관 선생님 앱 쉐어스페이스</strong>
          </div>
        </div>
      </footer>

      {/* Modals */}
      {runningApp && (
        <AppRunnerModal
          app={runningApp}
          teacher={teachers.find(t => t.id === runningApp.teacher_id)}
          onClose={() => setRunningApp(null)}
        />
      )}

      {/* AI App Builder Modal */}
      {isAiBuilderOpen && (
        <AiAppBuilderModal
          teachers={teachers}
          selectedTeacher={aiBuilderPresetTeacher}
          onClose={() => setIsAiBuilderOpen(false)}
          onSaveApp={handleSaveApp}
          onOpenTeacherModal={() => {
            setIsAiBuilderOpen(false);
            setIsTeacherModalOpen(true);
          }}
        />
      )}

      {isUploadOpen && (
        <UploadModal
          teachers={teachers}
          selectedTeacher={uploadPresetTeacher}
          onClose={() => setIsUploadOpen(false)}
          onSaveApp={handleSaveApp}
          onOpenTeacherModal={() => {
            setIsUploadOpen(false);
            setIsTeacherModalOpen(true);
          }}
          onOpenAiBuilder={() => {
            setIsUploadOpen(false);
            setIsAiBuilderOpen(true);
          }}
        />
      )}

      {isTeacherModalOpen && (
        <TeacherModal
          onClose={() => setIsTeacherModalOpen(false)}
          onSaveTeacher={handleSaveTeacher}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal
          onClose={() => setIsSettingsOpen(false)}
          onSaveConfig={loadData}
          onResetData={handleResetData}
          onOpenGuide={() => {
            setIsSettingsOpen(false);
            setIsSupabaseGuideOpen(true);
          }}
        />
      )}

      {isSupabaseGuideOpen && (
        <SupabaseGuideModal
          onClose={() => setIsSupabaseGuideOpen(false)}
        />
      )}

    </div>
  );
}
