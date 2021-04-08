import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Task } from "../models/task.model";
import { CreateService } from "./create-serv.service";
import { tap } from "rxjs/operators";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class HttpService {
  constructor(private httpCl: HttpClient, private crtServ: CreateService) {}

  createTask(task: Task) {
    this.httpCl.post(`/tasks/add-task`, task).subscribe((data) => {
      this.crtServ.addTask(data["task"]);
    });
  }

  fetshTasks() {
    return this.httpCl.get<Task[]>(`/tasks`).pipe(
      tap((tasks) => {
        this.crtServ.setTasks(tasks["data"].tasks);
      })
    );
  }

  deleteTask(taskId: string) {
    return this.httpCl.delete(`/tasks/task/` + taskId);
  }

  updateTask(taskId: string, isFinished?: boolean, name?: string) {
    this.httpCl
      .patch(`/tasks/task/` + taskId, {
        name,
        isFinished,
      })
      .subscribe(() => {
        if (name !== undefined) this.crtServ.editTask(taskId, name);
      });
  }
}
