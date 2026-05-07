import { Router } from 'express';
import logger from '../utils/logger.js';

const router = Router();

// In-memory metrics object
const metrics = {
  sent: 0,
  failed: 0,
  bounced: 0,
  avgDeliveryTime: 0,
  lastError: null,
  deliveryTimes: [],
};

// POST /email-metrics/track - Track email metrics
router.post('/track', async (req, res) => {
  const { success, deliveryTime, error } = req.body;

  if (success === true) {
    metrics.sent += 1;
    if (deliveryTime !== undefined && typeof deliveryTime === 'number') {
      metrics.deliveryTimes.push(deliveryTime);
      metrics.avgDeliveryTime = metrics.deliveryTimes.reduce((a, b) => a + b, 0) / metrics.deliveryTimes.length;
    }
  } else if (success === false) {
    metrics.failed += 1;
    if (error) {
      metrics.lastError = error;
    }
  }

  logger.info(`📊 Email Metrics: ${JSON.stringify(metrics)}`);

  res.status(200).json({
    success: true,
    metrics,
  });
});

// GET /email-metrics - Get current metrics
router.get('/', async (req, res) => {
  logger.info(`📊 Email Metrics retrieved: ${JSON.stringify(metrics)}`);

  res.json(metrics);
});

export default router;