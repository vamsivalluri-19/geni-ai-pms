import cron from 'node-cron';
import Application from '../models/Application.js';
import User from '../models/User.js';
import { notifyApplicationStatus } from '../utils/emailService.js';
import { createNotification } from '../controllers/notificationController.js';

// Send reminders for pending applications older than 3 days
export function startApplicationReminderScheduler() {
  cron.schedule('0 9 * * *', async () => { // Every day at 9:00 AM
    try {
      const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
      const pendingApps = await Application.find({
        status: { $in: ['applied', 'pending'] },
        createdAt: { $lte: threeDaysAgo }
      }).populate(['student', 'job']);
      for (const app of pendingApps) {
        // Find student user
        const studentUser = app.student?.user ? await User.findById(app.student.user) : null;
        if (studentUser && studentUser.email) {
          // Send email reminder
          await notifyApplicationStatus({
            jobTitle: app.job?.position || app.job?.title || 'Position',
            company: app.job?.company || 'Company',
            status: app.status,
            feedback: 'Reminder: Your application is still pending. Please check for updates.'
          }, studentUser.email);
        }
        // In-app notification
        if (studentUser) {
          await createNotification(
            studentUser._id,
            'application',
            'Application Reminder',
            `Your application for ${app.job?.position || 'a job'} at ${app.job?.company || 'the company'} is still pending. Please check for updates.`,
            app._id,
            'Application'
          );
        }
      }
      if (pendingApps.length > 0) {
        console.log(`🔔 Sent ${pendingApps.length} application reminders.`);
      }
    } catch (err) {
      console.error('Reminder scheduler error:', err);
    }
  });
}
