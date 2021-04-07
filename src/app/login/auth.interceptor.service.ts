import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpParams,
  HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { take, exhaustMap } from 'rxjs/operators';

import { AuthService } from './auth.service';

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
          // params: new HttpParams().set('user', user._id),
          headers: new HttpHeaders().set(
            'Authorization',
            'Bearer ' + user.tokenExp
          ),
          // setHeaders: {
          //   Authorization: 'Bearer ' + user.tokenExp,
          // },
        });
        return next.handle(modReq);
      })
    );
  }
}
