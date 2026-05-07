import { Router } from 'express';
import transporter from '../config/email.js';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import crypto from 'crypto';

const router = Router();

// Email template builder with inline CSS and tracking
const buildEmailTemplate = ({
  subject,
  preheader,
  heading,
  content,
  ctaText,
  ctaUrl,
  trackingPixelId,
  trackableLinks = [],
  accentColor = '#10B981', // Emerald green
}) => {
  const trackingPixel = trackingPixelId 
    ? `<img src="${process.env.TRACKING_PIXEL_URL || 'https://api.example.com'}/track/open/${trackingPixelId}" width="1" height="1" alt="" style="display:none;" />`
    : '';

  const trackedLinks = trackableLinks.map(link => {
    const trackingId = crypto.randomBytes(16).toString('hex');
    return {
      ...link,
      trackingId,
      trackedUrl: `${process.env.TRACKING_URL || 'https://api.example.com'}/track/click/${trackingId}?url=${encodeURIComponent(link.url)}`
    };
  });

  const linksHtml = trackedLinks.map(link => `
    <tr>
      <td style="padding: 12px 0;">
        <a href="${link.trackedUrl}" style="display: inline-block; padding: 12px 24px; background-color: ${accentColor}; color: #ffffff; text-decoration: none; border-radius: 4px; font-weight: 600; font-size: 14px;">${link.text}</a>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="format-detection" content="telephone=no">
  <title>${subject}</title>
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      min-width: 100% !important;
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
    img {
      border: 0;
      outline: none;
      text-decoration: none;
      -ms-interpolation-mode: nearest-neighbor;
    }
    a {
      color: ${accentColor};
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, ${accentColor} 0%, #059669 100%);
      padding: 40px 20px;
      text-align: center;
      color: #ffffff;
    }
    .header-logo {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .header-tagline {
      font-size: 14px;
      margin: 8px 0 0 0;
      opacity: 0.9;
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
    }
    .content p {
      margin: 0 0 15px 0;
      font-size: 15px;
      line-height: 1.6;
      color: #555555;
    }
    .content ul {
      margin: 15px 0;
      padding-left: 20px;
      color: #555555;
    }
    .content li {
      margin: 8px 0;
      font-size: 15px;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      padding: 14px 32px;
      background-color: ${accentColor};
      color: #ffffff;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 15px;
      margin: 20px 0;
      border: 2px solid ${accentColor};
      transition: all 0.3s ease;
    }
    .cta-button:hover {
      background-color: #059669;
      border-color: #059669;
      text-decoration: none;
    }
    .highlight-box {
      background-color: #f0fdf4;
      border-left: 4px solid ${accentColor};
      padding: 20px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .highlight-box p {
      margin: 0;
      color: #047857;
      font-weight: 500;
    }
    .footer {
      background-color: #f9f9f9;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e0e0e0;
      font-size: 13px;
      color: #888888;
    }
    .footer-links {
      margin: 15px 0;
    }
    .footer-links a {
      color: ${accentColor};
      text-decoration: none;
      margin: 0 10px;
    }
    .footer-links a:hover {
      text-decoration: underline;
    }
    .divider {
      height: 1px;
      background-color: #e0e0e0;
      margin: 30px 0;
    }
    .preheader {
      display: none;
      font-size: 1px;
      color: #f5f5f5;
      line-height: 1px;
      max-height: 0;
      max-width: 0;
      opacity: 0;
      overflow: hidden;
    }
    .info-table {
      width: 100%;
      border-collapse: collapse;
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
      .footer-links a {
        display: block;
        margin: 8px 0 !important;
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
  <div class="preheader">${preheader}</div>
  <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; background-color: #f5f5f5;">
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table role="presentation" cellpadding="0" cellspacing="0" class="container">
          <!-- Header -->
          <tr>
            <td class="header">
              <h1 class="header-logo">Nova Teknoloji</h1>
              <p class="header-tagline">Otomasyon & Dijital Dönüşüm Çözümleri</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content">
              <h1>${heading}</h1>
              ${content}
              ${ctaText && ctaUrl ? `
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%;">
                <tr>
                  <td align="center" style="padding: 20px 0;">
                    <a href="${ctaUrl}" class="cta-button">${ctaText}</a>
                  </td>
                </tr>
              </table>
              ` : ''}
              ${linksHtml ? `
              <table role="presentation" cellpadding="0" cellspacing="0" style="width: 100%; margin-top: 20px;">
                ${linksHtml}
              </table>
              ` : ''}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td class="footer">
              <p style="margin: 0 0 10px 0;">&copy; 2024 Nova Teknoloji. Tüm hakları saklıdır.</p>
              <div class="footer-links">
                <a href="https://novaiteknoloji.com">Web Sitesi</a>
                <a href="https://novaiteknoloji.com/privacy">Gizlilik</a>
                <a href="https://novaiteknoloji.com/unsubscribe">Abonelikten Çık</a>
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
  ${trackingPixel}
</body>
</html>
  `;
};

// POST /send-email - Send email with professional template
router.post('/', async (req, res) => {
  const { to, subject, heading, content, ctaText, ctaUrl, trackableLinks, template } = req.body;

  // Validate required fields
  if (!to || !subject) {
    return res.status(400).json({ error: 'Missing required fields: to, subject' });
  }

  const trackingPixelId = crypto.randomBytes(16).toString('hex');
  const preheader = heading || subject;

  logger.info(`📤 Preparing email to: ${to}, subject: ${subject}`);

  let htmlContent;

  if (template === 'custom') {
    // Custom template with provided content
    htmlContent = buildEmailTemplate({
      subject,
      preheader,
      heading: heading || subject,
      content: content || '<p>Email content</p>',
      ctaText,
      ctaUrl,
      trackingPixelId,
      trackableLinks: trackableLinks || [],
      accentColor: '#10B981',
    });
  } else if (template === 'lead_confirmation') {
    // Lead confirmation template
    const { name, service } = req.body.data || {};
    htmlContent = buildEmailTemplate({
      subject,
      preheader: 'Talebiniz için teşekkür ederiz',
      heading: `Hoş geldiniz, ${name || 'Değerli Müşteri'}!`,
      content: `
        <p><strong>${service || 'hizmetlerimiz'}</strong> ile ilgilendiğiniz için teşekkür ederiz.</p>
        <p>Talebinizi aldık ve ekibimiz kısa sürede sizinle iletişime geçecektir. 24 saat içinde sizden haber alacaksınız.</p>
        <div class="highlight-box">
          <p>📧 Özel ihtiyaçlarınıza göre hazırlanmış bir teklif göndereceğiz.</p>
        </div>
        <p>Bu arada, hizmetlerimizi keşfetmeye ve Nova Teknoloji'nin işinizi nasıl dönüştürebileceğini öğrenmeye devam edebilirsiniz.</p>
      `,
      ctaText: 'Hizmetlerimizi Keşfet',
      ctaUrl: 'https://novaiteknoloji.com/services',
      trackingPixelId,
      trackableLinks: [
        { text: 'Hizmetleri Görüntüle', url: 'https://novaiteknoloji.com/services' },
        { text: 'Toplantı Planla', url: 'https://calendly.com/novaiteknoloji' },
      ],
      accentColor: '#10B981',
    });
  } else if (template === 'new_lead') {
    // New lead notification template - sent to info@nexaotomasyon.com.tr
    const { name, email, phone, company, service, message, timestamp } = req.body.data || {};
    htmlContent = buildEmailTemplate({
      subject: 'YENİ POTANSİYEL MÜŞTERİ TALEBİ - Nova Teknoloji',
      preheader: 'Yeni müşteri talebiniz alındı',
      heading: '🎯 Yeni Potansiyel Müşteri Talebiniz',
      content: `
        <p style="color: #10B981; font-weight: 600; margin-bottom: 20px;">Aşağıda müşteri bilgileri bulunmaktadır:</p>
        <table role="presentation" cellpadding="0" cellspacing="0" class="info-table">
          <tr>
            <td class="label">Ad Soyad:</td>
            <td class="value"><strong>${name || 'Belirtilmemiş'}</strong></td>
          </tr>
          <tr>
            <td class="label">E-posta:</td>
            <td class="value"><a href="mailto:${email}">${email || 'Belirtilmemiş'}</a></td>
          </tr>
          <tr>
            <td class="label">Telefon:</td>
            <td class="value">${phone || 'Belirtilmemiş'}</td>
          </tr>
          <tr>
            <td class="label">Şirket:</td>
            <td class="value">${company || 'Belirtilmemiş'}</td>
          </tr>
          <tr>
            <td class="label">Hizmet:</td>
            <td class="value"><strong>${service || 'Belirtilmemiş'}</strong></td>
          </tr>
          <tr>
            <td class="label" style="vertical-align: top;">Mesaj:</td>
            <td class="value">${message || 'Belirtilmemiş'}</td>
          </tr>
          <tr>
            <td class="label">Tarih/Saat:</td>
            <td class="value">${timestamp || new Date().toISOString()}</td>
          </tr>
        </table>
        <div class="highlight-box" style="margin-top: 25px;">
          <p>⚡ Bu talep otomatik olarak kaydedilmiştir. Lütfen müşteri ile en kısa sürede iletişime geçiniz.</p>
        </div>
      `,
      ctaText: 'Panelde Görüntüle',
      ctaUrl: 'https://novaiteknoloji.com/dashboard/leads',
      trackingPixelId,
      accentColor: '#10B981',
    });
  } else {
    // Default template
    htmlContent = buildEmailTemplate({
      subject,
      preheader,
      heading: heading || subject,
      content: content || '<p>Email content</p>',
      ctaText,
      ctaUrl,
      trackingPixelId,
      trackableLinks: trackableLinks || [],
      accentColor: '#10B981',
    });
  }

  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@nexaotomasyon.com.tr',
    to,
    subject,
    html: htmlContent,
    // Headers for SPF/DKIM/DMARC compatibility
    headers: {
      'X-Mailer': 'Nova-Teknoloji-Mailer/1.0',
      'X-Priority': '3',
      'Importance': 'normal',
      'X-MSMail-Priority': 'Normal',
      'List-Unsubscribe': '<https://novaiteknoloji.com/unsubscribe>',
      'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
      'X-Originating-IP': '[127.0.0.1]',
      'MIME-Version': '1.0',
      'Content-Type': 'text/html; charset=UTF-8',
    },
  };

  logger.info(`📤 Sending email to: ${to}`);
  const info = await transporter.sendMail(mailOptions);
  logger.info(`✅ Email sent successfully: ${info.messageId}`);

  // Create email record in PocketBase for tracking
  const emailRecord = await pb.collection('emails').create({
    to,
    subject,
    template: template || 'custom',
    html_content: htmlContent,
    tracking_pixel_id: trackingPixelId,
    status: 'sent',
    sent_at: new Date().toISOString(),
    message_id: info.messageId,
    response: info.response,
  });

  logger.info(`📊 Email record created with ID: ${emailRecord.id}`);

  res.status(200).json({
    success: true,
    messageId: info.messageId,
    recordId: emailRecord.id,
    trackingPixelId,
  });
});

