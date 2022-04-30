import { Injectable, Injector } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';

import { AuthService } from '../services/auth.service';
import {Router} from '@angular/router';

@Injectable()
export class CustomHttpInterceptor implements HttpInterceptor {
  constructor(private _auth: AuthService, private router: Router) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    console.log('intercepted request ... ');
    console.log('Sending request...');

    return next.handle(req).catch((error, caught) => {
      //intercept the respons error and displace it to the console
      console.log('Error Occurred');
      console.log(error);

      if(error.status === 403){
        console.log('Vencion la sesion');
        this._auth.logout();
        this.router.navigate(['authentication/login']);
      } else {
        //return the error to the method that called it
        return Observable.throw(error);
      }

    }) as any;
  }
}
