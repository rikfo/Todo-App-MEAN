import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from "./login/login.component";
import { TaskComponent } from "./task/task.component";
import { NewTaskComponent } from "./new-task/new-task.component";
import { AuthGuard } from "./login/auth.guard";
import { LoginGuard } from "./login/login.guard";

const routes: Routes = [
  {
    path: "",
    component: TaskComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: "addtask",
        component: NewTaskComponent,
      },
      {
        path: "edit-task/:id",
        component: NewTaskComponent,
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [LoginGuard],
  },
  {
    path: "**",
    redirectTo: "/login",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
