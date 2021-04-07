import { Injectable } from "@angular/core";
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpHeaders,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { take, exhaustMap } from "rxjs/operators";

import { AuthService } from "./auth.service";

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private authServ: AuthService) {}
  headers = new Headers();
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authServ.user.pipe(
      take(1),
      exhaustMap((user) => {
        if (!user) {
          return next.handle(req);
        }
        const modReq = req.clone({
          headers: new HttpHeaders().set(
            "Authorization",
            "Bearer " + user.tokenExp
          ),
        });
        return next.handle(modReq);
      })
    );
  }
}
