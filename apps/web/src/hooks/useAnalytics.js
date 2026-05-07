import { useEffect, useRef, useCallback } from 'react';

const BATCH_INTERVAL = 5000; 

export function useAnalytics() {
  const queueRef = useRef([]);
  const sessionRef = useRef(crypto.randomUUID());
  const timerRef = useRef(null);

  const trackEvent = useCallback((eventName, payload = {}) => {
    const event = {
      event_name: eventName,
      session_id: sessionRef.current,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      user_agent: navigator.userAgent,
      ...payload
    };

    queueRef.current.push(event);
    console.log(`📊 Analytics Event Tracked: ${eventName}`, payload);
  }, []);

  const flushQueue = useCallback(() => {
    if (queueRef.current.length === 0) return;

    const eventsToProcess = [...queueRef.current];
    queueRef.current = [];

    // Send to /api/analytics
    fetch('/hcgi/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ events: eventsToProcess })
    }).catch(err => {
      // Re-queue on failure (simplified)
      console.warn('Failed to send analytics batch, re-queuing', err);
      queueRef.current = [...eventsToProcess, ...queueRef.current];
    });
  }, []);

  // Set up periodic flushing
  useEffect(() => {
    timerRef.current = setInterval(flushQueue, BATCH_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [flushQueue]);

  // Set up sendBeacon for page unload to ensure no lost data
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (queueRef.current.length > 0) {
        const blob = new Blob([JSON.stringify({ events: queueRef.current })], { type: 'application/json' });
        navigator.sendBeacon('/hcgi/api/analytics', blob);
      }
    };

    window.addEventListener('visibilitychange', (e) => {
      if (document.visibilityState === 'hidden') handleBeforeUnload();
    });
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('visibilitychange', handleBeforeUnload);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return { trackEvent };
}