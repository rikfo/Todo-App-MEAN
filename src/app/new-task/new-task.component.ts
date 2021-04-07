import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { Task } from '../models/task.model';
import { CreateService } from '../services/create-serv.service';
import { HttpService } from '../services/httpReq.service';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css'],
})
export class NewTaskComponent implements OnInit, OnDestroy {
  @ViewChild('f', { static: true }) creationForm: NgForm;

  taskEditSub: Subscription;
  editMode = false;
  id: string;
  selectedTask: Task;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private createServ: CreateService,
    private httpServ: HttpService
  ) {}

  ngOnInit(): void {
    this.editMode = false;
    this.taskEditSub = this.route.params.subscribe((par: Params) => {
      if (par['id']) {
        this.id = par['id'];
        this.selectedTask = this.createServ.getTask(this.id);
        if (this.selectedTask) {
          setTimeout(() => {
            this.creationForm.form.setValue({
              desc: this.selectedTask.name,
            });
          }, 0);
          this.editMode = true;
        }
      }
    });
  }

  onSubmit() {
    if (!this.editMode) {
      const task = new Task('', this.creationForm.value.desc, false);
      this.httpServ.createTask(task);
      this.router.navigate(['../']);
    } else {
      this.httpServ.updateTask(
        this.id,
        undefined,
        this.creationForm.value.desc
      );
      this.router.navigate(['../']);
    }
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.taskEditSub.unsubscribe();
  }
}
