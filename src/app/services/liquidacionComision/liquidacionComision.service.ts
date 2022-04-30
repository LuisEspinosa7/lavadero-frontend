import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global';
import {LiquidacionFuncionario} from '../../models/LiquidacionFuncionario';
import {ResponseContentType} from '@angular/http';
import {LiquidacionComsion} from '../../models/LiquidacionComsion';


@Injectable()
export class LiquidacionComisionService {

  private urlApi = '/liquidacionComision';

  constructor(private http: HttpClient) { }


  /**
   * Liquidar una comision
   * @param comision
   */

  liquidarComision(liquidacionComsion: LiquidacionComsion): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi, liquidacionComsion, {headers});
  }


  /**
   * Calcular comision
   */
  calcularComision(liquidacionComsion: LiquidacionComsion): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/calcularComision', liquidacionComsion, {headers});
  }


  /**
   * Cargan historial liquidaciones de comisiones
   */

  cargarHistorialLiquidacionesComisiones(liquidacionComsion: LiquidacionComsion): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/historial', liquidacionComsion, {headers});
  }





}
