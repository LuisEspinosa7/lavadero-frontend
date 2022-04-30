import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global';


@Injectable()
export class TipoPagoService {

  private urlApi = '/tipoPago';

  constructor(private http: HttpClient) { }

  /**
   * Carga los tipo pago disponibles
   */
  cargarDisponibles(): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/disponibles', {headers});
  }




}
