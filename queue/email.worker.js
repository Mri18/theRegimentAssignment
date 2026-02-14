const emailQueue = require('./email.queue');
const sendEmail = require('../utils/mailer');

console.log("🚀 Worker started...");
console.log(`Redis host: ${process.env.REDIS_HOST || '127.0.0.1'}`);
console.log(`Redis port: ${process.env.REDIS_PORT || '6379'}`);

// Wait for queue to be ready
emailQueue.on('ready', () => {
  console.log('✅ Worker queue is ready, listening for jobs...');
});

emailQueue.on('error', (err) => {
  console.error('❌ Worker queue error:', err && err.message ? err.message : err);
});

emailQueue.process(async (job) => {
  console.log("🔥 JOB RECEIVED:", job.data);

  try {
    await sendEmail({
      to: job.data.to,
      subject: job.data.subject,
      text: job.data.text
    });

    console.log(`✅ Email sent to ${job.data.to}`);
  } catch (error) {
    console.error(`❌ Failed to send email to ${job.data.to}:`, error && error.message ? error.message : error);
    throw error;
  }
});
