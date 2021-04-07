import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, tap } from "rxjs/operators";
import { BehaviorSubject, throwError } from "rxjs";

import { User } from "../models/user.model";

export interface AuthResponse {
  token: string;
  experationDate: Date;
  data: {
    user: User;
  };
}

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(private httpCl: HttpClient, private router: Router) {}
  user = new BehaviorSubject<User>(null);
  private tokenExperation: any;
  private experationTimer: any;

  signUp(email: string, password: string, passwordConfirm: string) {
    return this.httpCl
      .post<AuthResponse>(`/signUp`, {
        email,
        password,
        passwordConfirm,
      })
      .pipe(
        catchError(this.errHandling),
        tap((resData) => {
          this.usersHandling(
            resData.token,
            resData.experationDate,
            resData.data
          );
          this.tokenExperation = parseInt(resData.experationDate.toString());
        })
      );
  }

  logIn(email: string, password: string) {
    return this.httpCl
      .post<AuthResponse>(`/login`, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError(this.errHandling),
        tap((resData) => {
          this.tokenExperation = parseInt(resData.experationDate.toString());
          this.usersHandling(resData.token, this.tokenExperation, resData.data);
        })
      );
  }
  logOut() {
    this.user.next(null);
    this.router.navigate(["/login"]);
    localStorage.removeItem("userInfo");
    if (this.experationTimer) clearTimeout(this.experationTimer);
    this.experationTimer = null;
  }
  autoLogIn() {
    const userData: {
      email: string;
      _id: string;
      _token: string;
      _tokenExperationDate: number;
    } = JSON.parse(localStorage.getItem("userInfo"));
    if (!userData) return;

    const currentUser = new User(
      userData.email,
      userData._id,
      userData._token,
      new Date(new Date().getTime() + userData._tokenExperationDate)
    );

    console.log(userData._tokenExperationDate);

    if (currentUser.tokenExp) {
      this.tokenExperation =
        new Date(
          new Date().getTime() + userData._tokenExperationDate
        ).getTime() - new Date().getTime();
      this.user.next(currentUser);
      this.autoLogOut(this.tokenExperation);
    }
  }
  autoLogOut(experationDur) {
    console.log(experationDur);
    this.experationTimer = setTimeout(() => {
      this.logOut();
    }, experationDur);
  }
  private usersHandling(
    token: string,
    experationDate: Date,
    data: {
      user: User;
    }
  ) {
    let user = new User(data.user.email, data.user._id, token, experationDate);
    this.user.next(user);
    this.autoLogOut(this.tokenExperation);
    localStorage.setItem("userInfo", JSON.stringify(user));
  }

  private errHandling(err: HttpErrorResponse) {
    let error;
    console.log(err);
    if (err) {
      console.log("1");
      error = "an error occurred : " + err.error.message;
      return throwError(error);
    } else {
      console.log("2");
      error = "an error occured : " + err;
    }
  }
}
