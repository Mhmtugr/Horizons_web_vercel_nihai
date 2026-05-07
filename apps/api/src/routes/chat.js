import { Router } from 'express';
import logger from '../utils/logger.js';

const router = Router();

// POST /chat - AI chat message endpoint
router.post('/', async (req, res) => {
  const { message, userId, conversationId } = req.body;

  // Validate required fields
  if (!message) {
    return res.status(400).json({ error: 'message is required' });
  }

  const finalUserId = userId || 'anonymous';
  const finalConversationId = conversationId || `conv_${Date.now()}`;

  logger.info(`Chat message received from user: ${finalUserId}`);
  console.log(`💬 Chat message from ${finalUserId}: ${message.substring(0, 50)}...`);

  // Note: The actual AI streaming is handled by the integrated-ai route
  // This endpoint logs the message and returns a confirmation
  // The frontend should use the integrated-ai/stream endpoint for actual AI responses

  res.status(200).json({
    success: true,
    conversationId: finalConversationId,
    userId: finalUserId,
    timestamp: new Date().toISOString(),
    message: 'Message received. Use /integrated-ai/stream for AI responses.',
  });
});

export default router;