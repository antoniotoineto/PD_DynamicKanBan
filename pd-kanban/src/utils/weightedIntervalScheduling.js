const moment = require("moment");

export default class WeightedIntervalScheduling {
  constructor(tasks) {
    this.data = tasks;

    this.memo = [0];
    this.sortedTasks = [0];
    this.p = [0, 0];
    this.priorizedTasks = [];

    for (let i = 1; i <= tasks.length; ++i) {
      this.memo[i] = null;
    }
  }

  sortTasks = () => {
    let sortedTimes = this.data.sort((a, b) => {
      if (moment(a.endTime, "hh:mm a").isBefore(moment(b.endTime, "hh:mm a")))
        return -1;
      else if (
        moment(b.endTime, "hh:mm a").isBefore(moment(a.endTime, "hh:mm a"))
      ) {
        return 1;
      }
      return 0;
    });
    sortedTimes.unshift({
      task: "peso 0",
      weight: 0,
      startTime: "00:00 am",
      endTime: "00:00 am",
    });
    this.sortedTasks = sortedTimes;
    return sortedTimes;
  };

  computeP() {
    for (let i = this.sortedTasks.length - 1; i > 1; --i) {
      for (let j = i - 1; j > 0; --j) {
        if (
          moment(this.sortedTasks[i].startTime, "hh:mm a").isAfter(
            moment(this.sortedTasks[j].endTime, "hh:mm a")
          )
        ) {
          this.p[i] = j;
          j = 0;
        } else {
          this.p[i] = 0;
        }
      }
    }
  }

  ComputeOpt(j) {
    if (this.memo[j] === null) {
      this.memo[j] = Math.max(
        this.sortedTasks[j].weight + this.ComputeOpt(this.p[j]),
        this.ComputeOpt(j - 1) //cacula solução ótima e salva no array
      );
    }
    return this.memo[j];
  }

  findSolution(j) {
    if (j === 0) {
      return;
    } else if (
      this.sortedTasks[j].weight + this.memo[this.p[j]] >
      this.memo[j - 1]
    ) {
      this.priorizedTasks.push(this.sortedTasks[j]);
      return this.findSolution(this.p[j]);
    } else {
      return this.findSolution(j - 1);
    }
  }
}

// const tasks = [
//   { task: "peso 34", weight: 34, startTime: "02:00 am", endTime: "05:00 am" },
// ];

// tasks.push({
//   task: "peso 8",
//   weight: 8,
//   startTime: "08:00 am",
//   endTime: "10:00 am",
// });
// tasks.push({
//   task: "peso 1",
//   weight: 1,
//   startTime: "08:00 am",
//   endTime: "10:00 am",
// });
// tasks.push({
//   task: "peso 1",
//   weight: 1,
//   startTime: "06:00 am",
//   endTime: "09:00 am",
// });
// const schedule = new WeightedIntervalScheduling(tasks);

// console.log(schedule.sortTasks());
// schedule.computeP();
// schedule.ComputeOpt(tasks.length - 1);
// schedule.findSolution(tasks.length - 1);

// console.log("SORTED", schedule.sortedTasks);
// const solution = schedule.priorizedTasks.reverse();

// console.log("SOLUTFION", solution);

// console.log("memo", schedule.memo);
