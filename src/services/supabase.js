import { createClient } from '@supabase/supabase-js';
import { INITIAL_TEACHERS, INITIAL_APPS } from '../data/sampleData';

const LOCAL_STORAGE_KEYS = {
  SUPABASE_CONFIG: 'seongdong_supabase_config',
  TEACHERS: 'seongdong_teachers_data',
  APPS: 'seongdong_apps_data',
};

export function safeGetItem(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.APPS);
      localStorage.setItem(key, value);
    } catch (_) {}
  }
}

// Retrieve config from localStorage or env
export function getSupabaseConfig() {
  const defaultUrl = 'https://qaivsflpnzfwxletxuqf.supabase.co';
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaXZzZmxwbnpmd3hsZXR4dXFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODYxODM4OTYsImV4cCI6MjEwMTc1OTg5Nn0.gTsqW4T-JJy7RvwlD4CAS9Y53RxFLvg844YpXIorIwI';
  const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.SUPABASE_CONFIG);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.url || parsed.key) {
        return {
          url: parsed.url || defaultUrl,
          key: parsed.key || defaultKey
        };
      }
    } catch (e) {
      console.error('Failed to parse saved supabase config', e);
    }
  }

  // Fallback to Vite env variables or default credentials
  const envUrl = import.meta.env.VITE_SUPABASE_URL || defaultUrl;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || defaultKey;
  return { url: envUrl, key: envKey };
}

// Save config to localStorage safely
export function saveSupabaseConfig(url, key) {
  try {
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.SUPABASE_CONFIG,
      JSON.stringify({ url: url.trim(), key: key.trim() })
    );
  } catch (e) {
    console.warn('localStorage quota exceeded while saving supabase config, pruning local cache:', e);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.APPS);
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.SUPABASE_CONFIG,
        JSON.stringify({ url: url.trim(), key: key.trim() })
      );
    } catch (_) {}
  }
}

// Initialize Supabase Client dynamically
let supabaseInstance = null;

export function getSupabaseClient() {
  const config = getSupabaseConfig();
  if (config.url && config.key) {
    try {
      if (!supabaseInstance || supabaseInstance.supabaseUrl !== config.url) {
        supabaseInstance = createClient(config.url, config.key);
      }
      return supabaseInstance;
    } catch (err) {
      console.warn('Supabase client init error:', err);
      return null;
    }
  }
  return null;
}

// In-memory fallback caches in case localStorage quota is exceeded or unavailable
let inMemoryTeachers = [...INITIAL_TEACHERS];
let inMemoryApps = [...INITIAL_APPS];

// LocalStorage data helpers for demo/offline fallback with quota-safe protection
function getLocalTeachers() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.TEACHERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryTeachers = parsed;
        return parsed;
      }
    }
  } catch (e) {}
  return inMemoryTeachers;
}

function saveLocalTeachers(teachers) {
  inMemoryTeachers = teachers;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TEACHERS, JSON.stringify(teachers));
  } catch (e) {}
}

function getLocalApps() {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.APPS);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryApps = parsed;
        return parsed;
      }
    }
  } catch (e) {}
  return inMemoryApps;
}

function saveLocalApps(apps) {
  inMemoryApps = apps;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEYS.APPS, JSON.stringify(apps));
  } catch (e) {
    // If quota exceeded, clear legacy data and keep in memory
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.APPS);
    } catch (_) {}
  }
}

// Helper functions to sort teachers by 1팀 -> 2팀 -> 3팀 -> 취업팀, and then by 조 (1조 -> 2조 -> 3조...)
export const getTeamRank = (teacher) => {
  const team = (teacher.team || teacher.department || '').trim();
  if (team.includes('1팀') || team.startsWith('1')) return 1;
  if (team.includes('2팀') || team.startsWith('2')) return 2;
  if (team.includes('3팀') || team.startsWith('3')) return 3;
  if (team.includes('취업')) return 4;
  return 99;
};