// GET /send-email/track/open/:trackingPixelId - Track email opens
router.get('/track/open/:trackingPixelId', async (req, res) => {
  const { trackingPixelId } = req.params;

  logger.info(`📊 Email opened (tracking ID: ${trackingPixelId})`);

  // Update email record with open status
  const emailRecords = await pb.collection('emails').getFullList({
    filter: `tracking_pixel_id = "${trackingPixelId}"`,
  });

  if (emailRecords.length > 0) {
    await pb.collection('emails').update(emailRecords[0].id, {
      opened: true,
      opened_at: new Date().toISOString(),
    });
    logger.info(`✅ Email open tracked for ID: ${emailRecords[0].id}`);
  }

  // Return 1x1 transparent pixel
  const pixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    'base64'
  );

  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.send(pixel);
});

// GET /send-email/track/click/:trackingId - Track link clicks
router.get('/track/click/:trackingId', async (req, res) => {
  const { trackingId } = req.params;
  const { url } = req.query;

  logger.info(`🔗 Link clicked (tracking ID: ${trackingId}, URL: ${url})`);

  // Log click event in PocketBase
  await pb.collection('email_clicks').create({
    tracking_id: trackingId,
    clicked_url: url,
    clicked_at: new Date().toISOString(),
    user_agent: req.get('user-agent'),
    ip_address: req.ip,
  });
  logger.info(`✅ Click tracked for URL: ${url}`);

  // Redirect to actual URL
  if (url) {
    res.redirect(301, decodeURIComponent(url));
  } else {
    res.status(400).json({ error: 'URL parameter is required' });
  }
});

