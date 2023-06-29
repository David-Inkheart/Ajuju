/* eslint-disable no-console */
async function mockPasswordResetEmail(recipient: string, subject: string, message: string) {
  console.log('Mock email sent:');
  console.log('Recipient:', recipient);
  console.log('Subject:', subject);
  console.log('Message:', message);
}

export default mockPasswordResetEmail;
