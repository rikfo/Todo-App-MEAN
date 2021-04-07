import {
  Component,
  ComponentFactoryResolver,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subscription } from "rxjs";

import { AuthResponse, AuthService } from "./auth.service";
import { AlertComponent } from "../alert/alert.component";

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

  constructor(
    private authServ: AuthService,
    private router: Router,
    private compFacResolver: ComponentFactoryResolver
  ) {}

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
      (userData) => {
        this.router.navigate(["../"]);
      },
      (err) => {
        this.error = err;
        // console.log(this.error);
        // this.showAlert(err);
      }
    );
  }

  // private showAlert(message: string) {
  //   const alertComp = this.compFacResolver.resolveComponentFactory(
  //     AlertComponent
  //   );
  //   this.alerHost.nativeElement.viewContRef.clear();
  //   const alertComponent = this.alerHost.nativeElement.viewContRef.createComponent(
  //     alertComp
  //   );
  //   alertComponent.instance.message = message;
  //   this.closeSub = alertComponent.instance.destroy.subscribe(() => {
  //     //Maximillian approach : this.alerHost.clear
  //     alertComponent.destroy();
  //     this.closeSub.unsubscribe();
  //   });
  // }

  onClose() {
    this.error = null;
  }
}
