require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const nodemailer = require('nodemailer');

(async () => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.OTP_EMAIL, pass: process.env.OTP_EMAIL_PASS },
    tls: { rejectUnauthorized: false }
  });

  try {
    await transporter.verify();
    console.log('SMTP verify: OK');
    const info = await transporter.sendMail({
      from: process.env.OTP_EMAIL,
      to: process.env.OTP_EMAIL,
      subject: 'Roamly SMTP test',
      text: 'If you receive this, SMTP works from Render'
    });
    console.log('Send result:', info.messageId || info.response);
    process.exit(0);
  } catch (err) {
    console.error('SMTP test error:', err);
    process.exit(1);
  }
})();