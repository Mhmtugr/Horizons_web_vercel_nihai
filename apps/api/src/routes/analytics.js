import { Router } from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = Router();

// POST /analytics/log-conversation - Create a new analytics event record
router.post('/log-conversation', async (req, res) => {
  const { userId, message, timestamp, source } = req.body;
  
  if (!message || !source) {
    return res.status(400).json({ error: 'Missing required fields: message, source' });
  }
  
  const finalUserId = userId || 'anonymous';
  const finalTimestamp = timestamp || new Date().toISOString();
  
  logger.info(`Logging conversation from source: ${source}`);
  
  const record = await pb.collection('analytics_events').create({
    user_id: finalUserId,
    message,
    timestamp: finalTimestamp,
    source,
  });
  
  logger.info(`Analytics event created with ID: ${record.id}`);
  
  res.status(201).json({ success: true, recordId: record.id });
});

// PUT /analytics/event/:eventId - Update analytics event record
router.put('/event/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { message, status, notes } = req.body;
  
  logger.info(`Updating analytics event with ID: ${eventId}`);
  
  const updateData = {};
  if (message !== undefined) updateData.message = message;
  if (status !== undefined) updateData.status = status;
  if (notes !== undefined) updateData.notes = notes;
  
  const record = await pb.collection('analytics_events').update(eventId, updateData);
  
  logger.info(`Analytics event updated with ID: ${eventId}`);
  
  res.json(record);
});

// GET /analytics/event/:eventId - Fetch single analytics event by ID
router.get('/event/:eventId', async (req, res) => {
  const { eventId } = req.params;
  
  logger.info(`Fetching analytics event with ID: ${eventId}`);
  
  const event = await pb.collection('analytics_events').getOne(eventId);
  
  res.json(event);
});

// GET /analytics/events - Fetch all analytics events
router.get('/events', async (req, res) => {
  logger.info('Fetching all analytics events from analytics_events collection');
  
  const events = await pb.collection('analytics_events').getFullList({
    sort: '-created',
  });
  
  res.json(events);
});

export default router;