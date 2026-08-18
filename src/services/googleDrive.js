/**
 * Google Drive integration & URL parsing utilities
 * Seongdong Welfare Center Shared Drive Folder
 */

export const OFFICIAL_DRIVE_FOLDER_ID = '1-hpo5T2Qvas3QsH2DBOKYOpY6fmSaXjC';
export const OFFICIAL_DRIVE_FOLDER_URL = 'https://drive.google.com/drive/folders/1-hpo5T2Qvas3QsH2DBOKYOpY6fmSaXjC?usp=drive_link';

export function getOfficialDriveFolderUrl() {
  return import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_URL || OFFICIAL_DRIVE_FOLDER_URL;
}

// Download HTML file to teacher's computer for uploading to Google Drive
export function downloadAppHtmlFile(teacherName, appTitle, htmlContent) {
  const safeTeacher = (teacherName || '선생님').replace(/[/\\?%*:|"<>]/g, '_').trim();
  const safeTitle = (appTitle || '스마트앱').replace(/[/\\?%*:|"<>]/g, '_').trim();
  const fileName = `${safeTeacher}_${safeTitle}.html`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// Extract Google Drive File ID from various link formats
export function extractDriveFileId(url) {
  if (!url) return null;
  const trimmed = url.trim();

  // Pattern 1: /file/d/FILE_ID/
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Pattern 2: id=FILE_ID
  const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  // Pattern 3: /folders/FOLDER_ID
  const matchFolder = trimmed.match(/\/folders\/([a-zA-Z0-9_-]+)/);
  if (matchFolder && matchFolder[1]) return matchFolder[1];

  // Pattern 4: Raw ID string (if user enters only ID)
  if (/^[a-zA-Z0-9_-]{25,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

// Generate Google Drive Preview Embed URL
export function getDrivePreviewUrl(urlOrId) {
  const fileId = extractDriveFileId(urlOrId) || urlOrId;
  if (!fileId) return null;
  return `https://drive.google.com/file/d/${fileId}/preview`;
}

// Generate direct content view link
export function getDriveDirectViewUrl(urlOrId) {
  const fileId = extractDriveFileId(urlOrId) || urlOrId;
  if (!fileId) return null;
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

// Create a safe sandboxed HTML execution source
export function createExecutableSrc(app) {
  if (!app) return '';

  // Case 1: Direct HTML/JS Code
  if (app.app_code && app.app_code.trim()) {
    const blob = new Blob([app.app_code], { type: 'text/html;charset=utf-8' });
    return URL.createObjectURL(blob);
  }

  // Case 2: Google Drive File URL
  if (app.drive_file_url) {
    const fileId = extractDriveFileId(app.drive_file_url);
    if (fileId) {
      // Return the Google Drive preview runner
      return `https://drive.google.com/file/d/${fileId}/preview`;
    }
    return app.drive_file_url;
  }

  return 'about:blank';
}

// Instructions for teachers on how to share Google Drive files
export const GOOGLE_DRIVE_GUIDE_STEPS = [
  {
    step: 1,
    title: '성동복지관 구글 드라이브 접속',
    desc: '공유 드라이브 폴더에 접속하여 [선생님 성함]으로 폴더를 생성합니다.',
    icon: '📁'
  },
  {
    step: 2,
    title: '앱 이름 폴더 생성 후 HTML 파일 업로드',
    desc: '선생님 폴더 안에 [앱 이름] 폴더를 만들고 완성된 HTML 파일을 업로드합니다.',
    icon: '📂'
  },
  {
    step: 3,
    title: '공유 권한 설정 및 링크 등록',
    desc: '파일 우클릭 > [공유] > [링크가 있는 모든 사용자]로 변경 후 링크를 복사하여 등록합니다.',
    icon: '🔗'
  }
];
