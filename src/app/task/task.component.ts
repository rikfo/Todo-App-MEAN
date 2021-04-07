import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

import { CreateService } from "../services/create-serv.service";
import { Task } from "../models/task.model";
import { AuthService } from "../login/auth.service";
import { HttpService } from "../services/httpReq.service";

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.css"],
})
export class TaskComponent implements OnInit {
  tasks: Task[] = [];
  deleteTime;
  constructor(
    private router: Router,
    private createServ: CreateService,
    private authServ: AuthService,
    private httpSrv: HttpService
  ) {}

  ngOnInit(): void {
    this.httpSrv.fetshTasks().subscribe((resData) => {
      this.tasks = resData["data"].tasks;
    });
  }

  onAddTask() {
    this.router.navigate(["/addtask"]);
  }
  onEditTask(task: Task) {
    this.router.navigate(["/edit-task", `${task._id}`]);
  }
  finishTask(task: Task) {
    task.isFinished = !task.isFinished;
    this.httpSrv.updateTask(task._id, task.isFinished);
  }
  onDelete(index: number, task: Task) {
    this.createServ.deleteTask(index);
    this.httpSrv.deleteTask(task._id).subscribe(() => {});
  }

  onLogOut() {
    this.authServ.logOut();
  }
}
