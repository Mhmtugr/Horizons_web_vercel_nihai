import { Router } from 'express';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';

const router = Router();

// POST /email - Send email via PocketBase
router.post('/', async (req, res) => {
  const { to, subject, html } = req.body;

  // Validate required fields
  if (!to || !subject || !html) {
    return res.status(400).json({ error: 'to, subject, and html are required' });
  }

  logger.info(`Sending email to: ${to}, subject: ${subject}`);

  // Create email record in PocketBase for logging/tracking
  const emailRecord = await pb.collection('emails').create({
    to,
    subject,
    html_content: html,
    status: 'sent',
    sent_at: new Date().toISOString(),
  });

  logger.info(`Email record created with ID: ${emailRecord.id}`);

  // Note: Actual email sending is handled by PocketBase hooks
  // The email record creation triggers PocketBase server-side hooks
  // that use the platform's built-in mailer

  res.status(201).json({ success: true, message: 'Email sent', recordId: emailRecord.id });
});

// POST /send-email - Legacy endpoint (kept for backward compatibility)
router.post('/send-email', async (req, res) => {
  const { to, subject, template, data } = req.body;

  // Validate required fields
  if (!to || !subject) {
    return res.status(400).json({ error: 'to and subject are required' });
  }

  logger.info(`Sending email to: ${to}, subject: ${subject}`);

  let htmlContent = '';

  // Build HTML content based on template
  if (template === 'new_lead') {
    const { name, email, phone, company, service, message, timestamp } = data || {};
    htmlContent = `
      <h2>New Lead Received</h2>
      <p><strong>Name:</strong> ${name || 'N/A'}</p>
      <p><strong>Email:</strong> ${email || 'N/A'}</p>
      <p><strong>Phone:</strong> ${phone || 'N/A'}</p>
      <p><strong>Company:</strong> ${company || 'N/A'}</p>
      <p><strong>Service:</strong> ${service || 'N/A'}</p>
      <p><strong>Message:</strong> ${message || 'N/A'}</p>
      <p><strong>Timestamp:</strong> ${timestamp || new Date().toISOString()}</p>
    `;
  } else if (template === 'lead_confirmation') {
    const { name, service } = data || {};
    htmlContent = `
      <h2>Welcome!</h2>
      <p>Dear ${name || 'Valued Customer'},</p>
      <p>Thank you for your interest in our <strong>${service || 'services'}</strong>.</p>
      <p>We have received your inquiry and will get back to you shortly.</p>
      <p>Best regards,<br/>Nova Teknoloji Otomasyon Team</p>
    `;
  } else {
    htmlContent = '<p>Email content</p>';
  }

  // Create email record in PocketBase for logging/tracking
  const emailRecord = await pb.collection('emails').create({
    to,
    subject,
    template,
    html_content: htmlContent,
    status: 'sent',
    sent_at: new Date().toISOString(),
  });

  logger.info(`Email record created with ID: ${emailRecord.id}`);

  // Note: Actual email sending is handled by PocketBase hooks
  // The email record creation triggers PocketBase server-side hooks
  // that use the platform's built-in mailer

  res.status(201).json({ success: true, recordId: emailRecord.id });
});

export default router;