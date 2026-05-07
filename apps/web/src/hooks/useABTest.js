import { useState, useEffect } from 'react';

export function useABTest(testName, variants = ['A', 'B']) {
  const [variant, setVariant] = useState(null);

  useEffect(() => {
    const storageKey = `ab_test_${testName}`;
    let assigned = localStorage.getItem(storageKey);

    if (!assigned) {
      assigned = variants[Math.floor(Math.random() * variants.length)];
      localStorage.setItem(storageKey, assigned);
      
      // Notify server of new assignment
      fetch('/hcgi/api/ab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testName, variant: assigned, action: 'assignment' })
      }).catch(() => {});
    }

    setVariant(assigned);
  }, [testName, variants]);

  const trackConversion = () => {
    if (!variant) return;
    console.log(`📈 A/B Test Conversion: ${testName} -> ${variant}`);
    fetch('/hcgi/api/ab-tests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ testName, variant, action: 'conversion' })
    }).catch(() => {});
  };

  return { variant, trackConversion };
}