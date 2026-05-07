import { Router } from 'express';
import pb from '../utils/pocketbaseClient.js';
import transporter from '../config/email.js';
import logger from '../utils/logger.js';

const router = Router();

// Helper function to build request form email template
const buildRequestFormEmailTemplate = ({
  conversationSummary,
  requestForm,
  contactInfo,
}) => {
  const { service, details } = requestForm || {};
  const { name, surname, email, phone } = contactInfo || {};

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yeni Hizmet Talebi - Nova Teknoloji</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #333333;
      background-color: #f5f5f5;
    }
    table {
      border-collapse: collapse;
      border-spacing: 0;
      width: 100%;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #10B981 0%, #059669 100%);
      padding: 40px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header-logo {
      font-size: 24px;
      font-weight: 700;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .content h1 {
      margin: 0 0 20px 0;
      font-size: 28px;
      font-weight: 700;
      color: #1a1a1a;
      line-height: 1.3;
    }
    .content h2 {
      margin: 30px 0 15px 0;
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      border-bottom: 2px solid #10B981;
      padding-bottom: 10px;
    }
    .content p {
      margin: 0 0 15px 0;
      font-size: 15px;
      line-height: 1.6;
      color: #555555;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    .info-table tr {
      border-bottom: 1px solid #e0e0e0;
    }
    .info-table td {
      padding: 12px 0;
    }
    .info-table .label {
      font-weight: 600;
      width: 30%;
      color: #1a1a1a;
    }
    .info-table .value {
      color: #555555;
    }
    .highlight-box {
      background-color: #f0fdf4;
      border-left: 4px solid #10B981;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .highlight-box p {
      margin: 0;
      color: #047857;
      font-weight: 500;
    }
    .conversation-box {
      background-color: #f9f9f9;
      border: 1px solid #e0e0e0;
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.6;
      color: #555555;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      font-size: 13px;
      color: #888888;
    }
    .footer-links a {
      color: #10B981;
      text-decoration: none;
      margin: 0 10px;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    @media only screen and (max-width: 600px) {
      .container {
        width: 100% !important;
      }
      .content {
        padding: 30px 20px !important;
      }
      .header {
        padding: 30px 20px !important;
      }
      .header-logo {
        font-size: 20px;
      }
      .content h1 {
        font-size: 24px;
      }
      .content h2 {
        font-size: 18px;
      }
      .footer {
        padding: 20px 15px !important;
      }
      .info-table .label {
        display: block;
        width: 100%;
        margin-bottom: 4px;
      }
      .info-table .value {
        display: block;
      }
    }
  </style>
</head>
<body>
  <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" class="container">
          <!-- Header -->
          <tr>
            <td class="header">
              <h1 class="header-logo">Nova Teknoloji</h1>
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Yeni Hizmet Talebi</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content">
              <h1>🎯 Yeni Hizmet Talebi Alındı</h1>
              
              <h2>İletişim Bilgileri</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" class="info-table">
                <tr>
                  <td class="label">Ad Soyad:</td>
                  <td class="value"><strong>${name || ''} ${surname || ''}</strong></td>
                </tr>
                <tr>
                  <td class="label">E-posta:</td>
                  <td class="value"><a href="mailto:${email}">${email || 'Belirtilmemiş'}</a></td>
                </tr>
                <tr>
                  <td class="label">Telefon:</td>
                  <td class="value"><a href="tel:${phone}">${phone || 'Belirtilmemiş'}</a></td>
                </tr>
              </table>
              
              <h2>Talep Edilen Hizmet</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" class="info-table">
                <tr>
                  <td class="label">Hizmet:</td>
                  <td class="value"><strong>${service || 'Belirtilmemiş'}</strong></td>
                </tr>
              </table>
              
              ${details ? `
              <h2>Hizmet Detayları</h2>
              <div class="conversation-box">
                ${Object.entries(details)
                  .map(([key, value]) => `<p><strong>${key}:</strong> ${value}</p>`)
                  .join('')}
              </div>
              ` : ''}
              
              ${conversationSummary ? `
              <h2>Konuşma Özeti</h2>
              <div class="conversation-box">
                ${conversationSummary}
              </div>
              ` : ''}
              
              <div class="highlight-box">
                <p>⚡ Bu talep otomatik olarak kaydedilmiştir. Lütfen müşteri ile en kısa sürede iletişime geçiniz.</p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer">
              <p style="margin: 0 0 10px 0;">&copy; 2024 Nova Teknoloji. Tüm hakları saklıdır.</p>
              <div class="footer-links">
                <a href="https://novaiteknoloji.com">Web Sitesi</a>
                <a href="https://novaiteknoloji.com/privacy">Gizlilik</a>
              </div>
              <p style="margin: 10px 0 0 0; font-size: 12px;">
                Nova Teknoloji | Otomasyon Çözümleri<br>
                İstanbul, Türkiye
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
};

// POST /send-request-form - Send request form email
router.post('/', async (req, res) => {
  const { conversationSummary, requestForm, contactInfo } = req.body;

  // Validate required fields
  if (!contactInfo || !contactInfo.email) {
    return res.status(400).json({ error: 'contactInfo with email is required' });
  }

  if (!requestForm || !requestForm.service) {
    return res.status(400).json({ error: 'requestForm with service is required' });
  }

  const { name, surname, email, phone } = contactInfo;
  const { service, details } = requestForm;

  logger.info(`📤 Processing request form from: ${name} ${surname} (${email})`);

  // Build email HTML
  const htmlContent = buildRequestFormEmailTemplate({
    conversationSummary,
    requestForm,
    contactInfo,
  });

  // Send email to info@nexaotomasyon.com.tr
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@nexaotomasyon.com.tr',
    to: 'info@nexaotomasyon.com.tr',
    replyTo: email,
    subject: `Yeni Hizmet Talebi - ${service} - ${name} ${surname}`,
    html: htmlContent,
    headers: {
      'X-Mailer': 'Nova-Teknoloji-RequestForm/1.0',
      'X-Priority': '2',
      'Importance': 'high',
      'X-MSMail-Priority': 'High',
      'MIME-Version': '1.0',
      'Content-Type': 'text/html; charset=UTF-8',
    },
  };

  logger.info(`📤 Sending request form email to: info@nexaotomasyon.com.tr`);
  const info = await transporter.sendMail(mailOptions);
  logger.info(`✅ Request form email sent successfully: ${info.messageId}`);

  // Create request form record in PocketBase for tracking
  const formRecord = await pb.collection('request_forms').create({
    customer_name: `${name} ${surname}`,
    customer_email: email,
    customer_phone: phone || '',
    service: service,
    service_details: JSON.stringify(details || {}),
    conversation_summary: conversationSummary || '',
    status: 'received',
    sent_at: new Date().toISOString(),
    message_id: info.messageId,
  });

  logger.info(`📊 Request form record created with ID: ${formRecord.id}`);

  res.status(200).json({
    success: true,
    message: 'Talep formunuz başarıyla gönderildi',
    recordId: formRecord.id,
    messageId: info.messageId,
  });
});

export default router;
