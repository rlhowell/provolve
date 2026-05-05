const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const SERVICE_LABELS = {
  'fractional-cto':         'Fractional CTO',
  'principal-architecture': 'Principal Architecture',
  'systems-rescue':         'Systems Rescue & Modernisation',
  'ai-workflow':            'AI Workflow Automation',
  'engineering':            'Hands-on Product Engineering',
  'other':                  'Other',
};

exports.contactEmail = async (req, res) => {
  res.set('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).send('');
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, company, service, message } = req.body || {};

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const serviceLabel = SERVICE_LABELS[service] || service || 'Not specified';

  const textBody = [
    `Name:    ${name}`,
    `Email:   ${email}`,
    `Company: ${company || '-'}`,
    `Service: ${serviceLabel}`,
    '',
    message,
  ].join('\n');

  const htmlBody = `
    <table style="font-family:sans-serif;font-size:14px;color:#333;border-collapse:collapse;width:100%;max-width:600px;">
      <tr><td style="padding:8px 12px;background:#f4f4f4;font-weight:600;width:100px;">Name</td><td style="padding:8px 12px;">${esc(name)}</td></tr>
      <tr><td style="padding:8px 12px;background:#f4f4f4;font-weight:600;">Email</td><td style="padding:8px 12px;"><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
      <tr><td style="padding:8px 12px;background:#f4f4f4;font-weight:600;">Company</td><td style="padding:8px 12px;">${esc(company || '-')}</td></tr>
      <tr><td style="padding:8px 12px;background:#f4f4f4;font-weight:600;">Service</td><td style="padding:8px 12px;">${esc(serviceLabel)}</td></tr>
      <tr><td colspan="2" style="padding:16px 12px;white-space:pre-wrap;">${esc(message)}</td></tr>
    </table>
  `;

  try {
    await transporter.sendMail({
      from:    `"Provolve Website" <datanotification@provolve.com>`,
      to:      process.env.RECIPIENT_EMAIL || 'hello@provolve.com',
      replyTo: email,
      subject: `New enquiry from ${name}`,
      text:    textBody,
      html:    htmlBody,
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('SMTP error:', err);
    return res.status(500).json({ error: 'Failed to send message. Please try again.' });
  }
};

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
