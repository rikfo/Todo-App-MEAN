import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";

import { AuthResponse, AuthService } from "./auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  @ViewChild("loginForm", { static: false }) loginForm: NgForm;
  loginMod: boolean = true;
  error: string = null;
  @ViewChild("alert", { static: false }) alerHost: ElementRef;
  closeSub: Subscription;

  constructor(private authServ: AuthService, private router: Router) {}

  ngOnInit(): void {}

  onSubmit() {
    let authObs: Observable<AuthResponse>;

    if (!this.loginMod) {
      authObs = this.authServ.signUp(
        this.loginForm.value.email,
        this.loginForm.value.password,
        this.loginForm.value.passwordConf
      );
    } else {
      authObs = this.authServ.logIn(
        this.loginForm.value.email,
        this.loginForm.value.password
      );
    }
    this.loginForm.reset();
    authObs.subscribe(
      () => {
        this.router.navigate(["../"]);
      },
      (err) => {
        this.error = err;
      }
    );
  }

  onClose() {
    this.error = null;
  }
}