// POST /send-email/handle-bounce - Handle bounce notifications
router.post('/handle-bounce', async (req, res) => {
  const { messageId, bounceType, bounceSubType, bouncedRecipients } = req.body;

  logger.info(`📬 Bounce notification received for message: ${messageId}`);

  // Find email record by message ID
  const emailRecords = await pb.collection('emails').getFullList({
    filter: `message_id = "${messageId}"`,
  });

  if (emailRecords.length > 0) {
    const emailRecord = emailRecords[0];
    const bounceStatus = bounceType === 'Permanent' ? 'bounced_permanent' : 'bounced_temporary';

    // Update email record with bounce status
    await pb.collection('emails').update(emailRecord.id, {
      status: bounceStatus,
      bounce_type: bounceType,
      bounce_sub_type: bounceSubType,
      bounced_at: new Date().toISOString(),
    });

    logger.info(`✅ Bounce status updated for email ID: ${emailRecord.id}`);

    // If permanent bounce, mark recipient as invalid
    if (bounceType === 'Permanent' && bouncedRecipients) {
      for (const recipient of bouncedRecipients) {
        // Find and update lead/contact record
        const leads = await pb.collection('leads').getFullList({
          filter: `email = "${recipient.emailAddress}"`,
        });

        if (leads.length > 0) {
          await pb.collection('leads').update(leads[0].id, {
            email_status: 'invalid',
            email_bounce_reason: recipient.diagnosticCode,
          });
          logger.info(`⚠️ Lead email marked as invalid: ${recipient.emailAddress}`);
        }
      }
    }
  }

  res.status(200).json({ success: true, message: 'Bounce handled' });
});

