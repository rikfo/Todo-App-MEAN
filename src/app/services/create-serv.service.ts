import { Injectable } from "@angular/core";
import { Task } from "../models/task.model";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class CreateService {
  selectedTask: Task;
  taskAdded = new BehaviorSubject([]);
  private tasksArr: Task[] = [];
  constructor() {}

  getTask(taskId: string) {
    for (let task of this.tasksArr) {
      if (task._id === taskId) {
        this.selectedTask = task;
        break;
      }
    }
    return this.selectedTask;
  }

  addTask(task: Task) {
    this.tasksArr.push(task);
    this.taskAdded.next(this.tasksArr.slice());
  }
  editTask(taskId: string, desc: string) {
    this.tasksArr.forEach((task) => {
      if (task._id === taskId) {
        task.name = desc;
        return true;
      }
    });
    return null;
  }
  deleteTask(index: number) {
    this.tasksArr.splice(index, 1);
    this.taskAdded.next(this.tasksArr.slice());
  }
  setTasks(tasks: Task[]) {
    this.tasksArr = tasks;
    this.taskAdded.next(this.tasksArr.slice());
  }
}
