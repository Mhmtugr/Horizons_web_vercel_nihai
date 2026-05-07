import { Router } from 'express';
import PocketBase from 'pocketbase';

const router = Router();

// Initialize PocketBase client
const pb = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');

// Calendly webhook handler
router.post('/calendly', async (req, res) => {
  try {
    const { event, payload } = req.body;
    
    console.log('✅ Calendly webhook received:', { event, payload });

    if (event === 'calendly.event_scheduled') {
      // Extract event details from payload
      const eventData = {
        event_type: payload.event_type || 'Discovery Call',
        event_name: payload.event_name || '15 Dakikalık Keşif Toplantısı',
        event_time: payload.event_time || new Date().toISOString(),
        event_end_time: payload.event_end_time || new Date().toISOString(),
        invitee_email: payload.invitee_email || 'unknown@email.com',
        invitee_name: payload.invitee_name || 'Ziyaretçi',
        created_at: payload.created_at || new Date().toISOString()
      };

      console.log('✅ Saving Calendly event to database:', eventData);

      // Save to PocketBase
      const record = await pb.collection('calendly_events').create(eventData);
      
      console.log('✅ Calendly event saved successfully:', record.id);

      return res.status(200).json({
        success: true,
        message: 'Calendly event saved successfully',
        recordId: record.id
      });
    }

    if (event === 'calendly.event_cancelled') {
      console.log('✅ Calendly event cancelled:', payload);
      
      return res.status(200).json({
        success: true,
        message: 'Calendly cancellation logged'
      });
    }

    // Unknown event type
    console.log('⚠️ Unknown Calendly event type:', event);
    return res.status(200).json({
      success: true,
      message: 'Event received but not processed'
    });

  } catch (error) {
    console.error('❌ Error processing Calendly webhook:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to process Calendly webhook'
    });
  }
});

export default router;