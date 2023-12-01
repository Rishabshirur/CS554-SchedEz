import { Router } from 'express';
import transporter, { sendWelcomeEmail } from '../data/nodemailer.js';

const router = Router();

router.post('/send-email', async (req, res) => {
  const { to, subject, text } = req.body;

  const mailOptions = {
    from: 'your-email@gmail.com',
    to,
    subject,
    text,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Email sent successfully', info });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/send-welcome-email', async (req, res) => {
  const { to, displayName } = req.body;

  try {
    const result = await sendWelcomeEmail(to, displayName);
    if (result) {
      res.status(200).json({ message: 'Welcome email sent successfully' });
    } else {
      res.status(500).json({ error: 'Error sending welcome email' });
    }
  } catch (error) {
    console.error('Error sending welcome email:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
