import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'schedezy@gmail.com',
    pass: 'test@12345',
  },
});

export const sendWelcomeEmail = async (to, displayName) => {
  const mailOptions = {
    from: 'schedezy@gmail.com',
    to,
    subject: 'Welcome to SchedEz',
    text: `Thank you for signing up, ${displayName}! Welcome to SchedEz.`,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

export default transporter;
