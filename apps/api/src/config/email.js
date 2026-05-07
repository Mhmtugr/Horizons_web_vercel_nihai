import 'dotenv/config';
import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  requireTLS: true,
  tls: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false,
  },
  connectionTimeout: 30000,
  socketTimeout: 30000,
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    logger.error('❌ Email configuration error:', error.message);
    logger.error('SMTP Configuration:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE,
      user: process.env.SMTP_USER ? process.env.SMTP_USER.substring(0, 5) + '***' : 'NOT SET',
      pass: process.env.SMTP_PASS ? '***' : 'NOT SET',
    });
  } else {
    logger.info('✅ Email config updated');
    logger.info('✅ Email service ready');
  }
});

export default transporter;