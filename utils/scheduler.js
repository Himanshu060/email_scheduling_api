import Agenda from "agenda";

class Scheduler {
  constructor() {
    this.mongoConnectionString =
      process.env.MONGO_CONNECTION_STRING + "/agenda";
    this.agenda_ = new Agenda({ db: { address: this.mongoConnectionString } });
  }

  start = async () => {
    await this.agenda_.start();
  };

  define_task = (task_name, callback) => {
    this.agenda_.define(task_name, callback);
  };

  schedule_task = async (time, task_name, data) => {
    const res = await this.agenda_.schedule(time, task_name, data);
    return res;
  };

  repeatEvery = async (time, task_name, data) => {
    const res = await this.agenda_.every(time, task_name, data);
    return res;
  };

  cancel_task = async (job) => {
    await job.remove();
  };
}

export default Scheduler; 
