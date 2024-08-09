import mongoose from "mongoose";

const emailSchema = new mongoose.Schema({
  recipient: String,
  subject: String,
  body: String,
  scheduleTime: String,
  repeat: String, 
  dayOfWeek: String,
  dayOfMonth: Number,
  dayOfQuarter: Number,
  jobId: String,
});

const Email = mongoose.model("Email", emailSchema);

export default Email;