export const getGroupRank = (teacher) => {
  const group = (teacher.group_name || teacher.department || '').trim();
  const matchNum = group.match(/(\d+)조/);
  if (matchNum) return parseInt(matchNum[1], 10);
  if (group.includes('오전')) return 10;
  if (group.includes('오후')) return 11;
  if (group.includes('기타')) return 20;
  return 30;
};

export const getSeqRank = (teacher) => {
  if (typeof teacher.seq_num === 'number' && !isNaN(teacher.seq_num)) return teacher.seq_num;
  return 999;
};

export const sortTeachersByTeamAndGroup = (list) => {
  return [...list].sort((a, b) => {
    const tA = getTeamRank(a);
    const tB = getTeamRank(b);
    if (tA !== tB) return tA - tB;

    const gA = getGroupRank(a);
    const gB = getGroupRank(b);
    if (gA !== gB) return gA - gB;

    const sA = getSeqRank(a);
    const sB = getSeqRank(b);
    if (sA !== sB) return sA - sB;

    return (a.name || '').localeCompare(b.name || '', 'ko-KR');
  });
};

export const getTeamColor = (teamName = '') => {
  const t = teamName.trim();
  if (t.includes('1팀')) return '#ff6b4a';
  if (t.includes('2팀')) return '#3b82f6';
  if (t.includes('3팀')) return '#10b981';
  if (t.includes('취업')) return '#a855f7';
  return '#6366f1';
};

// Exclusion filter for inactive or requested exclusions (1팀 천은선/서승희, 3팀 서승희 등)
export const isTeacherExcluded = (t) => {
  if (!t) return true;
  if (t.is_active === false) return true;
  const name = (t.name || '').trim();
  const team = (t.team || t.department || '').trim();

  // 1팀 '천은선/서승희' 제외
  if (name.includes('천은선/서승희') || name === '천은선/서승희') return true;

  // 3팀 '서승희' 또는 서승희 선생님 제외
  if (name === '서승희' || name.startsWith('서승희') || (team.includes('3팀') && name.includes('서승희'))) return true;

  return false;
};

// --- Supabase API Methods ---

export async function fetchTeachers() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .select('*');

      if (!error && data && data.length > 0) {
        const activeData = data.filter(t => !isTeacherExcluded(t));
        const formatted = activeData.map((t) => {
          const teamName = t.team || '1팀';
          const groupName = t.group_name || '';
          const fullDept = teamName ? `${teamName}${groupName ? ' ' + groupName : ''}` : '성동복지관';
          return {
            ...t,
            department: fullDept,
            bio: t.bio || (t.shift1 ? `근무/활동 시간: ${t.shift1}${t.shift2 ? ', ' + t.shift2 : ''}` : '성동복지관에서 어르신과 함께하는 스마트 앱을 만들고 계십니다.'),
            icon_emoji: t.icon_emoji || (['👩‍🏫', '👨‍💻', '🎨', '🧭', '🌸', '⭐', '🍀', '🌟'][Math.abs((t.name?.charCodeAt(0) || 0) % 8)]),
            color: t.color || getTeamColor(teamName)
          };
        });

        const sorted = sortTeachersByTeamAndGroup(formatted);
        return { data: sorted, isSupabase: true };
      }
      if (error) {
        console.warn('Supabase fetchTeachers error, using local data:', error.message);
      }
    } catch (e) {
      console.warn('Supabase network error, using local data:', e);
    }
  }
  return { data: sortTeachersByTeamAndGroup(getLocalTeachers().filter(t => !isTeacherExcluded(t))), isSupabase: false };
}

export async function fetchApps() {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('apps')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return { data, isSupabase: true };
      }
    } catch (e) {}
  }
  return { data: getLocalApps(), isSupabase: false };
}

export async function createTeacher(teacherData) {
  const supabase = getSupabaseClient();
  const newTeacher = {
    ...teacherData,
    id: teacherData.id || `t-${Date.now()}`,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('teachers')
        .insert([
          {
            name: newTeacher.name,
            department: newTeacher.department || '성동복지관',
            bio: newTeacher.bio || '',
            avatar_url: newTeacher.avatar_url || '',
          },
        ])
        .select();

      if (!error && data && data.length > 0) {
        return { data: data[0], isSupabase: true };
      }
    } catch (e) {
      console.warn('Supabase insert teacher error:', e);
    }
  }

  // Fallback local
  const list = getLocalTeachers();
  const updated = [newTeacher, ...list];
  saveLocalTeachers(updated);
  return { data: newTeacher, isSupabase: false };
}

