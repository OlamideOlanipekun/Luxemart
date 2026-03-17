import { api } from './api';

const SESSION_KEY = 'luxemart_session_id';

export const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      sessionId = crypto.randomUUID();
    } else {
      sessionId = Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    }
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

export const trackPageView = async (path: string) => {
  try {
    await api.tracking.trackPageView({
      path,
      referrer: document.referrer,
      session_id: getSessionId(),
    });
  } catch (err) {
    // Fail silently to not disrupt UX
    console.debug('Tracking failed:', err);
  }
};
