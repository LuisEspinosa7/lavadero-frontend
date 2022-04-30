import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GLOBAL } from '../../models/global'
import {Orden} from '../../models/Orden';
import {OrdenItem} from '../../models/OrdenItem';



@Injectable()
export class OrdenService {

  private urlApi = '/orden';

  constructor(private http: HttpClient) { }

  /**
   * Crea una nueva orden
   * @param orden
   */

  agregar(orden: Orden): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.post(GLOBAL.urlBackend + this.urlApi, orden, {headers});
  }


  /**
   * Buscar las ordenes de un lavadero
   * @param codigoLavadero
   */
  buscarOrdenesXLavadero(codigoLavadero: number): Observable<any> {
    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));
    return this.http.get(GLOBAL.urlBackend + this.urlApi + '/lavadero/' + codigoLavadero, {headers});
  }

  /**
   * Genera la factura de la orden
   * @param orden
   */
  generarFactura(orden: Orden): Observable<any> {

    let headers =  new HttpHeaders();
    headers = headers.set('Content-Type', 'application/json');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/generarFactura', orden, { headers: headers, responseType: 'blob' });

  }


  /**
   * Consultar numero de ordenes de servicio nuevas que ha consumido el cliente
   * @param codigoLavadero
   */
  consultarNumeroServiciosConsumidosCliente(codigoLavadero: string, codigoUsuario: string, codigoTipoServicio: string): Observable<any> {

    const body = `codigoLavadero=${encodeURIComponent(codigoLavadero)}&codigoUsuario=${encodeURIComponent(codigoUsuario)}&codigoTipoServicio=${encodeURIComponent(codigoTipoServicio)}`;

    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');
    headers = headers.set('Authorization', localStorage.getItem('access_token'));

    return this.http.post(GLOBAL.urlBackend + this.urlApi + '/consultaNumeroServiciosConsumidosXCliente', body, { headers: headers});
  }



}
