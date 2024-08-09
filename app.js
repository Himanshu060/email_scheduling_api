import express from "express"
import dotenv from "dotenv"
import { scheduleEmail, getScheduledEmails, getScheduledEmailById, cancelScheduledEmail } from "./controller/emailController.js"
import mongoose from "mongoose"
import Scheduler from "./utils/scheduler.js"

dotenv.config();

const app = express()
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
mongoose.connect(process.env.MONGO_CONNECTION_STRING + "/emailSchema");

const db = mongoose.connection;
const scheduler = new Scheduler();
scheduler.start();
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});


app.post("/schedule-email",(req, res) =>  {
  scheduleEmail(req, res, scheduler);
});
app.get("/scheduled-emails", getScheduledEmails);
app.get("/scheduled-emails/:id", getScheduledEmailById);
app.delete("/scheduled-emails/:id", cancelScheduledEmail);

app.listen(4500, () => {
  console.log("App is running on port 4500")
})

