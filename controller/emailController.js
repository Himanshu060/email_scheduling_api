import Scheduler from "../utils/scheduler.js";

import Email from "../models/emailSchema.js";
import sendEmail from "../utils/emailer.js";

const scheduleEmail = async (req, res, scheduler) => {
  const { recipient, subject, body, scheduleTime, repeat, dayOfWeek, dayOfMonth, dayOfQuarter } = req.body;
  
  const emailData = {
    recipient,
    subject,
    body,
    scheduleTime,
    repeat,
    dayOfWeek,
    dayOfMonth,
    dayOfQuarter,
  };
  
  const email = new Email(emailData);
  await email.save();

  const jobName = `sendEmail_${email._id}`;
  scheduler.define_task(jobName, async (job) => {
    await sendEmail(email.recipient, email.body);
  });

  if (repeat) {
    let interval;
    switch (repeat) {
      case "daily":
        interval = "1 day";
        break;
      case "weekly":
        interval = `1 week on ${dayOfWeek}`;
        break;
      case "monthly":
        interval = `1 month on day ${dayOfMonth}`;
        break;
      case "quarterly":
        interval = `3 months on day ${dayOfQuarter}`;
        break;
      default:
        interval = null;
    }
    if (interval) {
      await scheduler.repeatEvery(interval, jobName, emailData);
    }
  } else {
    await scheduler.schedule_task(scheduleTime, jobName, emailData);
  }

  res.status(200).json({ message: "Email scheduled successfully", email });
};

const getScheduledEmails = async (req, res) => {
  const emails = await Email.find();
  res.status(200).json(emails);
};

const getScheduledEmailById = async (req, res) => {
  const email = await Email.findById(req.params.id);
  if (!email) {
    return res.status(404).json({ message: "Email not found" });
  }
  res.status(200).json(email);
};

const cancelScheduledEmail = async (req, res) => {
  const email = await Email.findById(req.params.id);
  if (!email) {
    return res.status(404).json({ message: "Email not found" });
  }

  const job = await scheduler.agenda_.jobs({ name: `sendEmail_${email._id}` });
  if (job.length > 0) {
    await job[0].remove();
  }

  await email.remove();
  res.status(200).json({ message: "Scheduled email canceled successfully" });
};

export {
  scheduleEmail,
  getScheduledEmails,
  getScheduledEmailById,
  cancelScheduledEmail,
}