export async function createApp(appData) {
  const supabase = getSupabaseClient();
  const appId = appData.id || `app-${Date.now()}`;
  let storageUrl = appData.drive_file_url || '';

  // 1. Upload HTML code to Supabase Storage ('apps' bucket)
  if (supabase && appData.app_code) {
    try {
      const fileName = `app_${appId}.html`;
      const blob = new Blob([appData.app_code], { type: 'text/html;charset=utf-8' });
      
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('apps')
        .upload(fileName, blob, {
          contentType: 'text/html;charset=utf-8',
          upsert: true
        });

      if (!uploadError) {
        const { data: urlData } = supabase
          .storage
          .from('apps')
          .getPublicUrl(fileName);
        if (urlData?.publicUrl) {
          storageUrl = urlData.publicUrl;
        }
      } else {
        console.warn('Supabase Storage upload warning (Ensure "apps" bucket is created):', uploadError.message);
      }
    } catch (e) {
      console.warn('Supabase Storage upload exception:', e);
    }
  }

  const newApp = {
    ...appData,
    id: appId,
    drive_file_url: storageUrl || appData.drive_file_url || '',
    view_count: 0,
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('apps')
        .insert([
          {
            teacher_id: newApp.teacher_id,
            title: newApp.title,
            description: newApp.description,
            category: newApp.category || '일반',
            icon_emoji: newApp.icon_emoji || '📱',
            thumbnail_url: newApp.thumbnail_url || '',
            drive_file_url: newApp.drive_file_url || '',
            app_code: newApp.app_code || '',
            app_type: newApp.app_type || 'html_code',
          },
        ])
        .select();

      if (!error && data && data.length > 0) {
        return { data: data[0], isSupabase: true };
      }
    } catch (e) {
      console.warn('Supabase insert app error:', e);
    }
  }

  // Fallback local
  const list = getLocalApps();
  const updated = [newApp, ...list];
  saveLocalApps(updated);
  return { data: newApp, isSupabase: false };
}

export async function recordAppView(appId, currentViewCount) {
  const supabase = getSupabaseClient();
  if (supabase) {
    try {
      let nextCount = typeof currentViewCount === 'number' ? currentViewCount + 1 : null;
      if (nextCount === null) {
        const { data } = await supabase.from('apps').select('view_count').eq('id', appId).single();
        if (data) {
          nextCount = (data.view_count || 0) + 1;
        }
      }
      if (nextCount !== null) {
        await supabase
          .from('apps')
          .update({ view_count: nextCount })
          .eq('id', appId);
      }
    } catch (e) {
      console.warn('Supabase view_count update error:', e);
    }
  }

  const list = getLocalApps();
  const updated = list.map((a) => (a.id === appId ? { ...a, view_count: (a.view_count || 0) + 1 } : a));
  saveLocalApps(updated);
}

export async function updateApp(appId, updatedFields) {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('apps')
        .update({
          title: updatedFields.title,
          description: updatedFields.description,
          category: updatedFields.category,
          icon_emoji: updatedFields.icon_emoji,
          teacher_id: updatedFields.teacher_id,
          app_code: updatedFields.app_code !== undefined ? updatedFields.app_code : undefined
        })
        .eq('id', appId)
        .select();

      if (!error && data && data.length > 0) {
        const list = getLocalApps();
        const updatedList = list.map((a) => (a.id === appId ? { ...a, ...updatedFields } : a));
        saveLocalApps(updatedList);
        return { data: data[0], isSupabase: true };
      }
    } catch (e) {
      console.warn('Supabase update app error:', e);
    }
  }

  // Fallback local
  const list = getLocalApps();
  const updatedList = list.map((a) => (a.id === appId ? { ...a, ...updatedFields } : a));
  saveLocalApps(updatedList);
  const updatedApp = updatedList.find((a) => a.id === appId);
  return { data: updatedApp, isSupabase: false };
}

