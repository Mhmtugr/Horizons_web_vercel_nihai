import { useEffect } from 'react';

export function usePerformanceMonitoring() {
  useEffect(() => {
    const metrics = {};

    // Helper to send metrics
    const sendMetric = (name, value) => {
      metrics[name] = value;
      fetch('/hcgi/api/metrics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metric: name, value, timestamp: new Date().toISOString() })
      }).catch(() => {});
    };

    try {
      // Paint Timing (FCP)
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            sendMetric('fcp', entry.startTime);
          }
        }
      });
      paintObserver.observe({ type: 'paint', buffered: true });

      // Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        sendMetric('lcp', lastEntry.startTime);
      });
      lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

      // Cumulative Layout Shift (CLS)
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            sendMetric('cls', clsValue);
          }
        }
      });
      clsObserver.observe({ type: 'layout-shift', buffered: true });

    } catch (e) {
      console.warn('PerformanceObserver not supported', e);
    }
  }, []);
}