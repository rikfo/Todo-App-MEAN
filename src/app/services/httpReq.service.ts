import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
// import { catchError, tap } from 'rxjs/operators';
import { BehaviorSubject, throwError } from "rxjs";

import { environment } from "../../environments/environment";

// import { User } from '../models/user.model';
import { Task } from "../models/task.model";
import { CreateService } from "./create-serv.service";
import { tap } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class HttpService {
  constructor(private httpCl: HttpClient, private crtServ: CreateService) {}

  createTask(task: Task) {
    this.httpCl
      .post(`${environment.API}/tasks/add-task`, task)
      .subscribe((data) => {
        this.crtServ.addTask(data["task"]);
      });
  }

  fetshTasks() {
    console.log(`${environment.API}/tasks`);
    return this.httpCl.get<Task[]>(`${environment.API}/tasks`).pipe(
      tap((tasks) => {
        this.crtServ.setTasks(tasks["data"].tasks);
      })
    );
  }

  deleteTask(taskId: string) {
    return this.httpCl.delete(`${environment.API}/tasks/task/` + taskId);
  }

  updateTask(taskId: string, isFinished?: boolean, name?: string) {
    this.httpCl
      .patch(`${environment.API}/tasks/task/` + taskId, {
        name,
        isFinished,
      })
      .subscribe((resData) => {
        if (name !== undefined) this.crtServ.editTask(taskId, name);
      });
  }

  private errHandling(err: HttpErrorResponse) {
    const error = "an error occurred : " + err.message;
    return throwError(error);
  }
}