export async function deleteApp(appId) {
  const supabase = getSupabaseClient();

  if (supabase) {
    try {
      // 1. Fetch app record to get file storage URLs before row deletion
      const { data: targetApp } = await supabase
        .from('apps')
        .select('*')
        .eq('id', appId)
        .maybeSingle();

      if (targetApp) {
        // 2. Remove HTML code file from Supabase Storage ('apps' bucket)
        if (targetApp.drive_file_url && targetApp.drive_file_url.includes('/apps/')) {
          try {
            const urlParts = targetApp.drive_file_url.split('/apps/');
            if (urlParts.length > 1) {
              const fileName = decodeURIComponent(urlParts[1].split('?')[0]);
              if (fileName) {
                await supabase.storage.from('apps').remove([fileName]);
              }
            }
          } catch (storageErr) {
            console.warn('Supabase Storage file delete warning:', storageErr);
          }
        }

        // 3. Remove thumbnail file if stored in Supabase Storage ('apps' bucket)
        if (targetApp.thumbnail_url && targetApp.thumbnail_url.includes('/apps/')) {
          try {
            const urlParts = targetApp.thumbnail_url.split('/apps/');
            if (urlParts.length > 1) {
              const fileName = decodeURIComponent(urlParts[1].split('?')[0]);
              if (fileName) {
                await supabase.storage.from('apps').remove([fileName]);
              }
            }
          } catch (_) {}
        }
      }

      // 4. Delete app record from Supabase DB table
      const { error } = await supabase
        .from('apps')
        .delete()
        .eq('id', appId);

      if (!error) {
        // Also remove from local cache
        const list = getLocalApps();
        saveLocalApps(list.filter((a) => a.id !== appId));
        return { success: true, isSupabase: true };
      }
    } catch (e) {
      console.warn('Supabase delete app error:', e);
    }
  }

  // Fallback local
  const list = getLocalApps();
  saveLocalApps(list.filter((a) => a.id !== appId));
  return { success: true, isSupabase: false };
}

