import { useCallback } from 'react';

export function useABTestAnalysis() {
  // Normal Cumulative Distribution Function
  const normalCDF = (x) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423;
    const prob = d * Math.exp(-x * x / 2) * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  };

  const calculateSignificance = useCallback((visitorsA, conversionsA, visitorsB, conversionsB) => {
    const rateA = conversionsA / visitorsA;
    const rateB = conversionsB / visitorsB;
    
    // Pooled probability
    const pPool = (conversionsA + conversionsB) / (visitorsA + visitorsB);
    
    // Standard error
    const se = Math.sqrt(pPool * (1 - pPool) * (1 / visitorsA + 1 / visitorsB));
    
    // Z-score
    const zScore = (rateB - rateA) / se;
    
    // P-value (two-tailed)
    const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));
    
    // Confidence level
    const confidenceLevel = (1 - pValue) * 100;

    return {
      rateA: (rateA * 100).toFixed(2) + '%',
      rateB: (rateB * 100).toFixed(2) + '%',
      uplift: (((rateB - rateA) / rateA) * 100).toFixed(2) + '%',
      zScore: zScore.toFixed(4),
      pValue: pValue.toFixed(4),
      confidenceLevel: confidenceLevel.toFixed(2) + '%',
      isSignificant: pValue < 0.05
    };
  }, []);

  return { calculateSignificance };
}