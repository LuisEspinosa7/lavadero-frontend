import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from '../services/user/user.service';
import { GLOBAL } from '../models/global';


@Injectable()
export class AuthService {

  constructor(private http: HttpClient) { }

  /**
   * Extrae el token
   */
  getToken(): string {
     return localStorage.getItem('access_token');
   }


  /**
   * Valida si existe autenticacion
   */
  isAuthenticated(): boolean {
     const token = this.getToken();

     if(token == null){
         return false;
     }
     return true;
   }


  /**
   * Se autentica con el backend
   * @param email
   * @param password
   */
  login(email: string, password: string): Observable<boolean> {

      return this.http.post<any>(GLOBAL.urlAutentication, {email: email, password: password}, {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        observe: 'response'
      }).pipe(
          map(result => {
              const token = result.headers.get('Authorization');

              if(token == null){
                  return false;
              }

              localStorage.setItem('access_token', token);
              localStorage.setItem('email', email);
              return true;
          })
      );
    }

  /**
   * Sale de la sesion
    */
  logout() {
      console.log('Quitando el token');
    localStorage.removeItem('access_token');
  }

}
