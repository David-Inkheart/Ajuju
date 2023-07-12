import nodemailer from 'nodemailer';
import pug from 'pug';

const transporter = nodemailer.createTransport({
  host: 'ajuju-api.software',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASS,
  },
});

const selectTemplateFromPurpose = ({ purpose, username, otp }: { purpose: string; username: string; otp: string }) => {
  if (purpose === 'welcome') {
    return pug.renderFile(`${process.cwd()}/templates/welcome.pug`, { username });
  }
  return pug.renderFile(`${process.cwd()}/templates/resetPassword.pug`, { otp });
};

const sendEmail = async ({ recipientEmail, purpose, username, otp }: { recipientEmail: string; purpose: string; username: string; otp: string }) => {
  return transporter.sendMail({
    from: `"Ajuju" <${process.env.EMAIL}>`, // sender address
    to: recipientEmail, // list of receivers
    subject: purpose === 'welcome' ? `Welcome to Ajuju ${username}` : 'Password Reset Confirmation', // Subject line
    html: selectTemplateFromPurpose({ username, purpose, otp }), // html body
  });
};

export { sendEmail };