// POST /send-request - Send request form email
router.post('/send-request', async (req, res) => {
  const { name, surname, email, phone, message } = req.body;

  // Validate required fields
  if (!name || !surname || !email) {
    return res.status(400).json({ error: 'name, surname, and email are required' });
  }

  logger.info(`📤 Processing request form from: ${name} ${surname} (${email})`);

  // Build email HTML
  const htmlContent = `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Yeni Talep - Nova Teknoloji</title>
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
              <p style="margin: 8px 0 0 0; opacity: 0.9;">Yeni Talep</p>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td class="content">
              <h1>📋 Yeni Talep Alındı</h1>
              
              <h2>İletişim Bilgileri</h2>
              <table role="presentation" cellpadding="0" cellspacing="0" class="info-table">
                <tr>
                  <td class="label">Ad Soyad:</td>
                  <td class="value"><strong>${name} ${surname}</strong></td>
                </tr>
                <tr>
                  <td class="label">E-posta:</td>
                  <td class="value"><a href="mailto:${email}">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td class="label">Telefon:</td>
                  <td class="value"><a href="tel:${phone}">${phone}</a></td>
                </tr>
                ` : ''}
              </table>
              
              ${message ? `
              <h2>Talep Detayları</h2>
              <p>${message}</p>
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

  // Send email to info@nexaotomasyon.com.tr
  const mailOptions = {
    from: process.env.SMTP_FROM || 'noreply@nexaotomasyon.com.tr',
    to: 'info@nexaotomasyon.com.tr',
    replyTo: email,
    subject: `Yeni Talep - ${name} ${surname}`,
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
    message: message || '',
    status: 'received',
    sent_at: new Date().toISOString(),
    message_id: info.messageId,
  });

  logger.info(`📊 Request form record created with ID: ${formRecord.id}`);

  res.status(200).json({
    success: true,
    message: 'Talep başarıyla gönderildi',
    recordId: formRecord.id,
    messageId: info.messageId,
  });
});

export default router;