export const SUPABASE_SCHEMA_SQL = `-- 성동복지관 선생님 앱 공유 플랫폼 테이블 생성 스크립트
-- Supabase 대시보드 > SQL Editor 에서 아래 쿼리를 붙여넣고 Run을 눌러주세요.

-- 1. 선생님 테이블 (teachers) 생성 및 컬럼 자동 추가 (기존 테이블이 있을 경우 대비)
CREATE TABLE IF NOT EXISTS public.teachers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    team TEXT,
    group_name TEXT,
    seq_num INT,
    department TEXT DEFAULT '성동복지관',
    bio TEXT DEFAULT '성동복지관에서 어르신과 함께하는 스마트 앱을 만들어가고 계십니다. 🌿',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 기존 테이블이 존재할 경우 누락된 컬럼 자동 추가
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS team TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS group_name TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS seq_num INT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS department TEXT DEFAULT '성동복지관';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '성동복지관에서 어르신과 함께하는 스마트 앱을 만들어가고 계십니다. 🌿';
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.teachers ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- 2. 앱 테이블 (apps)
CREATE TABLE IF NOT EXISTS public.apps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES public.teachers(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT '일반',
    icon_emoji TEXT DEFAULT '📱',
    thumbnail_url TEXT,
    drive_file_url TEXT,
    app_code TEXT,
    app_type TEXT DEFAULT 'gdrive',
    view_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Row Level Security(RLS) 정책 활성화 및 모든 사용자 읽기/쓰기 허용
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow public insert teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow public update teachers" ON public.teachers;
DROP POLICY IF EXISTS "Allow public delete teachers" ON public.teachers;

CREATE POLICY "Allow public read teachers" ON public.teachers FOR SELECT USING (true);
CREATE POLICY "Allow public insert teachers" ON public.teachers FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update teachers" ON public.teachers FOR UPDATE USING (true);
CREATE POLICY "Allow public delete teachers" ON public.teachers FOR DELETE USING (true);

DROP POLICY IF EXISTS "Allow public read apps" ON public.apps;
DROP POLICY IF EXISTS "Allow public insert apps" ON public.apps;
DROP POLICY IF EXISTS "Allow public update apps" ON public.apps;
DROP POLICY IF EXISTS "Allow public delete apps" ON public.apps;

CREATE POLICY "Allow public read apps" ON public.apps FOR SELECT USING (true);
CREATE POLICY "Allow public insert apps" ON public.apps FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update apps" ON public.apps FOR UPDATE USING (true);
CREATE POLICY "Allow public delete apps" ON public.apps FOR DELETE USING (true);

-- 4. 32명 선생님 데이터 일괄 추가 (INSERT)
INSERT INTO public.teachers (team, group_name, name, seq_num, department) VALUES
-- 1팀
('1팀', '1조', '김종철', 1, '1팀 1조'),
('1팀', '1조', '이근홍', 2, '1팀 1조'),
('1팀', '2조', '김성수', 3, '1팀 2조'),
('1팀', '2조', '이혜섭', 4, '1팀 2조'),
('1팀', '3조', '이성호', 5, '1팀 3조'),
('1팀', '3조', '김영송', 6, '1팀 3조'),
('1팀', '4조', '권오삼', 7, '1팀 4조'),
('1팀', '4조', '육수영', 8, '1팀 4조'),
('1팀', '기타', '천은선/서승희', 9, '1팀 기타'),

-- 2팀
('2팀', '1조', '표영', 1, '2팀 1조'),
('2팀', '1조', '주청자', 2, '2팀 1조'),
('2팀', '2조', '김겸숙', 3, '2팀 2조'),
('2팀', '2조', '이광범', 4, '2팀 2조'),
('2팀', '3조', '박정숙', 5, '2팀 3조'),
('2팀', '3조', '백응현', 6, '2팀 3조'),
('2팀', '4조', '권용의', 7, '2팀 4조'),
('2팀', '4조', '김향숙', 8, '2팀 4조'),

-- 3팀
('3팀', '1조', '강계환', 1, '3팀 1조'),
('3팀', '1조', '박선화', 2, '3팀 1조'),
('3팀', '2조', '윤성배', 3, '3팀 2조'),
('3팀', '2조', '천은선', 4, '3팀 2조'),
('3팀', '3조', '이근수', 5, '3팀 3조'),
('3팀', '3조', '임미자', 6, '3팀 3조'),
('3팀', '3조', '서승희', 6, '3팀 3조'),
('3팀', '4조', '이현숙', 7, '3팀 4조'),
('3팀', '4조', '김용하', 8, '3팀 4조'),
('3팀', '5조', '강미영', 9, '3팀 5조'),
('3팀', '5조', '김금미', 10, '3팀 5조'),

-- 취업팀
('취업팀', '오전', '이수인', 1, '취업팀 오전'),
('취업팀', '오전', '강유정', 2, '취업팀 오전'),
('취업팀', '오후', '전성주', 3, '취업팀 오후'),
('취업팀', '오후', '차미혜', 4, '취업팀 오후');

-- 5. Supabase Storage 에 'apps' 버킷 생성 및 공개 읽기/쓰기 권한 설정
INSERT INTO storage.buckets (id, name, public) 
VALUES ('apps', 'apps', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Allow public select on apps bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public insert on apps bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update on apps bucket" ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete on apps bucket" ON storage.objects;

CREATE POLICY "Allow public select on apps bucket" ON storage.objects FOR SELECT USING (bucket_id = 'apps');
CREATE POLICY "Allow public insert on apps bucket" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'apps');
CREATE POLICY "Allow public update on apps bucket" ON storage.objects FOR UPDATE USING (bucket_id = 'apps');
CREATE POLICY "Allow public delete on apps bucket" ON storage.objects FOR DELETE USING (bucket_id = 'apps');
`;
