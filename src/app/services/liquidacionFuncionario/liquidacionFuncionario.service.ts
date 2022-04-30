import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GLOBAL } from '../../models/global';
import {LiquidacionFuncionario} from '../../models/LiquidacionFuncionario';
import {ResponseContentType} from '@angular/http';


@Injectable()
export class LiquidacionFuncionarioService {

  private urlApi = '/liquidacionFuncionario';

  constructor(private http: HttpClient) { }


  /**
   * Liquidar un funcionario tecnico
   * @param li
   */

  liquidarFuncionarioTecnico(liquidacionFuncionario: LiquidacionFuncionario): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi, liquidacionFuncionario, {headers});
  }


  /**
   * Cargan registros liquidables de tecnicos
   */
  cargarRegistrosLiquidablesTecnicos(liquidacionFuncionario: LiquidacionFuncionario): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/registrosLiquidables', liquidacionFuncionario, {headers});
  }


  /**
   * Cargan historial liquidaciones de tecnicos
   */
  cargarHistorialLiquidacionesTecnicos(liquidacionFuncionario: LiquidacionFuncionario): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/historial', liquidacionFuncionario, {headers});
  }


  /**
   * Genera el ticket de liquidacion de funcionarios
   * @param LiquidacionFuncionario
   */
  generarTicketLiquidacionFuncionario(liquidacionFuncionario: LiquidacionFuncionario): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    //return this.http.post(GLOBAL.urlBackend + this.urlApi + '/generarTicket', liquidacionFuncionario, { headers: headers, responseType: 'blob' });

    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/generarTicket', liquidacionFuncionario, { headers: headers, responseType: 'blob' });

  }



}
