import { Router } from 'express';
import transporter from '../config/email.js';
import logger from '../utils/logger.js';

const router = Router();

// POST /test-email - Send a test email
router.post('/', async (req, res) => {
  const testEmail = 'info@nexaotomasyon.com.tr';
  const timestamp = new Date().toISOString();

  logger.info('📤 Sending test email...');

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@nexaotomasyon.com.tr',
    to: testEmail,
    subject: 'TEST EMAIL - Nova Teknoloji',
    html: `
      <h2>Test Email Confirmation</h2>
      <p>This is a test email from Nova Teknoloji automation system.</p>
      <p><strong>Timestamp:</strong> ${timestamp}</p>
      <p><strong>Status:</strong> ✅ Email service is working correctly</p>
      <hr />
      <p><em>This is an automated test message. Please do not reply.</em></p>
    `,
  };

  const info = await transporter.sendMail(mailOptions);

  logger.info(`✅ Test email sent: ${info.messageId}`);

  res.status(200).json({
    success: true,
    messageId: info.messageId,
    timestamp,
  });
});

export default router;